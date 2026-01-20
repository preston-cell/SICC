# Gap Analysis Improvement Plan

## Executive Summary

The current gap analysis system runs a **single Claude Code execution with 5 max turns** to generate an entire estate planning analysis. While functional, this approach falls far short of what a real estate planning attorney would produce over several weeks of careful analysis.

**Core Problem**: Trying to accomplish too much in one run, resulting in shallow analysis across all dimensions rather than deep, expert-level analysis in each area.

**Solution**: Multi-phase, multi-run architecture that mirrors how a real estate planning attorney would approach a comprehensive review.

---

## Current Implementation Analysis

### Architecture Overview

```
Current Flow (Single Run):
┌─────────────────┐
│   Intake Data   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Single Prompt   │ ◄── Everything in one prompt
│ (5 max turns)   │
└────────┬────────┘
         ▼
┌─────────────────┐
│  JSON Output    │ ◄── Shallow across all categories
└─────────────────┘
```

### Current Output Categories (All in One Run)
1. Overall Score
2. Missing Documents (4-6 items)
3. Outdated Documents (2-4 items)
4. Inconsistencies (2-4 items)
5. Financial Exposure
6. Tax Strategies (3-5 items)
7. State-Specific Considerations (5-7 items)
8. Prioritized Recommendations (8-10 items)
9. Executive Summary

### Key Limitations

| Limitation | Impact | Real Attorney Equivalent |
|------------|--------|-------------------------|
| 5 max turns | Analysis cut short | Attorney spends days on each area |
| Single prompt | Surface-level for each area | Dedicated analysis for each topic |
| No research phase | May use outdated thresholds | Attorney researches current law |
| No scenario modeling | Misses critical "what-ifs" | Attorney models multiple scenarios |
| No document deep-dive | Generic document recommendations | Clause-by-clause review |
| No iterative refinement | First-pass analysis only | Multiple review passes |
| Limited state specificity | Generic state guidance | Deep state law expertise |

---

## Proposed Multi-Phase Architecture

### High-Level Flow

```
Proposed Flow (Multi-Phase, 9-13 Runs):

╔═══════════════════════════════════════════════════════════════╗
║                    PHASE 1: RESEARCH & CONTEXT                 ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ ║
║  │ State Law       │  │ Client Context  │  │ Document       │ ║
║  │ Research        │  │ Analysis        │  │ Inventory      │ ║
║  │ (Run 1)         │  │ (Run 2)         │  │ (Run 3)        │ ║
║  └────────┬────────┘  └────────┬────────┘  └───────┬────────┘ ║
║           │                    │                    │          ║
║           └────────────────────┼────────────────────┘          ║
║                                ▼                               ║
║                    ┌───────────────────┐                       ║
║                    │ Context Summary   │                       ║
║                    └─────────┬─────────┘                       ║
╚══════════════════════════════╪════════════════════════════════╝
                               ▼
╔═══════════════════════════════════════════════════════════════╗
║                 PHASE 2: DEEP ANALYSIS (Parallel)              ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           ║
║  │ Document     │ │ Tax          │ │ Medicaid &   │           ║
║  │ Completeness │ │ Optimization │ │ Long-Term    │           ║
║  │ (Run 4)      │ │ (Run 5)      │ │ (Run 6)      │           ║
║  └──────────────┘ └──────────────┘ └──────────────┘           ║
║                                                                ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           ║
║  │ Beneficiary  │ │ Family       │ │ Asset        │           ║
║  │ Coordination │ │ Protection   │ │ Protection   │           ║
║  │ (Run 7)      │ │ (Run 8)      │ │ (Run 9)      │           ║
║  └──────────────┘ └──────────────┘ └──────────────┘           ║
║                                                                ║
║  ┌──────────────┐                                              ║
║  │ Existing Doc │ ◄── Only if client has documents             ║
║  │ Review       │                                              ║
║  │ (Run 10)     │                                              ║
║  └──────────────┘                                              ║
╚══════════════════════════════╪════════════════════════════════╝
                               ▼
╔═══════════════════════════════════════════════════════════════╗
║                PHASE 3: SYNTHESIS & RECOMMENDATIONS            ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐ ║
║  │ Scenario        │  │ Priority Matrix │  │ Final Report   │ ║
║  │ Modeling        │  │ Development     │  │ Generation     │ ║
║  │ (Run 11)        │  │ (Run 12)        │  │ (Run 13)       │ ║
║  └────────┬────────┘  └────────┬────────┘  └───────┬────────┘ ║
║           │                    │                    │          ║
║           └────────────────────┴────────────────────┘          ║
║                                ▼                               ║
║                    ┌───────────────────┐                       ║
║                    │ COMPREHENSIVE     │                       ║
║                    │ GAP ANALYSIS      │                       ║
║                    │ REPORT            │                       ║
║                    └───────────────────┘                       ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Detailed Phase Specifications

### Phase 1: Research & Context (Sequential, ~5 minutes)

#### Run 1: State Law Research
**Purpose**: Gather current, accurate state-specific information

**Tasks**:
- Search current federal estate tax exemption ($13.99M for 2025)
- Search state estate tax thresholds and rates
- Search state inheritance tax rules (if applicable)
- Search state Medicaid asset limits and penalty divisors
- Search recent state law changes affecting estate planning
- Search state-specific document execution requirements

**Output**: `state_research.json`
```json
{
  "state": "Massachusetts",
  "researchDate": "2025-01-20",
  "federalExemption": 13990000,
  "stateEstateTax": {
    "threshold": 2000000,
    "rates": [...],
    "cliffEffect": true,
    "notes": "Entire estate taxable once threshold exceeded"
  },
  "inheritanceTax": null,
  "medicaid": {
    "assetLimit": 2000,
    "csra": 154140,
    "penaltyDivisor": 419,
    "lookbackMonths": 60
  },
  "recentChanges": [...],
  "documentRequirements": {...}
}
```

#### Run 2: Client Context Analysis
**Purpose**: Deep understanding of client's unique situation

**Tasks**:
- Analyze complexity factors (estate size, family structure, business interests)
- Identify special circumstances (blended family, special needs, charitable intent)
- Assess risk profile (age, health indicators, profession)
- Determine planning priorities based on goals
- Identify potential conflicts between stated goals

**Output**: `client_context.json`
```json
{
  "complexityScore": "high",
  "complexityFactors": [
    "Blended family with children from prior marriage",
    "Business ownership requiring succession planning",
    "Assets in multiple states"
  ],
  "specialCircumstances": [...],
  "riskFactors": [...],
  "goalPriorities": [...],
  "potentialConflicts": [...]
}
```

#### Run 3: Document Inventory
**Purpose**: Catalog existing documents and identify gaps

**Tasks**:
- List all existing documents with dates
- Identify age of each document
- Note last review/update dates
- Identify life events since document creation
- Create preliminary gap list

**Output**: `document_inventory.json`
```json
{
  "existingDocuments": [
    {
      "type": "will",
      "dateCreated": "2018-03-15",
      "ageYears": 6.8,
      "lastReviewed": null,
      "lifeEventsSince": ["birth of child", "home purchase"],
      "potentialIssues": ["Pre-dates second child", "May not reflect current assets"]
    }
  ],
  "missingDocuments": [...],
  "documentGaps": [...]
}
```

---

### Phase 2: Deep Analysis (Parallel, ~10-15 minutes)

#### Run 4: Document Completeness Analysis
**Purpose**: Deep dive on what documents are needed and why

**Input**: State research + Client context + Document inventory

**Analysis Areas**:
- Core documents needed based on state law
- Additional documents based on client complexity
- Priority ordering based on risk
- State-specific execution requirements
- Cost estimates for each document
- Consequences of not having each document

**Output**: `document_completeness.json` (15-20 detailed document recommendations)

#### Run 5: Tax Optimization Analysis
**Purpose**: Comprehensive federal and state tax planning

**Input**: State research + Client context + Asset data

**Analysis Areas**:
- Federal estate tax exposure calculation
- State estate tax exposure calculation
- Gift tax planning opportunities
- Generation-skipping transfer tax considerations
- Income tax planning in trusts
- Charitable giving tax benefits
- Specific strategy recommendations with calculations
- Implementation steps for each strategy

**Output**: `tax_analysis.json` (8-12 detailed strategies with dollar amounts)

#### Run 6: Medicaid & Long-Term Care Analysis
**Purpose**: Plan for potential long-term care needs

**Input**: State research + Client context + Asset data

**Analysis Areas**:
- Current Medicaid eligibility assessment
- Asset protection strategies
- Look-back period implications
- Spousal protection planning (CSRA)
- Irrevocable trust options
- Long-term care insurance analysis
- Penalty period calculations for past transfers
- Timeline recommendations

**Output**: `medicaid_analysis.json` (6-10 detailed recommendations)

#### Run 7: Beneficiary Coordination Analysis
**Purpose**: Ensure all beneficiary designations align with estate plan

**Input**: Client context + Asset data + Beneficiary designations

**Analysis Areas**:
- Retirement account beneficiary review
- Life insurance beneficiary review
- Payable-on-death account review
- Trust beneficiary consistency
- Contingent beneficiary adequacy
- Per stirpes vs per capita issues
- Special needs beneficiary considerations
- Tax-efficient beneficiary designations

**Output**: `beneficiary_analysis.json` (detailed review of each designation)

#### Run 8: Family Protection Analysis
**Purpose**: Protect vulnerable family members

**Input**: Client context + Family data

**Analysis Areas**:
- Minor children guardianship
- Special needs trust requirements
- Blended family considerations
- Elder family member care
- Estranged family member issues
- Pet planning
- Educational funding
- Family governance structures

**Output**: `family_protection.json` (8-12 detailed recommendations)

#### Run 9: Asset Protection Analysis
**Purpose**: Protect assets from creditors and claims

**Input**: State research + Client context + Asset data

**Analysis Areas**:
- State homestead exemption
- Tenancy by entirety protection
- LLC/entity structuring
- Domestic asset protection trusts
- Umbrella insurance adequacy
- Professional liability exposure
- Business succession planning
- Real estate titling optimization

**Output**: `asset_protection.json` (6-10 detailed strategies)

#### Run 10: Existing Document Review (Conditional)
**Purpose**: Clause-by-clause analysis of existing documents

**Only runs if**: Client has existing documents

**Input**: Document inventory + Uploaded documents

**Analysis Areas**:
- Will provisions analysis
- Trust terms review
- POA powers adequacy
- Healthcare directive completeness
- Outdated provisions identification
- Conflicting provisions
- Missing provisions
- State compliance issues

**Output**: `document_review.json` (detailed clause-by-clause findings)

---

### Phase 3: Synthesis & Recommendations (Sequential, ~5-7 minutes)

#### Run 11: Scenario Modeling
**Purpose**: Model "what-if" scenarios

**Input**: All Phase 2 outputs + Client context

**Scenarios to Model**:
1. Death of primary earner tomorrow
2. Death of both spouses (common disaster)
3. Incapacity of primary earner
4. Divorce scenario
5. Major lawsuit/creditor claim
6. Long-term care need in 10 years
7. Significant inheritance received
8. Business failure or sale

**Output**: `scenario_models.json` (8 detailed scenarios with outcomes)

#### Run 12: Priority Matrix Development
**Purpose**: Create risk-weighted prioritization

**Input**: All Phase 2 outputs + Scenario models

**Analysis**:
- Risk probability scoring
- Financial impact scoring
- Urgency assessment
- Dependency mapping (what enables what)
- Resource requirement analysis
- Timeline development

**Output**: `priority_matrix.json` (fully prioritized action list)

#### Run 13: Final Report Generation
**Purpose**: Create comprehensive unified report

**Input**: All previous outputs

**Report Sections**:
1. Executive Summary (1 page)
2. Client Profile & Complexity Assessment
3. Current State Analysis
4. Gap Analysis by Category
5. Risk Assessment & Scenario Analysis
6. Prioritized Action Plan (with timelines)
7. Implementation Roadmap
8. Cost Estimates Summary
9. Appendix: State-Specific References
10. Appendix: Glossary of Terms

**Output**: `final_report.json` (comprehensive structured report)

---

## Technical Implementation Details

### API Endpoint Changes

**New Endpoint Structure**:
```
POST /api/gap-analysis/start      - Initiate analysis, return runId
GET  /api/gap-analysis/status/:id - Check progress
GET  /api/gap-analysis/result/:id - Get final result
POST /api/gap-analysis/cancel/:id - Cancel running analysis
```

### Database Schema Additions

```typescript
// New table: gapAnalysisRuns
{
  id: string,
  estatePlanId: string,
  status: "pending" | "phase1" | "phase2" | "phase3" | "completed" | "failed",
  currentPhase: number,
  currentRun: number,
  totalRuns: number,
  startedAt: number,
  completedAt?: number,

  // Phase outputs stored as JSON strings
  phase1Outputs?: string,  // { stateResearch, clientContext, documentInventory }
  phase2Outputs?: string,  // { docCompleteness, taxAnalysis, ... }
  phase3Outputs?: string,  // { scenarioModels, priorityMatrix, finalReport }

  // Final aggregated result
  finalResult?: string,

  // Error tracking
  errors?: string,

  // Metadata
  tokenUsage?: string,
  costUsd?: number,
  durationMs?: number
}
```

### Parallel Execution Strategy

Phase 2 runs can execute in parallel using Promise.all:

```typescript
const phase2Results = await Promise.all([
  executeRun('document_completeness', phase1Context),
  executeRun('tax_optimization', phase1Context),
  executeRun('medicaid_analysis', phase1Context),
  executeRun('beneficiary_coordination', phase1Context),
  executeRun('family_protection', phase1Context),
  executeRun('asset_protection', phase1Context),
  // Conditional: only if documents exist
  ...(hasExistingDocs ? [executeRun('document_review', phase1Context)] : [])
]);
```

### Progress Tracking

Real-time progress updates via polling or webhooks:

```json
{
  "runId": "abc123",
  "status": "phase2",
  "progress": {
    "phase1": { "completed": true, "runs": 3, "completedRuns": 3 },
    "phase2": { "completed": false, "runs": 7, "completedRuns": 4 },
    "phase3": { "completed": false, "runs": 3, "completedRuns": 0 }
  },
  "currentActivity": "Analyzing tax optimization strategies...",
  "estimatedTimeRemaining": "5-7 minutes"
}
```

---

## Output Quality Comparison

### Current Output (Single Run)

```json
{
  "missingDocuments": [
    {
      "document": "Last Will and Testament",
      "priority": "critical",
      "reason": "No will creates intestacy risk",
      "consequences": "Assets distribute per MA law",
      "estimatedCostToCreate": { "low": 500, "high": 2000 }
    }
    // 3-5 more items, fairly generic
  ],
  "taxStrategies": [
    {
      "strategy": "Annual Gift Exclusion",
      "applicability": "Can reduce taxable estate",
      "estimatedSavings": { "low": 5000, "high": 20000 }
    }
    // 2-4 more items, surface-level
  ]
}
```

### Proposed Output (Multi-Phase)

```json
{
  "missingDocuments": [
    {
      "document": "Last Will and Testament",
      "priority": "critical",
      "urgencyRank": 1,
      "detailedReason": "Without a valid will, your estate would pass via Massachusetts intestacy law (M.G.L. c. 190B, § 2-102). Given your marital status and two minor children, this means...",
      "consequences": {
        "financial": "Spouse receives first $100,000 plus half of remainder; children split other half",
        "practical": "Court-appointed guardian for children's inheritance until age 18",
        "timeline": "Probate would take 12-18 months minimum in Norfolk County"
      },
      "whatWillShouldInclude": [
        "Nomination of spouse as primary executor",
        "Guardian nomination for minor children (recommend: [based on family data])",
        "Specific bequests for [identified items]",
        "Pour-over provision to fund revocable trust",
        "No-contest clause to prevent challenges"
      ],
      "estimatedCost": {
        "attorneyDrafted": { "low": 800, "high": 2500 },
        "onlineService": { "low": 150, "high": 400 },
        "recommendation": "Attorney-drafted strongly recommended due to minor children and estate complexity"
      },
      "stateRequirements": {
        "witnesses": 2,
        "notarization": "Recommended for self-proving affidavit",
        "statute": "M.G.L. c. 190B, § 2-502"
      },
      "relatedActions": [
        "Coordinate with revocable trust creation",
        "Review after trust is funded",
        "Update beneficiary designations to align"
      ]
    }
    // 15-20 more documents with this level of detail
  ],
  "taxStrategies": [
    {
      "strategy": "Spousal Lifetime Access Trust (SLAT)",
      "category": "moderate_aggressive",
      "applicability": {
        "whyRelevant": "Your combined estate of $3.2M exceeds Massachusetts threshold of $2M",
        "clientFit": "Married with stable relationship, sufficient assets to gift"
      },
      "mechanics": {
        "howItWorks": "One spouse creates irrevocable trust for benefit of other spouse and descendants. Removes assets from donor's estate while beneficiary spouse retains access.",
        "keyTerms": ["Irrevocable", "Gift tax return required", "Beneficiary spouse cannot be trustee"]
      },
      "financialAnalysis": {
        "estimatedSavings": {
          "maEstateTax": { "low": 64000, "high": 96000 },
          "federalTax": 0,
          "totalSavings": { "low": 64000, "high": 96000 },
          "methodology": "Based on removing $800K-$1.2M from estate at 8% MA rate"
        },
        "giftTaxImplications": "Uses portion of lifetime exemption ($13.99M available)",
        "incomeInTrust": "Trust income taxed to grantor (defective grantor trust)"
      },
      "implementationSteps": [
        "1. Consult with estate planning attorney specializing in irrevocable trusts",
        "2. Determine optimal funding amount (recommend $800K-$1.2M)",
        "3. Draft trust document with SLAT-specific provisions",
        "4. Identify and appoint independent trustee",
        "5. Transfer assets to trust (cash, marketable securities recommended)",
        "6. File gift tax return (Form 709) for year of transfer",
        "7. Consider spouse creating reciprocal SLAT (watch for reciprocal trust doctrine)",
        "8. Review trust annually to ensure compliance"
      ],
      "risks": [
        "Irrevocable - cannot be undone",
        "Divorce risk - beneficiary spouse loses access",
        "Reciprocal trust doctrine could collapse both SLATs if too similar"
      ],
      "timeline": "90-120 days to implement properly",
      "estimatedCost": { "legal": { "low": 5000, "high": 15000 } }
    }
    // 8-12 more strategies with this level of detail
  ]
}
```

---

## Expected Improvements

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Missing Documents Identified | 4-6 | 15-20 | 3-4x |
| Tax Strategies | 3-5 generic | 8-12 detailed | 2-3x depth |
| State-Specific Citations | 1-2 | 15-25 | 10x+ |
| Scenario Analysis | None | 8 scenarios | New capability |
| Implementation Steps | 2-3 per item | 6-10 per item | 3x |
| Cost Estimates | Rough ranges | Detailed breakdown | Much more accurate |
| Document Review Depth | Surface | Clause-by-clause | Qualitative leap |
| Research Currency | Potentially outdated | Fresh web searches | Always current |
| Total Analysis Time | 2-5 minutes | 15-25 minutes | Worth it for depth |

---

## Risk Mitigation

### Timeout Handling
- Each run has independent timeout (5 min max)
- Partial results saved after each phase
- Resume capability if connection lost

### Cost Management
- Estimated cost: $2-5 per comprehensive analysis
- Cost tracking per run
- User notification if approaching limits

### Error Recovery
- Phase-level retry capability
- Graceful degradation (use completed phases if later phases fail)
- Clear error messaging with recovery options

---

## Migration Path

### Phase 1: Build Infrastructure (Week 1-2)
- New API endpoints
- Database schema changes
- Progress tracking system

### Phase 2: Implement Runs (Week 2-4)
- Create prompts for each run type
- Build parallel execution system
- Implement aggregation logic

### Phase 3: UI Updates (Week 4-5)
- Progress indicator
- Phased result display
- Enhanced result visualization

### Phase 4: Testing & Refinement (Week 5-6)
- Test with various client profiles
- Tune prompts based on output quality
- Performance optimization

---

## Success Criteria

1. **Depth**: Each category produces 3x more detailed recommendations
2. **Accuracy**: State-specific citations are correct and current
3. **Actionability**: Every recommendation has clear implementation steps
4. **Comprehensiveness**: No major estate planning area is overlooked
5. **Personalization**: Recommendations clearly tailored to specific client situation
6. **Quality**: Output reads as if produced by experienced estate planning attorney
