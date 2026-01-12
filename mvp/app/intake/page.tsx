"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Link from "next/link";
import SaveProgressPrompt from "../components/SaveProgressPrompt";

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
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Intake Complete!
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          You&apos;ve provided all the information we need. Now let&apos;s analyze your estate planning situation and identify any gaps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/analysis/${planId}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Run Gap Analysis
          </Link>
          <Link
            href={`/intake/personal?planId=${planId}`}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {existingPlan.name || "Your Estate Plan"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Continue where you left off
          </p>
        </div>

        {/* Extracted Data Banner */}
        {hasExtractedData && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  Pre-filled data available
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  We extracted information from your {uploadedDocs?.length || 0} uploaded document{(uploadedDocs?.length || 0) !== 1 ? 's' : ''}.
                  Fields with extracted data will be marked with a blue badge.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Documents Link */}
        {!hasUploadedDocs && (
          <Link
            href={`/intake/upload?planId=${planId}`}
            className="block bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  Have existing documents?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload your will, trust, or POA to auto-fill your questionnaire
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        )}

        {/* Save Progress Prompt for anonymous users */}
        <SaveProgressPrompt completedSections={completedSections} showAfterSections={2} />

        {/* Progress Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Intake Progress
            </h2>
            <span className="text-2xl font-bold text-blue-600">
              {intakeProgress.percentComplete}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${intakeProgress.percentComplete}%` }}
            />
          </div>

          <div className="space-y-3">
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
                      ? "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
                      : status.exists
                        ? "bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center
                        ${status.isComplete
                          ? "bg-green-500 text-white"
                          : status.exists
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                        }
                      `}
                    >
                      {status.isComplete ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : status.exists ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <span className="text-xs">○</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {sectionNames[section]}
                    </span>
                  </div>
                  <span
                    className={`
                      text-sm
                      ${status.isComplete
                        ? "text-green-600"
                        : status.exists
                          ? "text-yellow-600"
                          : "text-gray-500"
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
        <div className="flex flex-col sm:flex-row gap-4">
          {intakeProgress.isAllComplete ? (
            <Link
              href={`/analysis/${planId}`}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
            >
              Continue to Gap Analysis
            </Link>
          ) : (
            <Link
              href={`/intake/${getNextIncompleteSection(intakeProgress.sections)}?planId=${planId}`}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
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
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Start New Plan
          </button>
        </div>
      </div>
    );
  }

  // New user - show document-first flow
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-2 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Let&apos;s Review Your Documents
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Upload your existing estate planning documents and we&apos;ll automatically extract your information.
        </p>
      </div>

      {/* Primary CTA - Upload Documents */}
      <div className="space-y-4">
        <button
          onClick={handleStartWithDocuments}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl group"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-xl mb-1">Upload Your Documents</h3>
              <p className="text-blue-100 text-sm">
                Wills, trusts, powers of attorney, healthcare directives
              </p>
            </div>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-700 dark:text-green-300 font-medium">Save 15+ min</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-700 dark:text-blue-300 font-medium">Auto-fill forms</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-purple-700 dark:text-purple-300 font-medium">AI analysis</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isCreating && (
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Creating your estate plan...
        </div>
      )}

      {/* Supported Document Types */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-left">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Supported Documents
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {[
            "Last Will & Testament",
            "Revocable Living Trust",
            "Irrevocable Trust",
            "Power of Attorney",
            "Healthcare Proxy",
            "Advance Directive",
            "Beneficiary Forms",
            "Property Deeds",
            "Insurance Policies",
          ].map((doc) => (
            <div key={doc} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Option - Start Fresh */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Don&apos;t have documents yet?
        </p>
        <button
          onClick={handleStartNew}
          disabled={isCreating}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center gap-1 disabled:opacity-50"
        >
          Start with a blank questionnaire
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Takes about 15-20 minutes to complete manually
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <IntakeLandingContent />
    </Suspense>
  );
}
