"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Analysis error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[var(--border)] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>

        <h2 className="text-xl font-semibold text-[var(--text-heading)] mb-2">
          Error Loading Analysis
        </h2>

        <p className="text-[var(--text-muted)] mb-6">
          There was a problem loading your analysis results. Please try again.
        </p>

        {error.digest && (
          <p className="text-xs text-[var(--text-caption)] mb-4 font-mono bg-[var(--off-white)] rounded px-3 py-2">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--accent-purple)] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded-lg font-medium text-sm text-[var(--text-heading)] hover:bg-[var(--off-white)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
