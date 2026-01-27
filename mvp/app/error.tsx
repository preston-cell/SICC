"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    // For now, just log to console
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--off-white)] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[var(--border)] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-semibold text-[var(--text-heading)] mb-2">
          Something went wrong
        </h1>

        <p className="text-[var(--text-muted)] mb-6">
          We encountered an unexpected error. Don&apos;t worry, your data is safe.
        </p>

        {error.digest && (
          <p className="text-xs text-[var(--text-caption)] mb-6 font-mono bg-[var(--off-white)] rounded px-3 py-2">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-purple)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--border)] rounded-lg font-medium text-[var(--text-heading)] hover:bg-[var(--off-white)] transition-colors"
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
