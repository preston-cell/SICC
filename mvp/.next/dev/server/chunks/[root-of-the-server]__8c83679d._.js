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
    const { prompt, outputFile, timeoutMs = 240000, maxTurns = 5, enableWebSearch = false, runType } = options;
    const E2B_API_KEY = process.env.E2B_API_KEY;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!E2B_API_KEY || !ANTHROPIC_API_KEY) {
        return {
            success: false,
            error: "API keys not configured"
        };
    }
    // Create sandbox with very long timeout for comprehensive analysis
    // Quality is the priority - allow up to 60 minutes for thorough analysis
    const sandbox = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$e2b$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Sandbox"].create("base", {
        timeoutMs: 3600000,
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
        const commandOptions = {
            envs: {
                ANTHROPIC_API_KEY,
                HOME: "/home/user",
                CI: "true"
            },
            // Quality is priority - allow up to 55 minutes per command (leaving 5 min buffer for sandbox lifetime)
            // When timeoutMs is 0, use max. Otherwise use passed value or default 15 minutes.
            timeoutMs: timeoutMs === 0 ? 3300000 : timeoutMs || 900000
        };
        const result = await sandbox.commands.run("bash /tmp/run_claude.sh", commandOptions);
        // Log full output for debugging
        console.log("E2B execution completed:", {
            exitCode: result.exitCode,
            stdoutLength: result.stdout?.length || 0,
            stderrLength: result.stderr?.length || 0
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
                    result: typeof claudeOutput.result === 'string' ? claudeOutput.result.substring(0, 500) : claudeOutput.result
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
                const listResult = await sandbox.commands.run(`find ${OUTPUT_DIR} -type f 2>/dev/null || true`);
                const files = listResult.stdout.split("\n").filter((f)=>f.trim());
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
// Helper to get parsed client info for prompts
function getClientContext(parsed) {
    const existingDocs = parsed.existingDocs;
    const hasWill = toBool(existingDocs?.hasWill);
    const hasTrust = toBool(existingDocs?.hasTrust);
    const hasPOAFinancial = toBool(existingDocs?.hasPOAFinancial);
    const hasPOAHealthcare = toBool(existingDocs?.hasPOAHealthcare);
    const hasHealthcareDirective = toBool(existingDocs?.hasHealthcareDirective);
    const familyData = parsed.family;
    const children = familyData?.children || [];
    const hasMinorChildren = children.some((c)=>c.isMinor);
    const numberOfChildren = children.length;
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
    const personalData = parsed.personal;
    const isMarried = personalData?.maritalStatus === "married";
    const age = typeof personalData?.age === 'number' ? personalData.age : 0;
    const spouseAge = typeof personalData?.spouseAge === 'number' ? personalData.spouseAge : 0;
    const hasBusinessInterests = toBool(assetsData?.hasBusinessInterests) || toBool(assetsData?.ownsBusinessInterest);
    const hasRealEstate = toBool(assetsData?.hasRealEstate) || assetsData?.realEstateProperties?.length > 0;
    const hasRetirementAccounts = toBool(assetsData?.hasRetirementAccounts) || assetsData?.retirementAccounts?.length > 0;
    return {
        hasWill,
        hasTrust,
        hasPOAFinancial,
        hasPOAHealthcare,
        hasHealthcareDirective,
        hasMinorChildren,
        estimatedValue,
        isMarried,
        age,
        spouseAge,
        numberOfChildren,
        hasBusinessInterests,
        hasRealEstate,
        hasRetirementAccounts
    };
}
// Build comprehensive context accumulator
function buildContextAccumulator(parsed, ctx) {
    const personalData = parsed.personal;
    const familyData = parsed.family;
    const assetsData = parsed.assets;
    const goalsData = parsed.goals;
    return `
# ESTATE PLANNING CONTEXT ACCUMULATOR

## 1. IDENTITY & LIFE STAGE
- **Full Name:** ${personalData?.firstName || 'Unknown'} ${personalData?.lastName || ''}
- **Age:** ${ctx.age || 'Unknown'} years old
- **State of Residence:** ${parsed.state}
- **Marital Status:** ${ctx.isMarried ? 'Married' : personalData?.maritalStatus || 'Unknown'}
${ctx.isMarried ? `- **Spouse Age:** ${ctx.spouseAge || 'Unknown'}` : ''}
- **Life Stage Assessment:** ${ctx.age >= 70 ? 'Late retirement - focus on legacy, incapacity planning, and potential long-term care' : ctx.age >= 60 ? 'Pre-retirement/early retirement - estate tax planning window, beneficiary optimization' : ctx.age >= 45 ? 'Peak earning years - asset protection, education funding, retirement planning' : ctx.age >= 30 ? 'Family building years - minor children protection, insurance needs' : 'Early career - foundational documents needed'}

## 2. FAMILY STRUCTURE
- **Children:** ${ctx.numberOfChildren} ${ctx.numberOfChildren === 1 ? 'child' : 'children'}
- **Minor Children:** ${ctx.hasMinorChildren ? 'YES - Guardian nomination critical' : 'No'}
- **Named Guardian:** ${familyData?.guardian || 'NOT SPECIFIED'}
- **Family Complexity Indicators:**
  ${familyData?.isBlendedFamily ? '  - ⚠️ BLENDED FAMILY - requires careful beneficiary planning' : ''}
  ${familyData?.hasSpecialNeedsDependent ? '  - ⚠️ SPECIAL NEEDS DEPENDENT - SNT consideration required' : ''}
  ${familyData?.hasEstrangedRelatives ? '  - ⚠️ ESTRANGED RELATIVES - disinheritance provisions needed' : ''}
  ${!familyData?.isBlendedFamily && !familyData?.hasSpecialNeedsDependent ? '  - Standard family structure' : ''}

## 3. FINANCIAL NARRATIVE
- **Estimated Total Estate Value:** $${ctx.estimatedValue.toLocaleString()}
- **Estate Size Category:** ${ctx.estimatedValue >= 13610000 ? 'TAXABLE ESTATE (exceeds 2024 federal exemption of $13.61M)' : ctx.estimatedValue >= 5000000 ? 'LARGE ESTATE - tax planning critical before 2026 sunset' : ctx.estimatedValue >= 1000000 ? 'SUBSTANTIAL ESTATE - probate avoidance valuable' : ctx.estimatedValue >= 500000 ? 'MODERATE ESTATE - basic planning essential' : 'MODEST ESTATE - foundational documents needed'}
- **Asset Composition:**
  - Real Estate: ${ctx.hasRealEstate ? 'YES' : 'No'}
  - Business Interests: ${ctx.hasBusinessInterests ? 'YES - succession planning needed' : 'No'}
  - Retirement Accounts: ${ctx.hasRetirementAccounts ? 'YES - beneficiary designations critical' : 'No'}

## 4. CURRENT DOCUMENT STATUS
| Document | Status | Risk Level |
|----------|--------|------------|
| Last Will & Testament | ${ctx.hasWill ? '✅ EXISTS' : '❌ MISSING'} | ${ctx.hasWill ? 'Low' : 'CRITICAL'} |
| Revocable Living Trust | ${ctx.hasTrust ? '✅ EXISTS' : '❌ MISSING'} | ${ctx.hasTrust || ctx.estimatedValue < 500000 ? 'Low' : 'HIGH'} |
| Financial Power of Attorney | ${ctx.hasPOAFinancial ? '✅ EXISTS' : '❌ MISSING'} | ${ctx.hasPOAFinancial ? 'Low' : 'CRITICAL'} |
| Healthcare Power of Attorney | ${ctx.hasPOAHealthcare ? '✅ EXISTS' : '❌ MISSING'} | ${ctx.hasPOAHealthcare ? 'Low' : 'CRITICAL'} |
| Healthcare Directive/Living Will | ${ctx.hasHealthcareDirective ? '✅ EXISTS' : '❌ MISSING'} | ${ctx.hasHealthcareDirective ? 'Low' : 'HIGH'} |

## 5. STATED GOALS
${JSON.stringify(goalsData, null, 2)}

## 6. BENEFICIARY DESIGNATIONS
${parsed.beneficiaries.length > 0 ? parsed.beneficiaries.map((b)=>`- **${b.assetName}** (${b.assetType}): Primary: ${b.primaryBeneficiaryName} (${b.primaryBeneficiaryPercentage || 100}%)${b.contingentBeneficiaryName ? `, Contingent: ${b.contingentBeneficiaryName}` : ''}`).join('\n') : 'No beneficiary designations tracked - THIS IS A GAP'}

## 7. RISK INDICATORS
${ctx.hasBusinessInterests ? '- 🔴 Business succession risk - what happens to business at death/incapacity?' : ''}
${ctx.hasMinorChildren && !familyData?.guardian ? '- 🔴 No guardian nominated for minor children' : ''}
${ctx.estimatedValue > 1000000 && !ctx.hasTrust ? '- 🟠 No trust for $1M+ estate - probate exposure' : ''}
${!ctx.hasPOAFinancial ? '- 🔴 No financial POA - incapacity crisis risk' : ''}
${!ctx.hasPOAHealthcare ? '- 🔴 No healthcare POA - medical decision crisis risk' : ''}
${ctx.isMarried && ctx.spouseAge && Math.abs(ctx.age - ctx.spouseAge) > 10 ? '- 🟠 Significant age gap between spouses - survivorship planning important' : ''}
`;
}
// Build a QUICK analysis prompt - faster, essential findings only
function buildQuickAnalysisPrompt(parsed) {
    const ctx = getClientContext(parsed);
    return `You are an estate planning attorney reviewing a client's situation in ${parsed.state}.

## CLIENT SUMMARY
- State: ${parsed.state}
- Marital Status: ${ctx.isMarried ? 'Married' : 'Single'}
- Children: ${ctx.numberOfChildren} ${ctx.hasMinorChildren ? '(has minors)' : ''}
- Estimated Estate Value: $${ctx.estimatedValue.toLocaleString()}
- Has Will: ${ctx.hasWill ? 'Yes' : 'NO'}
- Has Trust: ${ctx.hasTrust ? 'Yes' : 'NO'}
- Has Financial POA: ${ctx.hasPOAFinancial ? 'Yes' : 'NO'}
- Has Healthcare POA: ${ctx.hasPOAHealthcare ? 'Yes' : 'NO'}
- Has Healthcare Directive: ${ctx.hasHealthcareDirective ? 'Yes' : 'NO'}
- Has Business: ${ctx.hasBusinessInterests ? 'Yes' : 'No'}
- Has Real Estate: ${ctx.hasRealEstate ? 'Yes' : 'No'}
- Has Retirement Accounts: ${ctx.hasRetirementAccounts ? 'Yes' : 'No'}

## ADDITIONAL DATA
${JSON.stringify({
        goals: parsed.goals,
        beneficiaries: parsed.beneficiaries
    }, null, 2)}

---

## TASK
Analyze this estate planning situation and write a JSON file to /home/user/generated/analysis.json with this structure:

{
  "score": <0-100, deduct: no will -15, no trust with $500K+ -10, no POAs -10 each, no directive -5>,
  "overallScore": {
    "score": <same as above>,
    "grade": "<A/B/C/D/F>",
    "summary": "<2 sentence assessment>"
  },
  "executiveSummary": {
    "oneLineSummary": "<key insight>",
    "criticalIssues": ["<issue 1>", "<issue 2>"],
    "immediateActions": ["<action 1>", "<action 2>"]
  },
  "missingDocuments": [
    {
      "document": "<name>",
      "priority": "<critical/high/medium>",
      "reason": "<why needed for THIS client>",
      "consequences": "<what happens without it>"
    }
  ],
  "outdatedDocuments": [
    {"document": "<name>", "issue": "<problem>", "risk": "<risk>", "recommendation": "<action>"}
  ],
  "inconsistencies": [
    {"type": "<type>", "severity": "<level>", "issue": "<description>", "resolution": "<fix>"}
  ],
  "financialExposure": {
    "estimatedProbateCost": {"low": <number>, "high": <number>},
    "estimatedEstateTax": {"federal": <number>, "state": <number>}
  },
  "stateSpecificNotes": [
    {"topic": "<topic>", "rule": "<${parsed.state} rule>", "impact": "<effect>", "action": "<recommendation>"}
  ],
  "recommendations": [
    {
      "rank": <1-5>,
      "action": "<specific recommendation>",
      "category": "<documents/tax/beneficiaries>",
      "priority": "<critical/high/medium>",
      "timeline": "<immediate/30-days/90-days>",
      "estimatedCost": {"low": <number>, "high": <number>}
    }
  ],
  "scoreBreakdown": {
    "startingScore": 100,
    "deductions": [
      {"reason": "<what's missing/wrong>", "points": <number deducted>, "category": "<documents/planning/beneficiaries>"}
    ],
    "finalScore": <calculated score>,
    "summary": "<1 sentence explaining the score>"
  }
}

Focus on the MOST IMPORTANT findings. Be concise. Write the JSON now.`;
}
// Build the comprehensive deep analysis prompt (for multi-phase mode)
function buildDeepAnalysisPrompt(parsed) {
    const ctx = getClientContext(parsed);
    const contextAccumulator = buildContextAccumulator(parsed, ctx);
    return `You are a senior estate planning attorney with 25+ years of experience in ${parsed.state}. You are conducting a thorough gap analysis that will be as valuable as a $500/hour consultation.

${contextAccumulator}

## RAW CLIENT DATA
${JSON.stringify({
        personal: parsed.personal,
        family: parsed.family,
        assets: parsed.assets,
        existingDocs: parsed.existingDocs,
        goals: parsed.goals
    }, null, 2)}

---

# DEEP ANALYSIS PROTOCOL

## PHASE 1: PRE-ANALYSIS REASONING (Think through before writing output)

### What makes this situation UNIQUE?
Consider: age, family structure, asset composition, state of residence, stated goals, existing documents

### What's the WORST thing that could happen?
For this specific client, enumerate the top 3 catastrophic scenarios given their current documents/situation.

### What would an experienced attorney notice IMMEDIATELY?
Flag obvious issues a professional would spot in 30 seconds of reviewing this case.

### What would they notice after 30 MINUTES of review?
Deeper issues requiring synthesis across documents, goals, and circumstances.

### What's the $50,000 insight?
The single most valuable finding that justifies professional analysis for THIS client.

---

## PHASE 2: MULTI-LAYER GAP ANALYSIS

Analyze EACH of these 6 layers:

### Layer 1: EXISTENCE GAPS
- What essential documents are COMPLETELY MISSING?
- What provisions are ABSENT from existing documents?
- What beneficiary designations are EMPTY or DEFAULT?

### Layer 2: ALIGNMENT GAPS
- Where do documents CONTRADICT stated goals?
- Where do documents CONTRADICT each other?
- Where do beneficiary designations CONTRADICT wills/trusts?

### Layer 3: OPTIMIZATION GAPS
- What tax strategies are AVAILABLE but unused?
- What estate planning techniques would benefit this client?
- What's the COST of current structure vs. optimal?

### Layer 4: RESILIENCE GAPS (Model each scenario)
- What happens if primary income earner dies tomorrow?
- What happens if both spouses die in common accident?
- What happens if client becomes incapacitated?
- What happens if a child divorces after inheriting?
- What happens if a beneficiary predeceases?
- What happens if federal estate tax exemption sunsets in 2026?

### Layer 5: EXECUTION GAPS
- Are documents properly executed for ${parsed.state}?
- Are assets properly titled to work with the estate plan?
- Are fiduciaries able and willing to serve?
- Is the plan discoverable in an emergency?

### Layer 6: TEMPORAL GAPS
- What life events should trigger plan review?
- What legal deadlines exist (tax elections, Medicaid lookback)?
- How old are existing documents? Are they stale?

---

## PHASE 3: OUTPUT GENERATION

Write a JSON file to /home/user/generated/analysis.json with this ENHANCED structure:

{
  "score": <number 0-100>,
  "overallScore": {
    "score": <number 0-100>,
    "grade": "<A/B/C/D/F>",
    "summary": "<2-3 sentence personalized assessment for THIS client>"
  },

  "preAnalysisInsights": {
    "uniqueFactors": ["<what makes this case unique>", "..."],
    "worstCaseScenarios": [
      {
        "scenario": "<description>",
        "likelihood": "<low/medium/high>",
        "financialImpact": "<dollar estimate>",
        "currentProtection": "<none/partial/full>"
      }
    ],
    "immediateRedFlags": ["<obvious issue 1>", "<obvious issue 2>"],
    "deeperInsights": ["<synthesis insight 1>", "<synthesis insight 2>"],
    "keyInsight": "<the single most valuable finding - the $50,000 insight>"
  },

  "missingDocuments": [
    {
      "document": "<full document name>",
      "priority": "<critical/high/medium/low>",
      "reason": "<2-3 sentences explaining why essential for THIS client specifically>",
      "consequences": "<specific real-world consequences if not addressed - be concrete>",
      "stateRequirements": "<${parsed.state} execution requirements: witnesses, notarization, etc.>",
      "estimatedCostToCreate": {"low": <number>, "high": <number>},
      "scenarioImpact": "<what happens in death/incapacity scenario without this document>",
      "questionsForAttorney": ["<specific question 1>", "<specific question 2>"]
    }
  ],

  "outdatedDocuments": [
    {
      "document": "<document name>",
      "issue": "<what's outdated or problematic>",
      "risk": "<specific risk this creates>",
      "recommendation": "<what to do>",
      "estimatedUpdateCost": {"low": <number>, "high": <number>}
    }
  ],

  "inconsistencies": [
    {
      "type": "<beneficiary mismatch/document conflict/goal misalignment>",
      "severity": "<critical/high/medium/low>",
      "issue": "<clear description of the inconsistency>",
      "document1": "<first document or source>",
      "document2": "<second document or source>",
      "potentialConsequence": "<what could go wrong>",
      "resolution": "<how to fix it>",
      "estimatedResolutionCost": {"low": <number>, "high": <number>}
    }
  ],

  "financialExposure": {
    "estimatedProbateCost": {
      "low": <number>,
      "high": <number>,
      "methodology": "<${parsed.state} statutory fee calculation with actual math>",
      "statutoryBasis": "<cite specific ${parsed.state} probate code section>"
    },
    "estimatedEstateTax": {
      "federal": <number based on current exemption>,
      "state": <number based on ${parsed.state} estate/inheritance tax>,
      "notes": "<explain calculation, mention 2026 sunset if relevant>"
    },
    "probateTimeEstimate": "<X-Y months typical for ${parsed.state}>",
    "assetsSubjectToProbate": <estimated dollar amount>
  },

  "taxStrategies": [
    {
      "strategy": "<strategy name>",
      "applicability": "<why specifically relevant for THIS client>",
      "estimatedSavings": {"low": <number>, "high": <number>},
      "complexity": "<low/medium/high>",
      "implementationSteps": ["<step 1>", "<step 2>", "<step 3>"],
      "professionalNeeded": "<type of professional required>",
      "timeToImplement": "<estimated timeline>"
    }
  ],

  "stateSpecificNotes": [
    {
      "topic": "<legal topic>",
      "rule": "<${parsed.state} specific rule - be precise>",
      "impact": "<how it specifically affects THIS client>",
      "action": "<what the client should do>",
      "citation": "<${parsed.state} statute or code section>"
    }
  ],

  "recommendations": [
    {
      "rank": <1-10>,
      "action": "<specific, actionable recommendation>",
      "category": "<documents/tax/beneficiaries/titling/insurance/other>",
      "priority": "<critical/high/medium/low>",
      "timeline": "<immediate/30-days/90-days/12-months>",
      "estimatedCost": {"low": <number>, "high": <number>},
      "estimatedBenefit": "<quantified benefit where possible>",
      "detailedSteps": [
        "<Step 1: specific action>",
        "<Step 2: specific action>",
        "<Step 3: specific action>"
      ],
      "professionalNeeded": "<estate attorney/CPA/financial advisor/none>",
      "riskOfDelay": "<what happens if this waits>",
      "questionsForAttorney": ["<question 1>", "<question 2>"]
    }
  ],

  "scenarioAnalysis": [
    {
      "scenario": "<death of primary earner/both spouses/incapacity/etc.>",
      "currentOutcome": "<what happens with current documents>",
      "desiredOutcome": "<what client presumably wants>",
      "gaps": ["<gap 1>", "<gap 2>"],
      "financialImpact": "<dollar estimate of gap>",
      "recommendedFixes": ["<fix 1>", "<fix 2>"]
    }
  ],

  "uncertaintyLog": {
    "informationGaps": [
      {
        "gap": "<what information is missing>",
        "impactOnAnalysis": "<how it limits conclusions>",
        "howToResolve": "<what client should provide>"
      }
    ],
    "assumptionsMade": [
      {
        "assumption": "<what was assumed>",
        "ifWrong": "<how conclusions would change>"
      }
    ],
    "confidenceLevels": {
      "overallAnalysis": "<high/medium/low>",
      "scoreAccuracy": "<high/medium/low>",
      "costEstimates": "<high/medium/low>"
    }
  },

  "targetStateSummary": {
    "ifAllRecommendationsImplemented": {
      "newScore": <projected score>,
      "protections": ["<what would be protected>"],
      "optimizations": ["<tax savings, efficiency gains>"],
      "alignments": ["<how plan matches goals>"],
      "survivedScenarios": ["<what scenarios plan now handles>"]
    },
    "comparisonTable": [
      {
        "metric": "<metric name>",
        "current": "<current state>",
        "target": "<target state>",
        "improvement": "<quantified improvement>"
      }
    ]
  },

  "executiveSummary": {
    "oneLineSummary": "<One sentence capturing the most important insight>",
    "criticalIssues": ["<issue 1 - most urgent>", "<issue 2>", "<issue 3>"],
    "immediateActions": ["<action 1 - do this week>", "<action 2>"],
    "biggestRisks": ["<risk 1>", "<risk 2>", "<risk 3>"],
    "biggestOpportunities": ["<opportunity 1>", "<opportunity 2>"]
  }
}

---

## SCORING GUIDE
Start at 100, deduct based on severity:
- No Will: -15 (critical)
- No Trust (estate >$500K): -10 (high)
- No Financial POA: -10 (critical)
- No Healthcare POA: -8 (critical)
- No Healthcare Directive: -5 (high)
- Minor children, no guardian: -10 (critical)
- Beneficiary misalignment: -5 to -10 depending on severity
- State probate exposure (high-cost state, no trust): -5
- Outdated documents (>5 years): -3 to -5

## QUALITY REQUIREMENTS
1. Every finding must cite specific client data that supports it
2. Every dollar estimate must show methodology
3. Every ${parsed.state} reference must include statute citation where applicable
4. Every recommendation must include specific next steps
5. No generic advice - everything must be personalized to THIS client
6. Acknowledge uncertainty where it exists
7. The output should feel like a senior attorney spent an hour reviewing the case

Write the complete JSON file now. Be thorough and specific.`;
}
// Attempt to repair truncated JSON by closing open brackets
function repairJSON(json) {
    let repaired = json.trim();
    // First, try to find where the JSON becomes invalid by parsing progressively
    // Find a valid truncation point
    let validEnd = repaired.length;
    // Try to parse, and if it fails, try truncating at different points
    for(let attempts = 0; attempts < 50; attempts++){
        try {
            // Try to find a good truncation point - look for complete objects/arrays
            let testJson = repaired.substring(0, validEnd);
            // Remove trailing incomplete content
            testJson = testJson.replace(/,\s*"[^"]*":\s*"[^"]*$/, ''); // incomplete string value
            testJson = testJson.replace(/,\s*"[^"]*":\s*\[[^\]]*$/, ''); // incomplete array
            testJson = testJson.replace(/,\s*"[^"]*":\s*\{[^}]*$/, ''); // incomplete object
            testJson = testJson.replace(/,\s*"[^"]*":\s*"?[^",}\]]*$/, '');
            testJson = testJson.replace(/,\s*"[^"]*":\s*$/, '');
            testJson = testJson.replace(/,\s*"[^"]*$/, '');
            testJson = testJson.replace(/,\s*$/, '');
            // Count and close brackets
            let openBraces = 0;
            let openBrackets = 0;
            let inString = false;
            let escapeNext = false;
            for (const char of testJson){
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
                testJson += '"';
            }
            // Close any open brackets/braces
            while(openBrackets > 0){
                testJson += ']';
                openBrackets--;
            }
            while(openBraces > 0){
                testJson += '}';
                openBraces--;
            }
            // Try parsing
            JSON.parse(testJson);
            return testJson;
        } catch (e) {
            // Get error position if available
            const errorMsg = e.message;
            const posMatch = errorMsg.match(/position (\d+)/);
            if (posMatch) {
                const errorPos = parseInt(posMatch[1], 10);
                // Truncate before the error and try again
                validEnd = Math.min(validEnd - 100, errorPos - 10);
            } else {
                validEnd -= 500;
            }
            if (validEnd < 1000) {
                break;
            }
        }
    }
    // Fallback: aggressive truncation to find last complete property
    // Find the last complete "key": value pattern
    const lastCompleteProperty = repaired.lastIndexOf('",');
    if (lastCompleteProperty > 1000) {
        let truncated = repaired.substring(0, lastCompleteProperty + 1);
        // Close brackets
        let openBraces = (truncated.match(/\{/g) || []).length - (truncated.match(/\}/g) || []).length;
        let openBrackets = (truncated.match(/\[/g) || []).length - (truncated.match(/\]/g) || []).length;
        while(openBrackets > 0){
            truncated += ']';
            openBrackets--;
        }
        while(openBraces > 0){
            truncated += '}';
            openBraces--;
        }
        try {
            JSON.parse(truncated);
            return truncated;
        } catch  {
        // Continue to original method
        }
    }
    // Original repair logic as final fallback
    repaired = repaired.replace(/,\s*"[^"]*":\s*"?[^",}\]]*$/, '');
    repaired = repaired.replace(/,\s*"[^"]*":\s*$/, '');
    repaired = repaired.replace(/,\s*"[^"]*$/, '');
    repaired = repaired.replace(/,\s*$/, '');
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
    if (inString) {
        repaired += '"';
    }
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
        try {
            const parsed = JSON.parse(result.fileContent);
            console.log("Successfully parsed fileContent, keys:", Object.keys(parsed));
            return parsed;
        } catch (e) {
            console.error("Failed to parse fileContent:", e);
            console.error("fileContent preview:", result.fileContent.substring(0, 500));
            // Try to repair truncated JSON
            try {
                console.log("Attempting to repair JSON, original length:", result.fileContent.length);
                const repaired = repairJSON(result.fileContent);
                console.log("Repaired JSON length:", repaired.length);
                const parsed = JSON.parse(repaired);
                console.log("Successfully parsed REPAIRED fileContent, keys:", Object.keys(parsed));
                return parsed;
            } catch (repairError) {
                console.error("Failed to repair JSON:", repairError);
                // Log the area around the error
                const errorMsg = repairError.message;
                const posMatch = errorMsg.match(/position (\d+)/);
                if (posMatch) {
                    const pos = parseInt(posMatch[1], 10);
                    console.error("Error context around position", pos, ":", result.fileContent.substring(Math.max(0, pos - 100), pos + 100));
                }
            }
        }
    }
    // Try to extract from stdout
    if (result.stdout) {
        console.log("Attempting to extract JSON from stdout, length:", result.stdout.length);
        console.log("stdout preview (first 500 chars):", result.stdout.substring(0, 500));
        console.log("stdout preview (last 500 chars):", result.stdout.slice(-500));
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
        // Try to find raw JSON object starting with {"score"
        const analysisMatch = result.stdout.match(/\{"score"[\s\S]*\}(?=\s*$|\s*\n\s*===)/);
        if (analysisMatch) {
            try {
                const parsed = JSON.parse(analysisMatch[0]);
                console.log("Successfully parsed analysis JSON from stdout, keys:", Object.keys(parsed));
                return parsed;
            } catch (e) {
                console.error("Failed to parse analysis JSON:", e);
            }
        }
        // Fallback: Try to find JSON starting with {"score"
        const jsonStart = result.stdout.indexOf('{"score"');
        if (jsonStart !== -1) {
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
                    // Try to repair truncated JSON
                    try {
                        const repaired = repairJSON(result.stdout.substring(jsonStart, jsonEnd + 1));
                        const parsed = JSON.parse(repaired);
                        console.log("Successfully parsed REPAIRED stdout JSON, keys:", Object.keys(parsed));
                        return parsed;
                    } catch (repairError) {
                        console.error("Failed to repair stdout JSON:", repairError);
                    }
                }
            }
        }
        // Try to find any JSON object containing analysis keys
        const anyJsonMatch = result.stdout.match(/\{[^{}]*"missingDocuments"[^{}]*[\s\S]*\}/);
        if (anyJsonMatch) {
            try {
                const parsed = JSON.parse(anyJsonMatch[0]);
                console.log("Successfully parsed JSON with missingDocuments key, keys:", Object.keys(parsed));
                return parsed;
            } catch (e) {
                // Try brace matching
                const start = result.stdout.indexOf(anyJsonMatch[0]);
                let braceCount = 0;
                let end = -1;
                for(let i = start; i < result.stdout.length; i++){
                    if (result.stdout[i] === '{') braceCount++;
                    if (result.stdout[i] === '}') {
                        braceCount--;
                        if (braceCount === 0) {
                            end = i;
                            break;
                        }
                    }
                }
                if (end !== -1) {
                    try {
                        const repaired = repairJSON(result.stdout.substring(start, end + 1));
                        const parsed = JSON.parse(repaired);
                        console.log("Successfully parsed repaired analysis JSON, keys:", Object.keys(parsed));
                        return parsed;
                    } catch  {
                        console.error("Failed to repair analysis JSON");
                    }
                }
            }
        }
    }
    console.error("extractJSON: No valid JSON found");
    console.error("Full stdout for debugging:", result.stdout?.slice(0, 2000));
    return null;
}
// Calculate score based on document completeness and risk factors
function calculateScore(parsed, analysisResult) {
    let score = 100;
    const ctx = getClientContext(parsed);
    // Core documents (40 points total)
    if (!ctx.hasWill) score -= 15;
    if (!ctx.hasPOAFinancial) score -= 10;
    if (!ctx.hasPOAHealthcare) score -= 8;
    if (!ctx.hasHealthcareDirective) score -= 7;
    // Trust consideration (15 points)
    if (!ctx.hasTrust) {
        if (ctx.estimatedValue > 1000000) score -= 15;
        else if (ctx.estimatedValue > 500000) score -= 10;
        else if (ctx.estimatedValue > 100000) score -= 5;
    }
    // Minor children (15 points)
    if (ctx.hasMinorChildren) {
        const familyData = parsed.family;
        if (!familyData?.guardian) score -= 10;
        if (!ctx.hasWill) score -= 5;
    }
    // Beneficiary tracking (10 points)
    if (parsed.beneficiaries.length === 0 && ctx.estimatedValue > 50000) {
        score -= 10;
    }
    // Marital considerations (10 points)
    if (ctx.isMarried) {
        if (!ctx.hasWill && !ctx.hasTrust) score -= 5;
        if (ctx.estimatedValue > 500000 && !ctx.hasTrust) score -= 5;
    }
    // High probate states (5 points)
    const highProbateStates = [
        "CA",
        "California",
        "NY",
        "New York",
        "FL",
        "Florida"
    ];
    if (highProbateStates.includes(parsed.state) && !ctx.hasTrust && ctx.estimatedValue > 100000) {
        score -= 5;
    }
    // Outdated documents penalty
    const outdatedDocs = analysisResult?.outdatedDocuments || [];
    if (outdatedDocs.length > 0) {
        score -= Math.min(5, outdatedDocs.length * 2);
    }
    return Math.max(0, Math.min(100, Math.round(score)));
}
async function POST(req) {
    try {
        const body = await req.json();
        const { intakeData, mode = "quick", estatePlanId } = body;
        if (!intakeData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Intake data is required"
            }, {
                status: 400
            });
        }
        // If comprehensive mode, redirect to orchestration endpoint
        if (mode === "comprehensive") {
            if (!estatePlanId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "estatePlanId is required for comprehensive analysis"
                }, {
                    status: 400
                });
            }
            // Forward to orchestration endpoint
            const orchestrateUrl = new URL("/api/gap-analysis/orchestrate", req.url);
            const orchestrateResponse = await fetch(orchestrateUrl.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    estatePlanId,
                    intakeData
                })
            });
            const orchestrateResult = await orchestrateResponse.json();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ...orchestrateResult,
                mode: "comprehensive"
            });
        }
        // Quick mode - single run with simplified prompt for faster results
        // Parse the intake data
        const parsed = parseIntakeData(intakeData);
        const ctx = getClientContext(parsed);
        console.log("Starting QUICK gap analysis...");
        console.log("Client context:", JSON.stringify(ctx));
        // Build simplified quick analysis prompt (faster, essential findings only)
        const prompt = buildQuickAnalysisPrompt(parsed);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$e2b$2d$executor$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeInE2B"])({
            prompt,
            outputFile: "analysis.json",
            timeoutMs: 300000,
            maxTurns: 5,
            runType: "quick_analysis"
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
            // Blend AI score with calculated score
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
                stateSpecificNotes: [],
                recommendations: [],
                scenarioAnalysis: [],
                preAnalysisInsights: {},
                uncertaintyLog: {},
                targetStateSummary: {},
                executiveSummary: {
                    criticalIssues: [],
                    immediateActions: [],
                    biggestRisks: []
                }
            };
        }
        // Ensure all arrays exist
        analysisResult.missingDocuments = analysisResult.missingDocuments || [];
        analysisResult.outdatedDocuments = analysisResult.outdatedDocuments || [];
        analysisResult.inconsistencies = analysisResult.inconsistencies || [];
        analysisResult.taxStrategies = analysisResult.taxStrategies || [];
        analysisResult.stateSpecificNotes = analysisResult.stateSpecificNotes || analysisResult.stateSpecificConsiderations || [];
        analysisResult.recommendations = analysisResult.recommendations || analysisResult.prioritizedRecommendations || [];
        analysisResult.scenarioAnalysis = analysisResult.scenarioAnalysis || [];
        console.log("Final deep analysis:", {
            score: analysisResult.score,
            missingDocsCount: analysisResult.missingDocuments.length,
            recommendationsCount: analysisResult.recommendations.length,
            stateNotesCount: analysisResult.stateSpecificNotes.length,
            hasPreAnalysisInsights: !!analysisResult.preAnalysisInsights,
            hasScenarioAnalysis: analysisResult.scenarioAnalysis.length > 0,
            hasUncertaintyLog: !!analysisResult.uncertaintyLog
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