"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface SaveProgressPromptProps {
  // Show after completing this many sections
  showAfterSections?: number;
  completedSections?: number;
  // Can be dismissed
  dismissable?: boolean;
}

export default function SaveProgressPrompt({
  showAfterSections = 2,
  completedSections = 0,
  dismissable = true,
}: SaveProgressPromptProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for previous dismissal
  useEffect(() => {
    const dismissed = localStorage.getItem("saveProgressPromptDismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Show again after 24 hours
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("saveProgressPromptDismissed", Date.now().toString());
  };

  // Don't show if:
  // - User is signed in
  // - Not enough sections completed
  // - Already dismissed
  // - Not loaded yet
  if (!isLoaded || isSignedIn || completedSections < showAfterSections || isDismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 mb-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-8 h-8 text-white/90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">Save Your Progress</h3>
          <p className="text-white/80 text-sm mt-1">
            Create a free account to save your answers and access your estate plan from any device.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Create Free Account
              </button>
            </SignUpButton>
            {dismissable && (
              <button
                onClick={handleDismiss}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
