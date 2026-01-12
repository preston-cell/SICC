"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getStateSpecificContent, getFinancialProfilePrompt } from "./stateSpecificAnalysis";

// Gap analysis action - analyzes estate planning intake data
export const runGapAnalysis = action({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
    const { Sandbox } = require("@e2b/sdk");

    // Fetch all intake data for this estate plan
    const intakeData = await ctx.runQuery(internal.gapAnalysisQueries.getIntakeDataForAnalysis, {
      estatePlanId,
    });

    if (!intakeData || !intakeData.estatePlan) {
      throw new Error("Estate plan not found");
    }

    // Create agent run record
    const runId: Id<"agentRuns"> = await ctx.runMutation(
      internal.mutations.createRun,
      { prompt: `Gap analysis for estate plan ${estatePlanId}` }
    );

    // Update run status
    await ctx.runMutation(internal.mutations.updateRun, {
      runId,
      status: "running",
    });

    let sandbox;
    try {
      // Build the analysis prompt
      const analysisPrompt = buildAnalysisPrompt(intakeData);

      // Create sandbox with explicit API key
      sandbox = await Sandbox.create({
        template: "base",
        timeoutMs: 300000,
        apiKey: process.env.E2B_API_KEY,
      });

      // Create Python script for analysis (using Anthropic API directly for structured output)
      const pythonScript = `
import os
import json
import anthropic

# Intake data for analysis
INTAKE_DATA = '''
${JSON.stringify(intakeData, null, 2).replace(/'/g, "\\'")}
'''

ANALYSIS_PROMPT = '''
${analysisPrompt.replace(/'/g, "\\'")}
'''

def run_analysis():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY missing")

    client = anthropic.Anthropic(api_key=api_key)

    response = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4000,
        messages=[
            {
                "role": "user",
                "content": ANALYSIS_PROMPT
            }
        ]
    )

    # Extract the text response
    result_text = "".join(block.text for block in response.content if block.type == "text")

    # Try to parse as JSON
    try:
        # Find JSON in the response
        start = result_text.find('{')
        end = result_text.rfind('}') + 1
        if start != -1 and end > start:
            json_str = result_text[start:end]
            result = json.loads(json_str)
            print("===JSON_START===")
            print(json.dumps(result, indent=2))
            print("===JSON_END===")
            return result
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")

    # If JSON parsing fails, return raw text
    print("===RAW_OUTPUT===")
    print(result_text)
    print("===RAW_END===")
    return {"raw": result_text}

if __name__ == "__main__":
    run_analysis()
`;

      await sandbox.files.write("/tmp/analysis.py", pythonScript);

      // Run the analysis
      const result = await sandbox.commands.run(
        "pip install -q anthropic && python /tmp/analysis.py",
        {
          envs: {
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
          },
          timeoutMs: 180000,
        }
      );

      const output = result.stdout + "\n" + (result.stderr || "");

      // Parse the JSON result from output
      let analysisResult;
      const jsonMatch = output.match(/===JSON_START===\n([\s\S]*?)\n===JSON_END===/);

      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.error("Failed to parse analysis JSON:", e);
          analysisResult = {
            score: 50,
            missingDocuments: [],
            outdatedDocuments: [],
            inconsistencies: [],
            recommendations: [{ action: "Review analysis output manually", priority: "medium", reason: "Automated parsing failed" }],
            stateSpecificNotes: [],
          };
        }
      } else {
        // Try to extract raw output
        const rawMatch = output.match(/===RAW_OUTPUT===\n([\s\S]*?)\n===RAW_END===/);
        analysisResult = {
          score: 50,
          missingDocuments: [],
          outdatedDocuments: [],
          inconsistencies: [],
          recommendations: [],
          stateSpecificNotes: [],
          rawAnalysis: rawMatch ? rawMatch[1] : output,
        };
      }

      // Save the gap analysis results
      await ctx.runMutation(internal.estatePlanning.saveGapAnalysis, {
        estatePlanId,
        runId,
        score: analysisResult.score || 50,
        estateComplexity: analysisResult.estateComplexity || undefined,
        estimatedEstateTax: analysisResult.estimatedEstateTax
          ? JSON.stringify(analysisResult.estimatedEstateTax)
          : undefined,
        missingDocuments: JSON.stringify(analysisResult.missingDocuments || []),
        outdatedDocuments: JSON.stringify(analysisResult.outdatedDocuments || []),
        inconsistencies: JSON.stringify(analysisResult.inconsistencies || []),
        taxOptimization: analysisResult.taxOptimization
          ? JSON.stringify(analysisResult.taxOptimization)
          : undefined,
        medicaidPlanning: analysisResult.medicaidPlanning
          ? JSON.stringify(analysisResult.medicaidPlanning)
          : undefined,
        recommendations: JSON.stringify(analysisResult.recommendations || []),
        stateSpecificNotes: JSON.stringify(analysisResult.stateSpecificNotes || []),
        rawAnalysis: analysisResult.rawAnalysis || output,
      });

      // Update run as completed
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "completed",
        output,
      });

      return {
        success: true,
        runId,
        analysisResult,
      };
    } catch (err: unknown) {
      const error = err as Error & { stdout?: string; stderr?: string };
      const errorOutput = `Error: ${error.message}\nStdout: ${error.stdout || ""}\nStderr: ${error.stderr || ""}`;

      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "failed",
        output: errorOutput,
        error: error.message,
      });

      return {
        success: false,
        runId,
        error: error.message,
      };
    } finally {
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

// Beneficiary designation type for type safety
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
function buildAnalysisPrompt(intakeData: {
  estatePlan: { stateOfResidence?: string };
  personal?: { data: string };
  family?: { data: string };
  assets?: { data: string };
  existingDocuments?: { data: string };
  goals?: { data: string };
  beneficiaryDesignations?: BeneficiaryDesignation[];
}): string {
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

  // Get state-specific analysis content
  const stateContent = getStateSpecificContent(state);
  const financialProfilePrompt = getFinancialProfilePrompt();

  // Build state-specific section if available
  let stateSpecificSection = '';
  if (stateContent.isSupported) {
    stateSpecificSection = `
=== STATE-SPECIFIC ANALYSIS REQUIREMENTS FOR ${state.toUpperCase()} ===

You MUST apply the following state-specific rules in your analysis:

${stateContent.complianceReference}

${stateContent.taxReference}

${stateContent.medicaidReference}

=== END STATE-SPECIFIC REQUIREMENTS ===
`;
  }

  return `You are an estate planning expert assistant. Analyze the following estate planning intake data and provide a comprehensive gap analysis.

STATE OF RESIDENCE: ${state}
${stateContent.isSupported ? `\n**ENHANCED ANALYSIS**: This state (${state}) has specialized analysis rules available. Apply them carefully.\n` : ''}

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

${financialProfilePrompt}

${stateSpecificSection}

Based on this information, provide a detailed gap analysis in the following JSON format:

{
  "score": <number 0-100 representing estate plan completeness>,
  "estateComplexity": "<low, moderate, or high based on financial profile>",
  "estimatedEstateTax": {
    "state": <estimated state estate tax in dollars, or 0 if below threshold>,
    "federal": <estimated federal estate tax in dollars, or 0 if below threshold>,
    "notes": "<explanation of tax exposure>"
  },
  "missingDocuments": [
    {
      "type": "<document type: will, trust, poa_financial, poa_healthcare, healthcare_directive, hipaa, credit_shelter_trust, ilit, homestead_declaration>",
      "priority": "<high, medium, or low>",
      "reason": "<why this document is needed based on their situation>",
      "estimatedImpact": "<dollar impact if applicable, e.g., 'Could save $X in estate taxes'>"
    }
  ],
  "outdatedDocuments": [
    {
      "type": "<document type>",
      "issue": "<what's outdated or needs updating>",
      "recommendation": "<what should be done>"
    }
  ],
  "inconsistencies": [
    {
      "issue": "<describe the inconsistency>",
      "details": "<specifics about the problem>",
      "recommendation": "<how to resolve>"
    }
  ],
  "taxOptimization": [
    {
      "strategy": "<strategy name, e.g., Credit Shelter Trust, ILIT, Gifting Program>",
      "applicability": "<why this applies to their situation>",
      "estimatedSavings": "<dollar amount or range>",
      "complexity": "<conservative, moderate, or advanced>",
      "priority": "<high, medium, or low>"
    }
  ],
  "medicaidPlanning": {
    "atRisk": <boolean - true if should consider Medicaid planning>,
    "concerns": ["<list of Medicaid-related concerns>"],
    "recommendations": ["<Medicaid planning recommendations>"],
    "lookbackIssues": ["<any 5-year look-back concerns>"]
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
      "note": "<state-specific consideration for ${state}>",
      "relevance": "<why this matters for their situation>",
      "citation": "<legal citation if applicable, e.g., MGL c. 190B, § 2-502>"
    }
  ]
}

Consider the following in your analysis:
1. Missing essential documents based on their family situation (e.g., minor children need guardian nominations)
2. Documents that may be outdated (created more than 5 years ago)
3. Inconsistencies between stated goals and existing documents
4. State-specific requirements and considerations for ${state}
5. Special situations like blended families, special needs beneficiaries, business ownership
6. Tax planning considerations based on estate value
7. Healthcare directives and end-of-life planning completeness

CRITICAL - BENEFICIARY DESIGNATION ANALYSIS:
8. Beneficiary designations on retirement accounts, life insurance, and TOD/POD accounts BYPASS the will entirely
9. Check if beneficiary designations are consistent with stated family and estate planning goals
10. Flag any potential conflicts, such as:
    - Ex-spouse still named as beneficiary
    - Children from previous marriage not included
    - Beneficiaries different from will beneficiaries without clear reason
    - Accounts without contingent beneficiaries
    - Outdated beneficiary designations (not reviewed recently)
11. For users with retirement accounts or life insurance but no beneficiary data tracked, recommend they verify and track their beneficiary designations

${stateContent.isSupported ? `
CRITICAL - ${state.toUpperCase()} SPECIFIC ANALYSIS:
12. Apply ALL state-specific compliance requirements from the reference material above
13. Calculate potential estate tax using state thresholds (e.g., MA $2M cliff effect)
14. Include Medicaid/MassHealth planning considerations if relevant
15. Reference specific statutes (e.g., MGL citations for Massachusetts)
16. Identify state-specific documents (e.g., Homestead Declaration in MA)
` : ''}

Respond ONLY with the JSON object, no additional text.`;
}
