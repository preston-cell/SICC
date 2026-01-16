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
}

/**
 * Execute Claude Code in E2B sandbox
 * This is a shared function that can be called directly without HTTP
 */
export async function executeInE2B(options: E2BExecuteOptions): Promise<E2BExecuteResult> {
  const { prompt, outputFile, timeoutMs = 240000 } = options;

  const E2B_API_KEY = process.env.E2B_API_KEY;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!E2B_API_KEY || !ANTHROPIC_API_KEY) {
    return { success: false, error: "API keys not configured" };
  }

  // Create sandbox with very long timeout for comprehensive analysis
  const sandbox = await Sandbox.create("base", {
    timeoutMs: 1800000, // 30 minutes sandbox lifetime
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

    // Create wrapper script
    const wrapperScript = `
#!/bin/bash
set -e

cd ${OUTPUT_DIR}

# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code 2>&1 || {
    echo "Failed to install claude-code, trying npx..."
    export USE_NPX=1
}

# Create prompt file
cat > /tmp/prompt.txt << 'PROMPT_EOF'
${prompt.replace(/'/g, "'\\''")}
PROMPT_EOF

echo "=== Starting Claude Code ==="
echo "Working directory: $(pwd)"
echo "Available skills:"
ls -la $HOME/.claude/skills/ 2>/dev/null || echo "(no skills)"

# Run Claude Code with safety limits and structured output
if [ "\${USE_NPX:-}" = "1" ]; then
    npx -y @anthropic-ai/claude-code --print --dangerously-skip-permissions --output-format json --max-turns 5 -p "$(cat /tmp/prompt.txt)" 2>&1
else
    claude --print --dangerously-skip-permissions --output-format json --max-turns 5 -p "$(cat /tmp/prompt.txt)" 2>&1
fi

echo ""
echo "=== Claude Code Finished ==="
echo "Generated files:"
ls -la ${OUTPUT_DIR}/ 2>/dev/null || echo "(none)"
`;

    await sandbox.files.write("/tmp/run_claude.sh", wrapperScript);
    await sandbox.commands.run("chmod +x /tmp/run_claude.sh");

    // Run Claude Code with very long timeout
    const result = await sandbox.commands.run("bash /tmp/run_claude.sh", {
      envs: {
        ANTHROPIC_API_KEY,
        HOME: "/home/user",
        CI: "true",
      },
      timeoutMs: 900000, // 15 minutes per command
    });

    // Try to read output file if specified
    let fileContent = "";
    if (outputFile) {
      try {
        fileContent = await sandbox.files.read(`${OUTPUT_DIR}/${outputFile}`);
      } catch {
        // Try to find any file with similar name
        const listResult = await sandbox.commands.run(
          `find ${OUTPUT_DIR} -type f 2>/dev/null || true`
        );
        const files = listResult.stdout.split("\n").filter((f: string) => f.trim());
        if (files.length > 0) {
          fileContent = await sandbox.files.read(files[0]);
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
