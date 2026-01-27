"use client";

import { useEffect, useRef } from "react";
import { getOrCreateUser, linkSessionToUser } from "./usePrismaQueries";

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Dynamically import useUser only if Clerk is configured
let useClerkUser: () => { user: unknown; isSignedIn: boolean; isLoaded: boolean } = () => ({
  user: null,
  isSignedIn: false,
  isLoaded: true,
});

if (isClerkConfigured) {
  try {
    const clerk = require("@clerk/nextjs");
    useClerkUser = clerk.useUser;
  } catch {
    // Clerk not available
  }
}

/**
 * Hook to sync Clerk authentication with PostgreSQL user database.
 * This is the PostgreSQL/Prisma replacement for the Convex-based useAuthSync.
 *
 * When a user signs in:
 * 1. Creates or updates their user record via API
 * 2. Links any anonymous session data to their account
 */
export function useAuthSyncPrisma() {
  const { user, isSignedIn, isLoaded } = useClerkUser();

  // Track if we've already synced this session
  const hasSynced = useRef(false);

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !isSignedIn || !user || hasSynced.current) {
        return;
      }

      try {
        // Get user's primary email
        const typedUser = user as { 
          id: string; 
          primaryEmailAddress?: { emailAddress: string }; 
          fullName?: string; 
          firstName?: string 
        };
        const email = typedUser.primaryEmailAddress?.emailAddress;
        if (!email) return;

        // Create or get user via PostgreSQL API
        const dbUser = await getOrCreateUser({
          email,
          name: typedUser.fullName || typedUser.firstName || email.split("@")[0],
        });

        // Get session ID from localStorage
        const sessionId = localStorage.getItem("estatePlanSessionId");

        // If there's a session, link it to the user
        if (sessionId && dbUser?.id) {
          await linkSessionToUser(sessionId);

          // Store user ID for future reference
          localStorage.setItem("estatePlanUserId", dbUser.id);
        }

        hasSynced.current = true;
      } catch (error) {
        console.error("Error syncing user with PostgreSQL:", error);
      }
    }

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return {
    isLoaded,
    isSignedIn,
    user,
  };
}
