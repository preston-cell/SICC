"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "./ClerkComponents";
import Link from "next/link";

interface AuthHeaderProps {
  showBackLink?: {
    href: string;
    label: string;
  };
}

export default function AuthHeader({ showBackLink }: AuthHeaderProps) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Estate Planning Assistant
        </Link>

        <div className="flex items-center gap-4">
          {showBackLink && (
            <Link
              href={showBackLink.href}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showBackLink.label}
            </Link>
          )}

          {isLoaded && (
            <>
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
