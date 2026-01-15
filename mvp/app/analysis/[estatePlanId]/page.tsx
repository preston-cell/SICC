"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import { Tabs, TabPanel } from "../../components/ui/Tabs";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import GapAnalysisCard, { ScoreRing, DOCUMENT_TYPE_NAMES } from "../../components/GapAnalysisCard";

interface MissingDocument {
  // New API fields
  document?: string;
  priority?: "critical" | "high" | "medium" | "low";
  urgency?: string;
  reason?: string;
  consequences?: string;
  estimatedCostToCreate?: { low: number; high: number };
  stateRequirements?: string;
  // Legacy fields for backward compatibility
  type?: string;
}

interface OutdatedDocument {
  document?: string;
  type?: string;
  issue?: string;
  risk?: string;
  recommendation?: string;
  lastUpdated?: string;
  yearsOld?: number;
  estimatedUpdateCost?: { low: number; high: number };
}

interface Inconsistency {
  type?: string;
  severity?: "critical" | "high" | "medium" | "low";
  issue?: string;
  details?: string;
  potentialConsequence?: string;
  resolution?: string;
  recommendation?: string;
  estimatedResolutionCost?: { low: number; high: number };
}

interface Recommendation {
  rank?: number;
  action?: string;
  category?: string;
  priority?: "critical" | "high" | "medium" | "low";
  timeline?: string;
  estimatedCost?: { low: number; high: number };
  estimatedBenefit?: string;
  detailedSteps?: string[];
  professionalNeeded?: string;
  riskOfDelay?: string;
  // Legacy fields
  reason?: string;
}

interface StateNote {
  topic?: string;
  rule?: string;
  impact?: string;
  action?: string;
  citation?: string;
  // Legacy fields
  note?: string;
  relevance?: string;
}

// Score interpretation helper
function getScoreInterpretation(score: number): {
  label: string;
  description: string;
  color: string;
} {
  if (score >= 80) {
    return {
      label: "Excellent",
      description: "Your estate plan is comprehensive and well-organized.",
      color: "text-green-600 dark:text-green-400",
    };
  }
  if (score >= 60) {
    return {
      label: "Good",
      description: "Your estate plan is solid but has some room for improvement.",
      color: "text-yellow-600 dark:text-yellow-400",
    };
  }
  if (score >= 40) {
    return {
      label: "Needs Work",
      description: "Several important areas need attention in your estate plan.",
      color: "text-orange-600 dark:text-orange-400",
    };
  }
  return {
    label: "Critical",
    description: "Your estate plan has significant gaps that should be addressed soon.",
    color: "text-red-600 dark:text-red-400",
  };
}

export default function AnalysisPage() {
  const params = useParams();
  const estatePlanId = params.estatePlanId as Id<"estatePlans">;

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch estate plan and analysis
  const estatePlan = useQuery(api.queries.getEstatePlan, { estatePlanId });
  const latestAnalysis = useQuery(api.queries.getLatestGapAnalysis, { estatePlanId });
  const intakeProgress = useQuery(api.queries.getIntakeProgress, { estatePlanId });

  // Get full intake data for analysis
  const intakeData = useQuery(api.queries.getEstatePlanFull, { estatePlanId });

  // Mutation to save gap analysis results
  const saveGapAnalysis = useMutation(api.estatePlanning.saveGapAnalysisPublic);

  const handleRunAnalysis = useCallback(async () => {
    setIsRunning(true);
    setError(null);

    try {
      // Build intake data object for the API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawIntakeData = intakeData as any;
      console.log("Raw intakeData from Convex:", rawIntakeData);

      const intakeArray = rawIntakeData?.intakeData || rawIntakeData?.intake || [];
      console.log("Intake array:", intakeArray);
      console.log("Available sections:", intakeArray.map?.((i: { section: string }) => i.section) || "none");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const beneficiaries = rawIntakeData?.beneficiaryDesignations || [];

      const apiIntakeData = {
        estatePlan: { stateOfResidence: estatePlan?.stateOfResidence },
        personal: intakeArray?.find((i: { section: string }) => i.section === "personal"),
        family: intakeArray?.find((i: { section: string }) => i.section === "family"),
        assets: intakeArray?.find((i: { section: string }) => i.section === "assets"),
        existingDocuments: intakeArray?.find((i: { section: string }) => i.section === "existing_documents"),
        goals: intakeArray?.find((i: { section: string }) => i.section === "goals"),
        beneficiaryDesignations: beneficiaries,
      };

      console.log("Built apiIntakeData:", JSON.stringify(apiIntakeData, null, 2));

      // Call the API route directly (bypasses Convex timeout issues)
      const response = await fetch("/api/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeData: apiIntakeData }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Analysis failed");
        return;
      }

      // Debug: Log what we received from the API
      console.log("Gap analysis API response:", {
        success: result.success,
        hasAnalysisResult: !!result.analysisResult,
        score: result.analysisResult?.score,
        overallScore: result.analysisResult?.overallScore,
        missingDocsCount: result.analysisResult?.missingDocuments?.length || 0,
        recommendationsCount: (result.analysisResult?.recommendations || result.analysisResult?.prioritizedRecommendations)?.length || 0,
        stateNotesCount: (result.analysisResult?.stateSpecificNotes || result.analysisResult?.stateSpecificConsiderations)?.length || 0,
      });

      // Validate we got meaningful data
      const missingDocs = result.analysisResult?.missingDocuments || [];
      const recommendations = result.analysisResult?.recommendations || result.analysisResult?.prioritizedRecommendations || [];
      const stateNotes = result.analysisResult?.stateSpecificNotes || result.analysisResult?.stateSpecificConsiderations || [];

      if (missingDocs.length === 0 && recommendations.length === 0) {
        console.warn("WARNING: API returned empty analysis data - possible parsing issue");
        console.warn("Full result structure:", JSON.stringify(result.analysisResult, null, 2).slice(0, 1000));
      }

      // Log what we're about to save
      console.log("Saving to Convex:", {
        score: result.analysisResult?.score || 50,
        missingDocsCount: missingDocs.length,
        recommendationsCount: recommendations.length,
        stateNotesCount: stateNotes.length,
      });

      // Save results to Convex
      await saveGapAnalysis({
        estatePlanId,
        score: result.analysisResult.score || 50,
        estateComplexity: result.analysisResult.estateComplexity
          ? JSON.stringify(result.analysisResult.estateComplexity)
          : undefined,
        estimatedEstateTax: (result.analysisResult.estimatedEstateTax || result.analysisResult.financialExposure?.estimatedEstateTax)
          ? JSON.stringify(result.analysisResult.estimatedEstateTax || result.analysisResult.financialExposure?.estimatedEstateTax)
          : undefined,
        missingDocuments: JSON.stringify(result.analysisResult.missingDocuments || []),
        outdatedDocuments: JSON.stringify(result.analysisResult.outdatedDocuments || []),
        inconsistencies: JSON.stringify(result.analysisResult.inconsistencies || []),
        taxOptimization: (result.analysisResult.taxOptimization || result.analysisResult.taxStrategies)
          ? JSON.stringify(result.analysisResult.taxOptimization || result.analysisResult.taxStrategies)
          : undefined,
        medicaidPlanning: result.analysisResult.medicaidPlanning
          ? JSON.stringify(result.analysisResult.medicaidPlanning)
          : undefined,
        recommendations: JSON.stringify(result.analysisResult.recommendations || result.analysisResult.prioritizedRecommendations || []),
        stateSpecificNotes: JSON.stringify(result.analysisResult.stateSpecificNotes || result.analysisResult.stateSpecificConsiderations || []),
        rawAnalysis: result.analysisResult.rawAnalysis || result.stdout,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  }, [estatePlanId, estatePlan, intakeData, saveGapAnalysis]);

  // Parse analysis data
  const parseJsonArray = <T,>(jsonString: string | undefined): T[] => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString) as T[];
    } catch {
      return [];
    }
  };

  const missingDocs = parseJsonArray<MissingDocument>(latestAnalysis?.missingDocuments);
  const outdatedDocs = parseJsonArray<OutdatedDocument>(latestAnalysis?.outdatedDocuments);
  const inconsistencies = parseJsonArray<Inconsistency>(latestAnalysis?.inconsistencies);
  const recommendations = parseJsonArray<Recommendation>(latestAnalysis?.recommendations);
  const stateNotes = parseJsonArray<StateNote>(latestAnalysis?.stateSpecificNotes);

  // Compute issues count (outdated + inconsistencies)
  const issuesCount = outdatedDocs.length + inconsistencies.length;

  // Check if intake is complete
  const intakeComplete = intakeProgress?.isAllComplete;

  // Score interpretation
  const scoreInfo = latestAnalysis?.score
    ? getScoreInterpretation(latestAnalysis.score)
    : null;

  // Tab configuration
  const tabs = useMemo(
    () => [
      {
        id: "overview",
        label: "Overview",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        id: "missing",
        label: `Missing (${missingDocs.length})`,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        disabled: missingDocs.length === 0,
      },
      {
        id: "issues",
        label: `Issues (${issuesCount})`,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        disabled: issuesCount === 0,
      },
      {
        id: "recommendations",
        label: `Actions (${recommendations.length})`,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        disabled: recommendations.length === 0,
      },
      {
        id: "state",
        label: "State Notes",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        ),
        disabled: stateNotes.length === 0,
      },
    ],
    [missingDocs.length, issuesCount, recommendations.length, stateNotes.length]
  );

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  if (!estatePlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Estate Planning Assistant
          </Link>
          <div className="flex items-center gap-3">
            {latestAnalysis && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                }
              >
                Print Report
              </Button>
            )}
            <Link
              href={`/intake?planId=${estatePlanId}`}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Back to Intake
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Intake Incomplete Warning */}
        {!intakeComplete && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 print:hidden">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Intake Incomplete</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Complete all intake sections for the most accurate analysis.
                  You&apos;ve completed {intakeProgress?.completedCount || 0} of {intakeProgress?.totalCount || 5} sections.
                </p>
                <Link
                  href={`/intake?planId=${estatePlanId}`}
                  className="inline-block mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
                >
                  Complete Intake →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Run Analysis State */}
        {!latestAnalysis && !isRunning && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to Analyze Your Estate Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Our AI will review your intake data and identify gaps, outdated documents, and provide personalized recommendations based on your state&apos;s laws.
            </p>
            <Button onClick={handleRunAnalysis} size="lg">
              Run Gap Analysis
            </Button>
          </div>
        )}

        {/* Running State */}
        {isRunning && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Analyzing Your Estate Plan...
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              This may take a minute. We&apos;re reviewing your information and generating personalized recommendations.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-300">Analysis Failed</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
                <button
                  onClick={handleRunAnalysis}
                  className="mt-2 text-sm font-medium text-red-800 dark:text-red-300 hover:underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {latestAnalysis && !isRunning && (
          <div className="space-y-6">
            {/* Hero Section - Score Display */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Score Hero */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-10 text-center">
                <h1 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-6">
                  {estatePlan.name || "Your Estate Plan"} Analysis
                </h1>

                {/* Large Score Ring */}
                <div className="mb-6">
                  <ScoreRing score={latestAnalysis.score || 0} size="lg" />
                </div>

                {/* Score Interpretation */}
                {scoreInfo && (
                  <div className="mb-8">
                    <h2 className={`text-3xl font-bold ${scoreInfo.color} mb-2`}>
                      {scoreInfo.label}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      {scoreInfo.description}
                    </p>
                  </div>
                )}

                {/* Quick Stats Row */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                  <StatCard
                    label="Missing Documents"
                    value={missingDocs.length}
                    color={missingDocs.length > 0 ? "red" : "green"}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Issues Found"
                    value={issuesCount}
                    color={issuesCount > 0 ? "yellow" : "green"}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />
                  <StatCard
                    label="Recommendations"
                    value={recommendations.length}
                    color="blue"
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    }
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href={`/analysis/${estatePlanId}/visualization`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    View Estate Distribution
                  </Link>
                  <Link
                    href={`/analysis/${estatePlanId}/reminders`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Reminders & Life Events
                  </Link>
                </div>
              </div>

              {/* Metadata bar */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2 text-sm print:hidden">
                <span className="text-gray-500 dark:text-gray-400">
                  Analysis from {new Date(latestAnalysis.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={handleRunAnalysis}
                  disabled={isRunning}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Re-run Analysis
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden print:shadow-none">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="underline"
                fullWidth
                className="print:hidden"
              >
                {/* Overview Tab */}
                <TabPanel tabId="overview">
                  <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Priority Actions Card */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Priority Actions
                        </h3>
                        {missingDocs.filter((d) => d.priority === "high").length > 0 ||
                        recommendations.filter((r) => r.priority === "high").length > 0 ? (
                          <ul className="space-y-2">
                            {missingDocs
                              .filter((d) => d.priority === "high")
                              .slice(0, 3)
                              .map((doc, idx) => (
                                <li key={`doc-${idx}`} className="flex items-start gap-2 text-sm">
                                  <Badge variant="error" size="sm">Missing</Badge>
                                  <span className="text-gray-700 dark:text-gray-300">
                                    {DOCUMENT_TYPE_NAMES[doc.document || doc.type || ""] || doc.document || doc.type || "Document"}
                                  </span>
                                </li>
                              ))}
                            {recommendations
                              .filter((r) => r.priority === "high" || r.priority === "critical")
                              .slice(0, 2)
                              .map((rec, idx) => (
                                <li key={`rec-${idx}`} className="flex items-start gap-2 text-sm">
                                  <Badge variant="warning" size="sm">Action</Badge>
                                  <span className="text-gray-700 dark:text-gray-300">{rec.action}</span>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No high-priority actions needed.
                          </p>
                        )}
                      </div>

                      {/* Documents Status Card */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Document Status
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Missing</span>
                            <span className="font-medium text-red-600">{missingDocs.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Outdated</span>
                            <span className="font-medium text-yellow-600">{outdatedDocs.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Inconsistencies</span>
                            <span className="font-medium text-orange-600">{inconsistencies.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link
                        href={`/documents/generate/${estatePlanId}`}
                        className="flex-1"
                      >
                        <Button variant="primary" fullWidth>
                          Generate Documents
                        </Button>
                      </Link>
                      <Link
                        href={`/documents/upload/${estatePlanId}`}
                        className="flex-1"
                      >
                        <Button variant="secondary" fullWidth>
                          Upload & Analyze
                        </Button>
                      </Link>
                      <Link href={`/intake?planId=${estatePlanId}`} className="flex-1">
                        <Button variant="outline" fullWidth>
                          Update Information
                        </Button>
                      </Link>
                    </div>
                  </div>
                </TabPanel>

                {/* Missing Documents Tab */}
                <TabPanel tabId="missing">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {missingDocs.map((doc, idx) => {
                        const docName = doc.document || doc.type || "Unknown Document";
                        const docType = doc.type || doc.document?.toLowerCase().replace(/\s+/g, "_") || "";
                        const priority = doc.priority || "medium";
                        const priorityVariant = priority === "critical" || priority === "high" ? "error" : priority === "medium" ? "warning" : "success";
                        return (
                          <div
                            key={idx}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {DOCUMENT_TYPE_NAMES[docType] || docName}
                              </h4>
                              <Badge variant={priorityVariant} size="sm">
                                {priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {doc.reason || "This document is recommended for your estate plan."}
                            </p>
                            {doc.consequences && (
                              <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                                <strong>Without it:</strong> {doc.consequences}
                              </p>
                            )}
                            {doc.estimatedCostToCreate && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                                Est. cost: ${doc.estimatedCostToCreate.low.toLocaleString()} - ${doc.estimatedCostToCreate.high.toLocaleString()}
                              </p>
                            )}
                            <Link
                              href={`/documents/generate/${estatePlanId}?type=${docType}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              Generate Document →
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabPanel>

                {/* Issues Tab */}
                <TabPanel tabId="issues">
                  <div className="p-6 space-y-6">
                    {/* Outdated Documents */}
                    {outdatedDocs.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Outdated Documents ({outdatedDocs.length})
                        </h3>
                        <div className="space-y-3">
                          {outdatedDocs.map((doc, idx) => {
                            const docName = doc.document || doc.type || "Document";
                            const description = [
                              doc.issue,
                              doc.risk && `Risk: ${doc.risk}`,
                              doc.recommendation
                            ].filter(Boolean).join(". ");
                            return (
                              <GapAnalysisCard
                                key={idx}
                                type="outdated"
                                title={DOCUMENT_TYPE_NAMES[docName] || docName}
                                description={description || "This document may need review."}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Inconsistencies */}
                    {inconsistencies.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Inconsistencies ({inconsistencies.length})
                        </h3>
                        <div className="space-y-3">
                          {inconsistencies.map((item, idx) => {
                            const title = item.issue || item.type || "Inconsistency Found";
                            const description = [
                              item.details || item.potentialConsequence,
                              (item.resolution || item.recommendation) && `Resolution: ${item.resolution || item.recommendation}`
                            ].filter(Boolean).join(". ");
                            // Map "critical" to "high" for component compatibility
                            const mappedPriority = item.severity === "critical" ? "high" : item.severity;
                            return (
                              <GapAnalysisCard
                                key={idx}
                                type="inconsistency"
                                title={title}
                                description={description || "Please review this inconsistency."}
                                priority={mappedPriority}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </TabPanel>

                {/* Recommendations Tab */}
                <TabPanel tabId="recommendations">
                  <div className="p-6">
                    <div className="space-y-4">
                      {recommendations.map((rec, idx) => {
                        const title = rec.action || "Recommendation";
                        const priority = rec.priority || "medium";
                        const description = rec.reason || rec.riskOfDelay || rec.estimatedBenefit || "";
                        return (
                          <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {rec.rank && (
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-bold">
                                    {rec.rank}
                                  </span>
                                )}
                                <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                {rec.timeline && (
                                  <Badge variant="default" size="sm">{rec.timeline}</Badge>
                                )}
                                <Badge
                                  variant={priority === "critical" || priority === "high" ? "error" : priority === "medium" ? "warning" : "success"}
                                  size="sm"
                                >
                                  {priority}
                                </Badge>
                              </div>
                            </div>
                            {description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
                            )}
                            {rec.detailedSteps && rec.detailedSteps.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Steps:</p>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                  {rec.detailedSteps.slice(0, 3).map((step, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-gray-400">•</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                  {rec.detailedSteps.length > 3 && (
                                    <li className="text-gray-400 text-xs">+ {rec.detailedSteps.length - 3} more steps...</li>
                                  )}
                                </ul>
                              </div>
                            )}
                            {rec.estimatedCost && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                Est. cost: ${rec.estimatedCost.low?.toLocaleString()} - ${rec.estimatedCost.high?.toLocaleString()}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabPanel>

                {/* State Notes Tab */}
                <TabPanel tabId="state">
                  <div className="p-6">
                    <div className="space-y-4">
                      {stateNotes.map((note, idx) => {
                        const title = note.topic || note.note || "State Consideration";
                        const description = [
                          note.rule,
                          note.impact,
                          note.action && `Action: ${note.action}`,
                          note.relevance
                        ].filter(Boolean).join(". ");
                        return (
                          <div
                            key={idx}
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
                            {description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
                            )}
                            {note.citation && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                                {note.citation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      {stateNotes.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                          No state-specific considerations found. This may be due to limited state information provided.
                        </p>
                      )}
                    </div>
                  </div>
                </TabPanel>
              </Tabs>

              {/* Print-only content */}
              <div className="hidden print:block p-6 space-y-8">
                <PrintSection title="Missing Documents" items={missingDocs} type="missing" />
                <PrintSection title="Outdated Documents" items={outdatedDocs} type="outdated" />
                <PrintSection title="Inconsistencies" items={inconsistencies} type="inconsistency" />
                <PrintSection title="Recommendations" items={recommendations} type="recommendation" />
                <PrintSection title="State-Specific Notes" items={stateNotes} type="note" />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not constitute legal advice.
                Please consult with a licensed attorney in your state to review your specific situation and any documents before signing.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Stat Card component
interface StatCardProps {
  label: string;
  value: number;
  color: "red" | "yellow" | "green" | "blue";
  icon: React.ReactNode;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  const colorClasses = {
    red: "text-red-600 bg-red-100 dark:bg-red-900/30",
    yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
    green: "text-green-600 bg-green-100 dark:bg-green-900/30",
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  };

  return (
    <div className="text-center">
      <div
        className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-2`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}

// Print section component
interface PrintSectionProps {
  title: string;
  items: Array<{
    type?: string;
    priority?: string;
    reason?: string;
    issue?: string;
    details?: string;
    recommendation?: string;
    action?: string;
    note?: string;
    relevance?: string;
  }>;
  type: "missing" | "outdated" | "inconsistency" | "recommendation" | "note";
}

function PrintSection({ title, items, type }: PrintSectionProps) {
  if (items.length === 0) return null;

  return (
    <div className="break-inside-avoid">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm">
            {type === "missing" && (() => {
              const doc = item as MissingDocument;
              const docName = doc.document || doc.type || "Document";
              return (
                <>
                  <strong>{DOCUMENT_TYPE_NAMES[docName] || docName}</strong>
                  {" - "}
                  {doc.reason || doc.consequences || "Recommended for your estate plan"}
                </>
              );
            })()}
            {type === "outdated" && (() => {
              const doc = item as OutdatedDocument;
              const docName = doc.document || doc.type || "Document";
              return (
                <>
                  <strong>{DOCUMENT_TYPE_NAMES[docName] || docName}</strong>
                  {" - "}
                  {doc.issue}. {doc.recommendation}
                </>
              );
            })()}
            {type === "inconsistency" && (() => {
              const inc = item as Inconsistency;
              return (
                <>
                  <strong>{inc.issue || inc.type || "Inconsistency"}</strong>
                  {" - "}
                  {inc.details || inc.potentialConsequence || ""}. {inc.recommendation || inc.resolution || ""}
                </>
              );
            })()}
            {type === "recommendation" && (() => {
              const rec = item as Recommendation;
              return (
                <>
                  <strong>{rec.action || "Recommendation"}</strong>
                  {" - "}
                  {rec.reason || rec.riskOfDelay || rec.estimatedBenefit || ""}
                </>
              );
            })()}
            {type === "note" && (() => {
              const note = item as StateNote;
              return (
                <>
                  <strong>{note.topic || note.note || "State Consideration"}</strong>
                  {" - "}
                  {note.rule || note.impact || note.relevance || ""}
                </>
              );
            })()}
          </li>
        ))}
      </ul>
    </div>
  );
}
