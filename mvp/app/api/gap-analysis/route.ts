import { NextResponse } from "next/server";
import { executeInE2B } from "@/lib/e2b-executor";

// Extend Vercel function timeout (3 phases x 2 min each + buffer)
export const maxDuration = 600;

interface IntakeData {
  estatePlan: { stateOfResidence?: string };
  personal?: { data: string };
  family?: { data: string };
  assets?: { data: string };
  existingDocuments?: { data: string };
  goals?: { data: string };
  beneficiaryDesignations?: BeneficiaryDesignation[];
}

interface BeneficiaryDesignation {
  assetType: string;
  assetName: string;
  institution?: string;
  estimatedValue?: string;
  primaryBeneficiaryName: string;
  primaryBeneficiaryRelationship?: string;
  primaryBeneficiaryPercentage?: number;
  contingentBeneficiaryName?: string;
  contingentBeneficiaryRelationship?: string;
  contingentBeneficiaryPercentage?: number;
  lastReviewedDate?: string;
  notes?: string;
}

interface ParsedIntake {
  state: string;
  personal: Record<string, unknown>;
  family: Record<string, unknown>;
  assets: Record<string, unknown>;
  existingDocs: Record<string, unknown>;
  goals: Record<string, unknown>;
  beneficiaries: BeneficiaryDesignation[];
}

function parseIntakeData(intakeData: IntakeData): ParsedIntake {
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
    beneficiaries: intakeData.beneficiaryDesignations || [],
  };
}

// Helper to normalize yes/no/true/false to boolean
function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return lower === 'yes' || lower === 'true' || lower === '1';
  }
  return !!value;
}

// Sophisticated scoring system based on multiple weighted criteria
function calculateScore(parsed: ParsedIntake, analysisResult: Record<string, unknown>): number {
  let score = 100; // Start with perfect score and deduct

  // Handle both boolean and string "yes"/"no" values
  const existingDocs = parsed.existingDocs as Record<string, unknown>;
  const hasWill = toBool(existingDocs?.hasWill);
  const hasTrust = toBool(existingDocs?.hasTrust);
  const hasPOAFinancial = toBool(existingDocs?.hasPOAFinancial);
  const hasPOAHealthcare = toBool(existingDocs?.hasPOAHealthcare);
  const hasHealthcareDirective = toBool(existingDocs?.hasHealthcareDirective);

  const hasMinorChildren = (parsed.family as { children?: Array<{ isMinor?: boolean }> })?.children?.some(c => c.isMinor);
  const estimatedValue = (parsed.assets as { estimatedTotalValue?: number })?.estimatedTotalValue || 0;
  const isMarried = (parsed.personal as { maritalStatus?: string })?.maritalStatus === "married";

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
    const hasGuardian = (parsed.family as { guardian?: string })?.guardian;
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
  const highProbateStates = ["CA", "California", "NY", "New York", "FL", "Florida"];
  if (highProbateStates.includes(parsed.state) && !hasTrust && estimatedValue > 100000) {
    score -= 5;
  }

  // Document currency (5 points) - from analysis result
  const outdatedDocs = analysisResult?.outdatedDocuments as Array<unknown> || [];
  if (outdatedDocs.length > 0) {
    score -= Math.min(5, outdatedDocs.length * 2);
  }

  // Ensure score stays in valid range
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Helper to get parsed client info for prompts
function getClientContext(parsed: ParsedIntake): {
  hasWill: boolean;
  hasTrust: boolean;
  hasPOAFinancial: boolean;
  hasPOAHealthcare: boolean;
  hasMinorChildren: boolean;
  estimatedValue: number;
  isMarried: boolean;
} {
  const existingDocs = parsed.existingDocs as Record<string, unknown>;
  const hasWill = toBool(existingDocs?.hasWill);
  const hasTrust = toBool(existingDocs?.hasTrust);
  const hasPOAFinancial = toBool(existingDocs?.hasPOAFinancial);
  const hasPOAHealthcare = toBool(existingDocs?.hasPOAHealthcare);
  const hasMinorChildren = !!(parsed.family as { children?: Array<{ isMinor?: boolean }> })?.children?.some(c => c.isMinor);

  let estimatedValue = 0;
  const assetsData = parsed.assets as Record<string, unknown>;
  const rawValue = assetsData?.estimatedTotalValue || assetsData?.totalEstateValue;
  if (typeof rawValue === 'number') {
    estimatedValue = rawValue;
  } else if (typeof rawValue === 'string') {
    const valueMap: Record<string, number> = {
      'under_100k': 50000, '100k_500k': 300000, '500k_1m': 750000,
      '1m_2m': 1500000, '2m_5m': 3500000, '5m_plus': 7500000
    };
    estimatedValue = valueMap[rawValue] || parseInt(rawValue.replace(/[^0-9]/g, '')) || 0;
  }

  const isMarried = (parsed.personal as { maritalStatus?: string })?.maritalStatus === "married";

  return { hasWill, hasTrust, hasPOAFinancial, hasPOAHealthcare, hasMinorChildren, estimatedValue, isMarried };
}

// Single comprehensive prompt - runs in one sandbox session
function buildAnalysisPrompt(parsed: ParsedIntake): string {
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
${JSON.stringify({ personal: parsed.personal, family: parsed.family, assets: parsed.assets, goals: parsed.goals }, null, 2)}

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
  "outdatedDocuments": [
    {
      "document": "<document name>",
      "type": "<will/trust/poa_financial/poa_healthcare/etc>",
      "issue": "<specific issue - e.g., 'Created before marriage', 'Over 5 years old', 'Does not reflect current assets'>",
      "risk": "<what could go wrong if not updated>",
      "recommendation": "<specific action to take>",
      "yearsOld": <number or null if unknown>,
      "estimatedUpdateCost": {"low": <number>, "high": <number>}
    }
  ],
  "inconsistencies": [
    {
      "type": "<beneficiary_mismatch/naming_conflict/asset_discrepancy/guardian_conflict/etc>",
      "severity": "<critical/high/medium/low>",
      "issue": "<brief title of the inconsistency>",
      "details": "<detailed explanation of the conflict between documents or information>",
      "potentialConsequence": "<what could happen if not resolved - legal/financial impact>",
      "resolution": "<specific steps to fix this inconsistency>"
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
- Include 2-4 outdated documents if client has existing docs (consider: docs over 3+ years old, docs created before major life events like marriage/children/divorce, docs that don't reflect current asset levels)
- Include 2-4 inconsistencies if you detect conflicts (e.g., beneficiary designations that conflict with will, POA agents who are deceased/estranged, trust that doesn't include all assets, guardian nominations that conflict between documents)
- Calculate exact ${parsed.state} probate fees with statutory citations
- Provide 3-5 tax strategies with implementation steps
- List 5-7 ${parsed.state}-specific legal considerations with statute citations
- Give 8-10 prioritized recommendations with detailed steps

Write the complete JSON file now.`;
}

// Attempt to repair truncated JSON by closing open brackets
function repairJSON(json: string): string {
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

  for (const char of repaired) {
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
  while (openBrackets > 0) {
    repaired += ']';
    openBrackets--;
  }
  while (openBraces > 0) {
    repaired += '}';
    openBraces--;
  }

  return repaired;
}

function extractJSON(result: { stdout?: string; fileContent?: string }): Record<string, unknown> | null {
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
      for (let i = jsonStart; i < result.stdout.length; i++) {
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

export async function POST(req: Request) {
  try {
    const { intakeData } = await req.json();

    if (!intakeData) {
      return NextResponse.json({ error: "Intake data is required" }, { status: 400 });
    }

    // Parse the intake data
    const parsed = parseIntakeData(intakeData);
    const ctx = getClientContext(parsed);

    console.log("Starting gap analysis...");
    console.log("Client context:", JSON.stringify(ctx));

    // Build and execute single comprehensive prompt
    const prompt = buildAnalysisPrompt(parsed);
    const result = await executeInE2B({
      prompt,
      outputFile: "analysis.json",
      timeoutMs: 600000, // 10 minutes
    });

    console.log("E2B result:", {
      success: result.success,
      hasFileContent: !!result.fileContent,
      fileContentLength: result.fileContent?.length,
      error: result.error,
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
        const overallScore = analysisResult.overallScore as Record<string, unknown>;
        const aiScore = typeof overallScore.score === 'number' ? overallScore.score : calculatedScore;
        overallScore.score = Math.round((aiScore * 0.7) + (calculatedScore * 0.3));
        overallScore.calculatedScore = calculatedScore;
        overallScore.aiGeneratedScore = aiScore;
      } else {
        analysisResult.overallScore = {
          score: calculatedScore,
          grade: calculatedScore >= 90 ? 'A' : calculatedScore >= 80 ? 'B' : calculatedScore >= 70 ? 'C' : calculatedScore >= 60 ? 'D' : 'F',
          summary: "Score calculated based on document completeness and estate planning best practices."
        };
      }
      analysisResult.score = (analysisResult.overallScore as Record<string, unknown>).score;
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
        executiveSummary: { criticalIssues: [], immediateActions: [], biggestRisks: [] },
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
      missingDocsCount: (analysisResult.missingDocuments as unknown[]).length,
      recommendationsCount: (analysisResult.prioritizedRecommendations as unknown[]).length,
      stateNotesCount: (analysisResult.stateSpecificConsiderations as unknown[]).length,
    });

    return NextResponse.json({
      success: true,
      analysisResult,
      stdout: result.stdout,
    });

  } catch (error) {
    console.error("Gap analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
