"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useEstatePlan,
  useEstatePlanFull,
  useIntakeProgress,
  useLatestGapAnalysis,
  saveGapAnalysis,
} from "../../hooks/usePrismaQueries";
import { Tabs, TabPanel } from "../../components/ui/Tabs";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import GapAnalysisCard, { ScoreRing, DOCUMENT_TYPE_NAMES } from "../../components/GapAnalysisCard";
import { GapAnalysisProgress } from "@/components/GapAnalysisProgress";

interface MissingDocument {
  // New API fields
  document?: string;
  priority?: "critical" | "high" | "medium" | "low";
  urgency?: string;
  reason?: string;
  consequences?: string | string[];
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
  estimatedBenefit?: string | { low: number; high: number };
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
      color: "text-[var(--success)]",
    };
  }
  if (score >= 60) {
    return {
      label: "Good",
      description: "Your estate plan is solid but has some room for improvement.",
      color: "text-[var(--warning)]",
    };
  }
  if (score >= 40) {
    return {
      label: "Needs Work",
      description: "Several important areas need attention in your estate plan.",
      color: "text-[var(--warning)]",
    };
  }
  return {
    label: "Critical",
    description: "Your estate plan has significant gaps that should be addressed soon.",
    color: "text-[var(--error)]",
  };
}

// Score breakdown interface
interface ScoreBreakdown {
  startingScore: number;
  deductions: Array<{
    reason: string;
    points: number;
    category: string;
  }>;
  finalScore: number;
  summary: string;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const estatePlanId = params.estatePlanId as string;

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [analysisMode, setAnalysisMode] = useState<"quick" | "comprehensive">("quick");
  const [progressStep, setProgressStep] = useState<string>("");
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [comprehensiveRunId, setComprehensiveRunId] = useState<string | null>(null);

  // Fetch estate plan and analysis
  const { data: estatePlan, isLoading: estatePlanLoading } = useEstatePlan(estatePlanId);
  const { data: latestAnalysis } = useLatestGapAnalysis(estatePlanId);
  const { data: intakeProgress } = useIntakeProgress(estatePlanId);

  // Get full intake data for analysis
  const { data: intakeData } = useEstatePlanFull(estatePlanId);


  const handleRunAnalysis = useCallback(async (mode: "quick" | "comprehensive" = "quick") => {
    setIsRunning(true);
    setError(null);
    setProgressLog([]);
    setProgressStep(mode === "quick" ? "Initializing analysis..." : "Starting comprehensive analysis...");

    // Simulate progress updates for better UX
    const progressSteps = mode === "quick"
      ? [
          "Connecting to AI assistant...",
          "Analyzing your documents...",
          "Reviewing state requirements...",
          "Identifying gaps...",
          "Generating recommendations...",
        ]
      : [
          "Phase 1: Researching state laws...",
          "Phase 1: Analyzing client context...",
          "Phase 1: Creating document inventory...",
          "Phase 2: Deep analysis in progress...",
          "Phase 3: Synthesizing findings...",
          "Generating final report...",
        ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setProgressStep(progressSteps[stepIndex]);
        setProgressLog(prev => [...prev, progressSteps[stepIndex]]);
        stepIndex++;
      }
    }, mode === "quick" ? 8000 : 30000);

    try {
      // Build intake data object for the API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawIntakeData = intakeData as any;
      const intakeArray = rawIntakeData?.intakeData || rawIntakeData?.intake || [];

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

      // Call different endpoints based on mode
      // Comprehensive mode calls orchestrate directly to avoid nested fetch timeout
      const endpoint = mode === "comprehensive"
        ? "/api/gap-analysis/orchestrate"
        : "/api/gap-analysis";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intakeData: apiIntakeData, mode, estatePlanId }),
      });

      const result = await response.json();

      // For comprehensive mode, the orchestration is async - we get a runId back
      if (mode === "comprehensive") {
        if (result.runId) {
          // Orchestration started - redirect to preparation tasks page
          setComprehensiveRunId(result.runId as string);
          clearInterval(progressInterval);
          // Redirect to preparation tasks page where user can work while analysis runs
          router.push(`/analysis/${estatePlanId}/prepare?runId=${result.runId}`);
          setIsRunning(false);
          return;
        } else if (!result.success) {
          clearInterval(progressInterval);
          setError(result.error || "Failed to start comprehensive analysis");
          setIsRunning(false);
          return;
        }
      }

      if (!result.success) {
        setError(result.error || "Analysis failed");
        return;
      }

      // Clear progress interval
      clearInterval(progressInterval);
      setProgressStep("Analysis complete!");

      // Validate we got meaningful data
      const missingDocs = result.analysisResult?.missingDocuments || [];
      const recommendations = result.analysisResult?.recommendations || result.analysisResult?.prioritizedRecommendations || [];
      const stateNotes = result.analysisResult?.stateSpecificNotes || result.analysisResult?.stateSpecificConsiderations || [];

      // Save results to Prisma via API
      await saveGapAnalysis(estatePlanId, {
        score: result.analysisResult.score || 50,
        scoreBreakdown: result.analysisResult.scoreBreakdown
          ? JSON.stringify(result.analysisResult.scoreBreakdown)
          : undefined,
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
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      clearInterval(progressInterval);
      setIsRunning(false);
      setProgressStep("");
    }
  }, [estatePlanId, estatePlan, intakeData]);

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

  // Parse score breakdown
  const scoreBreakdown: ScoreBreakdown | null = useMemo(() => {
    if (!latestAnalysis?.scoreBreakdown) return null;
    try {
      return JSON.parse(latestAnalysis.scoreBreakdown) as ScoreBreakdown;
    } catch {
      return null;
    }
  }, [latestAnalysis?.scoreBreakdown]);

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

  if (estatePlanLoading || !estatePlan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-purple)] mx-auto"></div>
          <p className="mt-4 text-[var(--text-body)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-[var(--text-heading)] hover:text-[var(--accent-purple)] transition-colors"
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
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-body)]"
            >
              Back to Intake
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Intake Incomplete Warning */}
        {!intakeComplete && (
          <div className="mb-6 bg-[var(--warning-muted)] border border-[var(--warning)] rounded-lg p-4 print:hidden">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-medium text-[var(--warning)]">Intake Incomplete</h3>
                <p className="text-sm text-[var(--warning)] mt-1">
                  Complete all intake sections for the most accurate analysis.
                  You&apos;ve completed {intakeProgress?.completedCount || 0} of {intakeProgress?.totalCount || 5} sections.
                </p>
                <Link
                  href={`/intake?planId=${estatePlanId}`}
                  className="inline-block mt-2 text-sm font-medium text-[var(--warning)] hover:underline"
                >
                  Complete Intake →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Run Analysis State */}
        {!latestAnalysis && !isRunning && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--accent-muted)] to-[var(--accent-purple)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-heading)] mb-3">
              Ready to Analyze Your Estate Plan
            </h2>
            <p className="text-[var(--text-body)] mb-6 max-w-lg mx-auto">
              Our AI will review your intake data and identify gaps, outdated documents, and provide personalized recommendations based on your state&apos;s laws.
            </p>

            {/* Mode Selection */}
            <div className="mb-6">
              <p className="text-sm text-[var(--text-muted)] mb-3">Choose analysis depth:</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setAnalysisMode("quick")}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    analysisMode === "quick"
                      ? "border-[var(--accent-purple)] bg-[var(--accent-muted)] text-[var(--accent-purple)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">Quick Analysis</div>
                  <div className="text-xs text-[var(--text-muted)]">~1-2 min</div>
                </button>
                <button
                  onClick={() => setAnalysisMode("comprehensive")}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    analysisMode === "comprehensive"
                      ? "border-[var(--accent-purple)] bg-[var(--accent-muted)] text-[var(--accent-purple)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium">Comprehensive</div>
                  <div className="text-xs text-[var(--text-muted)]">~15-20 min (detailed)</div>
                </button>
              </div>
            </div>

            <Button onClick={() => handleRunAnalysis(analysisMode)} size="lg">
              Run {analysisMode === "quick" ? "Quick" : "Comprehensive"} Analysis
            </Button>
          </div>
        )}

        {/* Running State */}
        {isRunning && !comprehensiveRunId && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-muted)]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-purple)] border-t-transparent animate-spin"></div>
              </div>
              <h2 className="text-xl font-bold text-[var(--text-heading)] mb-2">
                Analyzing Your Estate Plan...
              </h2>
              <p className="text-[var(--accent-purple)] font-medium">
                {progressStep}
              </p>
            </div>

            {/* Progress Log - Terminal-like output */}
            <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm">
              <div className="text-gray-400 mb-2">$ claude-code --analyze estate-plan</div>
              {progressLog.map((log, idx) => (
                <div key={idx} className="text-green-400 flex items-center gap-2">
                  <span className="text-gray-500">[{String(idx + 1).padStart(2, "0")}]</span>
                  <span>✓ {log}</span>
                </div>
              ))}
              {progressStep && (
                <div className="text-yellow-400 flex items-center gap-2 animate-pulse">
                  <span className="text-gray-500">[{String(progressLog.length + 1).padStart(2, "0")}]</span>
                  <span>▶ {progressStep}</span>
                </div>
              )}
            </div>

            <p className="text-center text-[var(--text-muted)] text-sm mt-4">
              {analysisMode === "comprehensive"
                ? "Setting up your analysis... You'll be redirected to preparation tasks shortly."
                : "Quick analysis typically completes in 1-2 minutes."}
            </p>
          </div>
        )}

        {/* Comprehensive Analysis Progress */}
        {comprehensiveRunId && estatePlanId && (
          <div className="mb-8">
            <GapAnalysisProgress
              estatePlanId={estatePlanId}
              runId={comprehensiveRunId}
              onComplete={() => {
                setComprehensiveRunId(null);
                setIsRunning(false);
              }}
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-[var(--error-muted)] border border-[var(--error)] rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-[var(--error)]">Analysis Failed</h3>
                <p className="text-sm text-[var(--error)] mt-1">{error}</p>
                <button
                  onClick={() => handleRunAnalysis(analysisMode)}
                  className="mt-2 text-sm font-medium text-[var(--error)] hover:underline"
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Score Hero */}
              <div className="bg-gradient-to-br from-[var(--off-white)] to-[var(--light-gray)]/50 px-6 py-10 text-center">
                <h1 className="text-lg font-medium text-[var(--text-body)] mb-6">
                  {estatePlan.name || "Your Estate Plan"} Analysis
                </h1>

                {/* Large Score Ring */}
                <div className="mb-6">
                  <ScoreRing score={latestAnalysis.score || 0} size="lg" />
                </div>

                {/* Score Interpretation */}
                {scoreInfo && (
                  <div className="mb-6">
                    <h2 className={`text-3xl font-bold ${scoreInfo.color} mb-2`}>
                      {scoreInfo.label}
                    </h2>
                    <p className="text-[var(--text-body)] max-w-md mx-auto">
                      {scoreInfo.description}
                    </p>
                  </div>
                )}

                {/* Score Breakdown */}
                {scoreBreakdown && scoreBreakdown.deductions && scoreBreakdown.deductions.length > 0 && (
                  <div className="mb-8 max-w-lg mx-auto">
                    <button
                      onClick={() => {
                        const el = document.getElementById("score-breakdown");
                        el?.classList.toggle("hidden");
                      }}
                      className="text-sm text-[var(--accent-purple)] hover:underline flex items-center gap-1 mx-auto mb-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Why this score?
                    </button>
                    <div id="score-breakdown" className="hidden bg-white/80 rounded-lg p-4 text-left border border-[var(--border)]">
                      <p className="text-sm text-[var(--text-muted)] mb-3">
                        Starting from 100 points, the following deductions were made:
                      </p>
                      <div className="space-y-2">
                        {scoreBreakdown.deductions.map((d, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-[var(--text-body)]">{d.reason}</span>
                            <span className="text-red-600 font-medium">-{d.points}</span>
                          </div>
                        ))}
                        <div className="border-t border-[var(--border)] pt-2 mt-2 flex justify-between items-center font-medium">
                          <span>Final Score</span>
                          <span className={scoreInfo?.color || ""}>{scoreBreakdown.finalScore}</span>
                        </div>
                      </div>
                      {scoreBreakdown.summary && (
                        <p className="text-xs text-[var(--text-muted)] mt-3 italic">
                          {scoreBreakdown.summary}
                        </p>
                      )}
                    </div>
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF7759] hover:bg-[#E85A3C] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    View Estate Distribution
                  </Link>
                  <Link
                    href={`/analysis/${estatePlanId}/reminders`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D1D1B] hover:bg-[#2D2D2B] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Reminders & Life Events
                  </Link>
                </div>
              </div>

              {/* Metadata bar */}
              <div className="px-6 py-3 bg-white/50 border-t border-[var(--border)] flex flex-wrap justify-between items-center gap-2 text-sm print:hidden">
                <span className="text-[var(--text-muted)]">
                  Analysis from {new Date(latestAnalysis.createdAt).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunAnalysis("quick")}
                    disabled={isRunning}
                    className="text-[var(--accent-purple)] hover:opacity-80 font-medium inline-flex items-center gap-1 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Quick Re-run
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => handleRunAnalysis("comprehensive")}
                    disabled={isRunning}
                    className="text-[var(--text-muted)] hover:text-[var(--accent-purple)] font-medium text-sm"
                  >
                    Comprehensive
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none">
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
                      <div className="bg-white/50 rounded-lg p-4">
                        <h3 className="font-semibold text-[var(--text-heading)] mb-3 flex items-center gap-2">
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
                                  <span className="text-[var(--text-body)]">
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
                                  <span className="text-[var(--text-body)]">{rec.action}</span>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-[var(--text-muted)]">
                            No high-priority actions needed.
                          </p>
                        )}
                      </div>

                      {/* Documents Status Card */}
                      <div className="bg-white/50 rounded-lg p-4">
                        <h3 className="font-semibold text-[var(--text-heading)] mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Document Status
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-body)]">Missing</span>
                            <span className="font-medium text-red-600">{missingDocs.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-body)]">Outdated</span>
                            <span className="font-medium text-yellow-600">{outdatedDocs.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-body)]">Inconsistencies</span>
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
                            className="bg-[var(--error-muted)] border border-[var(--error)] rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-[var(--text-heading)]">
                                {DOCUMENT_TYPE_NAMES[docType] || docName}
                              </h4>
                              <Badge variant={priorityVariant} size="sm">
                                {priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-[var(--text-body)] mb-2">
                              {doc.reason || "This document is recommended for your estate plan."}
                            </p>
                            {doc.consequences && (
                              <p className="text-sm text-[var(--error)] mb-2">
                                <strong>Without it:</strong> {Array.isArray(doc.consequences) ? doc.consequences.join(". ") : doc.consequences}
                              </p>
                            )}
                            {doc.estimatedCostToCreate && (
                              <p className="text-xs text-[var(--text-muted)] mb-4">
                                Est. cost: ${doc.estimatedCostToCreate.low.toLocaleString()} - ${doc.estimatedCostToCreate.high.toLocaleString()}
                              </p>
                            )}
                            <Link
                              href={`/documents/generate/${estatePlanId}?type=${docType}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-purple)] hover:opacity-80"
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
                        <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
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
                        <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-4 flex items-center gap-2">
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
                        // Handle estimatedBenefit which might be an object {low, high}
                        const benefitValue = rec.estimatedBenefit;
                        const benefitText = typeof benefitValue === 'object' && benefitValue !== null && 'low' in benefitValue && 'high' in benefitValue
                          ? `Estimated benefit: $${(benefitValue as {low: number; high: number}).low.toLocaleString()} - $${(benefitValue as {low: number; high: number}).high.toLocaleString()}`
                          : benefitValue;
                        const description = rec.reason || rec.riskOfDelay || benefitText || "";
                        return (
                          <div
                            key={idx}
                            className="bg-white border border-[var(--border)] rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {rec.rank && (
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-muted)] text-[var(--accent-purple)] text-xs font-bold">
                                    {rec.rank}
                                  </span>
                                )}
                                <h4 className="font-semibold text-[var(--text-heading)]">{title}</h4>
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
                              <p className="text-sm text-[var(--text-body)] mb-3">{description}</p>
                            )}
                            {rec.detailedSteps && rec.detailedSteps.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                                <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Steps:</p>
                                <ul className="text-sm text-[var(--text-body)] space-y-1">
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
                              <p className="text-xs text-[var(--text-muted)] mt-2">
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
                            className="bg-[var(--info-muted)] border border-[var(--info)] rounded-lg p-4"
                          >
                            <h4 className="font-semibold text-[var(--text-heading)] mb-2">{title}</h4>
                            {description && (
                              <p className="text-sm text-[var(--text-body)] mb-2">{description}</p>
                            )}
                            {note.citation && (
                              <p className="text-xs text-[var(--accent-purple)] font-mono">
                                {note.citation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      {stateNotes.length === 0 && (
                        <p className="text-[var(--text-muted)] text-center py-8">
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
            <div className="bg-[var(--warning-muted)] border border-[var(--warning)] rounded-lg p-4">
              <p className="text-sm text-[var(--warning)]">
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
    red: "text-[var(--error)] bg-[var(--error-muted)]",
    yellow: "text-[var(--warning)] bg-[var(--warning-muted)]",
    green: "text-[var(--success)] bg-[var(--success-muted)]",
    blue: "text-[var(--accent-purple)] bg-[var(--accent-muted)]",
  };

  return (
    <div className="text-center">
      <div
        className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-2`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-[var(--text-heading)]">{value}</div>
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
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
                  {doc.reason || (Array.isArray(doc.consequences) ? doc.consequences.join(". ") : doc.consequences) || "Recommended for your estate plan"}
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
              // Handle estimatedBenefit which might be an object {low, high} instead of string
              const benefit = rec.estimatedBenefit;
              const benefitText = typeof benefit === 'object' && benefit !== null && 'low' in benefit && 'high' in benefit
                ? `$${(benefit as {low: number; high: number}).low.toLocaleString()} - $${(benefit as {low: number; high: number}).high.toLocaleString()}`
                : benefit;
              return (
                <>
                  <strong>{rec.action || "Recommendation"}</strong>
                  {" - "}
                  {rec.reason || rec.riskOfDelay || benefitText || ""}
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
