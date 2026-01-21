import {
  Phase1Results,
  Phase2Results,
  AggregatedPhase2Results,
} from "../types";

const OUTPUT_DIR = "/home/user/generated";

/**
 * Phase 3, Run 1: Scenario Modeling
 * Models 8 what-if scenarios for the estate plan
 */
export function buildScenarioModelingPrompt(
  phase1Results: Phase1Results,
  phase2Results: Phase2Results | AggregatedPhase2Results
): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/scenario_modeling.json

You are a scenario planning expert modeling 8 what-if scenarios.

## Prior Analysis
### Client Context
${JSON.stringify(phase1Results.clientContext, null, 2)}

### Document Inventory
${JSON.stringify(phase1Results.documentInventory, null, 2)}

### Phase 2 Analysis Results
${JSON.stringify(phase2Results, null, 2)}

## Required Scenarios (model all 8):
1. Primary Income Earner Dies Tomorrow
2. Both Spouses Die in Common Accident
3. Primary Earner Becomes Incapacitated
4. Key Beneficiary Predeceases
5. Child Divorces After Inheriting
6. Business Fails or Is Sold
7. Federal Estate Tax Exemption Sunsets (2026)
8. Long-Term Care Needed for 5+ Years

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/scenario_modeling.json with this structure:
{
  "scenarios": [
    {
      "id": number,
      "name": "string",
      "description": "string",
      "assumptions": ["string"],
      "currentOutcome": {
        "description": "string",
        "financialImpact": number,
        "familyImpact": "string",
        "legalIssues": ["string"]
      },
      "desiredOutcome": "string",
      "gaps": [
        {
          "gap": "string",
          "severity": "critical" | "high" | "medium",
          "fix": "string"
        }
      ],
      "financialImpact": number,
      "likelihood": "low" | "medium" | "high",
      "fixes": [
        {
          "action": "string",
          "cost": { "low": number, "high": number },
          "timeline": "string",
          "priority": number
        }
      ],
      "urgency": "immediate" | "soon" | "when-convenient"
    }
  ],
  "crossScenarioInsights": [
    {
      "insight": "string",
      "affectedScenarios": [number],
      "recommendation": "string"
    }
  ],
  "mostCriticalScenario": {
    "id": number,
    "reason": "string"
  },
  "overallPreparedness": {
    "score": number,
    "grade": "A" | "B" | "C" | "D" | "F",
    "summary": "string"
  }
}`;
}

/**
 * Phase 3, Run 2: Priority Matrix Development
 * Creates prioritized action matrix from all findings
 */
export function buildPriorityMatrixPrompt(
  phase1Results: Phase1Results,
  phase2Results: Phase2Results | AggregatedPhase2Results,
  scenarioResults: unknown
): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/priority_matrix.json

You are a prioritization specialist creating an action matrix from all findings.

## All Analysis Results
### Phase 1 - Research & Context
${JSON.stringify(phase1Results, null, 2)}

### Phase 2 - Deep Analysis
${JSON.stringify(phase2Results, null, 2)}

### Scenario Analysis
${JSON.stringify(scenarioResults, null, 2)}

## Prioritization Criteria
- Impact (35%): Financial impact, family protection, risk reduction
- Urgency (30%): Time-sensitive deadlines, risk of delay
- Cost-Effectiveness (20%): Cost to implement vs. benefit
- Complexity (15%): Ease of implementation, professional requirements

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/priority_matrix.json with this structure:
{
  "priorityMatrix": [
    {
      "rank": number,
      "action": "string",
      "category": "document" | "tax" | "protection" | "compliance" | "beneficiary",
      "description": "string",
      "impact": "critical" | "high" | "medium" | "low",
      "impactScore": number,
      "urgency": "immediate" | "30-days" | "90-days" | "12-months",
      "urgencyScore": number,
      "estimatedCost": { "low": number, "high": number },
      "estimatedBenefit": { "low": number, "high": number },
      "costEffectivenessScore": number,
      "complexity": "simple" | "moderate" | "complex",
      "complexityScore": number,
      "overallScore": number,
      "professionalNeeded": "attorney" | "cpa" | "financial-advisor" | "insurance-agent" | "self",
      "dependencies": ["string"],
      "riskOfDelay": "string",
      "deadline": "string or null"
    }
  ],
  "quickWins": [
    {
      "action": "string",
      "effort": "string",
      "benefit": "string"
    }
  ],
  "criticalPath": [
    {
      "step": number,
      "action": "string",
      "dependsOn": [number],
      "timeline": "string"
    }
  ],
  "budgetTiers": {
    "essential": {
      "totalCost": { "low": number, "high": number },
      "actions": [number]
    },
    "recommended": {
      "totalCost": { "low": number, "high": number },
      "actions": [number]
    },
    "comprehensive": {
      "totalCost": { "low": number, "high": number },
      "actions": [number]
    }
  },
  "timeline": {
    "immediate": [number],
    "30days": [number],
    "90days": [number],
    "12months": [number]
  }
}`;
}

/**
 * Phase 3, Run 3: Final Report Generation
 * Synthesizes all findings into comprehensive final report
 */
export function buildFinalReportPrompt(
  phase1Results: Phase1Results,
  phase2Results: Phase2Results | AggregatedPhase2Results,
  scenarioResults: unknown,
  priorityMatrix: unknown
): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/final_analysis.json

You are a senior estate planning attorney generating the final comprehensive analysis report.

## All Analysis Inputs
### Phase 1 - Research & Context
${JSON.stringify(phase1Results, null, 2)}

### Phase 2 - Deep Analysis
${JSON.stringify(phase2Results, null, 2)}

### Scenario Analysis
${JSON.stringify(scenarioResults, null, 2)}

### Priority Matrix
${JSON.stringify(priorityMatrix, null, 2)}

## Report Requirements
Generate a comprehensive report with:
- Overall Score (0-100) with Documents (30%), Tax (25%), Family Protection (25%), Compliance (20%)
- Executive Summary with key insight, critical issues, immediate actions
- Missing/Outdated Documents with consequences
- Financial Exposure (probate, estate tax, total)
- Tax Strategies with savings estimates
- State-Specific Notes for ${phase1Results.stateResearch?.state || "the state"}
- Prioritized Recommendations
- Uncertainty Log

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/final_analysis.json with this structure:
{
  "score": number,
  "overallScore": {
    "score": number,
    "grade": "A" | "B" | "C" | "D" | "F",
    "breakdown": {
      "documents": number,
      "tax": number,
      "familyProtection": number,
      "compliance": number
    },
    "summary": "string"
  },
  "executiveSummary": {
    "oneLineInsight": "string",
    "criticalIssues": ["string"],
    "immediateActions": ["string"],
    "opportunities": ["string"],
    "estimatedValueAtRisk": number,
    "estimatedSavingsOpportunity": number
  },
  "preAnalysisInsights": {
    "uniqueFactors": ["string"],
    "keyInsight": "string",
    "riskProfile": "low" | "moderate" | "high" | "critical"
  },
  "missingDocuments": [
    {
      "document": "string",
      "priority": "critical" | "high" | "medium" | "low",
      "reason": "string",
      "consequences": ["string"],
      "stateRequirements": "string",
      "estimatedCost": { "low": number, "high": number }
    }
  ],
  "outdatedDocuments": [
    {
      "document": "string",
      "issue": "string",
      "risk": "string",
      "recommendation": "string",
      "updateCost": { "low": number, "high": number }
    }
  ],
  "inconsistencies": [
    {
      "type": "beneficiary" | "provision" | "execution" | "other",
      "severity": "critical" | "high" | "medium",
      "issue": "string",
      "documents": ["string"],
      "resolution": "string"
    }
  ],
  "financialExposure": {
    "probate": number,
    "estateTax": {
      "federal": number,
      "state": number,
      "combined": number
    },
    "medicaid": number,
    "total": number,
    "notes": "string"
  },
  "taxStrategies": [
    {
      "strategy": "string",
      "applicability": "string",
      "estimatedSavings": { "low": number, "high": number },
      "complexity": "simple" | "moderate" | "complex",
      "timeline": "string"
    }
  ],
  "medicaidPlanning": {
    "riskLevel": "low" | "moderate" | "high",
    "currentExposure": number,
    "recommendedActions": ["string"],
    "timeline": "string"
  },
  "stateSpecificNotes": [
    {
      "topic": "string",
      "rule": "string",
      "impact": "string",
      "action": "string",
      "citation": "string"
    }
  ],
  "recommendations": [
    {
      "rank": number,
      "action": "string",
      "category": "string",
      "impact": "critical" | "high" | "medium" | "low",
      "urgency": "immediate" | "30-days" | "90-days" | "12-months",
      "estimatedCost": { "low": number, "high": number },
      "estimatedBenefit": { "low": number, "high": number },
      "professional": "string",
      "steps": ["string"]
    }
  ],
  "scenarioAnalysis": [
    {
      "scenario": "string",
      "currentOutcome": "string",
      "risk": "string",
      "recommendation": "string"
    }
  ],
  "priorityMatrix": [
    {
      "rank": number,
      "action": "string",
      "urgency": "string",
      "cost": { "low": number, "high": number }
    }
  ],
  "uncertaintyLog": {
    "assumptions": ["string"],
    "limitations": ["string"],
    "needsVerification": ["string"]
  },
  "targetStateSummary": {
    "currentState": "string",
    "targetState": "string",
    "gapCount": number,
    "criticalGaps": number,
    "estimatedCostToClose": { "low": number, "high": number },
    "estimatedTimeline": "string",
    "professionalHoursNeeded": number
  },
  "metadata": {
    "analysisDate": "string",
    "analysisType": "comprehensive",
    "phasesCompleted": number,
    "runsCompleted": number,
    "totalDurationMs": number
  }
}`;
}

// Export all Phase 3 prompt builders
export const phase3Prompts = {
  scenario_modeling: buildScenarioModelingPrompt,
  priority_matrix: buildPriorityMatrixPrompt,
  final_report: buildFinalReportPrompt,
};
