module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/lib/e2b-executor.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "executeInE2B",
    ()=>executeInE2B
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$e2b$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/e2b/dist/index.mjs [app-route] (ecmascript)");
;
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
async function executeInE2B(options) {
    const { prompt, outputFile, timeoutMs = 240000 } = options;
    const E2B_API_KEY = process.env.E2B_API_KEY;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!E2B_API_KEY || !ANTHROPIC_API_KEY) {
        return {
            success: false,
            error: "API keys not configured"
        };
    }
    // Create sandbox with very long timeout for comprehensive analysis
    const sandbox = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$e2b$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Sandbox"].create("base", {
        timeoutMs: 1800000,
        apiKey: E2B_API_KEY
    });
    try {
        // Create directories
        await sandbox.commands.run(`mkdir -p ${OUTPUT_DIR}`);
        await sandbox.commands.run(`mkdir -p ${SKILLS_DIR}`);
        // Inject skills
        for (const [skillName, files] of Object.entries(SKILLS)){
            const skillDir = `${SKILLS_DIR}/${skillName}`;
            await sandbox.commands.run(`mkdir -p "${skillDir}"`);
            for (const [fileName, content] of Object.entries(files)){
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
                CI: "true"
            },
            timeoutMs: 900000
        });
        // Try to read output file if specified
        let fileContent = "";
        if (outputFile) {
            try {
                fileContent = await sandbox.files.read(`${OUTPUT_DIR}/${outputFile}`);
            } catch  {
                // Try to find any file with similar name
                const listResult = await sandbox.commands.run(`find ${OUTPUT_DIR} -type f 2>/dev/null || true`);
                const files = listResult.stdout.split("\n").filter((f)=>f.trim());
                if (files.length > 0) {
                    fileContent = await sandbox.files.read(files[0]);
                }
            }
        }
        // Extract metadata from JSON output (--output-format json)
        let metadata;
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
                        cacheCreationInputTokens: parsed.usage.cache_creation_input_tokens
                    } : undefined
                };
            }
        } catch  {
        // Metadata extraction is best-effort, don't fail if it doesn't work
        }
        return {
            success: true,
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.exitCode,
            fileContent,
            metadata
        };
    } finally{
        await sandbox.kill();
    }
}
}),
"[project]/app/api/gap-analysis/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$e2b$2d$executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/e2b-executor.ts [app-route] (ecmascript)");
;
;
const maxDuration = 600;
function parseIntakeData(intakeData) {
    const state = intakeData.estatePlan?.stateOfResidence || "Unknown";
    let personal = {};
    let family = {};
    let assets = {};
    let existingDocs = {};
    let goals = {};
    try {
        if (intakeData.personal?.data) personal = JSON.parse(intakeData.personal.data);
        if (intakeData.family?.data) family = JSON.parse(intakeData.family.data);
        if (intakeData.assets?.data) assets = JSON.parse(intakeData.assets.data);
        if (intakeData.existingDocuments?.data) existingDocs = JSON.parse(intakeData.existingDocuments.data);
        if (intakeData.goals?.data) goals = JSON.parse(intakeData.goals.data);
    } catch (e) {
        console.error("Error parsing intake data:", e);
    }
    return {
        state,
        personal,
        family,
        assets,
        existingDocs,
        goals,
        beneficiaries: intakeData.beneficiaryDesignations || []
    };
}
// Helper to normalize yes/no/true/false to boolean
function toBool(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const lower = value.toLowerCase();
        return lower === 'yes' || lower === 'true' || lower === '1';
    }
    return !!value;
}
// Sophisticated scoring system based on multiple weighted criteria
function calculateScore(parsed, analysisResult) {
    let score = 100; // Start with perfect score and deduct
    // Handle both boolean and string "yes"/"no" values
    const existingDocs = parsed.existingDocs;
    const hasWill = toBool(existingDocs?.hasWill);
    const hasTrust = toBool(existingDocs?.hasTrust);
    const hasPOAFinancial = toBool(existingDocs?.hasPOAFinancial);
    const hasPOAHealthcare = toBool(existingDocs?.hasPOAHealthcare);
    const hasHealthcareDirective = toBool(existingDocs?.hasHealthcareDirective);
    const hasMinorChildren = parsed.family?.children?.some((c)=>c.isMinor);
    const estimatedValue = parsed.assets?.estimatedTotalValue || 0;
    const isMarried = parsed.personal?.maritalStatus === "married";
    // Core documents (40 points total)
    if (!hasWill) score -= 15; // Will is essential
    if (!hasPOAFinancial) score -= 10; // Financial POA critical for incapacity
    if (!hasPOAHealthcare) score -= 8; // Healthcare POA critical
    if (!hasHealthcareDirective) score -= 7; // Living will important
    // Trust consideration (15 points) - more important for higher estates
    if (!hasTrust) {
        if (estimatedValue > 1000000) score -= 15; // High value estates need trust
        else if (estimatedValue > 500000) score -= 10;
        else if (estimatedValue > 100000) score -= 5;
    }
    // Minor children considerations (15 points)
    if (hasMinorChildren) {
        const hasGuardian = parsed.family?.guardian;
        if (!hasGuardian) score -= 10; // Guardian nomination critical
        if (!hasWill) score -= 5; // Will even more important with minors
    }
    // Beneficiary alignment (10 points)
    if (parsed.beneficiaries.length === 0 && estimatedValue > 50000) {
        score -= 10; // Should track beneficiary designations
    }
    // Marital considerations (10 points)
    if (isMarried) {
        if (!hasWill && !hasTrust) score -= 5; // Married couples need estate docs
        if (estimatedValue > 500000 && !hasTrust) score -= 5; // Consider trust for asset protection
    }
    // State-specific compliance (5 points)
    // Deduct if in high-cost probate state without trust
    const highProbateStates = [
        "CA",
        "California",
        "NY",
        "New York",
        "FL",
        "Florida"
    ];
    if (highProbateStates.includes(parsed.state) && !hasTrust && estimatedValue > 100000) {
        score -= 5;
    }
    // Document currency (5 points) - from analysis result
    const outdatedDocs = analysisResult?.outdatedDocuments || [];
    if (outdatedDocs.length > 0) {
        score -= Math.min(5, outdatedDocs.length * 2);
    }
    // Ensure score stays in valid range
    return Math.max(0, Math.min(100, Math.round(score)));
}
// Helper to get parsed client info for prompts
function getClientContext(parsed) {
    const existingDocs = parsed.existingDocs;
    const hasWill = toBool(existingDocs?.hasWill);
    const hasTrust = toBool(existingDocs?.hasTrust);
    const hasPOAFinancial = toBool(existingDocs?.hasPOAFinancial);
    const hasPOAHealthcare = toBool(existingDocs?.hasPOAHealthcare);
    const hasMinorChildren = !!parsed.family?.children?.some((c)=>c.isMinor);
    let estimatedValue = 0;
    const assetsData = parsed.assets;
    const rawValue = assetsData?.estimatedTotalValue || assetsData?.totalEstateValue;
    if (typeof rawValue === 'number') {
        estimatedValue = rawValue;
    } else if (typeof rawValue === 'string') {
        const valueMap = {
            'under_100k': 50000,
            '100k_500k': 300000,
            '500k_1m': 750000,
            '1m_2m': 1500000,
            '2m_5m': 3500000,
            '5m_plus': 7500000
        };
        estimatedValue = valueMap[rawValue] || parseInt(rawValue.replace(/[^0-9]/g, '')) || 0;
    }
    const isMarried = parsed.personal?.maritalStatus === "married";
    return {
        hasWill,
        hasTrust,
        hasPOAFinancial,
        hasPOAHealthcare,
        hasMinorChildren,
        estimatedValue,
        isMarried
    };
}
// Single comprehensive prompt - runs in one sandbox session
function buildAnalysisPrompt(parsed) {
    const ctx = getClientContext(parsed);
    return `You are an expert ${parsed.state} estate planning attorney. Analyze this client and write a comprehensive JSON report.

## CLIENT PROFILE
- State: ${parsed.state}
- Marital Status: ${ctx.isMarried ? "Married" : "Single"}
- Estate Value: $${ctx.estimatedValue.toLocaleString()}
- Minor Children: ${ctx.hasMinorChildren ? "Yes" : "No"}

## CURRENT DOCUMENTS
- Will: ${ctx.hasWill ? "YES" : "NO - CRITICAL GAP"}
- Trust: ${ctx.hasTrust ? "YES" : "NO"}
- Financial POA: ${ctx.hasPOAFinancial ? "YES" : "NO - CRITICAL GAP"}
- Healthcare POA: ${ctx.hasPOAHealthcare ? "YES" : "NO - CRITICAL GAP"}

## CLIENT DATA
${JSON.stringify({
        personal: parsed.personal,
        family: parsed.family,
        assets: parsed.assets,
        goals: parsed.goals
    }, null, 2)}

## YOUR TASK
Write a JSON file to /home/user/generated/analysis.json with this structure:

{
  "overallScore": {
    "score": <number 0-100>,
    "grade": "<A/B/C/D/F>",
    "summary": "<2-3 sentence assessment>"
  },
  "missingDocuments": [
    {
      "document": "<full document name>",
      "priority": "<critical/high/medium>",
      "reason": "<why essential for THIS client - 2-3 sentences>",
      "consequences": "<specific ${parsed.state} legal/financial consequences>",
      "estimatedCostToCreate": {"low": <number>, "high": <number>},
      "stateRequirements": "<${parsed.state} execution requirements>"
    }
  ],
  "financialExposure": {
    "estimatedProbateCost": {
      "low": <number>,
      "high": <number>,
      "methodology": "<${parsed.state} statutory fee calculation showing math>",
      "statutoryBasis": "<cite ${parsed.state} probate code>"
    },
    "estimatedEstateTax": {"federal": <number>, "state": <number>}
  },
  "taxStrategies": [
    {
      "strategy": "<name>",
      "applicability": "<why relevant to THIS client>",
      "estimatedSavings": {"low": <number>, "high": <number>},
      "implementationSteps": ["<step1>", "<step2>", "<step3>"]
    }
  ],
  "stateSpecificConsiderations": [
    {
      "topic": "<legal topic>",
      "rule": "<${parsed.state} specific rule>",
      "impact": "<how it affects THIS client>",
      "action": "<what to do>",
      "citation": "<${parsed.state} statute>"
    }
  ],
  "prioritizedRecommendations": [
    {
      "rank": <1-10>,
      "action": "<specific action>",
      "priority": "<critical/high/medium>",
      "timeline": "<immediate/30-days/90-days>",
      "estimatedCost": {"low": <number>, "high": <number>},
      "detailedSteps": ["<step1>", "<step2>", "<step3>", "<step4>"],
      "riskOfDelay": "<consequence of not acting>"
    }
  ],
  "executiveSummary": {
    "criticalIssues": ["<issue1>", "<issue2>", "<issue3>"],
    "immediateActions": ["<action1>", "<action2>"],
    "biggestRisks": ["<risk1>", "<risk2>", "<risk3>"]
  }
}

## SCORING GUIDE
Start at 100, deduct: No Will=-15, No Trust(>$500K)=-10, No FinPOA=-10, No HealthPOA=-8, Minor children no guardian=-10

## REQUIREMENTS
- Include 4-6 missing documents with detailed ${parsed.state}-specific consequences
- Calculate exact ${parsed.state} probate fees with statutory citations
- Provide 3-5 tax strategies with implementation steps
- List 5-7 ${parsed.state}-specific legal considerations with statute citations
- Give 8-10 prioritized recommendations with detailed steps

Write the complete JSON file now.`;
}
// Attempt to repair truncated JSON by closing open brackets
function repairJSON(json) {
    let repaired = json.trim();
    // Remove trailing incomplete key-value pairs (e.g., `"key":` or `"key": "incomplete`)
    // Look for patterns at the end that indicate truncation
    repaired = repaired.replace(/,\s*"[^"]*":\s*"?[^",}\]]*$/, '');
    repaired = repaired.replace(/,\s*"[^"]*":\s*$/, '');
    repaired = repaired.replace(/,\s*"[^"]*$/, '');
    repaired = repaired.replace(/,\s*$/, '');
    // Count open brackets
    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;
    let escapeNext = false;
    for (const char of repaired){
        if (escapeNext) {
            escapeNext = false;
            continue;
        }
        if (char === '\\') {
            escapeNext = true;
            continue;
        }
        if (char === '"') {
            inString = !inString;
            continue;
        }
        if (!inString) {
            if (char === '{') openBraces++;
            if (char === '}') openBraces--;
            if (char === '[') openBrackets++;
            if (char === ']') openBrackets--;
        }
    }
    // If we're in a string, close it
    if (inString) {
        repaired += '"';
    }
    // Close any open brackets/braces
    while(openBrackets > 0){
        repaired += ']';
        openBrackets--;
    }
    while(openBraces > 0){
        repaired += '}';
        openBraces--;
    }
    return repaired;
}
function extractJSON(result) {
    console.log("extractJSON called, fileContent length:", result.fileContent?.length || 0, "stdout length:", result.stdout?.length || 0);
    // Try file content first (most reliable)
    if (result.fileContent && result.fileContent.trim()) {
        // First try direct parse
        try {
            const parsed = JSON.parse(result.fileContent);
            console.log("Successfully parsed fileContent, keys:", Object.keys(parsed));
            return parsed;
        } catch (e) {
            console.error("Failed to parse fileContent:", e);
            console.error("fileContent preview:", result.fileContent.substring(0, 500));
            // Try to repair truncated JSON
            try {
                const repaired = repairJSON(result.fileContent);
                const parsed = JSON.parse(repaired);
                console.log("Successfully parsed REPAIRED fileContent, keys:", Object.keys(parsed));
                return parsed;
            } catch (repairError) {
                console.error("Failed to repair JSON:", repairError);
            }
        }
    }
    // Try to extract from stdout
    if (result.stdout) {
        // Try code block first
        const codeBlockMatch = result.stdout.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
        if (codeBlockMatch) {
            try {
                const parsed = JSON.parse(codeBlockMatch[1]);
                console.log("Successfully parsed code block JSON, keys:", Object.keys(parsed));
                return parsed;
            } catch (e) {
                console.error("Failed to parse code block JSON:", e);
            }
        }
        // Try to find raw JSON object - look for analysis.json content pattern
        const analysisMatch = result.stdout.match(/\{"overallScore"[\s\S]*\}(?=\s*$|\s*\n\s*===)/);
        if (analysisMatch) {
            try {
                const parsed = JSON.parse(analysisMatch[0]);
                console.log("Successfully parsed analysis JSON from stdout, keys:", Object.keys(parsed));
                return parsed;
            } catch (e) {
                console.error("Failed to parse analysis JSON:", e);
            }
        }
        // Fallback: Try to find any large JSON object
        const jsonStart = result.stdout.indexOf('{"overallScore"');
        if (jsonStart !== -1) {
            // Find the matching closing brace
            let braceCount = 0;
            let jsonEnd = -1;
            for(let i = jsonStart; i < result.stdout.length; i++){
                if (result.stdout[i] === '{') braceCount++;
                if (result.stdout[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        jsonEnd = i;
                        break;
                    }
                }
            }
            if (jsonEnd !== -1) {
                try {
                    const parsed = JSON.parse(result.stdout.substring(jsonStart, jsonEnd + 1));
                    console.log("Successfully parsed JSON with brace matching, keys:", Object.keys(parsed));
                    return parsed;
                } catch (e) {
                    console.error("Failed to parse JSON with brace matching:", e);
                }
            }
        }
    }
    console.error("extractJSON: No valid JSON found");
    return null;
}
async function POST(req) {
    try {
        const { intakeData } = await req.json();
        if (!intakeData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Intake data is required"
            }, {
                status: 400
            });
        }
        // Parse the intake data
        const parsed = parseIntakeData(intakeData);
        const ctx = getClientContext(parsed);
        console.log("Starting gap analysis...");
        console.log("Client context:", JSON.stringify(ctx));
        // Build and execute single comprehensive prompt
        const prompt = buildAnalysisPrompt(parsed);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$e2b$2d$executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeInE2B"])({
            prompt,
            outputFile: "analysis.json",
            timeoutMs: 600000
        });
        console.log("E2B result:", {
            success: result.success,
            hasFileContent: !!result.fileContent,
            fileContentLength: result.fileContent?.length,
            error: result.error
        });
        if (!result.success) {
            throw new Error(result.error || "E2B execution failed");
        }
        // Extract JSON from result
        let analysisResult = extractJSON(result);
        // Calculate and validate score
        const calculatedScore = calculateScore(parsed, analysisResult || {});
        if (analysisResult) {
            if (analysisResult.overallScore && typeof analysisResult.overallScore === 'object') {
                const overallScore = analysisResult.overallScore;
                const aiScore = typeof overallScore.score === 'number' ? overallScore.score : calculatedScore;
                overallScore.score = Math.round(aiScore * 0.7 + calculatedScore * 0.3);
                overallScore.calculatedScore = calculatedScore;
                overallScore.aiGeneratedScore = aiScore;
            } else {
                analysisResult.overallScore = {
                    score: calculatedScore,
                    grade: calculatedScore >= 90 ? 'A' : calculatedScore >= 80 ? 'B' : calculatedScore >= 70 ? 'C' : calculatedScore >= 60 ? 'D' : 'F',
                    summary: "Score calculated based on document completeness and estate planning best practices."
                };
            }
            analysisResult.score = analysisResult.overallScore.score;
        } else {
            // Fallback if parsing failed
            analysisResult = {
                score: calculatedScore,
                overallScore: {
                    score: calculatedScore,
                    grade: calculatedScore >= 90 ? 'A' : calculatedScore >= 80 ? 'B' : calculatedScore >= 70 ? 'C' : calculatedScore >= 60 ? 'D' : 'F',
                    summary: "Analysis completed. Please review the details below."
                },
                missingDocuments: [],
                outdatedDocuments: [],
                inconsistencies: [],
                taxStrategies: [],
                stateSpecificConsiderations: [],
                prioritizedRecommendations: [],
                executiveSummary: {
                    criticalIssues: [],
                    immediateActions: [],
                    biggestRisks: []
                }
            };
        }
        // Ensure arrays exist
        analysisResult.missingDocuments = analysisResult.missingDocuments || [];
        analysisResult.outdatedDocuments = analysisResult.outdatedDocuments || [];
        analysisResult.inconsistencies = analysisResult.inconsistencies || [];
        analysisResult.taxStrategies = analysisResult.taxStrategies || [];
        analysisResult.stateSpecificConsiderations = analysisResult.stateSpecificConsiderations || [];
        analysisResult.prioritizedRecommendations = analysisResult.prioritizedRecommendations || [];
        console.log("Final analysis:", {
            score: analysisResult.score,
            missingDocsCount: analysisResult.missingDocuments.length,
            recommendationsCount: analysisResult.prioritizedRecommendations.length,
            stateNotesCount: analysisResult.stateSpecificConsiderations.length
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            analysisResult,
            stdout: result.stdout
        });
    } catch (error) {
        console.error("Gap analysis error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c83679d._.js.map