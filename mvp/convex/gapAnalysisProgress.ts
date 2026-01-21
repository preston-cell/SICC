import { query } from "./_generated/server";
import { v } from "convex/values";

// Get comprehensive run progress for UI
export const getRunProgress = query({
  args: {
    runId: v.id("gapAnalysisRuns"),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.db.get(runId);
    if (!run) return null;

    const phases = await ctx.db
      .query("gapAnalysisPhases")
      .withIndex("by_run", (q) => q.eq("runId", runId))
      .collect();

    // Get current running run result if any
    let currentRun = null;
    for (const phase of phases) {
      const runningResults = await ctx.db
        .query("gapAnalysisRunResults")
        .withIndex("by_phase", (q) => q.eq("phaseId", phase._id))
        .filter((q) => q.eq(q.field("status"), "running"))
        .take(1);

      if (runningResults.length > 0) {
        currentRun = {
          runType: runningResults[0].runType,
          status: runningResults[0].status,
        };
        break;
      }
    }

    // Calculate estimated completion time
    const elapsedMs = Date.now() - run.startedAt;
    const progressPct = run.overallProgress || 0;
    const estimatedTotalMs = progressPct > 0 ? (elapsedMs / progressPct) * 100 : 0;
    const estimatedRemainingMs = Math.max(0, estimatedTotalMs - elapsedMs);

    return {
      runId: run._id,
      estatePlanId: run.estatePlanId,
      status: run.status,
      overallProgress: run.overallProgress,
      currentPhase: run.currentPhase,
      phases: phases.map((phase) => ({
        phaseNumber: phase.phaseNumber,
        phaseType: phase.phaseType,
        status: phase.status,
        totalRuns: phase.totalRuns,
        completedRuns: phase.completedRuns,
        failedRuns: phase.failedRuns,
      })),
      currentRun,
      startedAt: run.startedAt,
      estimatedCompletionMs: estimatedRemainingMs,
      error: run.lastError,
      finalAnalysisId: run.finalAnalysisId,
    };
  },
});

// Get phase progress with run details
export const getPhaseProgress = query({
  args: {
    runId: v.id("gapAnalysisRuns"),
  },
  handler: async (ctx, { runId }) => {
    const phases = await ctx.db
      .query("gapAnalysisPhases")
      .withIndex("by_run", (q) => q.eq("runId", runId))
      .collect();

    const phaseDetails = await Promise.all(
      phases.map(async (phase) => {
        const runResults = await ctx.db
          .query("gapAnalysisRunResults")
          .withIndex("by_phase", (q) => q.eq("phaseId", phase._id))
          .collect();

        return {
          ...phase,
          runs: runResults.map((r) => ({
            runType: r.runType,
            status: r.status,
            durationMs: r.durationMs,
            error: r.error,
          })),
        };
      })
    );

    return phaseDetails;
  },
});

// Get latest analysis for estate plan (supports both quick and comprehensive)
export const getLatestAnalysis = query({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, { estatePlanId }) => {
    // Get latest gap analysis
    const analyses = await ctx.db
      .query("gapAnalysis")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .order("desc")
      .take(1);

    const analysis = analyses[0];
    if (!analysis) return null;

    // If it has a multiPhaseRunId, get the run details
    let runDetails = null;
    if (analysis.multiPhaseRunId) {
      const run = await ctx.db.get(analysis.multiPhaseRunId);
      if (run) {
        const phases = await ctx.db
          .query("gapAnalysisPhases")
          .withIndex("by_run", (q) => q.eq("runId", run._id))
          .collect();

        runDetails = {
          runId: run._id,
          status: run.status,
          totalDurationMs: run.completedAt ? run.completedAt - run.startedAt : null,
          phases: phases.map((p) => ({
            phaseType: p.phaseType,
            status: p.status,
            completedRuns: p.completedRuns,
            failedRuns: p.failedRuns,
          })),
        };
      }
    }

    return {
      ...analysis,
      runDetails,
    };
  },
});

// Get active run for estate plan (if any)
export const getActiveRun = query({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, { estatePlanId }) => {
    const runs = await ctx.db
      .query("gapAnalysisRuns")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .order("desc")
      .take(1);

    const run = runs[0];
    if (!run) return null;

    // Check if it's still active
    if (run.status === "completed" || run.status === "failed" || run.status === "partial") {
      return null;
    }

    // Get phases for progress
    const phases = await ctx.db
      .query("gapAnalysisPhases")
      .withIndex("by_run", (q) => q.eq("runId", run._id))
      .collect();

    return {
      runId: run._id,
      status: run.status,
      overallProgress: run.overallProgress,
      currentPhase: run.currentPhase,
      phases: phases.map((p) => ({
        phaseNumber: p.phaseNumber,
        phaseType: p.phaseType,
        status: p.status,
        completedRuns: p.completedRuns,
        totalRuns: p.totalRuns,
      })),
      startedAt: run.startedAt,
    };
  },
});

// Get run history for estate plan
export const getRunHistory = query({
  args: {
    estatePlanId: v.id("estatePlans"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { estatePlanId, limit = 10 }) => {
    const runs = await ctx.db
      .query("gapAnalysisRuns")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .order("desc")
      .take(limit);

    return runs.map((run) => ({
      runId: run._id,
      status: run.status,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      overallProgress: run.overallProgress,
      hasError: !!run.lastError,
    }));
  },
});
