"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getSkillFilesForSandbox, getSkillNames } from "./skillsBundle";

// Directory where generated files will be stored in the sandbox
const OUTPUT_DIR = "/home/user/generated";
const SKILLS_DIR = "/home/user/.claude/skills";

// Main action to run Claude Code in E2B sandbox
export const runAgent = action({
  args: { input: v.string() },
  handler: async (ctx, { input }) => {
    const { Sandbox } = require("@e2b/sdk");

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

    let sandbox;
    try {
      // Create sandbox with base template (has Node.js)
      sandbox = await Sandbox.create({
        template: "base",
        timeoutMs: 300000, // 5 minute timeout
        apiKey: process.env.E2B_API_KEY,
      });

      // Create output directory
      await sandbox.commands.run(`mkdir -p ${OUTPUT_DIR}`);

      // Inject skills into the sandbox
      console.log("Injecting skills into sandbox...");
      const skillFiles = getSkillFilesForSandbox(SKILLS_DIR);

      // Create all skill directories first
      const skillDirs = new Set<string>();
      for (const file of skillFiles) {
        const dir = file.path.substring(0, file.path.lastIndexOf("/"));
        skillDirs.add(dir);
      }
      for (const dir of skillDirs) {
        await sandbox.commands.run(`mkdir -p "${dir}"`);
      }

      // Write all skill files
      for (const file of skillFiles) {
        await sandbox.files.write(file.path, file.content);
      }
      console.log(`Injected ${skillFiles.length} skill files (${getSkillNames().join(", ")})`);

      // Create a wrapper script that runs Claude Code CLI
      // The script will:
      // 1. Install Claude Code CLI
      // 2. Run it with the user's prompt
      // 3. Generate files to the output directory
      const wrapperScript = `
#!/bin/bash
set -e

cd ${OUTPUT_DIR}

# Install Claude Code CLI globally
npm install -g @anthropic-ai/claude-code 2>&1 || {
    echo "Failed to install claude-code, trying alternative..."
    # If global install fails, try npx
    export USE_NPX=1
}

# Create a prompt file with instructions
cat > /tmp/prompt.txt << 'PROMPT_EOF'
${input.replace(/'/g, "'\\''")}

IMPORTANT: Save ALL generated files to the current working directory (${OUTPUT_DIR}).
Do not create files in any other location.
When you are done generating files, print "===FILES_GENERATED===" on a new line.
PROMPT_EOF

echo "=== Starting Claude Code Agent ==="
echo "Working directory: $(pwd)"
echo "HOME directory: $HOME"
echo "Skills directory contents:"
ls -la $HOME/.claude/skills/ 2>/dev/null || echo "(no skills dir)"
find $HOME/.claude/skills -name "SKILL.md" 2>/dev/null || echo "(no SKILL.md files)"
echo "Prompt: $(cat /tmp/prompt.txt | head -c 500)..."
echo "=================================="

# Run Claude Code with the prompt
if [ "\${USE_NPX:-}" = "1" ]; then
    echo "Using npx to run claude..."
    npx -y @anthropic-ai/claude-code --print --dangerously-skip-permissions -p "$(cat /tmp/prompt.txt)" 2>&1
else
    echo "Using globally installed claude..."
    claude --print --dangerously-skip-permissions -p "$(cat /tmp/prompt.txt)" 2>&1
fi

echo ""
echo "=== Claude Code Agent Finished ==="
echo "Files in output directory:"
ls -la ${OUTPUT_DIR}/ 2>/dev/null || echo "(no files)"
`;

      await sandbox.files.write("/tmp/run_agent.sh", wrapperScript);
      await sandbox.commands.run("chmod +x /tmp/run_agent.sh");

      // Run the agent script with the API key
      const result = await sandbox.commands.run("bash /tmp/run_agent.sh", {
        envs: {
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
          HOME: "/home/user",
          // Disable interactive prompts
          CI: "true",
        },
        timeoutMs: 240000, // 4 minute timeout for execution
      });

      const output = `STDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr || "(none)"}`;

      // List files in the output directory
      const listResult = await sandbox.commands.run(
        `find ${OUTPUT_DIR} -type f 2>/dev/null || true`
      );
      const filePaths = listResult.stdout
        .split("\n")
        .filter((p: string) => p.trim() && p !== OUTPUT_DIR);

      // Read and save each generated file
      for (const filePath of filePaths) {
        try {
          const relativePath = filePath.replace(`${OUTPUT_DIR}/`, "");

          // Read file content
          const content = await sandbox.files.read(filePath);

          // Determine if binary (simple heuristic)
          const isBinary = isBinaryContent(content);

          // Save to database
          await ctx.runMutation(internal.mutations.saveFile, {
            runId,
            path: relativePath,
            content: isBinary ? Buffer.from(content).toString("base64") : content,
            isBinary,
            size: content.length,
          });
        } catch (fileErr) {
          console.error(`Failed to read file ${filePath}:`, fileErr);
        }
      }

      // Update run as completed
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "completed",
        output,
      });

      return {
        runId,
        output,
        fileCount: filePaths.length,
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
    } finally {
      // Always close the sandbox
      if (sandbox) {
        try {
          await sandbox.kill();
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  },
});

// Helper to detect binary content
function isBinaryContent(content: string): boolean {
  // Check for null bytes or high ratio of non-printable characters
  let nonPrintable = 0;
  const sampleSize = Math.min(content.length, 1000);
  for (let i = 0; i < sampleSize; i++) {
    const code = content.charCodeAt(i);
    if (code === 0 || (code < 32 && code !== 9 && code !== 10 && code !== 13)) {
      nonPrintable++;
    }
  }
  return nonPrintable / sampleSize > 0.1;
}

// Legacy action for backward compatibility (can be removed later)
export const runAgentLegacy = action({
  args: { input: v.string() },
  handler: async (_ctx, { input }) => {
    const { Sandbox } = require("@e2b/sdk");

    const sandbox = await Sandbox.create({
      template: "python",
      apiKey: process.env.E2B_API_KEY,
    });

    await sandbox.files.write(
      "agent.py",
      `
import os
import time
import anthropic

print("=== E2B SANDBOX START ===")
print("timestamp:", time.time())
print("E2B_SANDBOX:", os.environ.get("E2B_SANDBOX"))
print("E2B_SANDBOX_ID:", os.environ.get("E2B_SANDBOX_ID"))
print("========================")

api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    raise RuntimeError("ANTHROPIC_API_KEY missing")

client = anthropic.Anthropic(api_key=api_key)

msg = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1800,
    messages=[{"role": "user", "content": ${JSON.stringify(input)}}],
)

print("\\n=== CLAUDE OUTPUT ===")
print("".join(b.text for b in msg.content if b.type == "text"))
`
    );

    try {
      const result = await sandbox.commands.run(
        "pip install -q anthropic && python agent.py",
        {
          envs: {
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
          },
        }
      );

      return {
        output:
          "STDOUT:\n" +
          result.stdout +
          "\n\nSTDERR:\n" +
          (result.stderr || "(none)"),
      };
    } catch (err: unknown) {
      const error = err as Error & { stdout?: string; stderr?: string };
      return {
        output:
          "COMMAND FAILED\n\n" +
          "STDOUT:\n" +
          (error.stdout || "(none)") +
          "\n\nSTDERR:\n" +
          (error.stderr || error.message || "(no stderr)"),
      };
    }
  },
});
