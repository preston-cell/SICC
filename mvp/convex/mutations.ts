import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation to create a run record
export const createRun = internalMutation({
  args: { prompt: v.string() },
  handler: async (ctx, { prompt }) => {
    return await ctx.db.insert("agentRuns", {
      prompt,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// Internal mutation to update run status
export const updateRun = internalMutation({
  args: {
    runId: v.id("agentRuns"),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { runId, status, output, error }) => {
    const updates: Record<string, unknown> = { status };
    if (output !== undefined) updates.output = output;
    if (error !== undefined) updates.error = error;
    if (status === "completed" || status === "failed") {
      updates.completedAt = Date.now();
    }
    await ctx.db.patch(runId, updates);
  },
});

// Internal mutation to save a generated file
export const saveFile = internalMutation({
  args: {
    runId: v.id("agentRuns"),
    path: v.string(),
    content: v.string(),
    isBinary: v.boolean(),
    size: v.number(),
  },
  handler: async (ctx, { runId, path, content, isBinary, size }) => {
    await ctx.db.insert("generatedFiles", {
      runId,
      path,
      content,
      isBinary,
      size,
    });
  },
});
