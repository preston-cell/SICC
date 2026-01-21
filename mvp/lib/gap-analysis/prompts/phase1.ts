import { ParsedIntake, ClientContext } from "../types";

const OUTPUT_DIR = "/home/user/generated";

/**
 * Phase 1, Run 1: State Law Research
 * Uses Claude's knowledge to gather state-specific estate planning requirements
 */
export function buildStateLawResearchPrompt(state: string): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/state_research.json

You are researching ${state} estate planning law information.

You MUST create this file with this JSON structure:

{
  "state": "${state}",
  "researchDate": "${new Date().toISOString().split('T')[0]}",
  "estateTax": {
    "threshold": <number - state estate tax threshold or 0 if no state estate tax>,
    "rates": [{"bracket": "<range>", "rate": <percentage as decimal>}],
    "hasCliffEffect": <true/false>,
    "notes": "<any relevant notes about ${state} estate tax>"
  },
  "inheritanceTax": {
    "exists": <true/false>,
    "rates": [{"relationship": "<relationship type>", "rate": <percentage>}],
    "exemptions": ["<list of exemptions>"]
  },
  "medicaid": {
    "assetLimit": <number - individual asset limit>,
    "lookbackMonths": 60,
    "csra": <number - community spouse resource allowance>
  },
  "willRequirements": {
    "witnesses": <number - typically 2>,
    "notarization": "<required/optional/not_required>",
    "selfProving": <true/false>
  },
  "poaRequirements": {
    "statutoryFormRequired": <true/false>,
    "witnesses": <number>,
    "notarization": "<required/optional>"
  },
  "recentChanges": []
}

Use your Write tool now to create this file with actual values for ${state} law - do not use placeholders.`;
}

/**
 * Phase 1, Run 2: Client Context Deep Analysis
 * Analyzes client situation to identify unique factors and risks
 */
export function buildClientContextPrompt(
  parsed: ParsedIntake,
  clientContext: ClientContext
): string {
  const personalData = parsed.personal as Record<string, unknown>;
  const familyData = parsed.family as Record<string, unknown>;
  const assetsData = parsed.assets as Record<string, unknown>;
  const goalsData = parsed.goals as Record<string, unknown>;

  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/client_context.json

You are a senior estate planning analyst with 20+ years of experience.

## Task
Deeply analyze this client's situation to identify unique factors that require special attention.

## Client Profile

### Personal Information
- Name: ${personalData?.firstName || "Unknown"} ${personalData?.lastName || ""}
- Age: ${clientContext.age || "Unknown"}
- State: ${parsed.state}
- Marital Status: ${clientContext.isMarried ? "Married" : personalData?.maritalStatus || "Unknown"}
${clientContext.isMarried ? `- Spouse Age: ${clientContext.spouseAge || "Unknown"}` : ""}

### Family Structure
- Number of Children: ${clientContext.numberOfChildren}
- Minor Children: ${clientContext.hasMinorChildren ? "YES" : "No"}
- Guardian Named: ${familyData?.guardian || "NOT SPECIFIED"}
- Blended Family: ${familyData?.isBlendedFamily ? "YES" : "No"}
- Special Needs Dependent: ${familyData?.hasSpecialNeedsDependent ? "YES" : "No"}

### Financial Profile
- Estimated Estate Value: $${clientContext.estimatedValue.toLocaleString()}
- Real Estate: ${clientContext.hasRealEstate ? "Yes" : "No"}
- Business Interests: ${clientContext.hasBusinessInterests ? "Yes" : "No"}
- Retirement Accounts: ${clientContext.hasRetirementAccounts ? "Yes" : "No"}

### Current Documents
- Will: ${clientContext.hasWill ? "Yes" : "NO"}
- Trust: ${clientContext.hasTrust ? "Yes" : "NO"}
- Financial POA: ${clientContext.hasPOAFinancial ? "Yes" : "NO"}
- Healthcare POA: ${clientContext.hasPOAHealthcare ? "Yes" : "NO"}
- Healthcare Directive: ${clientContext.hasHealthcareDirective ? "Yes" : "NO"}

### Stated Goals
${JSON.stringify(goalsData, null, 2)}

### Beneficiary Designations
${parsed.beneficiaries.length > 0
  ? parsed.beneficiaries.map(b => `- ${b.assetName} (${b.assetType}): Primary: ${b.primaryBeneficiaryName}`).join("\n")
  : "No beneficiary designations provided"}

## Analysis Requirements

Think like an experienced estate planning attorney reviewing a new client file. Identify:

1. **5-10 Unique Factors** that make this situation different from a typical estate plan
   - What stands out about this client?
   - What would an experienced attorney notice immediately?

2. **Top 3 Worst-Case Scenarios** given current documents
   - What happens if the primary income earner dies tomorrow?
   - What happens if both spouses become incapacitated?
   - What are the biggest financial/legal exposures?

3. **Immediate Red Flags**
   - Critical gaps that need urgent attention
   - Situations that could cause immediate harm to the family

4. **Deeper Insights** requiring synthesis across multiple factors
   - Interactions between family structure and assets
   - Tax implications given estate size and state
   - Beneficiary designation conflicts

5. **The Key Insight** - What is the single most valuable finding?
   - The "$50,000 insight" that justifies the analysis
   - Something that might be missed in a standard review

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/client_context.json with this structure:
{
  "uniqueFactors": [
    { "factor": "string", "significance": "string", "recommendation": "string" }
  ],
  "worstCaseScenarios": [
    {
      "scenario": "string",
      "currentOutcome": "string",
      "desiredOutcome": "string",
      "financialImpact": number,
      "likelihood": "low" | "medium" | "high"
    }
  ],
  "immediateRedFlags": [
    { "flag": "string", "severity": "critical" | "high", "action": "string" }
  ],
  "deeperInsights": [
    { "insight": "string", "factors": ["string"], "recommendation": "string" }
  ],
  "keyInsight": "string - the most valuable single finding",
  "riskProfile": "low" | "moderate" | "high" | "critical",
  "complexityScore": number (1-10),
  "priorityAreas": ["string"] // Which analysis areas need most attention
}`;
}

/**
 * Phase 1, Run 3: Document Inventory
 * Creates complete inventory of existing and needed documents
 */
export function buildDocumentInventoryPrompt(
  parsed: ParsedIntake,
  clientContext: ClientContext
): string {
  const existingDocs = parsed.existingDocs as Record<string, unknown>;
  const goalsData = parsed.goals as Record<string, unknown>;

  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/document_inventory.json

You are an estate planning document specialist.

## Task
Create a complete inventory of existing documents and identify gaps based on client needs.

## Client Information
- State: ${parsed.state}
- Age: ${clientContext.age}
- Marital Status: ${clientContext.isMarried ? "Married" : "Single"}
- Minor Children: ${clientContext.hasMinorChildren ? "Yes" : "No"}
- Estimated Estate: $${clientContext.estimatedValue.toLocaleString()}
- Business Interests: ${clientContext.hasBusinessInterests ? "Yes" : "No"}

## Existing Documents Status
${JSON.stringify(existingDocs, null, 2)}

## Client Goals
${JSON.stringify(goalsData, null, 2)}

## Beneficiary Designations
${parsed.beneficiaries.length > 0
  ? JSON.stringify(parsed.beneficiaries, null, 2)
  : "None provided"}

## Analysis Requirements

1. **Catalog Existing Documents**
   - Document type
   - Estimated date (if available)
   - Key provisions (inferred from client info)
   - Current status (valid, needs review, outdated)

2. **Identify Missing Essential Documents**
   - Documents required for basic protection
   - Documents required given estate size
   - Documents required for state compliance
   - Documents required for stated goals

3. **Identify Outdated Documents**
   - Documents over 5 years old
   - Documents that may not reflect current law
   - Documents with outdated provisions

4. **Map Documents to Goals**
   - Which goals are currently addressed?
   - Which goals have no document support?

5. **Identify Coordination Issues**
   - Potential conflicts between documents
   - Beneficiary designation vs. will conflicts
   - Trust funding issues

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/document_inventory.json with this structure:
{
  "existingDocuments": [
    {
      "type": "will" | "trust" | "poa_financial" | "poa_healthcare" | "healthcare_directive" | "other",
      "status": "valid" | "needs_review" | "outdated" | "unknown",
      "estimatedDate": "string or null",
      "keyProvisions": ["string"],
      "concerns": ["string"]
    }
  ],
  "missingEssential": [
    {
      "document": "string",
      "priority": "critical" | "high" | "medium" | "low",
      "reason": "string",
      "consequences": ["string"],
      "stateRequirement": "string or null"
    }
  ],
  "outdated": [
    {
      "document": "string",
      "estimatedAge": number,
      "issues": ["string"],
      "updatePriority": "urgent" | "soon" | "routine"
    }
  ],
  "goalAlignment": {
    "goalName": {
      "addressed": boolean,
      "documents": ["string"],
      "gaps": ["string"]
    }
  },
  "coordinationIssues": [
    {
      "issue": "string",
      "documents": ["string"],
      "risk": "string",
      "resolution": "string"
    }
  ],
  "summary": {
    "totalExisting": number,
    "totalMissing": number,
    "criticalGaps": number,
    "overallReadiness": "well-prepared" | "partial" | "significant-gaps" | "unprepared"
  }
}`;
}

// Export all Phase 1 prompt builders
export const phase1Prompts = {
  state_law_research: buildStateLawResearchPrompt,
  client_context_analysis: buildClientContextPrompt,
  document_inventory: buildDocumentInventoryPrompt,
};
