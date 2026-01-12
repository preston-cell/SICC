"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export type IntakeStep = "personal" | "family" | "assets" | "existing" | "goals";

interface StepInfo {
  id: IntakeStep;
  name: string;
  fullName: string;
  description: string;
  path: string;
}

const STEPS: StepInfo[] = [
  {
    id: "personal",
    name: "Personal",
    fullName: "Personal Information",
    description: "Your basic information",
    path: "/intake/personal",
  },
  {
    id: "family",
    name: "Family",
    fullName: "Family Members",
    description: "Spouse, children, dependents",
    path: "/intake/family",
  },
  {
    id: "assets",
    name: "Assets",
    fullName: "Assets & Property",
    description: "Property, accounts, valuables",
    path: "/intake/assets",
  },
  {
    id: "existing",
    name: "Documents",
    fullName: "Existing Documents",
    description: "Current estate planning docs",
    path: "/intake/existing",
  },
  {
    id: "goals",
    name: "Goals",
    fullName: "Goals & Wishes",
    description: "Your estate planning wishes",
    path: "/intake/goals",
  },
];

interface IntakeProgressProps {
  currentStep: IntakeStep;
  completedSteps: Set<IntakeStep>;
  estatePlanId: string;
}

export default function IntakeProgress({
  currentStep,
  completedSteps,
  estatePlanId,
}: IntakeProgressProps) {
  const router = useRouter();
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  const handleStepClick = (step: StepInfo, index: number) => {
    const isComplete = completedSteps.has(step.id);
    const isCurrent = step.id === currentStep;
    const isPast = index < currentIndex;

    // Only allow navigation to completed steps or previous steps
    if (isComplete || isPast || isCurrent) {
      router.push(`${step.path}?planId=${estatePlanId}`);
    }
  };

  const canNavigate = (step: StepInfo, index: number) => {
    const isComplete = completedSteps.has(step.id);
    const isCurrent = step.id === currentStep;
    const isPast = index < currentIndex;
    return isComplete || isPast || isCurrent;
  };

  return (
    <div className="w-full">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <nav aria-label="Progress" className="relative">
          {/* Background connector line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" style={{ left: '2.5rem', right: '2.5rem' }} />

          {/* Progress line */}
          <div
            className="absolute top-5 h-0.5 bg-blue-600 transition-all duration-500"
            style={{
              left: '2.5rem',
              width: `calc(${(currentIndex / (STEPS.length - 1)) * 100}% - 2.5rem)`
            }}
          />

          <ol className="relative flex items-start justify-between">
            {STEPS.map((step, index) => {
              const isComplete = completedSteps.has(step.id);
              const isCurrent = step.id === currentStep;
              const isPast = index < currentIndex;
              const isClickable = canNavigate(step, index);

              return (
                <li key={step.id} className="flex flex-col items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => handleStepClick(step, index)}
                    disabled={!isClickable}
                    className={`
                      relative flex h-10 w-10 items-center justify-center rounded-full
                      transition-all duration-200 bg-white dark:bg-gray-800
                      ${isComplete
                        ? "bg-green-600 text-white ring-4 ring-green-100 dark:ring-green-900/30"
                        : isCurrent
                          ? "border-2 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30"
                          : "border-2 border-gray-300 dark:border-gray-600"
                      }
                      ${isClickable && !isCurrent ? "cursor-pointer hover:ring-4 hover:ring-gray-100 dark:hover:ring-gray-700" : ""}
                      ${!isClickable ? "cursor-not-allowed opacity-60" : ""}
                    `}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isComplete ? (
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span
                        className={`text-sm font-semibold ${
                          isCurrent
                            ? "text-blue-600"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </button>

                  {/* Step Label */}
                  <div className="mt-3 text-center">
                    <span
                      className={`text-sm font-medium block ${
                        isCurrent
                          ? "text-blue-600 dark:text-blue-400"
                          : isComplete
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 max-w-[100px] hidden lg:block">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        {/* Current step info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Step {currentIndex + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(((currentIndex + 1) / STEPS.length) * 100)}% complete
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {STEPS[currentIndex].fullName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {STEPS[currentIndex].description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step indicators - scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {STEPS.map((step, index) => {
            const isComplete = completedSteps.has(step.id);
            const isCurrent = step.id === currentStep;
            const isClickable = canNavigate(step, index);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepClick(step, index)}
                disabled={!isClickable}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200
                  ${isComplete
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  }
                  ${!isClickable ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {isComplete && (
                  <span className="mr-1">✓</span>
                )}
                {step.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { STEPS };
export type { StepInfo };
