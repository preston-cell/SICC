"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";

// Check if Clerk is configured (client-side check)
const isClerkConfigured = typeof window !== "undefined"
  ? !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  : false;

// Safe wrapper around useUser that returns defaults when Clerk isn't configured
export function useUser() {
  // If Clerk isn't configured, return default values
  if (!isClerkConfigured) {
    return {
      user: null,
      isSignedIn: false,
      isLoaded: true,
    };
  }

  // Otherwise use the real Clerk hook
  try {
    return useClerkUser();
  } catch {
    // Fallback if Clerk context is missing
    return {
      user: null,
      isSignedIn: false,
      isLoaded: true,
    };
  }
}
