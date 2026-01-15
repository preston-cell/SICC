"use node";

/**
 * Gap Analysis Action - Using Claude Code in E2B
 *
 * This action analyzes estate planning intake data by:
 * 1. Fetching intake data from the database
 * 2. Calling the Next.js API route which runs Claude Code in E2B
 * 3. Claude Code uses the us-estate-planning-analyzer skill to produce comprehensive analysis
 * 4. Saving the analysis results to the database
 */

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getStateSpecificContent, getFinancialProfilePrompt } from "./stateSpecificAnalysis";

// Gap analysis action - analyzes estate planning intake data using Claude Code via API route
export const runGapAnalysis = action({
  args: { estatePlanId: v.id("estatePlans") },
  handler: async (ctx, { estatePlanId }) => {
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

    try {
      // Build the analysis prompt
      const analysisPrompt = buildAnalysisPrompt(intakeData);

      // Call the Next.js API route for E2B execution
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/e2b/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: analysisPrompt,
          outputFile: "analysis.json",
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

      // Parse the JSON result from output
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

      // Save the gap analysis results
      await ctx.runMutation(internal.estatePlanning.saveGapAnalysis, {
        estatePlanId,
        runId,
        score: analysisResult.score || 50,
        estateComplexity: analysisResult.estateComplexity
          ? JSON.stringify(analysisResult.estateComplexity)
          : undefined,
        estimatedEstateTax: (analysisResult.estimatedEstateTax || analysisResult.financialExposure?.estimatedEstateTax)
          ? JSON.stringify(analysisResult.estimatedEstateTax || analysisResult.financialExposure?.estimatedEstateTax)
          : undefined,
        missingDocuments: JSON.stringify(analysisResult.missingDocuments || []),
        outdatedDocuments: JSON.stringify(analysisResult.outdatedDocuments || []),
        inconsistencies: JSON.stringify(analysisResult.inconsistencies || []),
        taxOptimization: (analysisResult.taxOptimization || analysisResult.taxStrategies)
          ? JSON.stringify(analysisResult.taxOptimization || analysisResult.taxStrategies)
          : undefined,
        medicaidPlanning: analysisResult.medicaidPlanning
          ? JSON.stringify(analysisResult.medicaidPlanning)
          : undefined,
        recommendations: JSON.stringify(analysisResult.recommendations || analysisResult.prioritizedRecommendations || []),
        stateSpecificNotes: JSON.stringify(analysisResult.stateSpecificNotes || analysisResult.stateSpecificConsiderations || []),
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

  return `You are an expert estate planning analyst using the us-estate-planning-analyzer skill.

Perform a comprehensive gap analysis of the following estate planning data.

STATE OF RESIDENCE: ${state}
${stateContent.isSupported ? `\n**ENHANCED ANALYSIS**: This state (${state}) has specialized analysis rules available. Apply them carefully.\n` : ''}

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

${financialProfilePrompt}

${stateSpecificSection}

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

Save your analysis as JSON to: /home/user/generated/analysis.json

Use this exact format:
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
