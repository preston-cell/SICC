import { NextResponse } from "next/server";
import { executeInE2B } from "@/lib/e2b-executor";

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

  console.error("extractJSON: No valid JSON found in response");
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { intakeData, mode = "quick", estatePlanId } = body;

    if (!intakeData) {
      return NextResponse.json({ error: "Intake data is required" }, { status: 400 });
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
        executiveSummary: { criticalIssues: [], immediateActions: [], biggestRisks: [] },
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
