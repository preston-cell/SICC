"use client";

import Link from "next/link";

interface PreparationTaskCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  progress?: {
    current: number;
    total: number;
    unit: string;
  };
  estimatedTime: string;
  isComplete?: boolean;
}

export function PreparationTaskCard({
  title,
  description,
  icon,
  href,
  progress,
  estimatedTime,
  isComplete,
}: PreparationTaskCardProps) {
  const progressPercent = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <Link href={href} className="block group">
      <div
        className={`bg-white rounded-xl border p-6 transition-all hover:shadow-md hover:border-[var(--accent-purple)] ${
          isComplete ? "border-green-200 bg-green-50/30" : "border-[var(--border)]"
        }`}
      >
        {/* Icon and title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-xl ${
              isComplete
                ? "bg-green-100 text-green-600"
                : "bg-[var(--accent-muted)] text-[var(--accent-purple)]"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-heading)] group-hover:text-[var(--accent-purple)] transition-colors">
              {title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>
          </div>
          {isComplete && (
            <svg
              className="w-6 h-6 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Progress */}
        {progress && progress.total > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[var(--text-muted)]">
                {progress.current}/{progress.total} {progress.unit}
              </span>
              <span className="font-medium text-[var(--text-heading)]">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isComplete
                    ? "bg-green-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">{estimatedTime}</span>
          <span className="text-sm font-medium text-[var(--accent-purple)] group-hover:underline">
            {isComplete ? "Review" : progress && progress.current > 0 ? "Continue" : "Start"}
            <svg
              className="inline-block w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
