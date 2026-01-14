import { NextResponse } from "next/server";

// Extend Vercel function timeout
export const maxDuration = 300;

const E2B_API_URL = "/api/e2b/execute";

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

// Sophisticated scoring system based on multiple weighted criteria
function calculateScore(parsed: ParsedIntake, analysisResult: Record<string, unknown>): number {
  let score = 100; // Start with perfect score and deduct

  const hasWill = (parsed.existingDocs as { hasWill?: boolean })?.hasWill;
  const hasTrust = (parsed.existingDocs as { hasTrust?: boolean })?.hasTrust;
  const hasPOAFinancial = (parsed.existingDocs as { hasPOAFinancial?: boolean })?.hasPOAFinancial;
  const hasPOAHealthcare = (parsed.existingDocs as { hasPOAHealthcare?: boolean })?.hasPOAHealthcare;
  const hasHealthcareDirective = (parsed.existingDocs as { hasHealthcareDirective?: boolean })?.hasHealthcareDirective;

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

// Build comprehensive multi-pass prompt for autonomous Claude Code execution
function buildComprehensivePrompt(parsed: ParsedIntake): string {
  return `You are an elite estate planning analyst with expertise in tax law, elder law, and wealth transfer strategies. You have access to skill files that contain state-specific legal requirements.

CRITICAL INSTRUCTIONS:
1. First, read the skill file at /home/user/.claude/skills/us-estate-planning-analyzer/SKILL.md
2. If available, also read /home/user/.claude/skills/us-estate-planning-analyzer/references/${parsed.state.toLowerCase().replace(' ', '-')}.md for state-specific rules
3. Perform a COMPREHENSIVE multi-dimensional analysis
4. You MUST save your output as valid JSON to /home/user/generated/analysis.json using the Write tool

=== CLIENT PROFILE ===

STATE OF RESIDENCE: ${parsed.state}

PERSONAL INFORMATION:
${JSON.stringify(parsed.personal, null, 2)}

FAMILY STRUCTURE:
${JSON.stringify(parsed.family, null, 2)}

ASSET INVENTORY:
${JSON.stringify(parsed.assets, null, 2)}

EXISTING ESTATE PLANNING DOCUMENTS:
${JSON.stringify(parsed.existingDocs, null, 2)}

BENEFICIARY DESIGNATIONS ON FILE:
${parsed.beneficiaries.length > 0 ? JSON.stringify(parsed.beneficiaries, null, 2) : "NONE TRACKED - This is a significant gap"}

STATED GOALS AND WISHES:
${JSON.stringify(parsed.goals, null, 2)}

=== ANALYSIS FRAMEWORK ===

You must analyze this estate plan across ALL of the following dimensions:

**DIMENSION 1: DOCUMENT COMPLETENESS ANALYSIS**
- Identify ALL missing essential documents
- Assess document currency (anything > 3-5 years old needs review)
- Check for proper execution (witnesses, notarization as required by state)
- Evaluate document coordination (do they work together?)

**DIMENSION 2: FAMILY PROTECTION ANALYSIS**
- Minor children: guardian nominations, trusts for inheritance
- Disabled dependents: special needs trust requirements
- Blended families: QTIP trusts, separate property protection
- Aging parents: elder care planning considerations

**DIMENSION 3: ASSET PROTECTION & TRANSFER ANALYSIS**
- Probate exposure calculation (use state-specific statutory fees)
- Asset titling review (joint tenancy vs community property vs trust)
- Beneficiary designation audit (do they align with estate plan?)
- Business succession planning (if applicable)
- Creditor protection strategies

**DIMENSION 4: TAX OPTIMIZATION ANALYSIS**
- Federal estate tax exposure (current exemption $13.61M, sunset to ~$7M in 2026)
- State estate/inheritance tax (varies by state)
- Income tax considerations (step-up in basis planning)
- Gift tax strategies (annual exclusion, lifetime exemption)
- Generation-skipping transfer tax considerations

**DIMENSION 5: INCAPACITY PLANNING ANALYSIS**
- Financial management during incapacity
- Healthcare decision-making authority
- Digital asset access
- Business continuity during incapacity

**DIMENSION 6: LONG-TERM CARE & MEDICAID ANALYSIS**
- Medicaid/Medi-Cal eligibility risks
- Look-back period considerations (5 years federal, varies by state)
- Asset protection trust opportunities
- Long-term care insurance evaluation

**DIMENSION 7: SCENARIO MODELING**
Analyze what happens under these scenarios:
- Scenario A: Client dies tomorrow (current state)
- Scenario B: Client becomes incapacitated
- Scenario C: Spouse dies first (if married)
- Scenario D: Both parents die simultaneously (if minor children)
- Scenario E: Estate value doubles over next 10 years
- Scenario F: Federal exemption sunsets to $7M in 2026

=== OUTPUT REQUIREMENTS ===

You MUST save a JSON file to /home/user/generated/analysis.json with this EXACT structure:

{
  "analysisMetadata": {
    "analysisDate": "<current date>",
    "stateAnalyzed": "${parsed.state}",
    "analysisVersion": "2.0",
    "confidenceLevel": "<high, medium, or low based on data completeness>"
  },
  "overallScore": {
    "score": <0-100 calculated score>,
    "grade": "<A, B, C, D, or F>",
    "summary": "<2-3 sentence overall assessment>",
    "scoringBreakdown": {
      "documentCompleteness": {"score": <0-25>, "maxScore": 25, "details": "<explanation>"},
      "familyProtection": {"score": <0-20>, "maxScore": 20, "details": "<explanation>"},
      "assetProtection": {"score": <0-20>, "maxScore": 20, "details": "<explanation>"},
      "taxEfficiency": {"score": <0-15>, "maxScore": 15, "details": "<explanation>"},
      "incapacityPlanning": {"score": <0-10>, "maxScore": 10, "details": "<explanation>"},
      "longTermCarePlanning": {"score": <0-10>, "maxScore": 10, "details": "<explanation>"}
    }
  },
  "estateComplexity": {
    "level": "<simple, moderate, complex, or highly-complex>",
    "factors": ["<list factors contributing to complexity>"],
    "recommendedPlanningLevel": "<basic will-based, trust-based, or advanced multi-entity>"
  },
  "financialExposure": {
    "estimatedProbateCost": {
      "low": <number>,
      "high": <number>,
      "methodology": "<how calculated>"
    },
    "estimatedEstateTax": {
      "federal": <number>,
      "state": <number>,
      "notes": "<explanation of calculations>"
    },
    "potentialSavingsFromPlanning": {
      "probateAvoidance": <number>,
      "taxReduction": <number>,
      "assetProtection": <number>,
      "total": <number>
    }
  },
  "missingDocuments": [
    {
      "document": "<document name>",
      "priority": "<critical, high, medium, or low>",
      "urgency": "<immediate, within-30-days, within-90-days, or when-convenient>",
      "reason": "<detailed explanation>",
      "consequences": "<what happens without this document>",
      "estimatedCostToCreate": "<dollar range>",
      "estimatedCostOfNotHaving": "<dollar range or 'incalculable'>"
    }
  ],
  "outdatedDocuments": [
    {
      "document": "<document name>",
      "lastUpdated": "<date or 'unknown'>",
      "issue": "<what's outdated>",
      "risk": "<what could go wrong>",
      "recommendation": "<specific action>"
    }
  ],
  "inconsistencies": [
    {
      "type": "<beneficiary-mismatch, titling-issue, goal-conflict, or family-structure>",
      "issue": "<describe the inconsistency>",
      "details": "<specific details>",
      "risk": "<potential consequences>",
      "resolution": "<how to fix>"
    }
  ],
  "taxStrategies": [
    {
      "strategy": "<strategy name>",
      "type": "<income-tax, estate-tax, gift-tax, or capital-gains>",
      "applicability": "<why this applies to this client>",
      "estimatedSavings": "<dollar amount or range>",
      "complexity": "<simple, moderate, or complex>",
      "implementation": "<steps to implement>",
      "timeframe": "<when to implement>",
      "risks": "<potential downsides>"
    }
  ],
  "scenarioAnalysis": {
    "deathTomorrow": {
      "whatHappens": "<detailed description>",
      "whoInherits": "<beneficiary breakdown>",
      "probateRequired": <boolean>,
      "estimatedSettlementTime": "<timeframe>",
      "estimatedCosts": <number>,
      "familyImpact": "<description>",
      "minorChildrenImpact": "<description if applicable>"
    },
    "incapacity": {
      "whoManagesFinances": "<name or 'court-appointed conservator'>",
      "whoMakesMedicalDecisions": "<name or 'court-appointed'>",
      "accessToAccounts": "<description>",
      "businessContinuity": "<description if applicable>",
      "estimatedConservatorshipCost": <number>
    },
    "spouseDiesFirst": {
      "applicability": "<applicable or not-married>",
      "assetTransfer": "<description>",
      "taxImplications": "<description>",
      "portabilityElection": "<needed, not-needed, or not-applicable>"
    },
    "bothParentsDie": {
      "applicability": "<applicable or no-minor-children>",
      "guardianship": "<named guardian or 'court decides'>",
      "inheritanceManagement": "<trust, custodial account, or 'court supervision'>",
      "concerns": ["<list of concerns>"]
    },
    "estateDoubles": {
      "projectedValue": <number>,
      "newTaxExposure": "<description>",
      "planningChangesNeeded": ["<list of changes>"]
    },
    "exemptionSunset2026": {
      "currentExemption": 13610000,
      "projectedExemption": 7000000,
      "clientExposure": "<description>",
      "recommendedAction": "<specific recommendation>"
    }
  },
  "medicaidPlanning": {
    "riskLevel": "<low, moderate, high, or critical>",
    "currentExposure": "<description>",
    "lookbackConcerns": ["<list any transfers in lookback period>"],
    "protectionStrategies": [
      {
        "strategy": "<strategy name>",
        "effectiveness": "<description>",
        "timing": "<when to implement>",
        "cost": "<implementation cost>"
      }
    ],
    "longTermCareInsurance": {
      "recommended": <boolean>,
      "reason": "<explanation>",
      "estimatedPremium": "<if recommendable>"
    }
  },
  "stateSpecificConsiderations": [
    {
      "topic": "<topic>",
      "rule": "<state-specific rule>",
      "impact": "<how this affects the client>",
      "action": "<what to do about it>",
      "citation": "<legal citation>"
    }
  ],
  "prioritizedRecommendations": [
    {
      "rank": <number 1-N>,
      "action": "<specific action>",
      "category": "<documents, tax, asset-protection, family, or compliance>",
      "priority": "<critical, high, medium, or low>",
      "timeline": "<immediate, 30-days, 90-days, 6-months, or 1-year>",
      "estimatedCost": "<dollar range>",
      "estimatedBenefit": "<dollar range or description>",
      "dependsOn": ["<list of prerequisite actions by rank>"],
      "detailedSteps": ["<step 1>", "<step 2>", "..."]
    }
  ],
  "professionalReferrals": [
    {
      "professionalType": "<estate-attorney, CPA, financial-advisor, insurance-agent, or elder-law-attorney>",
      "reason": "<why this professional is needed>",
      "urgency": "<immediate, soon, or when-convenient>",
      "questionsToAsk": ["<list of questions for the professional>"]
    }
  ]
}

IMPORTANT:
- Calculate the score based on actual deficiencies found, NOT a default
- Be specific with dollar amounts when possible
- Reference state-specific laws by citation
- The score should reflect reality: missing critical documents = low score
- Use the Write tool to save the JSON file

Now perform the comprehensive analysis and save the results.`;
}

async function callE2B(prompt: string, baseUrl: string, outputFile: string): Promise<{ success: boolean; stdout?: string; fileContent?: string; error?: string }> {
  const response = await fetch(`${baseUrl}${E2B_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      outputFile,
      timeoutMs: 240000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { success: false, error: `E2B API call failed: ${response.status} ${errorText}` };
  }

  return response.json();
}

function extractJSON(result: { stdout?: string; fileContent?: string }): Record<string, unknown> | null {
  // Try file content first (most reliable)
  if (result.fileContent) {
    try {
      return JSON.parse(result.fileContent);
    } catch (e) {
      console.error("Failed to parse fileContent:", e);
    }
  }

  // Try to extract from stdout
  if (result.stdout) {
    // Try code block first
    const codeBlockMatch = result.stdout.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch (e) {
        console.error("Failed to parse code block JSON:", e);
      }
    }

    // Try to find raw JSON object
    const jsonStart = result.stdout.indexOf('{');
    const jsonEnd = result.stdout.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(result.stdout.substring(jsonStart, jsonEnd + 1));
      } catch (e) {
        console.error("Failed to parse raw JSON from stdout:", e);
      }
    }
  }

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

    // Build comprehensive prompt
    const prompt = buildComprehensivePrompt(parsed);

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Execute main analysis via Claude Code in E2B
    console.log("Starting comprehensive gap analysis...");
    const result = await callE2B(prompt, baseUrl, "analysis.json");

    if (!result.success) {
      throw new Error(result.error || "E2B execution failed");
    }

    // Extract and parse the JSON result
    let analysisResult = extractJSON(result);

    // Calculate score if not present or if we need to override
    if (analysisResult) {
      const calculatedScore = calculateScore(parsed, analysisResult);

      // If the analysis has a score, validate it; otherwise use calculated
      if (analysisResult.overallScore && typeof analysisResult.overallScore === 'object') {
        const overallScore = analysisResult.overallScore as Record<string, unknown>;
        // Use the higher confidence score (calculated vs AI-generated)
        const aiScore = typeof overallScore.score === 'number' ? overallScore.score : 50;
        // Blend the scores - trust AI more but validate with calculation
        overallScore.score = Math.round((aiScore * 0.7) + (calculatedScore * 0.3));
        overallScore.calculatedScore = calculatedScore;
        overallScore.aiGeneratedScore = aiScore;
      } else {
        // Create overallScore structure if missing
        analysisResult.overallScore = {
          score: calculatedScore,
          grade: calculatedScore >= 90 ? 'A' : calculatedScore >= 80 ? 'B' : calculatedScore >= 70 ? 'C' : calculatedScore >= 60 ? 'D' : 'F',
          summary: "Score calculated based on document completeness and estate planning best practices."
        };
      }

      // Also set top-level score for backward compatibility
      analysisResult.score = (analysisResult.overallScore as Record<string, unknown>).score;
    }

    // If parsing failed completely, create a detailed fallback
    if (!analysisResult) {
      const calculatedScore = calculateScore(parsed, {});
      analysisResult = {
        score: calculatedScore,
        overallScore: {
          score: calculatedScore,
          grade: calculatedScore >= 90 ? 'A' : calculatedScore >= 80 ? 'B' : calculatedScore >= 70 ? 'C' : calculatedScore >= 60 ? 'D' : 'F',
          summary: "Analysis completed but structured output could not be parsed. Review raw output for details.",
          calculatedScore: calculatedScore
        },
        estateComplexity: { level: "unknown", factors: ["Unable to parse AI analysis"] },
        missingDocuments: [],
        outdatedDocuments: [],
        inconsistencies: [],
        taxStrategies: [],
        scenarioAnalysis: {},
        medicaidPlanning: { riskLevel: "unknown" },
        stateSpecificConsiderations: [],
        prioritizedRecommendations: [{
          rank: 1,
          action: "Review raw analysis output and consult estate planning attorney",
          category: "documents",
          priority: "high",
          timeline: "immediate",
          estimatedCost: "Varies",
          estimatedBenefit: "Proper estate planning",
          dependsOn: [],
          detailedSteps: ["Review the raw analysis output below", "Consult with a licensed estate planning attorney"]
        }],
        professionalReferrals: [{
          professionalType: "estate-attorney",
          reason: "Comprehensive estate plan review needed",
          urgency: "soon",
          questionsToAsk: ["What documents do I need?", "How can I minimize probate costs?"]
        }],
        rawAnalysis: result.stdout
      };
    }

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
