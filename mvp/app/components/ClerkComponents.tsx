"use client";

import { ReactNode } from "react";

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Stub types for when Clerk isn't available
type StubButtonProps = {
  children?: ReactNode;
  mode?: string;
};

// User type that matches Clerk's user structure
type ClerkUser = {
  id: string;
  primaryEmailAddress?: { emailAddress: string };
  fullName?: string | null;
  firstName?: string | null;
} | null;

type UseUserReturn = {
  user: ClerkUser;
  isSignedIn: boolean;
  isLoaded: boolean;
};

// Default stub components
const StubSignInButton = ({ children }: StubButtonProps) => <>{children}</>;
const StubSignUpButton = ({ children }: StubButtonProps) => <>{children}</>;
const StubUserButton = () => null;

// Default stub hook
const stubUseUser = (): UseUserReturn => ({
  user: null,
  isSignedIn: false,
  isLoaded: true,
});

// Export either real Clerk components or stubs
let SignInButton: React.ComponentType<StubButtonProps> = StubSignInButton;
let SignUpButton: React.ComponentType<StubButtonProps> = StubSignUpButton;
let UserButton: React.ComponentType<Record<string, unknown>> = StubUserButton;
let useUser: () => UseUserReturn = stubUseUser;

if (isClerkConfigured) {
  try {
    const clerk = require("@clerk/nextjs");
    SignInButton = clerk.SignInButton;
    SignUpButton = clerk.SignUpButton;
    UserButton = clerk.UserButton;
    useUser = clerk.useUser;
  } catch {
    // Clerk not available, use stubs
  }
}

export { SignInButton, SignUpButton, UserButton, useUser };
export type { ClerkUser };
