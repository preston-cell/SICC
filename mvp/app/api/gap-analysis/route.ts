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

// Build the analysis prompt from intake data
function buildAnalysisPrompt(intakeData: IntakeData): string {
  const state = intakeData.estatePlan?.stateOfResidence || "Unknown";

  let personalData = {};
  let familyData = {};
  let assetsData = {};
  let existingDocsData = {};
  let goalsData = {};

  try {
    if (intakeData.personal?.data) personalData = JSON.parse(intakeData.personal.data);
    if (intakeData.family?.data) familyData = JSON.parse(intakeData.family.data);
    if (intakeData.assets?.data) assetsData = JSON.parse(intakeData.assets.data);
    if (intakeData.existingDocuments?.data) existingDocsData = JSON.parse(intakeData.existingDocuments.data);
    if (intakeData.goals?.data) goalsData = JSON.parse(intakeData.goals.data);
  } catch (e) {
    console.error("Error parsing intake data:", e);
  }

  const beneficiaryData = intakeData.beneficiaryDesignations || [];

  return `IMPORTANT: First, read the skill file at /home/user/.claude/skills/us-estate-planning-analyzer/SKILL.md to understand the estate planning analysis methodology.

You are an expert estate planning analyst. Use the methodology from the skill file to perform a comprehensive gap analysis.

Perform a comprehensive gap analysis of the following estate planning data.

STATE OF RESIDENCE: ${state}

=== INTAKE DATA ===

PERSONAL INFORMATION:
${JSON.stringify(personalData, null, 2)}

FAMILY INFORMATION:
${JSON.stringify(familyData, null, 2)}

ASSETS OVERVIEW:
${JSON.stringify(assetsData, null, 2)}

BENEFICIARY DESIGNATIONS (accounts that bypass the will):
${beneficiaryData.length > 0 ? JSON.stringify(beneficiaryData, null, 2) : "No beneficiary designations tracked"}

EXISTING DOCUMENTS:
${JSON.stringify(existingDocsData, null, 2)}

GOALS AND WISHES:
${JSON.stringify(goalsData, null, 2)}

=== ANALYSIS REQUIREMENTS ===

Analyze this estate plan comprehensively. Consider:

1. **Missing Documents**: What essential documents are missing based on their situation?
   - Will, Trust, POAs (financial & healthcare), Healthcare Directive, HIPAA
   - Consider family situation (minor children need guardian nominations)
   - Consider asset complexity (high value may need trust)

2. **Outdated Documents**: Any documents created more than 5 years ago?

3. **Inconsistencies**: Conflicts between stated goals and existing documents?
   - Beneficiary designations vs. will provisions
   - Ex-spouse still named on accounts?
   - Children from previous marriage not included?

4. **State-Specific Issues**: Requirements specific to ${state}

5. **Tax Planning**: Based on estate value, any tax optimization strategies?

6. **Beneficiary Conflicts**: Do retirement/insurance beneficiaries match will intentions?

=== OUTPUT FORMAT ===

CRITICAL: You MUST use the Write tool to save your analysis as a JSON file to: /home/user/generated/analysis.json

The JSON must follow this exact format:
{
  "score": <number 0-100 representing estate plan completeness>,
  "estateComplexity": "<low, moderate, or high>",
  "estimatedEstateTax": {
    "state": <estimated state estate tax in dollars>,
    "federal": <estimated federal estate tax in dollars>,
    "notes": "<explanation>"
  },
  "missingDocuments": [
    {
      "type": "<document type>",
      "priority": "<high, medium, or low>",
      "reason": "<why this document is needed>",
      "estimatedImpact": "<dollar impact if applicable>"
    }
  ],
  "outdatedDocuments": [
    {
      "type": "<document type>",
      "issue": "<what's outdated>",
      "recommendation": "<what should be done>"
    }
  ],
  "inconsistencies": [
    {
      "issue": "<describe the inconsistency>",
      "details": "<specifics>",
      "recommendation": "<how to resolve>"
    }
  ],
  "taxOptimization": [
    {
      "strategy": "<strategy name>",
      "applicability": "<why this applies>",
      "estimatedSavings": "<dollar amount>",
      "complexity": "<conservative, moderate, or advanced>",
      "priority": "<high, medium, or low>"
    }
  ],
  "medicaidPlanning": {
    "atRisk": <boolean>,
    "concerns": ["<list of concerns>"],
    "recommendations": ["<recommendations>"],
    "lookbackIssues": ["<5-year look-back concerns>"]
  },
  "recommendations": [
    {
      "action": "<specific action to take>",
      "priority": "<high, medium, or low>",
      "reason": "<why this is important>",
      "estimatedImpact": "<dollar impact if calculable>"
    }
  ],
  "stateSpecificNotes": [
    {
      "note": "<state-specific consideration>",
      "relevance": "<why this matters>",
      "citation": "<legal citation if applicable>"
    }
  ]
}

Perform the analysis now and save the results.`;
}

export async function POST(req: Request) {
  try {
    const { intakeData } = await req.json();

    if (!intakeData) {
      return NextResponse.json({ error: "Intake data is required" }, { status: 400 });
    }

    // Build the prompt
    const prompt = buildAnalysisPrompt(intakeData);

    // Get the base URL for the E2B API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    // Call the E2B execute endpoint
    const response = await fetch(`${baseUrl}${E2B_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        outputFile: "analysis.json",
        timeoutMs: 240000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`E2B API call failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "E2B execution failed");
    }

    // Parse the JSON result
    let analysisResult;

    // Try to read from file content first
    if (result.fileContent) {
      try {
        analysisResult = JSON.parse(result.fileContent);
      } catch {
        console.error("Failed to parse file content as JSON");
      }
    }

    // Try to extract JSON from stdout
    if (!analysisResult) {
      const jsonMatch = result.stdout?.match(/```json\n([\s\S]*?)\n```/) ||
                        result.stdout?.match(/\{[\s\S]*"score"[\s\S]*"recommendations"[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          const start = jsonStr.indexOf('{');
          const end = jsonStr.lastIndexOf('}') + 1;
          if (start !== -1 && end > start) {
            analysisResult = JSON.parse(jsonStr.substring(start, end));
          }
        } catch (e) {
          console.error("Failed to parse analysis JSON:", e);
        }
      }
    }

    // If we still don't have a result, create a default one
    if (!analysisResult) {
      analysisResult = {
        score: 50,
        missingDocuments: [],
        outdatedDocuments: [],
        inconsistencies: [],
        recommendations: [
          {
            action: "Review analysis output manually",
            priority: "medium",
            reason: "Automated parsing could not extract structured results"
          }
        ],
        stateSpecificNotes: [],
        rawAnalysis: result.stdout,
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
