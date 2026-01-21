"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import Link from "next/link";

interface AnalysisFloatingWidgetProps {
  runId: Id<"gapAnalysisRuns">;
  estatePlanId: string;
  onComplete?: () => void;
}

export function AnalysisFloatingWidget({
  runId,
  estatePlanId,
  onComplete,
}: AnalysisFloatingWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);

  const runProgress = useQuery(api.gapAnalysisProgress.getRunProgress, { runId });
  const phases = useQuery(api.gapAnalysisProgress.getPhaseProgress, { runId });

  const isComplete = runProgress?.status === "completed" || runProgress?.status === "partial";
  const isFailed = runProgress?.status === "failed";

  // Notify when complete
  useEffect(() => {
    if (isComplete && !hasNotified) {
      setHasNotified(true);
      setIsExpanded(true);
      onComplete?.();
    }
  }, [isComplete, hasNotified, onComplete]);

  // Calculate estimated time remaining
  const getEstimatedTimeRemaining = () => {
    if (!runProgress) return null;
    const progress = runProgress.overallProgress;
    if (progress === 0) return "Calculating...";
    if (progress >= 100) return "Complete";

    // Rough estimate: comprehensive analysis takes ~15-25 minutes
    // Based on current progress, estimate remaining
    const avgTotalMinutes = 20;
    const remainingPercent = 100 - progress;
    const remainingMinutes = Math.ceil((remainingPercent / 100) * avgTotalMinutes);

    if (remainingMinutes <= 1) return "< 1 min";
    return `~${remainingMinutes} min`;
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "running":
        return (
          <div className="w-4 h-4 border-2 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
        );
      case "failed":
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  if (!runProgress) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-xl shadow-lg border border-[var(--border)] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-[var(--text-muted)]">Starting analysis...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-white rounded-xl shadow-lg border transition-all duration-300 ${
          isComplete
            ? "border-green-300 ring-2 ring-green-100"
            : isFailed
            ? "border-red-300"
            : "border-[var(--border)]"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !isComplete && setIsExpanded(false)}
      >
        {/* Minimized view */}
        {!isExpanded && (
          <div className="px-4 py-3 cursor-pointer" onClick={() => setIsExpanded(true)}>
            <div className="flex items-center gap-3">
              {isComplete ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : isFailed ? (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <div className="w-5 h-5 border-2 border-[var(--accent-purple)] border-t-transparent rounded-full animate-spin" />
              )}
              <span className="text-sm font-medium text-[var(--text-heading)]">
                {runProgress.overallProgress}%
              </span>
              <span className="text-sm text-[var(--text-muted)]">
                {isComplete ? "Complete!" : isFailed ? "Failed" : getEstimatedTimeRemaining()}
              </span>
            </div>
          </div>
        )}

        {/* Expanded view */}
        {isExpanded && (
          <div className="p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[var(--text-heading)]">
                Comprehensive Analysis
              </h4>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--text-muted)]">Progress</span>
                <span className="font-medium text-[var(--text-heading)]">
                  {runProgress.overallProgress}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isComplete
                      ? "bg-green-500"
                      : isFailed
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  style={{ width: `${runProgress.overallProgress}%` }}
                />
              </div>
            </div>

            {/* Phase status */}
            {phases && (
              <div className="space-y-2 mb-4">
                {phases.map((phase) => (
                  <div key={phase._id} className="flex items-center gap-2">
                    {getPhaseIcon(phase.status)}
                    <span className="text-sm text-[var(--text-body)]">
                      Phase {phase.phaseNumber}:{" "}
                      {phase.phaseType === "research"
                        ? "Research"
                        : phase.phaseType === "analysis"
                        ? "Deep Analysis"
                        : "Synthesis"}
                    </span>
                    {phase.status === "running" && (
                      <span className="text-xs text-[var(--text-muted)]">
                        ({phase.completedRuns}/{phase.totalRuns})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Time remaining */}
            {!isComplete && !isFailed && (
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {getEstimatedTimeRemaining()} remaining
              </p>
            )}

            {/* Actions */}
            {isComplete ? (
              <Link
                href={`/analysis/${estatePlanId}`}
                className="block w-full py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                View Results
              </Link>
            ) : isFailed ? (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">
                Analysis failed. Please try again.
              </div>
            ) : (
              <Link
                href={`/analysis/${estatePlanId}`}
                className="block text-center text-sm text-[var(--accent-purple)] hover:underline"
              >
                View Full Progress
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
