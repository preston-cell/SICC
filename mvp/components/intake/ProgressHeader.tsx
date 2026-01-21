"use client";

import { Check } from "lucide-react";
import { getTotalSteps } from "@/lib/intake/guided-flow-config";

interface ProgressHeaderProps {
  currentStep: number;
  completedSteps: number[];
  stepTitle: string;
  estimatedMinutes?: number;
}

export function ProgressHeader({
  currentStep,
  completedSteps,
  stepTitle,
  estimatedMinutes,
}: ProgressHeaderProps) {
  const totalSteps = getTotalSteps();
  const progress = (completedSteps.length / totalSteps) * 100;

  return (
    <div className="space-y-4">
      {/* Step indicator and title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-muted)]">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-[var(--text-caption)]">•</span>
          <span className="text-sm font-medium text-[var(--text-heading)]">
            {stepTitle}
          </span>
        </div>
        {estimatedMinutes && (
          <span className="text-xs text-[var(--text-caption)]">
            ~{estimatedMinutes} min
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full bg-[var(--light-gray)] rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full bg-[var(--accent-purple)] transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, (currentStep / totalSteps) * 100)}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-0">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isCompleted = completedSteps.includes(stepNum);
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={stepNum}
                className={`
                  w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted
                    ? "bg-[var(--accent-purple)]"
                    : isCurrent
                      ? "bg-white border-2 border-[var(--accent-purple)]"
                      : "bg-[var(--light-gray)]"
                  }
                `}
              >
                {isCompleted && (
                  <Check className="w-2 h-2 text-white" strokeWidth={3} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
