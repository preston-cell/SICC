import {
  ParsedIntake,
  ClientContext,
  Phase1Results,
} from "../types";

const OUTPUT_DIR = "/home/user/generated";

/**
 * Phase 2, Run 1: Document Completeness Analysis
 */
export function buildDocumentCompletenessPrompt(
  phase1Results: Phase1Results,
  clientContext: ClientContext
): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/document_completeness.json

You are an estate planning compliance expert. Analyze document completeness against state requirements.

## Prior Analysis Results
### State Research
${JSON.stringify(phase1Results.stateResearch, null, 2)}

### Document Inventory
${JSON.stringify(phase1Results.documentInventory, null, 2)}

### Client Context
${JSON.stringify(phase1Results.clientContext, null, 2)}

## Analysis Requirements

1. **Compliance Issues** - Documents not meeting state requirements, missing language, execution defects
2. **Execution Defects** - Validity issues, missing signatures/witnesses, improper notarization
3. **Missing Provisions** - Standard provisions missing, state-required clauses
4. **State-Specific Gaps** - Requirements unique to ${phase1Results.stateResearch?.state || "the state"}

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/document_completeness.json with this structure:
{
  "complianceIssues": [
    {
      "document": "string",
      "issue": "string",
      "severity": "critical" | "high" | "medium",
      "stateRequirement": "string",
      "fix": "string",
      "estimatedCost": { "low": number, "high": number }
    }
  ],
  "executionDefects": [
    {
      "document": "string",
      "defect": "string",
      "impact": "invalid" | "voidable" | "challengeable",
      "remedy": "string"
    }
  ],
  "missingProvisions": [
    {
      "document": "string",
      "provision": "string",
      "importance": "required" | "recommended" | "optional",
      "reason": "string"
    }
  ],
  "stateSpecificGaps": [
    {
      "requirement": "string",
      "currentStatus": "string",
      "action": "string",
      "citation": "string"
    }
  ],
  "estimatedComplianceCost": { "low": number, "high": number },
  "prioritizedFixes": ["string"]
}`;
}

/**
 * Phase 2, Run 2: Tax Optimization Analysis
 */
export function buildTaxOptimizationPrompt(
  phase1Results: Phase1Results,
  clientContext: ClientContext,
  parsed: ParsedIntake
): string {
  const assetsData = parsed.assets as Record<string, unknown>;

  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/tax_optimization.json

You are an estate tax planning specialist analyzing tax optimization strategies.

## Client Financial Profile
- Estimated Estate: $${clientContext.estimatedValue.toLocaleString()}
- State: ${phase1Results.stateResearch?.state || "Unknown"}
- Marital Status: ${clientContext.isMarried ? "Married" : "Single"}
- Age: ${clientContext.age}
${clientContext.isMarried ? `- Spouse Age: ${clientContext.spouseAge}` : ""}

## State Tax Information
${JSON.stringify(phase1Results.stateResearch?.estateTax || {}, null, 2)}

## Asset Breakdown
${JSON.stringify(assetsData, null, 2)}

## Analysis Requirements
1. **Current Tax Exposure** - Federal estate tax (consider 2026 sunset), state tax, combined exposure
2. **Tax Optimization Strategies** - Gift tax, trust strategies, charitable, business strategies
3. **2026 Sunset Analysis** - Impact of exemption reduction, time-sensitive opportunities

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/tax_optimization.json with this structure:
{
  "currentExposure": {
    "federal": number,
    "state": number,
    "combined": number,
    "effectiveRate": number
  },
  "strategies": [
    {
      "name": "string",
      "type": "conservative" | "moderate" | "advanced",
      "description": "string",
      "estimatedSavings": { "low": number, "high": number },
      "implementationCost": { "low": number, "high": number },
      "timeline": "string",
      "prerequisites": ["string"],
      "risks": ["string"],
      "complexity": "simple" | "moderate" | "complex",
      "professionalNeeded": "string"
    }
  ],
  "sunsetAnalysis": {
    "currentExemption": number,
    "projectedExemption2026": number,
    "additionalExposure": number,
    "urgentActions": ["string"],
    "deadline": "string"
  },
  "totalPotentialSavings": { "low": number, "high": number },
  "recommendedPriority": ["string"]
}`;
}

/**
 * Phase 2, Run 3: Medicaid Planning Analysis
 */
export function buildMedicaidPlanningPrompt(
  phase1Results: Phase1Results,
  clientContext: ClientContext
): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/medicaid_planning.json

You are a Medicaid planning specialist analyzing long-term care planning needs.

## Client Profile
- Age: ${clientContext.age}
${clientContext.isMarried ? `- Spouse Age: ${clientContext.spouseAge}` : ""}
- Estimated Estate: $${clientContext.estimatedValue.toLocaleString()}
- State: ${phase1Results.stateResearch?.state || "Unknown"}

## State Medicaid Rules
${JSON.stringify(phase1Results.stateResearch?.medicaid || {}, null, 2)}

## Analysis Requirements
1. **Risk Assessment** - Likelihood of needing LTC, timeline, risk factors
2. **Current Exposure** - Assets at risk, monthly care cost, duration
3. **Protection Strategies** - Asset protection trusts, spousal protection, permissible transfers

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/medicaid_planning.json with this structure:
{
  "riskAssessment": {
    "likelihood": "low" | "moderate" | "high",
    "timeframe": "string",
    "factors": ["string"]
  },
  "currentExposure": {
    "assetsAtRisk": number,
    "monthlyCareCost": number,
    "maxExposure": number,
    "durationMonths": number
  },
  "lookbackConcerns": [
    {
      "transfer": "string",
      "date": "string",
      "amount": number,
      "penaltyPeriod": number,
      "recommendation": "string"
    }
  ],
  "strategies": [
    {
      "name": "string",
      "description": "string",
      "timeline": "string",
      "protection": number,
      "cost": { "low": number, "high": number },
      "risks": ["string"]
    }
  ],
  "spousalProtection": {
    "currentCSRA": number,
    "maximizationOptions": ["string"],
    "incomeProtection": "string",
    "homeProtection": "string"
  },
  "assetProtectionOptions": ["string"],
  "recommendedActions": ["string"],
  "urgency": "low" | "moderate" | "high" | "urgent"
}`;
}

/**
 * Phase 2, Run 4: Beneficiary Coordination Analysis
 */
export function buildBeneficiaryCoordinationPrompt(
  phase1Results: Phase1Results,
  parsed: ParsedIntake
): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/beneficiary_coordination.json

You are a beneficiary designation specialist analyzing for conflicts and optimization.

## Document Inventory
${JSON.stringify(phase1Results.documentInventory, null, 2)}

## Client Context
${JSON.stringify(phase1Results.clientContext, null, 2)}

## Beneficiary Designations
${JSON.stringify(parsed.beneficiaries, null, 2)}

## Analysis Requirements
1. **Conflicts Detection** - Designations vs. will, inconsistencies, outdated beneficiaries
2. **Missing Designations** - Accounts without beneficiaries, estate as beneficiary
3. **Coordination Issues** - Trust funding vs. designations, tax-inefficient designations
4. **Optimization Opportunities** - Tax-efficient ordering, trust as beneficiary

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/beneficiary_coordination.json with this structure:
{
  "conflicts": [
    {
      "asset1": "string",
      "asset2": "string",
      "issue": "string",
      "severity": "critical" | "high" | "medium",
      "resolution": "string"
    }
  ],
  "missingDesignations": [
    {
      "asset": "string",
      "currentStatus": "string",
      "risk": "string",
      "recommendation": "string"
    }
  ],
  "outdatedDesignations": [
    {
      "asset": "string",
      "currentBeneficiary": "string",
      "issue": "string",
      "recommendedAction": "string"
    }
  ],
  "coordinationIssues": [
    {
      "issue": "string",
      "assets": ["string"],
      "impact": "string",
      "fix": "string"
    }
  ],
  "optimizations": [
    {
      "opportunity": "string",
      "benefit": "string",
      "implementation": "string"
    }
  ],
  "recommendations": [
    {
      "priority": number,
      "action": "string",
      "reason": "string",
      "deadline": "string"
    }
  ]
}`;
}

/**
 * Phase 2, Run 5: Family Protection Analysis
 */
export function buildFamilyProtectionPrompt(
  phase1Results: Phase1Results,
  clientContext: ClientContext,
  parsed: ParsedIntake
): string {
  const familyData = parsed.family as Record<string, unknown>;

  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/family_protection.json

You are a family protection specialist analyzing protections for family members.

## Client Context
${JSON.stringify(phase1Results.clientContext, null, 2)}

## Family Structure
${JSON.stringify(familyData, null, 2)}

## Document Inventory
${JSON.stringify(phase1Results.documentInventory, null, 2)}

## Analysis Requirements
1. **Minor Children Protection** - Guardian nominations, trusts for minors, age of distribution
2. **Special Needs Planning** - SNT requirements, government benefits preservation
3. **Blended Family Considerations** - Protection for children from prior relationships
4. **Incapacity Protection** - POA adequacy, HIPAA authorizations
5. **Survivor Support** - Immediate cash availability, ongoing income

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/family_protection.json with this structure:
{
  "minorChildrenProtection": {
    "guardianNamed": boolean,
    "guardianSuitability": "string",
    "alternateGuardian": boolean,
    "trustForMinors": boolean,
    "trustType": "string",
    "ageOfDistribution": number,
    "gaps": ["string"],
    "recommendations": ["string"]
  },
  "specialNeedsPlanning": {
    "applicable": boolean,
    "sntInPlace": boolean,
    "sntType": "first-party" | "third-party" | "pooled" | null,
    "benefitsProtected": ["string"],
    "gaps": ["string"],
    "recommendations": ["string"]
  },
  "blendedFamilyIssues": [
    {
      "issue": "string",
      "affectedParties": ["string"],
      "risk": "string",
      "solution": "string"
    }
  ],
  "incapacityProtection": {
    "poaFinancial": {
      "exists": boolean,
      "adequate": boolean,
      "gaps": ["string"]
    },
    "poaHealthcare": {
      "exists": boolean,
      "adequate": boolean,
      "gaps": ["string"]
    },
    "hipaaAuth": boolean,
    "digitalAssets": boolean,
    "overallScore": number
  },
  "survivorSupport": {
    "immediateCash": "string",
    "ongoingIncome": "string",
    "gaps": ["string"]
  },
  "gaps": ["string"],
  "recommendations": [
    {
      "priority": number,
      "action": "string",
      "protects": ["string"],
      "cost": { "low": number, "high": number }
    }
  ]
}`;
}

/**
 * Phase 2, Run 6: Asset Protection Analysis
 */
export function buildAssetProtectionPrompt(
  phase1Results: Phase1Results,
  clientContext: ClientContext,
  parsed: ParsedIntake
): string {
  const assetsData = parsed.assets as Record<string, unknown>;

  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/asset_protection.json

You are an asset protection specialist analyzing protection needs and strategies.

## State Law Context
${JSON.stringify(phase1Results.stateResearch, null, 2)}

## Client Context
${JSON.stringify(phase1Results.clientContext, null, 2)}

## Assets
${JSON.stringify(assetsData, null, 2)}

## Analysis Requirements
1. **Vulnerability Assessment** - Assets exposed to creditors, liability risks
2. **Protection Strategies** - Exempt assets, trust-based protection, entity structuring
3. **Trust Options** - DAPTs, irrevocable trusts, FLPs
4. **Business Succession** - Succession plan, buy-sell agreements, valuation

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/asset_protection.json with this structure:
{
  "vulnerabilities": [
    {
      "asset": "string",
      "risk": "string",
      "exposure": number,
      "likelihood": "low" | "medium" | "high"
    }
  ],
  "protectionStrategies": [
    {
      "strategy": "string",
      "applicableAssets": ["string"],
      "protection": "string",
      "cost": { "low": number, "high": number },
      "timeline": "string",
      "limitations": ["string"]
    }
  ],
  "trustOptions": [
    {
      "type": "string",
      "description": "string",
      "protection": "string",
      "requirements": ["string"],
      "availableInState": boolean
    }
  ],
  "businessSuccession": {
    "applicable": boolean,
    "currentPlan": "string",
    "gaps": ["string"],
    "recommendations": ["string"],
    "buyerIdentified": boolean,
    "valuationNeeded": boolean
  },
  "recommendations": [
    {
      "priority": number,
      "strategy": "string",
      "protects": number,
      "cost": { "low": number, "high": number }
    }
  ],
  "totalExposure": number,
  "protectableAmount": number
}`;
}

/**
 * Phase 2, Run 7: Existing Document Review
 */
export function buildExistingDocumentReviewPrompt(
  phase1Results: Phase1Results,
  clientContext: ClientContext
): string {
  return `IMPORTANT: Your task is to create a JSON file. Use your Write tool to create the file ${OUTPUT_DIR}/document_review.json

You are a document review specialist analyzing existing documents for issues.

## State Requirements
${JSON.stringify(phase1Results.stateResearch, null, 2)}

## Document Inventory
${JSON.stringify(phase1Results.documentInventory, null, 2)}

## Client Context
${JSON.stringify(phase1Results.clientContext, null, 2)}

## Analysis Requirements
1. **Document Issues** - Technical defects, outdated provisions, ambiguous language
2. **Outdated Provisions** - References to old law, changed circumstances
3. **Missing Clauses** - Standard clauses missing, state-required language

## Required Output
You MUST use the Write tool to create ${OUTPUT_DIR}/document_review.json with this structure:
{
  "documentIssues": [
    {
      "document": "string",
      "issue": "string",
      "severity": "critical" | "high" | "medium" | "low",
      "location": "string",
      "recommendation": "string"
    }
  ],
  "outdatedProvisions": [
    {
      "document": "string",
      "provision": "string",
      "issue": "string",
      "currentLaw": "string",
      "update": "string"
    }
  ],
  "ambiguousLanguage": [
    {
      "document": "string",
      "language": "string",
      "interpretation1": "string",
      "interpretation2": "string",
      "recommendation": "string"
    }
  ],
  "missingClauses": [
    {
      "document": "string",
      "clause": "string",
      "purpose": "string",
      "importance": "required" | "recommended" | "optional"
    }
  ],
  "recommendations": [
    {
      "priority": number,
      "document": "string",
      "action": "string",
      "reason": "string"
    }
  ],
  "overallAssessment": {
    "documentsReviewed": number,
    "issuesFound": number,
    "criticalIssues": number,
    "recommendedActions": number
  }
}`;
}

// Export all Phase 2 prompt builders
export const phase2Prompts = {
  document_completeness: buildDocumentCompletenessPrompt,
  tax_optimization: buildTaxOptimizationPrompt,
  medicaid_planning: buildMedicaidPlanningPrompt,
  beneficiary_coordination: buildBeneficiaryCoordinationPrompt,
  family_protection: buildFamilyProtectionPrompt,
  asset_protection: buildAssetProtectionPrompt,
  existing_document_review: buildExistingDocumentReviewPrompt,
};
