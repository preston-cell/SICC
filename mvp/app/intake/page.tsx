"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEstatePlan, useIntakeProgress, createEstatePlan, useUploadedDocuments, useExtractedData } from "../hooks/usePrismaQueries";
import Link from "next/link";
import SaveProgressPrompt from "../components/SaveProgressPrompt";
import {
  FileText,
  Upload,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Loader2,
  MessageCircle,
  ListChecks,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui";

// Design system colors
const ACCENT = "var(--accent-purple)";
const SUCCESS = "var(--success)";

function IntakeLandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const isComplete = searchParams.get("complete") === "true";

  const [isCreating, setIsCreating] = useState(false);

// createEstatePlan is imported from usePrismaQueries
  const { data: existingPlan } = useEstatePlan(planId);
  const { data: intakeProgress } = useIntakeProgress(planId);
  const { data: extractedData } = useExtractedData(planId);
  const { data: uploadedDocs } = useUploadedDocuments(planId);

  const hasExtractedData = extractedData && extractedData.length > 0;
  const hasUploadedDocs = uploadedDocs && uploadedDocs.length > 0;

  const handleStartWithDocuments = async () => {
    setIsCreating(true);
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const newPlan = await createEstatePlan({
        sessionId,
        name: "My Estate Plan",
      });
      localStorage.setItem("estatePlanSessionId", sessionId);
      localStorage.setItem("estatePlanId", newPlan.id);
      router.push(`/intake/upload?planId=${newPlan.id}`);
    } catch (error) {
      console.error("Failed to create estate plan:", error);
      setIsCreating(false);
    }
  };

  const handleStartNew = async () => {
    setIsCreating(true);
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const newPlan = await createEstatePlan({
        sessionId,
        name: "My Estate Plan",
      });
      localStorage.setItem("estatePlanSessionId", sessionId);
      localStorage.setItem("estatePlanId", newPlan.id);
      router.push(`/intake/personal?planId=${newPlan.id}`);
    } catch (error) {
      console.error("Failed to create estate plan:", error);
      setIsCreating(false);
    }
  };

  const handleStartGuided = async () => {
    setIsCreating(true);
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const newPlan = await createEstatePlan({
        sessionId,
        name: "My Estate Plan",
      });
      localStorage.setItem("estatePlanSessionId", sessionId);
      localStorage.setItem("estatePlanId", newPlan.id);
      router.push(`/intake/guided?planId=${newPlan.id}`);
    } catch (error) {
      console.error("Failed to create estate plan:", error);
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (!planId) {
      const savedPlanId = localStorage.getItem("estatePlanId");
      if (savedPlanId) {
        router.replace(`/intake?planId=${savedPlanId}`);
      }
    }
  }, [planId, router]);

  // Completion state
  if (isComplete && planId) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto bg-[var(--success-muted)]">
          <Check className="w-8 h-8 text-[var(--success)]" />
        </div>

        <h1 className="text-section text-[var(--text-heading)]">
          Intake Complete
        </h1>

        <p className="text-[var(--text-muted)]">
          You&apos;ve provided all the information we need. Let&apos;s analyze your estate planning situation.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/analysis/${planId}`}>
            <Button variant="primary">
              Run Gap Analysis
            </Button>
          </Link>
          <Link href={`/intake/personal?planId=${planId}`}>
            <Button variant="secondary">
              Review Answers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Existing plan progress
  if (existingPlan && intakeProgress) {
    const completedSections = (Object.values(intakeProgress.sections) as Array<{ isComplete: boolean }>).filter((s: { isComplete: boolean }) => s.isComplete).length;

    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-section text-[var(--text-heading)]">
            {existingPlan.name || "Your Estate Plan"}
          </h1>
          <p className="text-[var(--text-muted)] mt-1">
            Continue where you left off
          </p>
        </div>

        {/* Extracted Data Banner */}
        {hasExtractedData && (
          <div className="bg-[var(--info-muted)] border border-[var(--info)]/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--info)]/10">
                <FileText className="w-5 h-5 text-[var(--info)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--info)]">
                  Pre-filled data available
                </p>
                <p className="text-sm text-[var(--info)]/80 mt-0.5">
                  Extracted from {uploadedDocs?.length || 0} uploaded document{(uploadedDocs?.length || 0) !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Documents Link */}
        {!hasUploadedDocs && (
          <Link
            href={`/intake/upload?planId=${planId}`}
            className="block bg-white border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent-purple)] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--accent-muted)]">
                <Upload className="w-5 h-5 text-[var(--accent-purple)]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[var(--text-heading)]">
                  Have existing documents?
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Upload to auto-fill your questionnaire
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-purple)] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        )}

        <SaveProgressPrompt completedSections={completedSections} showAfterSections={2} />

        {/* Progress Overview */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[var(--text-heading)]">
              Progress
            </h2>
            <span className="text-xl font-semibold text-[var(--accent-purple)]">
              {intakeProgress.percentComplete}%
            </span>
          </div>

          <div className="w-full bg-[var(--off-white)] rounded-full h-2 mb-5">
            <div
              className="h-2 rounded-full bg-[var(--accent-purple)] transition-all duration-300"
              style={{ width: `${intakeProgress.percentComplete}%` }}
            />
          </div>

          <div className="space-y-2">
            {Object.entries(intakeProgress.sections).map(([section, status]) => {
              const s = status as { isComplete: boolean; exists: boolean };
              const sectionNames: Record<string, string> = {
                personal: "Personal Information",
                family: "Family Information",
                assets: "Assets Overview",
                existing_documents: "Existing Documents",
                goals: "Goals & Wishes",
              };

              const sectionPaths: Record<string, string> = {
                personal: "personal",
                family: "family",
                assets: "assets",
                existing_documents: "existing",
                goals: "goals",
              };

              return (
                <Link
                  key={section}
                  href={`/intake/${sectionPaths[section]}?planId=${planId}`}
                  className={`
                    flex items-center justify-between p-3 rounded-lg transition-all
                    ${s.isComplete
                      ? "bg-[var(--success-muted)] hover:bg-[var(--success)]/15"
                      : s.exists
                        ? "bg-[var(--warning-muted)] hover:bg-[var(--warning)]/15"
                        : "bg-[var(--off-white)] hover:bg-[var(--light-gray)]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center
                        ${s.isComplete
                          ? "bg-[var(--success)]"
                          : s.exists
                            ? "bg-[var(--warning)]"
                            : "border-2 border-[var(--border)]"
                        }
                      `}
                    >
                      {s.isComplete ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : s.exists ? (
                        <span className="text-[10px] text-white font-bold">...</span>
                      ) : null}
                    </div>
                    <span className="font-medium text-[var(--text-heading)] text-sm">
                      {sectionNames[section]}
                    </span>
                  </div>
                  <span
                    className={`
                      text-xs font-medium
                      ${s.isComplete
                        ? "text-[var(--success)]"
                        : s.exists
                          ? "text-[var(--warning)]"
                          : "text-[var(--text-muted)]"
                      }
                    `}
                  >
                    {s.isComplete ? "Complete" : s.exists ? "In Progress" : "Not Started"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {intakeProgress.isAllComplete ? (
            <Link href={`/analysis/${planId}`} className="flex-1">
              <Button variant="primary" fullWidth>
                Continue to Gap Analysis
              </Button>
            </Link>
          ) : (
            <Link href={`/intake/${getNextIncompleteSection(intakeProgress.sections)}?planId=${planId}`} className="flex-1">
              <Button variant="primary" fullWidth>
                Continue Intake
              </Button>
            </Link>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("estatePlanId");
              localStorage.removeItem("estatePlanSessionId");
              router.push("/intake");
            }}
            className="px-5 py-2.5 border border-[var(--border)] text-[var(--text-heading)] rounded-lg font-medium text-sm hover:bg-[var(--off-white)] transition-colors"
          >
            Start New Plan
          </button>
        </div>
      </div>
    );
  }

  // New user - mode selector
  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Emotional Banner */}
      <div className="bg-[var(--accent-muted)] border border-[var(--accent-purple)]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Heart className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--accent-purple)]" />
          <p className="text-sm text-[var(--accent-purple)]">
            Taking this step shows you care about your loved ones.
            <span className="block mt-1 opacity-80">
              There&apos;s no rush - save your progress and return anytime.
            </span>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-2 bg-[var(--accent-muted)]">
          <FileText className="w-7 h-7 text-[var(--accent-purple)]" />
        </div>
        <h1 className="text-section text-[var(--text-heading)]">
          Create Your Estate Plan
        </h1>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">
          Choose how you&apos;d like to get started
        </p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-4">
        {/* Quick Start - Guided Flow (Recommended) */}
        <button
          onClick={handleStartGuided}
          disabled={isCreating}
          className="w-full rounded-xl p-5 bg-[var(--accent-purple)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-medium text-white">Quick Start</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white/90">Recommended</span>
              </div>
              <p className="text-white/70 text-sm">
                Guided conversation • 15-20 minutes
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Simple questions
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> No jargon
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Mobile friendly
            </span>
          </div>
        </button>

        {/* Comprehensive Form Option */}
        <button
          onClick={handleStartNew}
          disabled={isCreating}
          className="w-full rounded-xl p-5 bg-white border-2 border-[var(--border)] hover:border-[var(--accent-purple)] disabled:opacity-50 disabled:cursor-not-allowed transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--off-white)] rounded-lg flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-[var(--text-heading)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--text-heading)] mb-0.5">
                Comprehensive Form
              </h3>
              <p className="text-[var(--text-muted)] text-sm">
                All sections at once • For detailed input
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-0.5 group-hover:text-[var(--accent-purple)] transition-all" />
          </div>
        </button>

        {/* Upload Documents Option */}
        <button
          onClick={handleStartWithDocuments}
          disabled={isCreating}
          className="w-full rounded-xl p-5 bg-white border-2 border-[var(--border)] hover:border-[var(--accent-purple)] disabled:opacity-50 disabled:cursor-not-allowed transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--off-white)] rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-[var(--text-heading)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--text-heading)] mb-0.5">
                Upload Existing Documents
              </h3>
              <p className="text-[var(--text-muted)] text-sm">
                AI extracts info from your files
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:translate-x-0.5 group-hover:text-[var(--accent-purple)] transition-all" />
          </div>
        </button>
      </div>

      {/* Loading State */}
      {isCreating && (
        <div className="flex items-center justify-center gap-2 text-[var(--text-muted)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Creating your estate plan...</span>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-[var(--off-white)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-[var(--text-heading)]">
          What happens next?
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent-purple)] flex items-center justify-center text-xs font-medium flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-[var(--text-heading)]">Answer a few questions</p>
              <p className="text-[var(--text-muted)]">About you, your family, and what you own</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent-purple)] flex items-center justify-center text-xs font-medium flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-[var(--text-heading)]">Get a personalized analysis</p>
              <p className="text-[var(--text-muted)]">AI reviews your situation and identifies gaps</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent-purple)] flex items-center justify-center text-xs font-medium flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-[var(--text-heading)]">Receive your documents</p>
              <p className="text-[var(--text-muted)]">Draft documents ready for attorney review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-[var(--text-caption)] text-center">
        Your information is encrypted and never shared without your permission.
      </p>
    </div>
  );
}

function getNextIncompleteSection(sections: Record<string, { exists: boolean; isComplete: boolean }>) {
  const order = ["personal", "family", "assets", "existing_documents", "goals"];
  const paths: Record<string, string> = {
    personal: "personal",
    family: "family",
    assets: "assets",
    existing_documents: "existing",
    goals: "goals",
  };

  for (const section of order) {
    if (!sections[section]?.isComplete) {
      return paths[section];
    }
  }
  return "personal";
}

export default function IntakePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-purple)]" />
      </div>
    }>
      <IntakeLandingContent />
    </Suspense>
  );
}
