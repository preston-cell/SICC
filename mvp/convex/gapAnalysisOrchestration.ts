import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new multi-phase analysis run
export const createRun = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    config: v.optional(v.string()),
  },
  handler: async (ctx, { estatePlanId, config }) => {
    const runId = await ctx.db.insert("gapAnalysisRuns", {
      estatePlanId,
      status: "pending",
      overallProgress: 0,
      startedAt: Date.now(),
      retryCount: 0,
      config,
    });

    return runId;
  },
});

// Create a phase record
export const createPhase = mutation({
  args: {
    runId: v.id("gapAnalysisRuns"),
    phaseNumber: v.number(),
    phaseType: v.union(
      v.literal("research"),
      v.literal("analysis"),
      v.literal("synthesis")
    ),
    totalRuns: v.number(),
  },
  handler: async (ctx, { runId, phaseNumber, phaseType, totalRuns }) => {
    const phaseId = await ctx.db.insert("gapAnalysisPhases", {
      runId,
      phaseNumber,
      phaseType,
      status: "pending",
      totalRuns,
      completedRuns: 0,
      failedRuns: 0,
    });

    return phaseId;
  },
});

// Update run status
export const updateRunStatus = mutation({
  args: {
    runId: v.id("gapAnalysisRuns"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("phase1_running"),
        v.literal("phase1_complete"),
        v.literal("phase2_running"),
        v.literal("phase2_complete"),
        v.literal("phase3_running"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("partial")
      )
    ),
    overallProgress: v.optional(v.number()),
    currentPhase: v.optional(v.number()),
    lastError: v.optional(v.string()),
    finalAnalysisId: v.optional(v.id("gapAnalysis")),
  },
  handler: async (ctx, args) => {
    const { runId, status, overallProgress, currentPhase, lastError, finalAnalysisId } = args;

    const updates: Record<string, unknown> = {};

    if (status !== undefined) updates.status = status;
    if (overallProgress !== undefined) updates.overallProgress = overallProgress;
    if (currentPhase !== undefined) updates.currentPhase = currentPhase;
    if (lastError !== undefined) updates.lastError = lastError;
    if (finalAnalysisId !== undefined) {
      updates.finalAnalysisId = finalAnalysisId;
      updates.completedAt = Date.now();
    }

    if (status === "phase1_complete") {
      updates.phase1CompletedAt = Date.now();
    } else if (status === "phase2_complete") {
      updates.phase2CompletedAt = Date.now();
    }

    await ctx.db.patch(runId, updates);
  },
});

// Update phase status
export const updatePhaseStatus = mutation({
  args: {
    phaseId: v.id("gapAnalysisPhases"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    completedRuns: v.optional(v.number()),
    failedRuns: v.optional(v.number()),
    aggregatedResults: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { phaseId, status, completedRuns, failedRuns, aggregatedResults } = args;

    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
      if (status === "running") {
        updates.startedAt = Date.now();
      } else if (status === "completed" || status === "failed") {
        updates.completedAt = Date.now();
      }
    }

    if (completedRuns !== undefined) updates.completedRuns = completedRuns;
    if (failedRuns !== undefined) updates.failedRuns = failedRuns;
    if (aggregatedResults !== undefined) updates.aggregatedResults = aggregatedResults;

    await ctx.db.patch(phaseId, updates);
  },
});

// Create individual run result
export const createRunResult = mutation({
  args: {
    runId: v.id("gapAnalysisRuns"),
    phaseId: v.id("gapAnalysisPhases"),
    runType: v.string(),
    maxTurns: v.number(),
    webSearchEnabled: v.boolean(),
    prompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resultId = await ctx.db.insert("gapAnalysisRunResults", {
      runId: args.runId,
      phaseId: args.phaseId,
      runType: args.runType,
      status: "pending",
      maxTurns: args.maxTurns,
      webSearchEnabled: args.webSearchEnabled,
      prompt: args.prompt,
      retryCount: 0,
    });

    return resultId;
  },
});

// Update run result
export const updateRunResult = mutation({
  args: {
    resultId: v.id("gapAnalysisRunResults"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      )
    ),
    result: v.optional(v.string()),
    rawOutput: v.optional(v.string()),
    error: v.optional(v.string()),
    durationMs: v.optional(v.number()),
    turnsUsed: v.optional(v.number()),
    costUsd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { resultId, status, result, rawOutput, error, durationMs, turnsUsed, costUsd } = args;

    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
      if (status === "running") {
        updates.startedAt = Date.now();
      } else if (status === "completed" || status === "failed") {
        updates.completedAt = Date.now();
      }
    }

    if (result !== undefined) updates.result = result;
    if (rawOutput !== undefined) updates.rawOutput = rawOutput;
    if (error !== undefined) updates.error = error;
    if (durationMs !== undefined) updates.durationMs = durationMs;
    if (turnsUsed !== undefined) updates.turnsUsed = turnsUsed;
    if (costUsd !== undefined) updates.costUsd = costUsd;

    await ctx.db.patch(resultId, updates);
  },
});

// Get completed run count for a phase
export const getCompletedRunCount = query({
  args: {
    phaseId: v.id("gapAnalysisPhases"),
  },
  handler: async (ctx, { phaseId }) => {
    const results = await ctx.db
      .query("gapAnalysisRunResults")
      .withIndex("by_phase", (q) => q.eq("phaseId", phaseId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "completed"),
          q.eq(q.field("status"), "failed")
        )
      )
      .collect();

    return results.length;
  },
});

// Save final analysis to gapAnalysis table
export const saveFinalAnalysis = mutation({
  args: {
    estatePlanId: v.id("estatePlans"),
    runId: v.id("gapAnalysisRuns"),
    score: v.number(),
    analysisType: v.union(v.literal("quick"), v.literal("comprehensive")),
    missingDocuments: v.string(),
    outdatedDocuments: v.string(),
    inconsistencies: v.string(),
    taxOptimization: v.optional(v.string()),
    medicaidPlanning: v.optional(v.string()),
    recommendations: v.string(),
    stateSpecificNotes: v.string(),
    scenarioAnalysis: v.optional(v.string()),
    priorityMatrix: v.optional(v.string()),
    stateResearch: v.optional(v.string()),
    documentInventory: v.optional(v.string()),
    rawAnalysis: v.optional(v.string()),
    totalDurationMs: v.optional(v.number()),
    totalCostUsd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("gapAnalysis", {
      estatePlanId: args.estatePlanId,
      score: args.score,
      missingDocuments: args.missingDocuments,
      outdatedDocuments: args.outdatedDocuments,
      inconsistencies: args.inconsistencies,
      taxOptimization: args.taxOptimization,
      medicaidPlanning: args.medicaidPlanning,
      recommendations: args.recommendations,
      stateSpecificNotes: args.stateSpecificNotes,
      rawAnalysis: args.rawAnalysis,
      createdAt: Date.now(),
      // Multi-phase specific fields
      multiPhaseRunId: args.runId,
      analysisType: args.analysisType,
      scenarioAnalysis: args.scenarioAnalysis,
      priorityMatrix: args.priorityMatrix,
      stateResearch: args.stateResearch,
      documentInventory: args.documentInventory,
      totalDurationMs: args.totalDurationMs,
      totalCostUsd: args.totalCostUsd,
    });

    // Update estate plan status
    await ctx.db.patch(args.estatePlanId, {
      status: "analysis_complete",
      updatedAt: Date.now(),
    });

    return analysisId;
  },
});

// Get run by ID
export const getRun = query({
  args: {
    runId: v.id("gapAnalysisRuns"),
  },
  handler: async (ctx, { runId }) => {
    return await ctx.db.get(runId);
  },
});

// Get phases for a run
export const getPhases = query({
  args: {
    runId: v.id("gapAnalysisRuns"),
  },
  handler: async (ctx, { runId }) => {
    return await ctx.db
      .query("gapAnalysisPhases")
      .withIndex("by_run", (q) => q.eq("runId", runId))
      .collect();
  },
});

// Get run results for a phase
export const getRunResults = query({
  args: {
    phaseId: v.id("gapAnalysisPhases"),
  },
  handler: async (ctx, { phaseId }) => {
    return await ctx.db
      .query("gapAnalysisRunResults")
      .withIndex("by_phase", (q) => q.eq("phaseId", phaseId))
      .collect();
  },
});

// Get latest run for an estate plan
export const getLatestRun = query({
  args: {
    estatePlanId: v.id("estatePlans"),
  },
  handler: async (ctx, { estatePlanId }) => {
    const runs = await ctx.db
      .query("gapAnalysisRuns")
      .withIndex("by_estate_plan", (q) => q.eq("estatePlanId", estatePlanId))
      .order("desc")
      .take(1);

    return runs[0] || null;
  },
});

// Cancel a running analysis
export const cancelRun = mutation({
  args: {
    runId: v.id("gapAnalysisRuns"),
  },
  handler: async (ctx, { runId }) => {
    const run = await ctx.db.get(runId);
    if (!run) {
      throw new Error("Run not found");
    }

    // Only allow cancelling runs that are not already completed/failed
    if (run.status === "completed" || run.status === "failed" || run.status === "partial") {
      return { success: false, message: "Run already finished" };
    }

    // Mark run as cancelled (using 'failed' status with error message)
    await ctx.db.patch(runId, {
      status: "failed",
      lastError: "Cancelled by user",
      completedAt: Date.now(),
    });

    // Mark all pending/running phases as failed
    const phases = await ctx.db
      .query("gapAnalysisPhases")
      .withIndex("by_run", (q) => q.eq("runId", runId))
      .collect();

    for (const phase of phases) {
      if (phase.status === "pending" || phase.status === "running") {
        await ctx.db.patch(phase._id, {
          status: "failed",
          completedAt: Date.now(),
        });
      }
    }

    return { success: true, message: "Analysis cancelled" };
  },
});
