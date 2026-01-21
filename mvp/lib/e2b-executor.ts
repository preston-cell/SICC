import { Sandbox } from "e2b";

// Skills content
const SKILLS = {
  "estate-document-analyzer": {
    "SKILL.md": `# Estate Document Analyzer Skill

You are an expert estate planning document analyzer. When given estate planning documents (wills, trusts, POAs, etc.), you:

1. **Extract Key Information**:
   - Document type and date
   - Principal/grantor name
   - Named parties (executors, trustees, agents, beneficiaries)
   - Key provisions and terms

2. **Identify Issues**:
   - Missing signatures or witnesses
   - Outdated information
   - Ambiguous language
   - Potential conflicts with other documents

3. **Provide Recommendations**:
   - Suggest updates needed
   - Flag inconsistencies
   - Note state-specific compliance issues

Output format: JSON with sections for extracted_info, issues, and recommendations.`
  },
  "estate-goals-profiler": {
    "SKILL.md": `# Estate Goals Profiler Skill

You help clients articulate and prioritize their estate planning goals. You:

1. **Identify Goals**:
   - Asset protection
   - Tax minimization
   - Family provision
   - Charitable giving
   - Business succession
   - Healthcare directives

2. **Assess Priorities**:
   - Rank goals by importance
   - Identify potential conflicts
   - Suggest compromise solutions

3. **Recommend Documents**:
   - Map goals to specific documents needed
   - Prioritize document creation order

Output format: JSON with prioritized_goals, conflicts, and document_recommendations.`
  },
  "financial-profile-classifier": {
    "SKILL.md": `# Financial Profile Classifier Skill

You analyze financial situations for estate planning purposes. You:

1. **Classify Estate Size**:
   - Simple (under $1M)
   - Moderate ($1M - $5M)
   - Complex ($5M - $12M)
   - High Net Worth ($12M+)

2. **Identify Tax Implications**:
   - Federal estate tax exposure
   - State estate/inheritance tax
   - Gift tax considerations
   - Generation-skipping tax

3. **Recommend Strategies**:
   - Basic will vs. living trust
   - Irrevocable trust options
   - Charitable planning
   - Life insurance planning

Output format: JSON with classification, tax_exposure, and strategy_recommendations.`
  },
  "us-estate-planning-analyzer": {
    "SKILL.md": `# US Estate Planning Analyzer Skill

You are an expert in US estate planning law. You analyze estate plans for:

1. **Federal Compliance**:
   - Estate tax exemption limits (current: $13.61M per person)
   - Gift tax annual exclusion ($18,000 per recipient)
   - Portability elections
   - QTIP trust requirements

2. **State-Specific Rules**:
   - Community property vs. common law states
   - State estate tax thresholds
   - State inheritance taxes
   - Homestead exemptions

3. **Document Requirements**:
   - Will execution requirements by state
   - Trust formation rules
   - POA statutory forms
   - Healthcare directive compliance

4. **Gap Analysis**:
   - Missing essential documents
   - Outdated provisions
   - Beneficiary inconsistencies
   - Tax optimization opportunities

Output format: JSON with compliance_status, state_specific_issues, gaps, and recommendations.`
  }
};

const OUTPUT_DIR = "/home/user/generated";
const SKILLS_DIR = "/home/user/.claude/skills";

export interface E2BExecuteResult {
  success: boolean;
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  fileContent?: string;
  error?: string;
  // Metadata from --output-format json
  metadata?: {
    numTurns?: number;
    durationMs?: number;
    totalCostUsd?: number;
    sessionId?: string;
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      cacheReadInputTokens?: number;
      cacheCreationInputTokens?: number;
    };
  };
}

export interface E2BExecuteOptions {
  prompt: string;
  outputFile?: string;
  timeoutMs?: number;
  maxTurns?: number;           // Configurable max turns (default: 5)
  enableWebSearch?: boolean;   // Enable web search capability
  runType?: string;            // For logging/tracking
}

/**
 * Execute Claude Code in E2B sandbox
 * This is a shared function that can be called directly without HTTP
 */
export async function executeInE2B(options: E2BExecuteOptions): Promise<E2BExecuteResult> {
  const { prompt, outputFile, timeoutMs = 240000, maxTurns = 5, enableWebSearch = false, runType } = options;

  const E2B_API_KEY = process.env.E2B_API_KEY;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!E2B_API_KEY || !ANTHROPIC_API_KEY) {
    return { success: false, error: "API keys not configured" };
  }

  // Create sandbox with very long timeout for comprehensive analysis
  // Quality is the priority - allow up to 60 minutes for thorough analysis
  const sandbox = await Sandbox.create("base", {
    timeoutMs: 3600000, // 60 minutes sandbox lifetime - quality over speed
    apiKey: E2B_API_KEY,
  });

  try {
    // Create directories
    await sandbox.commands.run(`mkdir -p ${OUTPUT_DIR}`);
    await sandbox.commands.run(`mkdir -p ${SKILLS_DIR}`);

    // Inject skills
    for (const [skillName, files] of Object.entries(SKILLS)) {
      const skillDir = `${SKILLS_DIR}/${skillName}`;
      await sandbox.commands.run(`mkdir -p "${skillDir}"`);
      for (const [fileName, content] of Object.entries(files)) {
        await sandbox.files.write(`${skillDir}/${fileName}`, content);
      }
    }

    // Write the prompt to a file first - safer than embedding in shell script
    await sandbox.files.write("/tmp/analysis_prompt.txt", prompt);

    // Create wrapper script that reads from the prompt file
    const wrapperScript = `
#!/bin/bash

cd ${OUTPUT_DIR}

echo "=== E2B Sandbox Debug Info ==="
echo "HOME: $HOME"
echo "PWD: $(pwd)"
echo "ANTHROPIC_API_KEY set: \${ANTHROPIC_API_KEY:+yes}"
echo "ANTHROPIC_API_KEY length: \${#ANTHROPIC_API_KEY}"

# Check prompt file
echo "=== Prompt File ==="
echo "Prompt file exists: $(test -f /tmp/analysis_prompt.txt && echo yes || echo no)"
echo "Prompt file size: $(wc -c < /tmp/analysis_prompt.txt 2>/dev/null || echo 0) bytes"
echo "Prompt preview (first 200 chars):"
head -c 200 /tmp/analysis_prompt.txt 2>/dev/null || echo "(could not read)"
echo ""

# Install Claude Code CLI
echo "=== Installing Claude Code CLI ==="
npm install -g @anthropic-ai/claude-code 2>&1 || {
    echo "Failed to install claude-code globally, trying npx..."
    export USE_NPX=1
}

# Verify installation
if [ "\${USE_NPX:-}" != "1" ]; then
    which claude || echo "claude not found in PATH"
    claude --version 2>&1 || echo "claude --version failed"
fi

echo "=== Starting Claude Code ==="
echo "Working directory: $(pwd)"
echo "Max turns: ${maxTurns}"
echo "Run type: ${runType || 'general'}"
echo "Available skills:"
ls -la $HOME/.claude/skills/ 2>/dev/null || echo "(no skills)"

# Run Claude Code with stdin piping from prompt file
# This is safer than embedding the prompt in the script
CLAUDE_EXIT_CODE=0
if [ "\${USE_NPX:-}" = "1" ]; then
    echo "Running with npx..."
    cat /tmp/analysis_prompt.txt | npx -y @anthropic-ai/claude-code --print --dangerously-skip-permissions --output-format json --max-turns ${maxTurns} 2>&1
    CLAUDE_EXIT_CODE=\$?
else
    echo "Running with claude CLI..."
    cat /tmp/analysis_prompt.txt | claude --print --dangerously-skip-permissions --output-format json --max-turns ${maxTurns} 2>&1
    CLAUDE_EXIT_CODE=\$?
fi

echo ""
echo "=== Claude Code Finished (exit code: \$CLAUDE_EXIT_CODE) ==="
echo "Generated files:"
ls -la ${OUTPUT_DIR}/ 2>/dev/null || echo "(none)"

# Also check if any json files were created anywhere
echo "=== JSON files in sandbox ==="
find /home/user -name "*.json" -type f 2>/dev/null || echo "(none found)"

# Always exit 0 - we check for output file to determine success
exit 0
`;

    await sandbox.files.write("/tmp/run_claude.sh", wrapperScript);
    await sandbox.commands.run("chmod +x /tmp/run_claude.sh");

    // Run Claude Code - use passed timeout (0 means use max timeout for comprehensive analysis)
    const commandOptions: { envs: Record<string, string>; timeoutMs: number } = {
      envs: {
        ANTHROPIC_API_KEY,
        HOME: "/home/user",
        CI: "true",
      },
      // Quality is priority - allow up to 55 minutes per command (leaving 5 min buffer for sandbox lifetime)
      // When timeoutMs is 0, use max. Otherwise use passed value or default 15 minutes.
      timeoutMs: timeoutMs === 0 ? 3300000 : (timeoutMs || 900000),
    };

    const result = await sandbox.commands.run("bash /tmp/run_claude.sh", commandOptions);

    // Log full output for debugging
    console.log("E2B execution completed:", {
      exitCode: result.exitCode,
      stdoutLength: result.stdout?.length || 0,
      stderrLength: result.stderr?.length || 0,
    });

    // Log full stdout to see what Claude Code returned
    console.log("E2B FULL STDOUT:", result.stdout);
    if (result.stderr) {
      console.log("E2B STDERR:", result.stderr);
    }

    // Try to parse Claude Code's JSON output to see if there's an error
    try {
      const claudeOutputMatch = result.stdout.match(/\{[\s\S]*"is_error"[\s\S]*\}/);
      if (claudeOutputMatch) {
        const claudeOutput = JSON.parse(claudeOutputMatch[0]);
        console.log("Claude Code output parsed:", {
          is_error: claudeOutput.is_error,
          num_turns: claudeOutput.num_turns,
          result: typeof claudeOutput.result === 'string'
            ? claudeOutput.result.substring(0, 500)
            : claudeOutput.result,
        });

        // If there's an error in Claude's output, report it
        if (claudeOutput.is_error) {
          console.error("Claude Code returned an error:", claudeOutput.result);
        }
      }
    } catch (parseErr) {
      console.log("Could not parse Claude output as JSON");
    }

    // Try to read output file if specified
    let fileContent = "";
    if (outputFile) {
      const targetPath = `${OUTPUT_DIR}/${outputFile}`;
      console.log("Attempting to read output file:", targetPath);

      try {
        fileContent = await sandbox.files.read(targetPath);
        console.log("Successfully read output file, length:", fileContent.length);
      } catch (readError) {
        console.log("Failed to read output file directly:", readError);

        // Try to find any file with similar name
        const listResult = await sandbox.commands.run(
          `find ${OUTPUT_DIR} -type f 2>/dev/null || true`
        );
        const files = listResult.stdout.split("\n").filter((f: string) => f.trim());
        console.log("Files found in output directory:", files);

        if (files.length > 0) {
          try {
            fileContent = await sandbox.files.read(files[0]);
            console.log("Read first available file:", files[0], "length:", fileContent.length);
          } catch (fallbackError) {
            console.log("Failed to read fallback file:", fallbackError);
          }
        }
      }
    }

    // Extract metadata from JSON output (--output-format json)
    let metadata: E2BExecuteResult["metadata"];
    try {
      const jsonMatch = result.stdout.match(/\{[\s\S]*"num_turns"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        metadata = {
          numTurns: parsed.num_turns,
          durationMs: parsed.duration_ms,
          totalCostUsd: parsed.total_cost_usd,
          sessionId: parsed.session_id,
          usage: parsed.usage ? {
            inputTokens: parsed.usage.input_tokens,
            outputTokens: parsed.usage.output_tokens,
            cacheReadInputTokens: parsed.usage.cache_read_input_tokens,
            cacheCreationInputTokens: parsed.usage.cache_creation_input_tokens,
          } : undefined,
        };
      }
    } catch {
      // Metadata extraction is best-effort, don't fail if it doesn't work
    }

    return {
      success: true,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      fileContent,
      metadata,
    };
  } finally {
    await sandbox.kill();
  }
}
