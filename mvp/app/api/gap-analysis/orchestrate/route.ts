import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuthOrSessionAndOwnership } from "@/lib/auth-helper";
import {
  parseIntakeData,
  getClientContext,
  executePhase1,
  executePhase2,
  executePhase3,
  getApplicableRuns,
  calculatePhaseProgress,
  aggregatePhase2Results,
  RunType,
  ParsedIntake,
  ClientContext,
  BeneficiaryDesignation,
} from "@/lib/gap-analysis";

// Extend Vercel function timeout (comprehensive analysis needs time)
export const maxDuration = 900; // 15 minutes

/**
 * Safely stringify data - handles cases where data is already a string
 * to prevent double-stringification issues
 */
function safeStringify(data: unknown): string {
  if (typeof data === "string") {
    // Check if it's already a valid JSON string
    try {
      JSON.parse(data);
      return data; // Already a valid JSON string
    } catch {
      // Not valid JSON, wrap it
      return JSON.stringify(data);
    }
  }
  return JSON.stringify(data ?? []);
}

interface OrchestrationRequest {
  estatePlanId: string;
  intakeData: {
    estatePlan: { stateOfResidence?: string };
    personal?: { data: string };
    family?: { data: string };
    assets?: { data: string };
    existingDocuments?: { data: string };
    goals?: { data: string };
    beneficiaryDesignations?: BeneficiaryDesignation[];
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { estatePlanId, intakeData }: OrchestrationRequest = body;

    if (!estatePlanId || !intakeData) {
      return NextResponse.json(
        { error: "estatePlanId and intakeData are required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, req);
    if (error) return error;

    // Check for existing active run
    const existingRun = await prisma.gapAnalysisRun.findFirst({
      where: {
        estatePlanId,
        status: "running",
      },
    });

    if (existingRun) {
      return NextResponse.json(
        { error: "An analysis is already running", runId: existingRun.id },
        { status: 409 }
      );
    }

    // Parse intake data and get client context
    const parsed = parseIntakeData(intakeData);
    const clientContext = getClientContext(parsed);

    // Determine applicable runs for each phase
    const phase1Runs = getApplicableRuns(1, clientContext, parsed);
    const phase2Runs = getApplicableRuns(2, clientContext, parsed);
    const phase3Runs = getApplicableRuns(3, clientContext, parsed);

    console.log("[ORCHESTRATE] Starting comprehensive analysis:", {
      estatePlanId,
      state: parsed.state,
      phase1Runs,
      phase2Runs,
      phase3Runs,
    });

    // Create a new gap analysis run with phases
    const run = await prisma.gapAnalysisRun.create({
      data: {
        estatePlanId,
        status: "running",
        analysisType: "comprehensive",
        currentPhase: 1,
        totalPhases: 3,
        progressPercent: 0,
        startedAt: new Date(),
        phases: {
          create: [
            {
              phaseNumber: 1,
              name: "research",
              status: "pending",
              totalRuns: phase1Runs.length,
            },
            {
              phaseNumber: 2,
              name: "analysis",
              status: "pending",
              totalRuns: phase2Runs.length,
            },
            {
              phaseNumber: 3,
              name: "synthesis",
              status: "pending",
              totalRuns: phase3Runs.length,
            },
          ],
        },
      },
      include: {
        phases: true,
      },
    });

    // Start background execution (fire-and-forget with proper error handling)
    executeComprehensiveAnalysis(
      run.id,
      estatePlanId,
      parsed,
      clientContext,
      phase1Runs,
      phase2Runs,
      phase3Runs,
      run.phases
    ).catch(async (error) => {
      console.error("[ORCHESTRATE] Background analysis failed:", error);
      await prisma.gapAnalysisRun.update({
        where: { id: run.id },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
          completedAt: new Date(),
        },
      }).catch(console.error);
    });

    return NextResponse.json({
      success: true,
      runId: run.id,
      message: "Comprehensive analysis started",
    });
  } catch (error) {
    console.error("[ORCHESTRATE] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

interface PhaseRecord {
  id: string;
  phaseNumber: number;
  name: string;
}

async function executeComprehensiveAnalysis(
  runId: string,
  estatePlanId: string,
  parsed: ParsedIntake,
  clientContext: ClientContext,
  phase1Runs: RunType[],
  phase2Runs: RunType[],
  phase3Runs: RunType[],
  phases: PhaseRecord[]
) {
  const startTime = Date.now();
  let totalDurationMs = 0;
  let totalCostUsd = 0;

  const phase1 = phases.find((p) => p.phaseNumber === 1)!;
  const phase2 = phases.find((p) => p.phaseNumber === 2)!;
  const phase3 = phases.find((p) => p.phaseNumber === 3)!;

  try {
    // =====================================
    // PHASE 1: Research & Context (Sequential)
    // =====================================
    console.log("[ORCHESTRATE] Starting Phase 1:", phase1Runs);

    await updatePhaseStatus(phase1.id, "running");
    await updateRunProgress(runId, 5, 1);

    let completedPhase1Runs = 0;
    const phase1Result = await executePhase1(
      parsed,
      clientContext,
      async (runType: RunType, status: "running" | "completed" | "failed") => {
        if (status === "completed" || status === "failed") {
          completedPhase1Runs++;
          await createRunResult(phase1.id, runType, status, null);
          const progress = calculatePhaseProgress(1, completedPhase1Runs, phase1Runs.length);
          await updateRunProgress(runId, progress, 1);
          await updatePhaseProgress(phase1.id, completedPhase1Runs);
        }
      }
    );

    totalDurationMs += phase1Result.metadata.totalDurationMs;
    totalCostUsd += phase1Result.metadata.totalCostUsd;

    await updatePhaseStatus(phase1.id, "completed");
    await updateRunProgress(runId, 30, 2);

    console.log("[ORCHESTRATE] Phase 1 complete:", {
      runs: phase1Runs.length,
      durationMs: phase1Result.metadata.totalDurationMs,
    });

    // =====================================
    // PHASE 2: Deep Analysis (Parallel)
    // =====================================
    console.log("[ORCHESTRATE] Starting Phase 2:", phase2Runs);

    await updatePhaseStatus(phase2.id, "running");

    let completedPhase2Runs = 0;
    const phase2Result = await executePhase2(
      parsed,
      clientContext,
      phase1Result.results,
      async (runType: RunType, status: "running" | "completed" | "failed") => {
        if (status === "completed" || status === "failed") {
          completedPhase2Runs++;
          await createRunResult(phase2.id, runType, status, null);
          const progress = calculatePhaseProgress(2, completedPhase2Runs, phase2Runs.length);
          await updateRunProgress(runId, progress, 2);
          await updatePhaseProgress(phase2.id, completedPhase2Runs);
        }
      }
    );

    totalDurationMs += phase2Result.metadata.totalDurationMs;
    totalCostUsd += phase2Result.metadata.totalCostUsd;

    await updatePhaseStatus(phase2.id, "completed");
    await updateRunProgress(runId, 70, 3);

    console.log("[ORCHESTRATE] Phase 2 complete:", {
      runs: phase2Runs.length,
      durationMs: phase2Result.metadata.totalDurationMs,
    });

    // =====================================
    // PHASE 3: Synthesis (Sequential)
    // =====================================
    console.log("[ORCHESTRATE] Starting Phase 3:", phase3Runs);

    await updatePhaseStatus(phase3.id, "running");

    let completedPhase3Runs = 0;
    const phase3Result = await executePhase3(
      parsed,
      clientContext,
      phase1Result.results,
      phase2Result.results,
      async (runType: RunType, status: "running" | "completed" | "failed") => {
        if (status === "completed" || status === "failed") {
          completedPhase3Runs++;
          await createRunResult(phase3.id, runType, status, null);
          const progress = calculatePhaseProgress(3, completedPhase3Runs, phase3Runs.length);
          await updateRunProgress(runId, progress, 3);
          await updatePhaseProgress(phase3.id, completedPhase3Runs);
        }
      }
    );

    totalDurationMs += phase3Result.metadata.totalDurationMs;
    totalCostUsd += phase3Result.metadata.totalCostUsd;

    await updatePhaseStatus(phase3.id, "completed");

    console.log("[ORCHESTRATE] Phase 3 complete:", {
      runs: phase3Runs.length,
      durationMs: phase3Result.metadata.totalDurationMs,
    });

    // =====================================
    // SAVE FINAL ANALYSIS
    // =====================================
    const finalReport = phase3Result.results.get("final_report") as Record<string, unknown> || {};
    const aggregatedPhase2 = aggregatePhase2Results(phase2Result.results);

    // Save to GapAnalysis table
    await prisma.gapAnalysis.create({
      data: {
        estatePlanId,
        analysisType: "comprehensive",
        score: (finalReport.score as number) || (finalReport.overallScore as { score: number })?.score || 0,
        scoreBreakdown: finalReport.scoreBreakdown
          ? safeStringify(finalReport.scoreBreakdown)
          : null,
        missingDocuments: safeStringify(
          finalReport.missingDocuments || aggregatedPhase2.allMissingDocuments || []
        ),
        outdatedDocuments: safeStringify(finalReport.outdatedDocuments || []),
        inconsistencies: safeStringify(
          finalReport.inconsistencies || aggregatedPhase2.conflicts || []
        ),
        taxOptimization: safeStringify(
          finalReport.taxStrategies || aggregatedPhase2.taxStrategies || []
        ),
        medicaidPlanning: safeStringify(finalReport.medicaidPlanning || {}),
        recommendations: safeStringify(
          finalReport.recommendations || aggregatedPhase2.allRecommendations || []
        ),
        stateSpecificNotes: safeStringify(finalReport.stateSpecificNotes || []),
        scenarioAnalysis: safeStringify(
          phase3Result.results.get("scenario_modeling") || finalReport.scenarioAnalysis || []
        ),
        priorityMatrix: safeStringify(
          phase3Result.results.get("priority_matrix") || finalReport.priorityMatrix || []
        ),
        stateResearch: safeStringify(phase1Result.results.stateResearch || {}),
        documentInventory: safeStringify(phase1Result.results.documentInventory || {}),
        rawAnalysis: safeStringify({
          phase1: phase1Result.results,
          phase2: Object.fromEntries(phase2Result.results),
          phase3: Object.fromEntries(phase3Result.results),
          metadata: { totalDurationMs, totalCostUsd },
        }),
      },
    });

    // Mark run as completed
    await prisma.gapAnalysisRun.update({
      where: { id: runId },
      data: {
        status: "completed",
        progressPercent: 100,
        completedAt: new Date(),
      },
    });

    // Update estate plan status
    await prisma.estatePlan.update({
      where: { id: estatePlanId },
      data: { status: "analysis_complete" },
    });

    const totalTime = Date.now() - startTime;
    console.log("[ORCHESTRATE] Comprehensive analysis COMPLETE:", {
      runId,
      estatePlanId,
      totalTimeMs: totalTime,
      totalDurationMs,
      totalCostUsd,
      score: finalReport.score || (finalReport.overallScore as { score: number })?.score,
    });

  } catch (error) {
    console.error("[ORCHESTRATE] Analysis execution error:", error);
    throw error;
  }
}

async function updateRunProgress(
  runId: string,
  progressPercent: number,
  currentPhase: number
) {
  await prisma.gapAnalysisRun.update({
    where: { id: runId },
    data: {
      progressPercent,
      currentPhase,
    },
  });
}

async function updatePhaseStatus(phaseId: string, status: string) {
  const data: { status: string; startedAt?: Date; completedAt?: Date } = { status };
  if (status === "running") {
    data.startedAt = new Date();
  } else if (status === "completed") {
    data.completedAt = new Date();
  }
  await prisma.gapAnalysisPhase.update({
    where: { id: phaseId },
    data,
  });
}

async function updatePhaseProgress(phaseId: string, completedRuns: number) {
  await prisma.gapAnalysisPhase.update({
    where: { id: phaseId },
    data: {
      completedRuns,
    },
  });
}

async function createRunResult(
  phaseId: string,
  runType: string,
  status: string,
  result: unknown
) {
  await prisma.gapAnalysisRunResult.create({
    data: {
      phaseId,
      runType,
      status: status === "completed" ? "completed" : "failed",
      result: result as object || {},
      completedAt: new Date(),
    },
  });
}
