"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
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
  Circle,
  Loader2,
} from "lucide-react";

// Cohere colors
const CORAL = "#FF5833";
const GREEN = "#19A582";

function IntakeLandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const isComplete = searchParams.get("complete") === "true";

  const [isCreating, setIsCreating] = useState(false);

  const createEstatePlan = useMutation(api.estatePlanning.createEstatePlan);

  // Get existing plan if planId is provided
  const existingPlan = useQuery(
    api.queries.getEstatePlan,
    planId ? { estatePlanId: planId as Id<"estatePlans"> } : "skip"
  );

  // Get intake progress if we have a plan
  const intakeProgress = useQuery(
    api.queries.getIntakeProgress,
    planId ? { estatePlanId: planId as Id<"estatePlans"> } : "skip"
  );

  // Get extracted data if available
  const extractedData = useQuery(
    api.extractedData.getExtractedData,
    planId ? { estatePlanId: planId as Id<"estatePlans"> } : "skip"
  );

  // Get uploaded documents count
  const uploadedDocs = useQuery(
    api.uploadedDocuments.getUploadedDocuments,
    planId ? { estatePlanId: planId as Id<"estatePlans"> } : "skip"
  );

  const hasExtractedData = extractedData && extractedData.length > 0;
  const hasUploadedDocs = uploadedDocs && uploadedDocs.length > 0;

  // Navigate to upload step for new users (document-first flow)
  const handleStartWithDocuments = async () => {
    setIsCreating(true);
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const newPlanId = await createEstatePlan({
        sessionId,
        name: "My Estate Plan",
      });
      localStorage.setItem("estatePlanSessionId", sessionId);
      localStorage.setItem("estatePlanId", newPlanId);
      router.push(`/intake/upload?planId=${newPlanId}`);
    } catch (error) {
      console.error("Failed to create estate plan:", error);
      setIsCreating(false);
    }
  };

  const handleStartNew = async () => {
    setIsCreating(true);
    try {
      // Generate a session ID for anonymous users
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const newPlanId = await createEstatePlan({
        sessionId,
        name: "My Estate Plan",
      });

      // Store session ID in localStorage for retrieval
      localStorage.setItem("estatePlanSessionId", sessionId);
      localStorage.setItem("estatePlanId", newPlanId);

      router.push(`/intake/personal?planId=${newPlanId}`);
    } catch (error) {
      console.error("Failed to create estate plan:", error);
      setIsCreating(false);
    }
  };

  // Check localStorage for existing plan on mount
  useEffect(() => {
    if (!planId) {
      const savedPlanId = localStorage.getItem("estatePlanId");
      if (savedPlanId) {
        router.replace(`/intake?planId=${savedPlanId}`);
      }
    }
  }, [planId, router]);

  // Show completion state
  if (isComplete && planId) {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto"
          style={{ backgroundColor: `${GREEN}15` }}
        >
          <Check className="w-8 h-8" style={{ color: GREEN }} />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Intake Complete
        </h1>

        <p className="text-gray-600 dark:text-[#9D918A]">
          You&apos;ve provided all the information we need. Let&apos;s analyze your estate planning situation.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/analysis/${planId}`}
            className="px-5 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
          >
            Run Gap Analysis
          </Link>
          <Link
            href={`/intake/personal?planId=${planId}`}
            className="px-5 py-2.5 border border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-white rounded-lg font-medium text-sm hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            Review Answers
          </Link>
        </div>
      </div>
    );
  }

  // Show existing plan progress
  if (existingPlan && intakeProgress) {
    // Calculate completed sections for SaveProgressPrompt
    const completedSections = Object.values(intakeProgress.sections).filter(s => s.isComplete).length;

    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {existingPlan.name || "Your Estate Plan"}
          </h1>
          <p className="text-gray-600 dark:text-[#9D918A] mt-1">
            Continue where you left off
          </p>
        </div>

        {/* Extracted Data Banner */}
        {hasExtractedData && (
          <div className="bg-[#3B82F6]/[0.08] border border-[#3B82F6]/[0.15] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
              >
                <FileText className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div>
                <p className="font-medium text-[#3B82F6] text-sm">
                  Pre-filled data available
                </p>
                <p className="text-sm text-[#3B82F6]/80 mt-0.5">
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
            className="block bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/[0.08] rounded-lg p-4 hover:border-gray-300 dark:hover:border-white/[0.12] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${CORAL}12` }}
              >
                <Upload className="w-5 h-5" style={{ color: CORAL }} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Have existing documents?
                </p>
                <p className="text-sm text-gray-500 dark:text-[#73655C]">
                  Upload to auto-fill your questionnaire
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[#73655C] group-hover:text-gray-600 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        )}

        {/* Save Progress Prompt for anonymous users */}
        <SaveProgressPrompt completedSections={completedSections} showAfterSections={2} />

        {/* Progress Overview */}
        <div className="bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/[0.08] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">
              Progress
            </h2>
            <span className="text-xl font-semibold" style={{ color: CORAL }}>
              {intakeProgress.percentComplete}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-white/[0.04] rounded-full h-1.5 mb-5">
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${intakeProgress.percentComplete}%`, backgroundColor: CORAL }}
            />
          </div>

          <div className="space-y-2">
            {Object.entries(intakeProgress.sections).map(([section, status]) => {
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
                    flex items-center justify-between p-3 rounded-lg transition-colors
                    ${status.isComplete
                      ? "bg-[#19A582]/[0.08] hover:bg-[#19A582]/[0.12]"
                      : status.exists
                        ? "bg-[#E68A00]/[0.08] hover:bg-[#E68A00]/[0.12]"
                        : "bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-5 h-5 rounded-full flex items-center justify-center
                        ${status.isComplete
                          ? "bg-[#19A582]"
                          : status.exists
                            ? "bg-[#E68A00]"
                            : "border border-gray-300 dark:border-white/[0.2]"
                        }
                      `}
                    >
                      {status.isComplete ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : status.exists ? (
                        <span className="text-[10px] text-white">...</span>
                      ) : null}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {sectionNames[section]}
                    </span>
                  </div>
                  <span
                    className={`
                      text-xs font-medium
                      ${status.isComplete
                        ? "text-[#19A582]"
                        : status.exists
                          ? "text-[#E68A00]"
                          : "text-gray-500 dark:text-[#73655C]"
                      }
                    `}
                  >
                    {status.isComplete ? "Complete" : status.exists ? "In Progress" : "Not Started"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {intakeProgress.isAllComplete ? (
            <Link
              href={`/analysis/${planId}`}
              className="flex-1 px-5 py-2.5 rounded-lg font-medium text-sm text-center hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
            >
              Continue to Gap Analysis
            </Link>
          ) : (
            <Link
              href={`/intake/${getNextIncompleteSection(intakeProgress.sections)}?planId=${planId}`}
              className="flex-1 px-5 py-2.5 rounded-lg font-medium text-sm text-center hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CORAL, color: "#0D0D0D" }}
            >
              Continue Intake
            </Link>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("estatePlanId");
              localStorage.removeItem("estatePlanSessionId");
              router.push("/intake");
            }}
            className="px-5 py-2.5 border border-gray-300 dark:border-white/[0.1] text-gray-700 dark:text-white rounded-lg font-medium text-sm hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            Start New Plan
          </button>
        </div>
      </div>
    );
  }

  // New user - show document-first flow
  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-2"
          style={{ backgroundColor: `${CORAL}15` }}
        >
          <FileText className="w-7 h-7" style={{ color: CORAL }} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Estate Plan Intake
        </h1>
        <p className="text-gray-600 dark:text-[#9D918A] max-w-md mx-auto">
          Upload your existing documents or start with a blank questionnaire.
        </p>
      </div>

      {/* Primary CTA - Upload Documents */}
      <div className="space-y-4">
        <button
          onClick={handleStartWithDocuments}
          disabled={isCreating}
          className="w-full rounded-xl p-5 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
          style={{ backgroundColor: CORAL }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#0D0D0D]" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-medium text-[#0D0D0D] mb-0.5">Upload Documents</h3>
              <p className="text-[#0D0D0D]/70 text-sm">
                Wills, trusts, powers of attorney
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#0D0D0D]/70 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/[0.08] rounded-lg">
            <Clock className="w-4 h-4" style={{ color: GREEN }} />
            <span className="text-gray-600 dark:text-[#9D918A] text-xs">Save 15+ min</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/[0.08] rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-gray-600 dark:text-[#9D918A] text-xs">Auto-fill forms</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/[0.08] rounded-lg">
            <Sparkles className="w-4 h-4" style={{ color: CORAL }} />
            <span className="text-gray-600 dark:text-[#9D918A] text-xs">AI analysis</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isCreating && (
        <div className="flex items-center justify-center gap-2 text-[#9D918A]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Creating your estate plan...</span>
        </div>
      )}

      {/* Supported Document Types */}
      <div className="bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/[0.08] rounded-xl p-5">
        <h2 className="text-xs font-medium text-gray-500 dark:text-[#73655C] uppercase tracking-wide mb-4 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          Supported Documents
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {[
            "Will",
            "Living Trust",
            "Irrevocable Trust",
            "Power of Attorney",
            "Healthcare Proxy",
            "Advance Directive",
            "Beneficiary Forms",
            "Property Deeds",
            "Insurance Policies",
          ].map((doc) => (
            <div key={doc} className="flex items-center gap-2 text-gray-600 dark:text-[#9D918A]">
              <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GREEN }} />
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Option - Start Fresh */}
      <div className="pt-4 border-t border-gray-200 dark:border-white/[0.06] text-center">
        <p className="text-sm text-gray-500 dark:text-[#73655C] mb-2">
          Don&apos;t have documents yet?
        </p>
        <button
          onClick={handleStartNew}
          disabled={isCreating}
          className="font-medium text-sm inline-flex items-center gap-1 disabled:opacity-50 hover:gap-1.5 transition-all"
          style={{ color: CORAL }}
        >
          Start with blank questionnaire
          <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-gray-400 dark:text-[#564C45] mt-1">
          Takes about 15-20 minutes
        </p>
      </div>
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
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: CORAL }} />
      </div>
    }>
      <IntakeLandingContent />
    </Suspense>
  );
}
