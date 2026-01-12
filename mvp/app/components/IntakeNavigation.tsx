"use client";

import { useRouter } from "next/navigation";
import { STEPS, IntakeStep } from "./IntakeProgress";
import SaveIndicator from "./SaveIndicator";
import Button from "./ui/Button";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface IntakeNavigationProps {
  currentStep: IntakeStep;
  estatePlanId: string;
  onSaveAndExit: () => Promise<void>;
  onSaveAndContinue: () => Promise<void>;
  isSubmitting: boolean;
  canContinue: boolean;
  saveStatus?: SaveStatus;
  lastSaved?: Date | null;
  nextStepLabel?: string;
  isLastStep?: boolean;
}

export default function IntakeNavigation({
  currentStep,
  estatePlanId,
  onSaveAndExit,
  onSaveAndContinue,
  isSubmitting,
  canContinue,
  saveStatus = "idle",
  lastSaved,
  nextStepLabel,
  isLastStep = false,
}: IntakeNavigationProps) {
  const router = useRouter();
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentIndex === 0;

  const previousStep = isFirstStep ? null : STEPS[currentIndex - 1];

  const handleBack = () => {
    if (previousStep) {
      router.push(`${previousStep.path}?planId=${estatePlanId}`);
    }
  };

  // Get the continue button label
  const getContinueLabel = () => {
    if (isSubmitting) return "Saving...";
    if (nextStepLabel) return nextStepLabel;
    if (isLastStep) return "Complete Intake";
    const nextStep = STEPS[currentIndex + 1];
    return nextStep ? `Continue to ${nextStep.name}` : "Complete";
  };

  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
      {/* Save indicator */}
      <div className="flex justify-end">
        <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left side - Back button */}
        <div className="w-full sm:w-auto order-2 sm:order-1">
          {!isFirstStep ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isSubmitting}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
              fullWidth
              className="sm:w-auto"
            >
              Back to {previousStep?.name}
            </Button>
          ) : (
            <div /> // Empty placeholder for layout
          )}
        </div>

        {/* Right side - Save and Continue buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
          <Button
            variant="outline"
            onClick={onSaveAndExit}
            disabled={isSubmitting}
            fullWidth
            className="sm:w-auto"
          >
            Save & Exit
          </Button>

          <Button
            variant="primary"
            onClick={onSaveAndContinue}
            disabled={isSubmitting || !canContinue}
            isLoading={isSubmitting}
            rightIcon={
              !isSubmitting && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )
            }
            fullWidth
            className="sm:w-auto"
          >
            {getContinueLabel()}
          </Button>
        </div>
      </div>

      {/* Help text for validation */}
      {!canContinue && (
        <p className="text-sm text-amber-600 dark:text-amber-400 text-center sm:text-right">
          Please complete all required fields to continue
        </p>
      )}
    </div>
  );
}
