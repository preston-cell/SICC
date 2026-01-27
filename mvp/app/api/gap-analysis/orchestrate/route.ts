import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuthOrSessionAndOwnership } from "@/lib/auth-helper";

// Extend Vercel function timeout
export const maxDuration = 600;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { estatePlanId, intakeData } = body;

    if (!estatePlanId) {
      return NextResponse.json(
        { error: "estatePlanId is required" },
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

    // Create a new gap analysis run
    const run = await prisma.gapAnalysisRun.create({
      data: {
        estatePlanId,
        status: "pending",
        analysisType: "comprehensive",
        currentPhase: 1,
        totalPhases: 3,
        progressPercent: 0,
        phases: {
          create: [
            { phaseNumber: 1, name: "research", status: "pending" },
            { phaseNumber: 2, name: "analysis", status: "pending" },
            { phaseNumber: 3, name: "synthesis", status: "pending" },
          ],
        },
      },
      include: {
        phases: true,
      },
    });

    // Update run to running status
    await prisma.gapAnalysisRun.update({
      where: { id: run.id },
      data: {
        status: "running",
        startedAt: new Date(),
      },
    });

    // Start the analysis asynchronously (in the background)
    // Note: In production, this would be a proper background job
    executeComprehensiveAnalysis(run.id, estatePlanId, intakeData).catch(
      (error) => {
        console.error("Comprehensive analysis failed:", error);
        prisma.gapAnalysisRun.update({
          where: { id: run.id },
          data: {
            status: "failed",
            error: error.message,
            completedAt: new Date(),
          },
        });
      }
    );

    return NextResponse.json({
      success: true,
      runId: run.id,
      message: "Comprehensive analysis started",
    });
  } catch (error) {
    console.error("Orchestrate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function executeComprehensiveAnalysis(
  runId: string,
  estatePlanId: string,
  intakeData: unknown
) {
  try {
    // Update progress to 10%
    await updateRunProgress(runId, 10, 1);

    // Phase 1: Research
    await updatePhaseStatus(runId, 1, "running");

    // Call the main gap analysis with quick mode for initial research
    const researchResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/gap-analysis`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeData,
          mode: "quick",
        }),
      }
    );

    const researchResult = await researchResponse.json();

    // Store research results
    await createRunResult(runId, 1, "state_law_research", researchResult);
    await updatePhaseStatus(runId, 1, "completed");
    await updateRunProgress(runId, 40, 2);

    // Phase 2: Analysis
    await updatePhaseStatus(runId, 2, "running");

    // For comprehensive analysis, we run additional specialized analysis
    // This is a placeholder - in full implementation, would run multiple specialized prompts
    await createRunResult(runId, 2, "tax_optimization", {
      strategies: researchResult.analysisResult?.taxStrategies || [],
    });

    await updatePhaseStatus(runId, 2, "completed");
    await updateRunProgress(runId, 70, 3);

    // Phase 3: Synthesis
    await updatePhaseStatus(runId, 3, "running");

    // Save final synthesized results to the estate plan
    if (researchResult.success && researchResult.analysisResult) {
      const analysisData = researchResult.analysisResult;
      await prisma.gapAnalysis.create({
        data: {
          estatePlanId,
          score: analysisData.score || 0,
          missingDocuments: JSON.stringify(analysisData.missingDocuments || []),
          outdatedDocuments: JSON.stringify(analysisData.outdatedDocuments || []),
          inconsistencies: JSON.stringify(analysisData.inconsistencies || []),
          recommendations: JSON.stringify(analysisData.recommendations || []),
          stateSpecificNotes: JSON.stringify(analysisData.stateSpecificNotes || []),
          rawAnalysis: JSON.stringify(analysisData),
        },
      });
    }

    await updatePhaseStatus(runId, 3, "completed");
    await updateRunProgress(runId, 100, 3);

    // Mark run as completed
    await prisma.gapAnalysisRun.update({
      where: { id: runId },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Comprehensive analysis execution error:", error);
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

async function updatePhaseStatus(
  runId: string,
  phaseNumber: number,
  status: string
) {
  const phase = await prisma.gapAnalysisPhase.findFirst({
    where: {
      runId,
      phaseNumber,
    },
  });

  if (phase) {
    await prisma.gapAnalysisPhase.update({
      where: { id: phase.id },
      data: {
        status,
        startedAt: status === "running" ? new Date() : undefined,
        completedAt: status === "completed" ? new Date() : undefined,
      },
    });
  }
}

async function createRunResult(
  runId: string,
  phaseNumber: number,
  runType: string,
  result: unknown
) {
  const phase = await prisma.gapAnalysisPhase.findFirst({
    where: {
      runId,
      phaseNumber,
    },
  });

  if (phase) {
    await prisma.gapAnalysisRunResult.create({
      data: {
        phaseId: phase.id,
        runType,
        status: "completed",
        result: result as object,
        completedAt: new Date(),
      },
    });

    // Update phase run counts
    await prisma.gapAnalysisPhase.update({
      where: { id: phase.id },
      data: {
        totalRuns: { increment: 1 },
        completedRuns: { increment: 1 },
      },
    });
  }
}
