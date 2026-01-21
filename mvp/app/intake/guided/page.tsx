"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGuidedIntakeProgress,
  createEstatePlan,
} from "@/app/hooks/usePrismaQueries";
import { Loader2, ArrowRight, Clock, Shield, Heart } from "lucide-react";
import { Button } from "@/app/components/ui";
import { EmotionalBanner } from "@/components/intake";
import { GUIDED_STEPS, getTotalSteps } from "@/lib/intake/guided-flow-config";

function GuidedIntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [isStarting, setIsStarting] = useState(false);

  // Check for existing guided progress using SWR hook
  const { data: existingProgress, isLoading } = useGuidedIntakeProgress(planId);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      let currentPlanId = planId;

      // Create a new plan if we don't have one
      if (!currentPlanId) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const newPlan = await createEstatePlan({
          sessionId,
          name: "My Estate Plan",
        });
        localStorage.setItem("estatePlanSessionId", sessionId);
        localStorage.setItem("estatePlanId", newPlan.id);
        currentPlanId = newPlan.id;
      }

      // Navigate to first step
      router.push(`/intake/guided/about-you?planId=${currentPlanId}`);
    } catch (error) {
      console.error("Failed to start guided intake:", error);
      setIsStarting(false);
    }
  };

  const handleContinue = () => {
    if (existingProgress && planId) {
      const currentStep = GUIDED_STEPS.find((s) => s.id === existingProgress.currentStep);
      if (currentStep) {
        router.push(`/intake/guided/${currentStep.slug}?planId=${planId}`);
      }
    }
  };

  // Show loading state while checking for existing progress
  if (isLoading && planId) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-purple)]" />
      </div>
    );
  }

  // If we have existing progress with completed steps, show continue option
  const hasExistingProgress = existingProgress && existingProgress.completedSteps?.length > 0;
  if (hasExistingProgress && planId) {
    const currentStep = GUIDED_STEPS.find((s) => s.id === existingProgress.currentStep);
    const completedCount = existingProgress.completedSteps.length;
    const totalSteps = getTotalSteps();
    const progress = Math.round((completedCount / totalSteps) * 100);

    return (
      <div className="space-y-8">
        <EmotionalBanner
          message="Welcome back! You've made great progress on your estate plan."
          variant="encouragement"
        />

        <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 space-y-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[var(--text-heading)]">
              Continue Your Estate Plan
            </h1>
            <p className="text-[var(--text-muted)] mt-2">
              You&apos;re {progress}% complete. Pick up where you left off.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Progress</span>
              <span className="font-medium text-[var(--accent-purple)]">{progress}%</span>
            </div>
            <div className="w-full bg-[var(--light-gray)] rounded-full h-2">
              <div
                className="h-2 rounded-full bg-[var(--accent-purple)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current step indicator */}
          {currentStep && (
            <div className="bg-[var(--off-white)] rounded-xl p-4">
              <p className="text-sm text-[var(--text-muted)]">Next up:</p>
              <p className="font-medium text-[var(--text-heading)]">
                Step {currentStep.id}: {currentStep.title}
              </p>
              <p className="text-sm text-[var(--text-caption)] mt-1">
                {currentStep.subtitle}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" onClick={handleContinue} className="flex-1">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="secondary" onClick={handleStart}>
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // New user - show welcome screen
  return (
    <div className="space-y-8">
      <EmotionalBanner message="Taking this step shows you care about your loved ones." />

      <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-heading)]">
            Let&apos;s Create Your Estate Plan
          </h1>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            We&apos;ll guide you through a few simple questions. No legal jargon, just conversation.
          </p>
        </div>

        {/* Time estimate */}
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[var(--accent-purple)]" />
            <span className="text-[var(--text-muted)]">15-20 minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-[var(--success)]" />
            <span className="text-[var(--text-muted)]">Auto-saves as you go</span>
          </div>
        </div>

        {/* Steps preview */}
        <div className="bg-[var(--off-white)] rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-[var(--text-heading)]">
            What we&apos;ll cover:
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {GUIDED_STEPS.slice(0, 6).map((step) => (
              <div key={step.id} className="flex items-center gap-2 text-[var(--text-muted)]">
                <div className="w-5 h-5 rounded-full bg-[var(--accent-muted)] text-[var(--accent-purple)] text-xs flex items-center justify-center font-medium">
                  {step.id}
                </div>
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleStart}
          disabled={isStarting}
        >
          {isStarting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Getting started...
            </>
          ) : (
            <>
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-[var(--text-caption)] text-center">
          <Heart className="w-3 h-3 inline mr-1" />
          You can save and return anytime. No information is shared without your permission.
        </p>
      </div>
    </div>
  );
}

export default function GuidedIntakePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-purple)]" />
        </div>
      }
    >
      <GuidedIntakeContent />
    </Suspense>
  );
}
