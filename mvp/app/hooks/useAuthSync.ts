"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef } from "react";

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Dynamically import useUser only if Clerk is configured
let useClerkUser: () => { user: unknown; isSignedIn: boolean; isLoaded: boolean } = () => ({
  user: null,
  isSignedIn: false,
  isLoaded: true,
});

if (isClerkConfigured) {
  // This will be tree-shaken if not used
  try {
    const clerk = require("@clerk/nextjs");
    useClerkUser = clerk.useUser;
  } catch {
    // Clerk not available
  }
}

/**
 * Hook to sync Clerk authentication with Convex user database.
 *
 * When a user signs in:
 * 1. Creates or updates their user record in Convex
 * 2. Links any anonymous session data to their account
 */
export function useAuthSync() {
  const { user, isSignedIn, isLoaded } = useClerkUser();
  const getOrCreateUser = useMutation(api.users.getOrCreateUser);
  const linkSessionToUser = useMutation(api.users.linkSessionToUser);

  // Track if we've already synced this session
  const hasSynced = useRef(false);

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !isSignedIn || !user || hasSynced.current) {
        return;
      }

      try {
        // Get user's primary email
        const typedUser = user as { id: string; primaryEmailAddress?: { emailAddress: string }; fullName?: string; firstName?: string };
        const email = typedUser.primaryEmailAddress?.emailAddress;
        if (!email) return;

        // Create or get user in Convex
        const userId = await getOrCreateUser({
          clerkId: typedUser.id,
          email,
          name: typedUser.fullName || typedUser.firstName || email.split("@")[0],
        });

        // Get session ID from localStorage
        const sessionId = localStorage.getItem("estatePlanSessionId");

        // If there's a session, link it to the user
        if (sessionId && userId) {
          await linkSessionToUser({
            sessionId,
            userId,
          });

          // Store user ID for future reference
          localStorage.setItem("estatePlanUserId", userId);
        }

        hasSynced.current = true;
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    }

    syncUser();
  }, [isLoaded, isSignedIn, user, getOrCreateUser, linkSessionToUser]);

  return {
    isLoaded,
    isSignedIn,
    user,
  };
}
