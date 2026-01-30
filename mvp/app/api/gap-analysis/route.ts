import { NextResponse } from "next/server";
import { executeInE2B } from "@/lib/e2b-executor";
import { STATE_REQUIREMENTS } from "@/lib/documentTemplates/will";

// Extend Vercel function timeout (comprehensive analysis needs time)
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
  let personal: Record<string, unknown> = {};
  let family: Record<string, unknown> = {};
  let assets: Record<string, unknown> = {};
  let existingDocs: Record<string, unknown> = {};
  let goals: Record<string, unknown> = {};

  try {
    if (intakeData.personal?.data) personal = JSON.parse(intakeData.personal.data);
    if (intakeData.family?.data) family = JSON.parse(intakeData.family.data);
    if (intakeData.assets?.data) assets = JSON.parse(intakeData.assets.data);
    if (intakeData.existingDocuments?.data) existingDocs = JSON.parse(intakeData.existingDocuments.data);
    if (intakeData.goals?.data) goals = JSON.parse(intakeData.goals.data);
  } catch (e) {
    console.error("Error parsing intake data:", e);
  }

  // Get state from estatePlan first, then fall back to personal data
  // Note: The personal intake form stores state as "state" field, not "stateOfResidence"
  const state = intakeData.estatePlan?.stateOfResidence
    || (personal.state as string)
    || (personal.stateOfResidence as string)
    || "Unknown";

  console.log("parseIntakeData - state:", state, "from estatePlan:", intakeData.estatePlan?.stateOfResidence, "from personal.state:", personal.state, "from personal.stateOfResidence:", personal.stateOfResidence);
  console.log("parseIntakeData - personal keys:", Object.keys(personal));
  console.log("parseIntakeData - family keys:", Object.keys(family));
  console.log("parseIntakeData - assets keys:", Object.keys(assets));
  console.log("parseIntakeData - existingDocs keys:", Object.keys(existingDocs));

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

// Helper to get parsed client info for prompts
function getClientContext(parsed: ParsedIntake): {
  hasWill: boolean;
  hasTrust: boolean;
  hasPOAFinancial: boolean;
  hasPOAHealthcare: boolean;
  hasHealthcareDirective: boolean;
  hasMinorChildren: boolean;
  estimatedValue: number;
  isMarried: boolean;
  age: number;
  spouseAge: number;
  numberOfChildren: number;
  hasBusinessInterests: boolean;
  hasRealEstate: boolean;
  hasRetirementAccounts: boolean;
} {
  const existingDocs = parsed.existingDocs as Record<string, unknown>;
  const hasWill = toBool(existingDocs?.hasWill);
  const hasTrust = toBool(existingDocs?.hasTrust);
  const hasPOAFinancial = toBool(existingDocs?.hasPOAFinancial);
  const hasPOAHealthcare = toBool(existingDocs?.hasPOAHealthcare);
  const hasHealthcareDirective = toBool(existingDocs?.hasHealthcareDirective);

  const familyData = parsed.family as Record<string, unknown>;
  const children = (familyData?.children as Array<{ isMinor?: boolean }>) || [];
  const hasMinorChildren = children.some(c => c.isMinor);
  const numberOfChildren = children.length;

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

  const personalData = parsed.personal as Record<string, unknown>;
  const isMarried = personalData?.maritalStatus === "married";
  const age = typeof personalData?.age === 'number' ? personalData.age : 0;
  const spouseAge = typeof personalData?.spouseAge === 'number' ? personalData.spouseAge : 0;

  const hasBusinessInterests = toBool(assetsData?.hasBusinessInterests) || toBool(assetsData?.ownsBusinessInterest);
  const hasRealEstate = toBool(assetsData?.hasRealEstate) || (assetsData?.realEstateProperties as unknown[])?.length > 0;
  const hasRetirementAccounts = toBool(assetsData?.hasRetirementAccounts) || (assetsData?.retirementAccounts as unknown[])?.length > 0;

  return {
    hasWill, hasTrust, hasPOAFinancial, hasPOAHealthcare, hasHealthcareDirective,
    hasMinorChildren, estimatedValue, isMarried, age, spouseAge, numberOfChildren,
    hasBusinessInterests, hasRealEstate, hasRetirementAccounts
  };
}

// Build comprehensive context accumulator
function buildContextAccumulator(parsed: ParsedIntake, ctx: ReturnType<typeof getClientContext>): string {
  const personalData = parsed.personal as Record<string, unknown>;
  const familyData = parsed.family as Record<string, unknown>;
  const assetsData = parsed.assets as Record<string, unknown>;
  const goalsData = parsed.goals as Record<string, unknown>;

  return `
# ESTATE PLANNING CONTEXT ACCUMULATOR

## 1. IDENTITY & LIFE STAGE
- **Full Name:** ${personalData?.firstName || 'Unknown'} ${personalData?.lastName || ''}
- **Age:** ${ctx.age || 'Unknown'} years old
- **State of Residence:** ${parsed.state}
- **Marital Status:** ${ctx.isMarried ? 'Married' : personalData?.maritalStatus || 'Unknown'}
${ctx.isMarried ? `- **Spouse Age:** ${ctx.spouseAge || 'Unknown'}` : ''}
- **Life Stage Assessment:** ${
  ctx.age >= 70 ? 'Late retirement - focus on legacy, incapacity planning, and potential long-term care' :
  ctx.age >= 60 ? 'Pre-retirement/early retirement - estate tax planning window, beneficiary optimization' :
  ctx.age >= 45 ? 'Peak earning years - asset protection, education funding, retirement planning' :
  ctx.age >= 30 ? 'Family building years - minor children protection, insurance needs' :
  'Early career - foundational documents needed'
}

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
- **Estate Size Category:** ${
  ctx.estimatedValue >= 13610000 ? 'TAXABLE ESTATE (exceeds 2024 federal exemption of $13.61M)' :
  ctx.estimatedValue >= 5000000 ? 'LARGE ESTATE - tax planning critical before 2026 sunset' :
  ctx.estimatedValue >= 1000000 ? 'SUBSTANTIAL ESTATE - probate avoidance valuable' :
  ctx.estimatedValue >= 500000 ? 'MODERATE ESTATE - basic planning essential' :
  'MODEST ESTATE - foundational documents needed'
}
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
${parsed.beneficiaries.length > 0 ? parsed.beneficiaries.map(b =>
  `- **${b.assetName}** (${b.assetType}): Primary: ${b.primaryBeneficiaryName} (${b.primaryBeneficiaryPercentage || 100}%)${b.contingentBeneficiaryName ? `, Contingent: ${b.contingentBeneficiaryName}` : ''}`
).join('\n') : 'No beneficiary designations tracked - THIS IS A GAP'}

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
function buildQuickAnalysisPrompt(parsed: ParsedIntake): string {
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
${JSON.stringify({ goals: parsed.goals, beneficiaries: parsed.beneficiaries }, null, 2)}

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
function buildDeepAnalysisPrompt(parsed: ParsedIntake): string {
  const ctx = getClientContext(parsed);
  const contextAccumulator = buildContextAccumulator(parsed, ctx);

  return `You are a senior estate planning attorney with 25+ years of experience in ${parsed.state}. You are conducting a thorough gap analysis that will be as valuable as a $500/hour consultation.

${contextAccumulator}

## RAW CLIENT DATA
${JSON.stringify({ personal: parsed.personal, family: parsed.family, assets: parsed.assets, existingDocs: parsed.existingDocs, goals: parsed.goals }, null, 2)}

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
function repairJSON(json: string): string {
  let repaired = json.trim();

  // First, try to find where the JSON becomes invalid by parsing progressively
  // Find a valid truncation point
  let validEnd = repaired.length;

  // Try to parse, and if it fails, try truncating at different points
  for (let attempts = 0; attempts < 50; attempts++) {
    try {
      // Try to find a good truncation point - look for complete objects/arrays
      let testJson = repaired.substring(0, validEnd);

      // Remove trailing incomplete content
      testJson = testJson.replace(/,\s*"[^"]*":\s*"[^"]*$/, '');  // incomplete string value
      testJson = testJson.replace(/,\s*"[^"]*":\s*\[[^\]]*$/, ''); // incomplete array
      testJson = testJson.replace(/,\s*"[^"]*":\s*\{[^}]*$/, '');  // incomplete object
      testJson = testJson.replace(/,\s*"[^"]*":\s*"?[^",}\]]*$/, '');
      testJson = testJson.replace(/,\s*"[^"]*":\s*$/, '');
      testJson = testJson.replace(/,\s*"[^"]*$/, '');
      testJson = testJson.replace(/,\s*$/, '');

      // Count and close brackets
      let openBraces = 0;
      let openBrackets = 0;
      let inString = false;
      let escapeNext = false;

      for (const char of testJson) {
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
      while (openBrackets > 0) {
        testJson += ']';
        openBrackets--;
      }
      while (openBraces > 0) {
        testJson += '}';
        openBraces--;
      }

      // Try parsing
      JSON.parse(testJson);
      return testJson;
    } catch (e) {
      // Get error position if available
      const errorMsg = (e as Error).message;
      const posMatch = errorMsg.match(/position (\d+)/);
      if (posMatch) {
        const errorPos = parseInt(posMatch[1], 10);
        // Truncate before the error and try again
        validEnd = Math.min(validEnd - 100, errorPos - 10);
      } else {
        validEnd -= 500;
      }

      if (validEnd < 1000) {
        // Give up - too much truncation
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

    while (openBrackets > 0) {
      truncated += ']';
      openBrackets--;
    }
    while (openBraces > 0) {
      truncated += '}';
      openBraces--;
    }

    try {
      JSON.parse(truncated);
      return truncated;
    } catch {
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

  if (inString) {
    repaired += '"';
  }

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
  // Try file content first (most reliable)
  if (result.fileContent && result.fileContent.trim()) {
    try {
      return JSON.parse(result.fileContent);
    } catch {
      // Try to repair truncated JSON
      try {
        const repaired = repairJSON(result.fileContent);
        return JSON.parse(repaired);
      } catch {
        // Fall through to try stdout
      }
    }
  }

  // Try to extract from stdout
  if (result.stdout) {
    // Try code block first
    const codeBlockMatch = result.stdout.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch {
        // Continue to other methods
      }
    }

    // Try to find raw JSON object starting with {"score"
    const analysisMatch = result.stdout.match(/\{"score"[\s\S]*\}(?=\s*$|\s*\n\s*===)/);
    if (analysisMatch) {
      try {
        return JSON.parse(analysisMatch[0]);
      } catch {
        // Continue to other methods
      }
    }

    // Fallback: Try to find JSON starting with {"score"
    const jsonStart = result.stdout.indexOf('{"score"');
    if (jsonStart !== -1) {
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
          return JSON.parse(result.stdout.substring(jsonStart, jsonEnd + 1));
        } catch {
          // Try to repair truncated JSON
          try {
            const repaired = repairJSON(result.stdout.substring(jsonStart, jsonEnd + 1));
            return JSON.parse(repaired);
          } catch {
            // Continue to other methods
          }
        }
      }
    }

    // Try to find any JSON object containing analysis keys
    const anyJsonMatch = result.stdout.match(/\{[^{}]*"missingDocuments"[^{}]*[\s\S]*\}/);
    if (anyJsonMatch) {
      try {
        return JSON.parse(anyJsonMatch[0]);
      } catch {
        // Try brace matching
        const start = result.stdout.indexOf(anyJsonMatch[0]);
        let braceCount = 0;
        let end = -1;
        for (let i = start; i < result.stdout.length; i++) {
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
            return JSON.parse(repaired);
          } catch {
            // All methods failed
          }
        }
      }
    }
  }

  console.error("extractJSON: No valid JSON found in response", {
    hasFileContent: !!result.fileContent,
    fileContentLength: result.fileContent?.length || 0,
    fileContentPreview: result.fileContent?.substring(0, 200) || "(empty)",
    hasStdout: !!result.stdout,
    stdoutLength: result.stdout?.length || 0,
    stdoutContainsScore: result.stdout?.includes('"score"') || false,
    stdoutContainsMissing: result.stdout?.includes('"missingDocuments"') || false,
  });
  return null;
}

// Calculate score based on document completeness and risk factors
function calculateScore(parsed: ParsedIntake, analysisResult: Record<string, unknown>): number {
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
    const familyData = parsed.family as Record<string, unknown>;
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
  const highProbateStates = ["CA", "California", "NY", "New York", "FL", "Florida"];
  if (highProbateStates.includes(parsed.state) && !ctx.hasTrust && ctx.estimatedValue > 100000) {
    score -= 5;
  }

  // Outdated documents penalty
  const outdatedDocs = analysisResult?.outdatedDocuments as Array<unknown> || [];
  if (outdatedDocs.length > 0) {
    score -= Math.min(5, outdatedDocs.length * 2);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================
// DETERMINISTIC FALLBACK ANALYSIS
// Used when E2B/AI fails to produce valid JSON output.
// Generates rule-based results from intake data alone.
// ============================================================

const HIGH_PROBATE_STATES = [
  "California", "CA", "New York", "NY", "Florida", "FL",
  "Connecticut", "CT", "Oregon", "OR", "Washington", "WA",
];

const ESTATE_TAX_STATES: Record<string, { exemption: string }> = {
  "Connecticut": { exemption: "$13.61M (matches federal)" },
  "CT": { exemption: "$13.61M" },
  "Hawaii": { exemption: "$5.49M" },
  "HI": { exemption: "$5.49M" },
  "Illinois": { exemption: "$4M" },
  "IL": { exemption: "$4M" },
  "Maine": { exemption: "$6.8M" },
  "ME": { exemption: "$6.8M" },
  "Maryland": { exemption: "$5M" },
  "MD": { exemption: "$5M" },
  "Massachusetts": { exemption: "$2M" },
  "MA": { exemption: "$2M" },
  "Minnesota": { exemption: "$3M" },
  "MN": { exemption: "$3M" },
  "New York": { exemption: "$6.94M" },
  "NY": { exemption: "$6.94M" },
  "Oregon": { exemption: "$1M" },
  "OR": { exemption: "$1M" },
  "Rhode Island": { exemption: "$1.77M" },
  "RI": { exemption: "$1.77M" },
  "Vermont": { exemption: "$5M" },
  "VT": { exemption: "$5M" },
  "Washington": { exemption: "$2.193M" },
  "WA": { exemption: "$2.193M" },
  "District of Columbia": { exemption: "$4.71M" },
  "DC": { exemption: "$4.71M" },
};

const INHERITANCE_TAX_STATES = [
  "Kentucky", "KY", "Maryland", "MD", "Nebraska", "NE",
  "New Jersey", "NJ", "Pennsylvania", "PA", "Iowa", "IA",
];

function generateMissingDocuments(
  parsed: ParsedIntake,
  ctx: ReturnType<typeof getClientContext>
): Array<Record<string, unknown>> {
  const docs: Array<Record<string, unknown>> = [];

  if (!ctx.hasWill) {
    docs.push({
      document: "Last Will & Testament",
      priority: "critical",
      reason: ctx.hasMinorChildren
        ? `Without a will, the court decides who raises your ${ctx.numberOfChildren} child${ctx.numberOfChildren !== 1 ? "ren" : ""} and how assets are distributed under ${parsed.state} intestacy laws.`
        : ctx.isMarried
          ? `Without a will, ${parsed.state} intestacy laws determine asset distribution — your spouse may not inherit everything.`
          : `Without a will, ${parsed.state} intestacy laws determine who inherits your assets, which may not align with your wishes.`,
      consequences: ctx.hasMinorChildren
        ? "Court appoints guardian for minor children; assets distributed by state intestacy formula; potential family disputes"
        : "Assets distributed by state intestacy formula; potential family disputes; no control over distribution",
    });
  }

  if (!ctx.hasTrust) {
    if (ctx.estimatedValue > 1000000) {
      docs.push({
        document: "Revocable Living Trust",
        priority: "critical",
        reason: `With an estimated estate of $${ctx.estimatedValue.toLocaleString()}, a trust avoids probate (saving time and fees), provides privacy, and enables structured asset distribution.`,
        consequences: "Estate goes through public probate process; potential probate fees of 2-5% of estate value; delays of 6-18 months for beneficiaries",
      });
    } else if (ctx.estimatedValue > 500000) {
      docs.push({
        document: "Revocable Living Trust",
        priority: "high",
        reason: `With an estate over $500K, a trust can help avoid probate costs and delays in ${parsed.state}.`,
        consequences: "Estate subject to probate; potential fees and delays for beneficiaries",
      });
    }
  }

  if (!ctx.hasPOAFinancial) {
    docs.push({
      document: "Financial Power of Attorney",
      priority: "critical",
      reason: "Designates someone to manage your finances if you become incapacitated. Without this, your family must petition the court for conservatorship — a costly and time-consuming process.",
      consequences: "Court-appointed conservator required if incapacitated; family cannot access accounts, pay bills, or manage investments; average conservatorship costs $5,000-$15,000",
    });
  }

  if (!ctx.hasPOAHealthcare) {
    docs.push({
      document: "Healthcare Power of Attorney",
      priority: "critical",
      reason: "Designates someone to make medical decisions on your behalf if you cannot. Without this, medical providers may not follow your family's wishes.",
      consequences: "Family members may disagree on care decisions; medical providers follow default protocols; potential court intervention for medical decisions",
    });
  }

  if (!ctx.hasHealthcareDirective) {
    docs.push({
      document: "Healthcare Directive / Living Will",
      priority: "high",
      reason: "Documents your wishes for end-of-life care, life-sustaining treatment, and organ donation — giving your family clarity during difficult moments.",
      consequences: "Family burdened with difficult decisions without guidance; potential for unwanted life-sustaining treatment; possible family conflict over care preferences",
    });
  }

  const familyData = parsed.family as Record<string, unknown>;
  if (ctx.hasMinorChildren && !familyData?.guardian) {
    docs.push({
      document: "Guardian Nomination for Minor Children",
      priority: "critical",
      reason: `You have minor children but no guardian has been nominated. Without a designated guardian, the court decides who raises your children.`,
      consequences: "Court selects guardian based on its own assessment; children may be placed with relatives you wouldn't choose; temporary foster care possible during proceedings",
    });
  }

  if (ctx.hasRetirementAccounts && parsed.beneficiaries.length === 0) {
    docs.push({
      document: "Beneficiary Designation Review",
      priority: "high",
      reason: "You have retirement accounts but no tracked beneficiary designations. Incorrect or missing designations can override your will and send assets to the wrong people.",
      consequences: "Retirement accounts pass by default beneficiary rules (often estate, triggering accelerated taxes); potential loss of spousal rollover benefits; assets may not go to intended recipients",
    });
  }

  if (ctx.hasBusinessInterests && !ctx.hasTrust && !ctx.hasWill) {
    docs.push({
      document: "Business Succession Plan",
      priority: "high",
      reason: "You have business interests but no will or trust that addresses business succession. Without a plan, your business could face disruption or forced liquidation.",
      consequences: "Business operations disrupted; co-owners or court may force sale; loss of business value; employees affected",
    });
  }

  return docs;
}

function generateRecommendations(
  parsed: ParsedIntake,
  ctx: ReturnType<typeof getClientContext>,
  missingDocs: Array<Record<string, unknown>>
): Array<Record<string, unknown>> {
  const recs: Array<Record<string, unknown>> = [];
  let rank = 1;

  // Missing documents become recommendations
  for (const doc of missingDocs) {
    const isCritical = doc.priority === "critical";
    recs.push({
      rank: rank++,
      action: `Create ${doc.document}`,
      category: "document_creation",
      priority: doc.priority,
      timeline: isCritical ? "Within 30 days" : "Within 90 days",
      estimatedCost: getDocumentCostEstimate(doc.document as string),
      reason: doc.reason,
    });
  }

  // Situational recommendations
  if (ctx.hasBusinessInterests && ctx.hasWill) {
    recs.push({
      rank: rank++,
      action: "Review business succession provisions in estate plan",
      category: "business_planning",
      priority: "high",
      timeline: "Within 60 days",
      estimatedCost: "$1,000 - $5,000",
      reason: "Business interests require specific succession planning to ensure continuity and protect value.",
    });
  }

  if (ctx.isMarried && ctx.estimatedValue > 5000000) {
    recs.push({
      rank: rank++,
      action: "Evaluate estate tax planning strategies",
      category: "tax_planning",
      priority: "high",
      timeline: "Within 90 days",
      estimatedCost: "$2,000 - $10,000",
      reason: `With an estate of $${ctx.estimatedValue.toLocaleString()}, strategic tax planning (portability election, credit shelter trust, gifting strategies) could save significant estate taxes.`,
    });
  }

  if (ctx.hasRealEstate && !ctx.hasTrust) {
    recs.push({
      rank: rank++,
      action: "Consider trust for real estate holdings",
      category: "asset_protection",
      priority: "medium",
      timeline: "Within 90 days",
      estimatedCost: "$1,500 - $5,000",
      reason: "Titling real estate in a trust avoids probate for those properties and can simplify transfer to beneficiaries.",
    });
  }

  if (ctx.age >= 60 && ctx.estimatedValue > 100000) {
    recs.push({
      rank: rank++,
      action: "Review long-term care and Medicaid planning options",
      category: "elder_planning",
      priority: "medium",
      timeline: "Within 6 months",
      estimatedCost: "$500 - $3,000",
      reason: "Long-term care costs can rapidly deplete an estate. Planning ahead preserves assets and ensures quality care.",
    });
  }

  if (ctx.hasRetirementAccounts && parsed.beneficiaries.length > 0) {
    recs.push({
      rank: rank++,
      action: "Audit all beneficiary designations for consistency",
      category: "beneficiary_review",
      priority: "medium",
      timeline: "Within 60 days",
      estimatedCost: "$0 - $500",
      reason: "Beneficiary designations on retirement accounts and insurance override your will. Regular audits prevent unintended distributions.",
    });
  }

  return recs;
}

function getDocumentCostEstimate(docName: string): string {
  const estimates: Record<string, string> = {
    "Last Will & Testament": "$300 - $1,500",
    "Revocable Living Trust": "$1,500 - $5,000",
    "Financial Power of Attorney": "$200 - $500",
    "Healthcare Power of Attorney": "$200 - $500",
    "Healthcare Directive / Living Will": "$100 - $300",
    "Guardian Nomination for Minor Children": "Included in Will ($0 additional)",
    "Beneficiary Designation Review": "$0 - $500",
    "Business Succession Plan": "$2,000 - $10,000",
  };
  return estimates[docName] || "$300 - $2,000";
}

function generateStateSpecificNotes(
  parsed: ParsedIntake,
  ctx: ReturnType<typeof getClientContext>
): Array<Record<string, unknown>> {
  const notes: Array<Record<string, unknown>> = [];
  const state = parsed.state;
  const stateReqs = STATE_REQUIREMENTS[state];

  // Community property
  if (stateReqs?.communityPropertyState) {
    notes.push({
      topic: "Community Property State",
      rule: `${state} is a community property state. Assets acquired during marriage are generally owned 50/50 by both spouses regardless of title.`,
      impact: ctx.isMarried
        ? "This affects how your estate is divided. Your will/trust can only control your half of community property. Consider a community property agreement."
        : "If you marry in the future, this will significantly affect asset ownership.",
      action: ctx.isMarried ? "Review asset classification with an attorney" : "Be aware of community property rules for future planning",
    });
  }

  // High-probate cost state
  if (HIGH_PROBATE_STATES.includes(state) && !ctx.hasTrust && ctx.estimatedValue > 100000) {
    notes.push({
      topic: "High Probate Costs",
      rule: `${state} has relatively high probate costs and a lengthy probate process. Probate fees can range from 2-5% of estate value.`,
      impact: `With an estimated estate of $${ctx.estimatedValue.toLocaleString()}, probate could cost $${Math.round(ctx.estimatedValue * 0.03).toLocaleString()} or more.`,
      action: "A revocable living trust is strongly recommended to avoid probate in this state.",
    });
  }

  // State estate tax
  const estateTaxInfo = ESTATE_TAX_STATES[state];
  if (estateTaxInfo) {
    notes.push({
      topic: "State Estate Tax",
      rule: `${state} imposes its own estate tax with an exemption of ${estateTaxInfo.exemption}. This is in addition to any federal estate tax.`,
      impact: ctx.estimatedValue > 1000000
        ? `Your estate value ($${ctx.estimatedValue.toLocaleString()}) may be subject to state estate tax depending on the exemption threshold.`
        : "Your current estate value is likely below the threshold, but this should be monitored as assets grow.",
      action: "Consult with a tax attorney about state estate tax planning strategies.",
    });
  }

  // Inheritance tax
  if (INHERITANCE_TAX_STATES.includes(state)) {
    notes.push({
      topic: "State Inheritance Tax",
      rule: `${state} imposes an inheritance tax on beneficiaries who receive assets. Tax rates and exemptions vary by the beneficiary's relationship to the deceased.`,
      impact: "Spouses are typically exempt. Children may have reduced rates. Non-relatives face the highest rates.",
      action: "Consider beneficiary planning strategies to minimize inheritance tax impact.",
    });
  }

  // Special witness requirements
  if (stateReqs && stateReqs.witnessCount > 2) {
    notes.push({
      topic: "Special Witness Requirements",
      rule: `${state} requires ${stateReqs.witnessCount} witnesses for a valid will (most states require only 2).`,
      impact: "Failing to have the required number of witnesses could invalidate your will.",
      action: `Ensure all estate planning documents are signed with ${stateReqs.witnessCount} witnesses present.`,
    });
  }

  // Notarization requirement (Louisiana)
  if (stateReqs?.notaryRequired) {
    notes.push({
      topic: "Notarization Required",
      rule: `${state} requires notarization for certain estate planning documents.${stateReqs.specialRequirements ? " " + stateReqs.specialRequirements.join(" ") : ""}`,
      impact: "Documents without proper notarization may be invalid.",
      action: "Ensure all documents are properly notarized per state requirements.",
    });
  }

  return notes;
}

function generateExecutiveSummary(
  ctx: ReturnType<typeof getClientContext>,
  missingDocs: Array<Record<string, unknown>>,
  recommendations: Array<Record<string, unknown>>
): Record<string, unknown> {
  const criticalDocs = missingDocs.filter(d => d.priority === "critical");
  const criticalIssues = criticalDocs.map(d => `Missing ${d.document}`);

  const immediateActions = recommendations
    .filter(r => r.priority === "critical" || r.priority === "high")
    .slice(0, 3)
    .map(r => r.action as string);

  let oneLineSummary: string;
  if (criticalDocs.length === 0 && missingDocs.length === 0) {
    oneLineSummary = "Your estate plan has the core documents in place. Consider reviewing for updates and optimizations.";
  } else if (criticalDocs.length > 0) {
    oneLineSummary = `Your estate plan is missing ${criticalDocs.length} critical document${criticalDocs.length !== 1 ? "s" : ""} that should be addressed promptly to protect your ${ctx.hasMinorChildren ? "family" : "assets"}.`;
  } else {
    oneLineSummary = `Your estate plan has ${missingDocs.length} gap${missingDocs.length !== 1 ? "s" : ""} that should be addressed to strengthen your overall protection.`;
  }

  return {
    oneLineSummary,
    criticalIssues,
    immediateActions,
    biggestRisks: criticalDocs.slice(0, 3).map(d => d.consequences as string),
  };
}

function generateDeterministicAnalysis(
  parsed: ParsedIntake,
  ctx: ReturnType<typeof getClientContext>
): Record<string, unknown> {
  const missingDocuments = generateMissingDocuments(parsed, ctx);
  const recommendations = generateRecommendations(parsed, ctx, missingDocuments);
  const stateSpecificNotes = generateStateSpecificNotes(parsed, ctx);
  const executiveSummary = generateExecutiveSummary(ctx, missingDocuments, recommendations);

  const score = calculateScore(parsed, {});
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  return {
    score,
    overallScore: {
      score,
      grade,
      summary: missingDocuments.length > 0
        ? `Your estate plan has ${missingDocuments.length} gap${missingDocuments.length !== 1 ? "s" : ""} and ${recommendations.length} recommended action${recommendations.length !== 1 ? "s" : ""}. This analysis was generated from your intake data.`
        : "Your estate plan covers the essential documents. This analysis was generated from your intake data.",
    },
    executiveSummary,
    missingDocuments,
    outdatedDocuments: [],
    inconsistencies: [],
    taxStrategies: [],
    stateSpecificNotes,
    recommendations,
    scenarioAnalysis: [],
    preAnalysisInsights: {},
    uncertaintyLog: {
      informationGaps: [],
      assumptionsMade: [
        { assumption: "Analysis based on intake data only (AI analysis unavailable)", ifWrong: "AI analysis may identify additional findings" },
      ],
      confidenceLevels: {
        overallAnalysis: "medium",
        scoreAccuracy: "high",
        costEstimates: "low",
      },
    },
    targetStateSummary: {},
    _fallbackUsed: true,
    _fallbackReason: "AI analysis was unavailable; results generated from intake data",
  };
}

// Debug endpoint to test intake data parsing without running full analysis
export async function GET(req: Request) {
  const url = new URL(req.url);
  const testMode = url.searchParams.get("test");

  if (testMode === "parse") {
    // Return info about what the parser would extract
    return NextResponse.json({
      message: "Use POST with intakeData and mode=debug to test parsing",
      example: {
        intakeData: {
          estatePlan: { stateOfResidence: "California" },
          personal: { data: '{"state": "California", "firstName": "John"}' }
        },
        mode: "debug"
      }
    });
  }

  return NextResponse.json({
    status: "ok",
    endpoints: {
      "POST /api/gap-analysis": "Run gap analysis (mode: quick, comprehensive, or debug)",
      "GET /api/gap-analysis?test=parse": "Get parsing info"
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { intakeData, mode = "quick", estatePlanId } = body;

    if (!intakeData) {
      return NextResponse.json({ error: "Intake data is required" }, { status: 400 });
    }

    // Debug mode - just parse and return without running analysis
    if (mode === "debug") {
      const parsed = parseIntakeData(intakeData);
      const ctx = getClientContext(parsed);
      return NextResponse.json({
        success: true,
        mode: "debug",
        parsed: {
          state: parsed.state,
          personalKeys: Object.keys(parsed.personal),
          familyKeys: Object.keys(parsed.family),
          assetsKeys: Object.keys(parsed.assets),
          existingDocsKeys: Object.keys(parsed.existingDocs),
          goalsKeys: Object.keys(parsed.goals),
          beneficiariesCount: parsed.beneficiaries.length,
        },
        clientContext: ctx,
        rawPersonalData: parsed.personal,
      });
    }

    // If comprehensive mode, redirect to orchestration endpoint
    if (mode === "comprehensive") {
      if (!estatePlanId) {
        return NextResponse.json(
          { error: "estatePlanId is required for comprehensive analysis" },
          { status: 400 }
        );
      }

      // Forward to orchestration endpoint
      const orchestrateUrl = new URL("/api/gap-analysis/orchestrate", req.url);
      const orchestrateResponse = await fetch(orchestrateUrl.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estatePlanId, intakeData }),
      });

      const orchestrateResult = await orchestrateResponse.json();
      return NextResponse.json({
        ...orchestrateResult,
        mode: "comprehensive",
      });
    }

    // Quick mode - single run with simplified prompt for faster results
    // Parse the intake data
    const parsed = parseIntakeData(intakeData);
    const ctx = getClientContext(parsed);

    // Build simplified quick analysis prompt (faster, essential findings only)
    const prompt = buildQuickAnalysisPrompt(parsed);
    const result = await executeInE2B({
      prompt,
      outputFile: "analysis.json",
      timeoutMs: 300000, // 5 minute timeout for quick analysis
      maxTurns: 5,
      runType: "quick_analysis",
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
      // Fallback: generate deterministic analysis from intake data
      console.warn("extractJSON returned null — using deterministic fallback analysis");
      console.warn("E2B result details:", {
        success: result.success,
        hasFileContent: !!result.fileContent,
        fileContentLength: result.fileContent?.length || 0,
        stdoutLength: result.stdout?.length || 0,
        exitCode: result.exitCode,
      });
      analysisResult = generateDeterministicAnalysis(parsed, ctx);
    }

    // Ensure all arrays exist
    analysisResult.missingDocuments = analysisResult.missingDocuments || [];
    analysisResult.outdatedDocuments = analysisResult.outdatedDocuments || [];
    analysisResult.inconsistencies = analysisResult.inconsistencies || [];
    analysisResult.taxStrategies = analysisResult.taxStrategies || [];
    analysisResult.stateSpecificNotes = analysisResult.stateSpecificNotes || analysisResult.stateSpecificConsiderations || [];
    analysisResult.recommendations = analysisResult.recommendations || analysisResult.prioritizedRecommendations || [];
    analysisResult.scenarioAnalysis = analysisResult.scenarioAnalysis || [];

    // Encode fallback flag in rawAnalysis for the UI to detect
    if (analysisResult._fallbackUsed) {
      analysisResult.rawAnalysis = JSON.stringify({
        _fallbackUsed: true,
        _fallbackReason: analysisResult._fallbackReason,
        _generatedAt: new Date().toISOString(),
      });
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
