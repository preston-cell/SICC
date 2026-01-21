import { NextResponse, after } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  parseIntakeData,
  getClientContext,
  executePhase1,
  executePhase2,
  executePhase3,
  getApplicableRuns,
  calculatePhaseProgress,
  PHASE_CONFIGS,
  aggregatePhase2Results,
} from "@/lib/gap-analysis";
import { BeneficiaryDesignation, RunType, ParsedIntake, ClientContext } from "@/lib/gap-analysis/types";

// Extend Vercel function timeout (comprehensive analysis needs time)
// Quality is the priority - using maximum allowed duration
export const maxDuration = 900; // 15 minutes - Vercel Pro/Enterprise allows longer

// Background execution function - runs after response is sent
async function executeAnalysisInBackground(
  runId: Id<"gapAnalysisRuns">,
  estatePlanId: string,
  parsed: ParsedIntake,
  clientContext: ClientContext,
  phase1Runs: RunType[],
  phase2Runs: RunType[],
  phase3Runs: RunType[],
  phase1Id: Id<"gapAnalysisPhases">,
  phase2Id: Id<"gapAnalysisPhases">,
  phase3Id: Id<"gapAnalysisPhases">,
  convex: ConvexHttpClient
) {
  const startTime = Date.now();
  console.log("[GAP-ANALYSIS] Starting comprehensive analysis:", {
    runId,
    estatePlanId,
    phase1Runs,
    phase2Runs,
    phase3Runs,
    clientContext: {
      state: parsed.state,
      estimatedValue: clientContext.estimatedValue,
      hasWill: clientContext.hasWill,
      hasTrust: clientContext.hasTrust,
    },
  });

  try {
    // Track metadata
    let totalDurationMs = 0;
    let totalCostUsd = 0;

    // =====================================
    // PHASE 1: Research & Context (Sequential)
    // =====================================
    await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
      runId,
      status: "phase1_running",
      currentPhase: 1,
      overallProgress: 0,
    });

    await convex.mutation(api.gapAnalysisOrchestration.updatePhaseStatus, {
      phaseId: phase1Id,
      status: "running",
    });

    const phase1Result = await executePhase1(
      parsed,
      clientContext,
      async (runType: RunType, status: "running" | "completed" | "failed") => {
        const completedRuns = await convex.query(api.gapAnalysisOrchestration.getCompletedRunCount, {
          phaseId: phase1Id,
        });

        const progress = calculatePhaseProgress(1, completedRuns, phase1Runs.length);

        await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
          runId,
          overallProgress: progress,
        });
      }
    );

    totalDurationMs += phase1Result.metadata.totalDurationMs;
    totalCostUsd += phase1Result.metadata.totalCostUsd;

    // Save Phase 1 results
    await convex.mutation(api.gapAnalysisOrchestration.updatePhaseStatus, {
      phaseId: phase1Id,
      status: "completed",
      completedRuns: phase1Runs.length,
      aggregatedResults: JSON.stringify(phase1Result.results),
    });

    await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
      runId,
      status: "phase1_complete",
      overallProgress: 30,
    });

    // =====================================
    // PHASE 2: Deep Analysis (Parallel)
    // =====================================
    await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
      runId,
      status: "phase2_running",
      currentPhase: 2,
    });

    await convex.mutation(api.gapAnalysisOrchestration.updatePhaseStatus, {
      phaseId: phase2Id,
      status: "running",
    });

    const phase2Result = await executePhase2(
      parsed,
      clientContext,
      phase1Result.results,
      async (runType: RunType, status: "running" | "completed" | "failed") => {
        const completedRuns = await convex.query(api.gapAnalysisOrchestration.getCompletedRunCount, {
          phaseId: phase2Id,
        });

        const progress = calculatePhaseProgress(2, completedRuns, phase2Runs.length);

        await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
          runId,
          overallProgress: progress,
        });
      }
    );

    totalDurationMs += phase2Result.metadata.totalDurationMs;
    totalCostUsd += phase2Result.metadata.totalCostUsd;

    // Aggregate Phase 2 results
    const aggregatedPhase2 = aggregatePhase2Results(phase2Result.results);

    // Save Phase 2 results
    await convex.mutation(api.gapAnalysisOrchestration.updatePhaseStatus, {
      phaseId: phase2Id,
      status: "completed",
      completedRuns: phase2Runs.length,
      aggregatedResults: JSON.stringify({
        individual: Object.fromEntries(phase2Result.results),
        aggregated: aggregatedPhase2,
      }),
    });

    await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
      runId,
      status: "phase2_complete",
      overallProgress: 70,
    });

    // =====================================
    // PHASE 3: Synthesis (Sequential)
    // =====================================
    await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
      runId,
      status: "phase3_running",
      currentPhase: 3,
    });

    await convex.mutation(api.gapAnalysisOrchestration.updatePhaseStatus, {
      phaseId: phase3Id,
      status: "running",
    });

    const phase3Result = await executePhase3(
      parsed,
      clientContext,
      phase1Result.results,
      phase2Result.results,
      async (runType: RunType, status: "running" | "completed" | "failed") => {
        const completedRuns = await convex.query(api.gapAnalysisOrchestration.getCompletedRunCount, {
          phaseId: phase3Id,
        });

        const progress = calculatePhaseProgress(3, completedRuns, phase3Runs.length);

        await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
          runId,
          overallProgress: progress,
        });
      }
    );

    totalDurationMs += phase3Result.metadata.totalDurationMs;
    totalCostUsd += phase3Result.metadata.totalCostUsd;

    // Save Phase 3 results
    await convex.mutation(api.gapAnalysisOrchestration.updatePhaseStatus, {
      phaseId: phase3Id,
      status: "completed",
      completedRuns: phase3Runs.length,
      aggregatedResults: JSON.stringify(Object.fromEntries(phase3Result.results)),
    });

    // =====================================
    // SAVE FINAL ANALYSIS
    // =====================================
    const finalReport = phase3Result.results.get("final_report") as Record<string, unknown>;

    // Save to gapAnalysis table (existing schema)
    const analysisId = await convex.mutation(api.gapAnalysisOrchestration.saveFinalAnalysis, {
      estatePlanId: estatePlanId as Id<"estatePlans">,
      runId,
      score: (finalReport?.score as number) || 0,
      analysisType: "comprehensive",
      missingDocuments: JSON.stringify(finalReport?.missingDocuments || []),
      outdatedDocuments: JSON.stringify(finalReport?.outdatedDocuments || []),
      inconsistencies: JSON.stringify(finalReport?.inconsistencies || []),
      taxOptimization: JSON.stringify(finalReport?.taxStrategies || []),
      medicaidPlanning: JSON.stringify(finalReport?.medicaidPlanning || {}),
      recommendations: JSON.stringify(finalReport?.recommendations || []),
      stateSpecificNotes: JSON.stringify(finalReport?.stateSpecificNotes || []),
      scenarioAnalysis: JSON.stringify(finalReport?.scenarioAnalysis || []),
      priorityMatrix: JSON.stringify(finalReport?.priorityMatrix || []),
      stateResearch: JSON.stringify(phase1Result.results.stateResearch || {}),
      documentInventory: JSON.stringify(phase1Result.results.documentInventory || {}),
      rawAnalysis: JSON.stringify(finalReport),
      totalDurationMs,
      totalCostUsd,
    });

    // Update run as completed
    await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
      runId,
      status: "completed",
      overallProgress: 100,
      finalAnalysisId: analysisId,
    });

    console.log("Background analysis completed successfully", { runId, analysisId });
  } catch (error) {
    console.error("Background analysis error:", error);

    // Mark run as failed
    await convex.mutation(api.gapAnalysisOrchestration.updateRunStatus, {
      runId,
      status: "failed",
      lastError: error instanceof Error ? error.message : "Unknown error",
    });
  }
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

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { estatePlanId, intakeData }: OrchestrationRequest = await req.json();

    if (!estatePlanId || !intakeData) {
      return NextResponse.json(
        { error: "Missing estatePlanId or intakeData" },
        { status: 400 }
      );
    }

    // Parse intake data
    const parsed = parseIntakeData(intakeData);
    const clientContext = getClientContext(parsed);

    // Determine applicable runs for each phase
    const phase1Runs = getApplicableRuns(1, clientContext, parsed);
    const phase2Runs = getApplicableRuns(2, clientContext, parsed);
    const phase3Runs = getApplicableRuns(3, clientContext, parsed);

    // Create orchestration run record
    const runId = await convex.mutation(api.gapAnalysisOrchestration.createRun, {
      estatePlanId: estatePlanId as Id<"estatePlans">,
      config: JSON.stringify({
        phase1Runs,
        phase2Runs,
        phase3Runs,
      }),
    });

    // Create phase records
    const phase1Id = await convex.mutation(api.gapAnalysisOrchestration.createPhase, {
      runId,
      phaseNumber: 1,
      phaseType: "research",
      totalRuns: phase1Runs.length,
    });

    const phase2Id = await convex.mutation(api.gapAnalysisOrchestration.createPhase, {
      runId,
      phaseNumber: 2,
      phaseType: "analysis",
      totalRuns: phase2Runs.length,
    });

    const phase3Id = await convex.mutation(api.gapAnalysisOrchestration.createPhase, {
      runId,
      phaseNumber: 3,
      phaseType: "synthesis",
      totalRuns: phase3Runs.length,
    });

    // Use Next.js `after` to ensure background work continues after response is sent
    // This is the proper way to handle background tasks in serverless environments
    after(async () => {
      await executeAnalysisInBackground(
        runId,
        estatePlanId,
        parsed,
        clientContext,
        phase1Runs,
        phase2Runs,
        phase3Runs,
        phase1Id,
        phase2Id,
        phase3Id,
        convex
      ).catch((error) => {
        console.error("Background analysis failed:", error);
      });
    });

    // Return immediately with the runId so UI can redirect to preparation tasks
    return NextResponse.json({
      success: true,
      runId,
      message: "Analysis started in background. Check progress via the runId.",
    });
  } catch (error) {
    console.error("Orchestration error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
