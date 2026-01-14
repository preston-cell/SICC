"use node";

/**
 * Run Agent Action - Using Claude Code in E2B via API route
 *
 * This action runs Claude Code autonomously by:
 * 1. Calling the Next.js API route which creates an E2B sandbox
 * 2. Claude Code runs with estate planning skills in the sandbox
 * 3. Results are saved to the database
 */

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Main action to run Claude Code in E2B sandbox via API route
export const runAgent = action({
  args: { input: v.string() },
  handler: async (ctx, { input }) => {
    // Create run record
    const runId: Id<"agentRuns"> = await ctx.runMutation(
      internal.mutations.createRun,
      { prompt: input }
    );

    // Update status to running
    await ctx.runMutation(internal.mutations.updateRun, {
      runId,
      status: "running",
    });

    try {
      // Call the Next.js API route for E2B execution
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/e2b/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          timeoutMs: 240000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "E2B execution failed");
      }

      const output = `STDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr || "(none)"}`;

      // Update run as completed
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "completed",
        output,
      });

      return {
        runId,
        output,
        fileCount: 0, // Files are handled by the API route now
      };
    } catch (err: unknown) {
      const error = err as Error & { stdout?: string; stderr?: string };
      const errorOutput =
        "COMMAND FAILED\n\n" +
        "STDOUT:\n" +
        (error.stdout || "(none)") +
        "\n\nSTDERR:\n" +
        (error.stderr || error.message || "(no stderr)");

      // Update run as failed
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "failed",
        output: errorOutput,
        error: error.message,
      });

      return {
        runId,
        output: errorOutput,
        fileCount: 0,
      };
    }
  },
});
