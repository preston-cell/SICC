# Claude Code Implementation Prompt: Multi-Phase Gap Analysis System

> **Instructions for Claude Code**: Use **planning mode** (shift-tab twice) before beginning implementation. Think through the architecture, review each phase carefully, and draft your implementation plan. Once the plan is approved, write the final plan with a detailed todo list to this file's companion: `gap-analysis-implementation-todos.md`. Then proceed with implementation phase by phase, updating the todo file as you complete each step.

---

## Project Context

You are implementing a major enhancement to an estate planning application's gap analysis feature. The current implementation uses a single Claude Code execution to produce all analysis, resulting in shallow coverage across all areas. Your task is to transform this into a **multi-phase, multi-run architecture** that produces comprehensive, attorney-quality analysis.

### Codebase Location
- **Project root**: `/home/user/SICC/mvp`
- **Current gap analysis API**: `/home/user/SICC/mvp/app/api/gap-analysis/route.ts`
- **E2B executor**: `/home/user/SICC/mvp/lib/e2b-executor.ts`
- **Analysis UI**: `/home/user/SICC/mvp/app/analysis/[estatePlanId]/page.tsx`
- **Database schema**: `/home/user/SICC/mvp/convex/schema.ts`
- **Database mutations**: `/home/user/SICC/mvp/convex/estatePlanning.ts`
- **Skills directory**: `/home/user/SICC/mvp/skills/`
- **Improvement plan**: `/home/user/SICC/docs/gap-analysis-improvement-plan.md`

### Technology Stack
- Next.js 14 (App Router)
- TypeScript
- Convex (database & backend)
- E2B (sandbox execution)
- Claude Code CLI (AI execution)
- TailwindCSS + shadcn/ui

---

## Objective

Transform the gap analysis from a **single-run, 5-turn Claude execution** into a **multi-phase system with 9-13 specialized Claude runs** that produces estate planning analysis comparable to what a professional attorney would deliver after weeks of careful review.

---

## Architecture Overview

### Current State (Single Run)
```
Intake Data → Single Prompt (5 turns) → JSON Output → Display
```

### Target State (Multi-Phase)
```
Intake Data
     │
     ▼
╔═══════════════════════════════════════╗
║  PHASE 1: Research & Context          ║
║  - Run 1: State Law Research          ║
║  - Run 2: Client Context Analysis     ║
║  - Run 3: Document Inventory          ║
╚═══════════════════════════════════════╝
     │
     ▼
╔═══════════════════════════════════════╗
║  PHASE 2: Deep Analysis (Parallel)    ║
║  - Run 4: Document Completeness       ║
║  - Run 5: Tax Optimization            ║
║  - Run 6: Medicaid Planning           ║
║  - Run 7: Beneficiary Coordination    ║
║  - Run 8: Family Protection           ║
║  - Run 9: Asset Protection            ║
║  - Run 10: Existing Doc Review (cond) ║
╚═══════════════════════════════════════╝
     │
     ▼
╔═══════════════════════════════════════╗
║  PHASE 3: Synthesis                   ║
║  - Run 11: Scenario Modeling          ║
║  - Run 12: Priority Matrix            ║
║  - Run 13: Final Report Generation    ║
╚═══════════════════════════════════════╝
     │
     ▼
Comprehensive Gap Analysis Report
```

---

## Implementation Phases

### PHASE A: Database & Infrastructure

#### A1: Update Convex Schema

**File**: `convex/schema.ts`

Add new table for tracking analysis runs:

```typescript
gapAnalysisRuns: defineTable({
  estatePlanId: v.id("estatePlanning"),
  status: v.union(
    v.literal("pending"),
    v.literal("phase1"),
    v.literal("phase2"),
    v.literal("phase3"),
    v.literal("completed"),
    v.literal("failed"),
    v.literal("cancelled")
  ),

  // Progress tracking
  currentPhase: v.number(),
  currentRun: v.number(),
  totalRuns: v.number(),

  // Timestamps
  startedAt: v.number(),
  updatedAt: v.number(),
  completedAt: v.optional(v.number()),

  // Phase outputs (JSON strings)
  phase1Outputs: v.optional(v.string()),
  phase2Outputs: v.optional(v.string()),
  phase3Outputs: v.optional(v.string()),

  // Final aggregated result
  finalResult: v.optional(v.string()),

  // Metadata
  tokenUsage: v.optional(v.string()),
  costUsd: v.optional(v.number()),
  durationMs: v.optional(v.number()),

  // Error tracking
  errors: v.optional(v.string()),
  lastError: v.optional(v.string()),
})
.index("by_estatePlan", ["estatePlanId"])
.index("by_status", ["status"]),
```

#### A2: Create Convex Mutations

**File**: `convex/gapAnalysisRuns.ts` (new file)

Create mutations for:
- `startRun`: Create new run record
- `updateRunProgress`: Update phase/run progress
- `savePhaseOutput`: Save output from a phase
- `completeRun`: Mark run as completed with final result
- `failRun`: Mark run as failed with error
- `cancelRun`: Cancel a running analysis
- `getRunStatus`: Query current status
- `getRunResult`: Query final result

#### A3: Create Run Types & Interfaces

**File**: `lib/gap-analysis/types.ts` (new file)

```typescript
// Run types enum
export enum AnalysisRunType {
  STATE_RESEARCH = 'state_research',
  CLIENT_CONTEXT = 'client_context',
  DOCUMENT_INVENTORY = 'document_inventory',
  DOCUMENT_COMPLETENESS = 'document_completeness',
  TAX_OPTIMIZATION = 'tax_optimization',
  MEDICAID_PLANNING = 'medicaid_planning',
  BENEFICIARY_COORDINATION = 'beneficiary_coordination',
  FAMILY_PROTECTION = 'family_protection',
  ASSET_PROTECTION = 'asset_protection',
  EXISTING_DOC_REVIEW = 'existing_doc_review',
  SCENARIO_MODELING = 'scenario_modeling',
  PRIORITY_MATRIX = 'priority_matrix',
  FINAL_REPORT = 'final_report',
}

// Phase definitions
export const PHASES = {
  PHASE_1: {
    name: 'Research & Context',
    runs: [
      AnalysisRunType.STATE_RESEARCH,
      AnalysisRunType.CLIENT_CONTEXT,
      AnalysisRunType.DOCUMENT_INVENTORY,
    ],
    sequential: true,
  },
  PHASE_2: {
    name: 'Deep Analysis',
    runs: [
      AnalysisRunType.DOCUMENT_COMPLETENESS,
      AnalysisRunType.TAX_OPTIMIZATION,
      AnalysisRunType.MEDICAID_PLANNING,
      AnalysisRunType.BENEFICIARY_COORDINATION,
      AnalysisRunType.FAMILY_PROTECTION,
      AnalysisRunType.ASSET_PROTECTION,
    ],
    conditionalRuns: [AnalysisRunType.EXISTING_DOC_REVIEW],
    sequential: false, // Can run in parallel
  },
  PHASE_3: {
    name: 'Synthesis',
    runs: [
      AnalysisRunType.SCENARIO_MODELING,
      AnalysisRunType.PRIORITY_MATRIX,
      AnalysisRunType.FINAL_REPORT,
    ],
    sequential: true,
  },
};

// Output interfaces for each run type
export interface StateResearchOutput { ... }
export interface ClientContextOutput { ... }
// ... etc for each run type
```

---

### PHASE B: Prompt Engineering

#### B1: Create Prompt Templates

**Directory**: `lib/gap-analysis/prompts/` (new directory)

Create individual prompt builder files for each run type. Each prompt should:
- Be highly specific to its analysis area
- Include state-specific context when relevant
- Request structured JSON output with detailed schema
- Include quality requirements (depth, citations, etc.)

**Files to create**:
1. `state-research-prompt.ts`
2. `client-context-prompt.ts`
3. `document-inventory-prompt.ts`
4. `document-completeness-prompt.ts`
5. `tax-optimization-prompt.ts`
6. `medicaid-planning-prompt.ts`
7. `beneficiary-coordination-prompt.ts`
8. `family-protection-prompt.ts`
9. `asset-protection-prompt.ts`
10. `existing-doc-review-prompt.ts`
11. `scenario-modeling-prompt.ts`
12. `priority-matrix-prompt.ts`
13. `final-report-prompt.ts`

#### B2: Prompt Requirements

Each prompt should follow this structure:

```typescript
export function buildStateResearchPrompt(context: Phase1Context): string {
  return `
# Role & Expertise
You are a ${context.state} estate planning law researcher with expertise in state-specific regulations.

# Your Task
Research and compile current, accurate information about ${context.state} estate planning law.

# Required Searches
Use web search to verify current (2025) values for:
1. Federal estate tax exemption (approximately $13.99M for 2025)
2. ${context.state} estate tax threshold and rates
3. ${context.state} inheritance tax (if applicable)
4. ${context.state} Medicaid asset limits
5. ${context.state} document execution requirements
6. Any recent ${context.state} estate planning law changes

# Output Format
Write a JSON file to /home/user/generated/state_research.json with this exact structure:
{
  "state": "${context.state}",
  "researchDate": "YYYY-MM-DD",
  "federalExemption": <number>,
  "stateEstateTax": {
    "hasEstateTax": <boolean>,
    "threshold": <number or null>,
    "rates": [{"bracket": <number>, "rate": <percent>}],
    "cliffEffect": <boolean>,
    "portability": <boolean>,
    "notes": "<important details>"
  },
  "inheritanceTax": {
    "hasInheritanceTax": <boolean>,
    // ... detailed structure
  },
  "medicaid": {
    "individualAssetLimit": <number>,
    "csra": <number>,
    "csra2025": <number>,
    "penaltyDivisor": <number>,
    "lookbackMonths": <number>,
    "homeEquityLimit": <number>,
    "notes": "<state-specific rules>"
  },
  "documentRequirements": {
    "will": {
      "witnesses": <number>,
      "notarization": "<required/recommended/not_required>",
      "selfProving": <boolean>,
      "holographic": <boolean>,
      "statute": "<citation>"
    },
    "trust": { ... },
    "poaFinancial": { ... },
    "poaHealthcare": { ... },
    "healthcareDirective": { ... }
  },
  "recentChanges": [
    {
      "effectiveDate": "YYYY-MM-DD",
      "description": "<what changed>",
      "impact": "<how it affects planning>"
    }
  ],
  "uniqueConsiderations": [
    "<${context.state}-specific rule or opportunity>"
  ]
}

# Quality Requirements
- All dollar amounts must be current 2025 values
- Include statutory citations where possible
- Note any pending legislation that could affect planning
- Be thorough - this research forms the foundation for all subsequent analysis
`;
}
```

#### B3: Tax Optimization Prompt (Example of Deep Analysis)

```typescript
export function buildTaxOptimizationPrompt(
  context: Phase2Context
): string {
  return `
# Role & Expertise
You are a senior estate planning attorney specializing in tax optimization for ${context.state} residents.

# Client Profile
${JSON.stringify(context.clientSummary, null, 2)}

# Estate Value
- Gross estate: $${context.estateValue.toLocaleString()}
- Federal exemption: $${context.federalExemption.toLocaleString()}
- ${context.state} threshold: $${context.stateThreshold?.toLocaleString() || 'N/A (no state estate tax)'}

# Current Tax Exposure
- Federal estate tax: ${context.federalExposure > 0 ? '$' + context.federalExposure.toLocaleString() : 'None (under exemption)'}
- ${context.state} estate tax: ${context.stateExposure > 0 ? '$' + context.stateExposure.toLocaleString() : 'None'}

# Your Task
Develop 8-12 comprehensive tax optimization strategies tailored to this specific client. Each strategy must include:
1. Detailed explanation of how it works
2. Why it's relevant to THIS client (not generic)
3. Precise savings calculations with methodology
4. Step-by-step implementation process
5. Risks and considerations
6. Timeline and estimated costs

# Strategy Categories to Consider
Analyze applicability of each and include if relevant:

## Conservative Strategies
- Portability election optimization
- Credit shelter trust
- Annual gift exclusion program
- Qualified transfers (education/medical)

## Moderate Strategies
- Irrevocable Life Insurance Trust (ILIT)
- Qualified Personal Residence Trust (QPRT)
- Charitable Remainder Trust (CRT)
- Donor Advised Fund
- Spousal Lifetime Access Trust (SLAT)

## Advanced Strategies
- Grantor Retained Annuity Trust (GRAT)
- Intentionally Defective Grantor Trust (IDGT)
- Family Limited Partnership (FLP)
- Qualified Small Business Stock (QSBS) - if applicable
- Dynasty Trust
- Charitable Lead Trust (CLT)

## State-Specific Strategies
- ${context.state}-specific opportunities
- Domicile planning if multi-state
- State income tax minimization in trusts

# Output Format
Write a JSON file to /home/user/generated/tax_analysis.json:

{
  "currentExposure": {
    "federal": <number>,
    "state": <number>,
    "total": <number>,
    "methodology": "<explanation of calculation>"
  },
  "strategies": [
    {
      "id": "<unique_id>",
      "name": "<Strategy Name>",
      "category": "<conservative/moderate/advanced>",
      "applicability": {
        "score": <1-10>,
        "reasoning": "<Why specifically relevant to this client - 3-4 sentences>",
        "clientFactors": ["<specific factor>", "<specific factor>"]
      },
      "mechanics": {
        "summary": "<2-3 sentence overview>",
        "howItWorks": "<Detailed explanation - 1-2 paragraphs>",
        "keyTerms": ["<term>", "<term>"],
        "taxTreatment": "<income/estate/gift tax implications>"
      },
      "financialAnalysis": {
        "estimatedSavings": {
          "federal": { "low": <number>, "high": <number> },
          "state": { "low": <number>, "high": <number> },
          "total": { "low": <number>, "high": <number> }
        },
        "methodology": "<Show your math>",
        "assumptions": ["<assumption>"],
        "sensitivityFactors": ["<what could change the numbers>"]
      },
      "implementation": {
        "steps": [
          {
            "order": <number>,
            "action": "<specific action>",
            "details": "<how to do it>",
            "responsible": "<who does this - client/attorney/CPA>",
            "documents": ["<document needed>"]
          }
        ],
        "timeline": "<e.g., 60-90 days>",
        "professionals": ["estate attorney", "CPA", "etc"],
        "estimatedCost": {
          "legal": { "low": <number>, "high": <number> },
          "accounting": { "low": <number>, "high": <number> },
          "ongoing": { "annual": <number>, "description": "<what ongoing costs>" }
        }
      },
      "risks": [
        {
          "risk": "<risk description>",
          "likelihood": "<low/medium/high>",
          "mitigation": "<how to mitigate>"
        }
      ],
      "contraindications": ["<when NOT to use this strategy>"],
      "relatedStrategies": ["<strategy that pairs well>"],
      "citations": ["<relevant IRC section or case>"]
    }
  ],
  "prioritizedRecommendations": [
    {
      "rank": <number>,
      "strategyId": "<id from above>",
      "urgency": "<immediate/short-term/long-term>",
      "rationale": "<why this ranking>"
    }
  ],
  "combinedSavings": {
    "ifAllImplemented": {
      "federal": <number>,
      "state": <number>,
      "total": <number>
    },
    "ifTop3Implemented": {
      "federal": <number>,
      "state": <number>,
      "total": <number>
    }
  },
  "warnings": [
    "<Important considerations or limitations>"
  ]
}

# Quality Requirements
- Minimum 8 strategies, maximum 12
- Each strategy must have specific dollar calculations
- Include at least 2 state-specific considerations
- All IRC citations must be accurate
- Implementation steps must be actionable
- This analysis should be so thorough that an attorney could use it as a starting point for client recommendations
`;
}
```

---

### PHASE C: Execution Engine

#### C1: Create Multi-Run Executor

**File**: `lib/gap-analysis/executor.ts` (new file)

```typescript
import { executeInE2B } from '../e2b-executor';
import { AnalysisRunType, PHASES } from './types';
import * as prompts from './prompts';

interface ExecutorOptions {
  estatePlanId: string;
  intakeData: IntakeData;
  onProgress: (progress: ProgressUpdate) => Promise<void>;
}

export class GapAnalysisExecutor {
  private estatePlanId: string;
  private intakeData: IntakeData;
  private onProgress: (progress: ProgressUpdate) => Promise<void>;

  private phase1Results: Phase1Results | null = null;
  private phase2Results: Phase2Results | null = null;
  private phase3Results: Phase3Results | null = null;

  constructor(options: ExecutorOptions) {
    this.estatePlanId = options.estatePlanId;
    this.intakeData = options.intakeData;
    this.onProgress = options.onProgress;
  }

  async execute(): Promise<FinalAnalysisResult> {
    try {
      // Phase 1: Sequential research runs
      await this.onProgress({ phase: 1, status: 'starting', message: 'Beginning research phase...' });
      this.phase1Results = await this.executePhase1();

      // Phase 2: Parallel deep analysis runs
      await this.onProgress({ phase: 2, status: 'starting', message: 'Beginning deep analysis...' });
      this.phase2Results = await this.executePhase2();

      // Phase 3: Sequential synthesis runs
      await this.onProgress({ phase: 3, status: 'starting', message: 'Synthesizing findings...' });
      this.phase3Results = await this.executePhase3();

      // Aggregate final result
      return this.aggregateResults();
    } catch (error) {
      await this.onProgress({ phase: 0, status: 'failed', message: error.message });
      throw error;
    }
  }

  private async executePhase1(): Promise<Phase1Results> {
    // Run 1: State Research
    await this.onProgress({ phase: 1, run: 1, status: 'running', message: 'Researching state laws...' });
    const stateResearch = await this.executeRun(
      AnalysisRunType.STATE_RESEARCH,
      prompts.buildStateResearchPrompt(this.getPhase1Context())
    );

    // Run 2: Client Context
    await this.onProgress({ phase: 1, run: 2, status: 'running', message: 'Analyzing client context...' });
    const clientContext = await this.executeRun(
      AnalysisRunType.CLIENT_CONTEXT,
      prompts.buildClientContextPrompt(this.getPhase1Context(), stateResearch)
    );

    // Run 3: Document Inventory
    await this.onProgress({ phase: 1, run: 3, status: 'running', message: 'Cataloging documents...' });
    const documentInventory = await this.executeRun(
      AnalysisRunType.DOCUMENT_INVENTORY,
      prompts.buildDocumentInventoryPrompt(this.getPhase1Context(), stateResearch, clientContext)
    );

    return { stateResearch, clientContext, documentInventory };
  }

  private async executePhase2(): Promise<Phase2Results> {
    const context = this.getPhase2Context();

    // Determine which runs to execute
    const runs = [
      { type: AnalysisRunType.DOCUMENT_COMPLETENESS, prompt: prompts.buildDocumentCompletenessPrompt(context) },
      { type: AnalysisRunType.TAX_OPTIMIZATION, prompt: prompts.buildTaxOptimizationPrompt(context) },
      { type: AnalysisRunType.MEDICAID_PLANNING, prompt: prompts.buildMedicaidPlanningPrompt(context) },
      { type: AnalysisRunType.BENEFICIARY_COORDINATION, prompt: prompts.buildBeneficiaryCoordinationPrompt(context) },
      { type: AnalysisRunType.FAMILY_PROTECTION, prompt: prompts.buildFamilyProtectionPrompt(context) },
      { type: AnalysisRunType.ASSET_PROTECTION, prompt: prompts.buildAssetProtectionPrompt(context) },
    ];

    // Add conditional run if client has existing documents
    if (this.hasExistingDocuments()) {
      runs.push({
        type: AnalysisRunType.EXISTING_DOC_REVIEW,
        prompt: prompts.buildExistingDocReviewPrompt(context)
      });
    }

    // Execute all Phase 2 runs in parallel
    await this.onProgress({ phase: 2, status: 'running', message: `Executing ${runs.length} parallel analyses...` });

    const results = await Promise.all(
      runs.map(async (run, index) => {
        await this.onProgress({
          phase: 2,
          run: index + 1,
          status: 'running',
          message: `Running ${run.type}...`
        });
        const result = await this.executeRun(run.type, run.prompt);
        await this.onProgress({
          phase: 2,
          run: index + 1,
          status: 'completed',
          message: `Completed ${run.type}`
        });
        return { type: run.type, result };
      })
    );

    // Map results to typed object
    return this.mapPhase2Results(results);
  }

  private async executePhase3(): Promise<Phase3Results> {
    const context = this.getPhase3Context();

    // Run 11: Scenario Modeling
    await this.onProgress({ phase: 3, run: 1, status: 'running', message: 'Modeling scenarios...' });
    const scenarioModeling = await this.executeRun(
      AnalysisRunType.SCENARIO_MODELING,
      prompts.buildScenarioModelingPrompt(context)
    );

    // Run 12: Priority Matrix
    await this.onProgress({ phase: 3, run: 2, status: 'running', message: 'Building priority matrix...' });
    const priorityMatrix = await this.executeRun(
      AnalysisRunType.PRIORITY_MATRIX,
      prompts.buildPriorityMatrixPrompt(context, scenarioModeling)
    );

    // Run 13: Final Report
    await this.onProgress({ phase: 3, run: 3, status: 'running', message: 'Generating final report...' });
    const finalReport = await this.executeRun(
      AnalysisRunType.FINAL_REPORT,
      prompts.buildFinalReportPrompt(context, scenarioModeling, priorityMatrix)
    );

    return { scenarioModeling, priorityMatrix, finalReport };
  }

  private async executeRun(runType: AnalysisRunType, prompt: string): Promise<unknown> {
    const outputFile = `${runType}.json`;

    const result = await executeInE2B({
      prompt,
      outputFile,
      timeoutMs: 300000, // 5 minutes per run
    });

    if (!result.success) {
      throw new Error(`Run ${runType} failed: ${result.error}`);
    }

    return this.extractJSON(result);
  }

  // ... helper methods
}
```

#### C2: Update E2B Executor

**File**: `lib/e2b-executor.ts`

Modify to support:
- Web search capability (for state research run)
- Longer timeouts per individual run
- Better error recovery
- Metadata extraction per run

Add these options:
```typescript
export interface E2BExecuteOptions {
  prompt: string;
  outputFile?: string;
  timeoutMs?: number;
  enableWebSearch?: boolean;  // NEW
  maxTurns?: number;          // NEW - default 10 for deep analysis
}
```

---

### PHASE D: API Endpoints

#### D1: Create New API Route

**File**: `app/api/gap-analysis-v2/route.ts` (new file)

```typescript
import { NextResponse } from "next/server";
import { GapAnalysisExecutor } from "@/lib/gap-analysis/executor";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const maxDuration = 900; // 15 minutes max

export async function POST(req: Request) {
  try {
    const { intakeData, estatePlanId } = await req.json();

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    // Create run record
    const runId = await convex.mutation(api.gapAnalysisRuns.startRun, {
      estatePlanId,
      totalRuns: 13,
    });

    // Create executor with progress callback
    const executor = new GapAnalysisExecutor({
      estatePlanId,
      intakeData,
      onProgress: async (progress) => {
        await convex.mutation(api.gapAnalysisRuns.updateRunProgress, {
          runId,
          ...progress,
        });
      },
    });

    // Execute analysis
    const result = await executor.execute();

    // Save final result
    await convex.mutation(api.gapAnalysisRuns.completeRun, {
      runId,
      finalResult: JSON.stringify(result),
    });

    return NextResponse.json({
      success: true,
      runId,
      result,
    });

  } catch (error) {
    console.error("Gap analysis error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

#### D2: Create Status Endpoint

**File**: `app/api/gap-analysis-v2/status/[runId]/route.ts` (new file)

For polling progress updates.

#### D3: Create Cancel Endpoint

**File**: `app/api/gap-analysis-v2/cancel/[runId]/route.ts` (new file)

For cancelling running analyses.

---

### PHASE E: Frontend Updates

#### E1: Create Progress Component

**File**: `components/gap-analysis/AnalysisProgress.tsx` (new file)

```typescript
interface AnalysisProgressProps {
  runId: string;
  onComplete: (result: AnalysisResult) => void;
}

export function AnalysisProgress({ runId, onComplete }: AnalysisProgressProps) {
  // Poll for status updates
  // Display phase/run progress
  // Show estimated time remaining
  // Allow cancellation
}
```

Design requirements:
- Visual progress bar showing overall completion
- Phase indicators (Phase 1/2/3)
- Current activity description
- Estimated time remaining
- Cancel button
- Partial results display as phases complete

#### E2: Update Analysis Page

**File**: `app/analysis/[estatePlanId]/page.tsx`

Modify to:
- Use new v2 API endpoint
- Show progress component during analysis
- Display results progressively as phases complete
- Handle much richer result data

#### E3: Create Enhanced Results Display

**File**: `components/gap-analysis/EnhancedResults.tsx` (new file)

New components for displaying:
- Detailed document completeness cards
- Tax strategy comparison table
- Scenario modeling visualizations
- Priority matrix display
- Full report view with sections

---

### PHASE F: Testing & Quality

#### F1: Create Test Fixtures

**File**: `lib/gap-analysis/__tests__/fixtures/` (new directory)

Create test fixtures for:
- Various client profiles (simple, complex, high net worth)
- Different states (estate tax vs. no tax states)
- Edge cases (no documents, all documents, etc.)

#### F2: Write Integration Tests

**File**: `lib/gap-analysis/__tests__/executor.test.ts` (new file)

Test:
- Phase execution order
- Error handling and recovery
- Parallel execution in Phase 2
- Result aggregation
- Timeout handling

#### F3: Create Output Validators

**File**: `lib/gap-analysis/validators.ts` (new file)

Zod schemas to validate output from each run type.

---

## Detailed Todo List

When you begin implementation, create the following todo structure:

```markdown
# Gap Analysis v2 Implementation Todos

## Phase A: Database & Infrastructure
- [ ] A1: Add gapAnalysisRuns table to convex/schema.ts
- [ ] A2: Create convex/gapAnalysisRuns.ts with all mutations
- [ ] A3: Create lib/gap-analysis/types.ts with interfaces

## Phase B: Prompt Engineering
- [ ] B1: Create lib/gap-analysis/prompts/ directory
- [ ] B2: Create state-research-prompt.ts
- [ ] B3: Create client-context-prompt.ts
- [ ] B4: Create document-inventory-prompt.ts
- [ ] B5: Create document-completeness-prompt.ts
- [ ] B6: Create tax-optimization-prompt.ts
- [ ] B7: Create medicaid-planning-prompt.ts
- [ ] B8: Create beneficiary-coordination-prompt.ts
- [ ] B9: Create family-protection-prompt.ts
- [ ] B10: Create asset-protection-prompt.ts
- [ ] B11: Create existing-doc-review-prompt.ts
- [ ] B12: Create scenario-modeling-prompt.ts
- [ ] B13: Create priority-matrix-prompt.ts
- [ ] B14: Create final-report-prompt.ts
- [ ] B15: Create prompts/index.ts barrel export

## Phase C: Execution Engine
- [ ] C1: Create lib/gap-analysis/executor.ts
- [ ] C2: Update lib/e2b-executor.ts with new options
- [ ] C3: Create lib/gap-analysis/result-aggregator.ts
- [ ] C4: Create lib/gap-analysis/json-extractor.ts

## Phase D: API Endpoints
- [ ] D1: Create app/api/gap-analysis-v2/route.ts
- [ ] D2: Create app/api/gap-analysis-v2/status/[runId]/route.ts
- [ ] D3: Create app/api/gap-analysis-v2/cancel/[runId]/route.ts

## Phase E: Frontend Updates
- [ ] E1: Create components/gap-analysis/AnalysisProgress.tsx
- [ ] E2: Update app/analysis/[estatePlanId]/page.tsx
- [ ] E3: Create components/gap-analysis/EnhancedResults.tsx
- [ ] E4: Create components/gap-analysis/PhaseResults.tsx
- [ ] E5: Update styling for new components

## Phase F: Testing & Quality
- [ ] F1: Create test fixtures
- [ ] F2: Write integration tests
- [ ] F3: Create Zod validators for outputs
- [ ] F4: Manual end-to-end testing

## Phase G: Migration & Cleanup
- [ ] G1: Keep old endpoint as fallback
- [ ] G2: Add feature flag for v2
- [ ] G3: Document new system in CLAUDE.md
- [ ] G4: Update any related documentation
```

---

## Implementation Guidelines

### Prompt Quality Standards

Each prompt must:
1. **Be specific to client** - Reference actual client data, not generic
2. **Include state context** - Use researched state information
3. **Define exact output schema** - JSON structure with all fields
4. **Set quality bar** - Minimum items, depth requirements
5. **Include citations requirement** - Legal citations where applicable

### Error Handling Requirements

1. **Run-level retry** - Retry failed individual runs up to 2 times
2. **Phase-level recovery** - Save completed phases, resume from failure point
3. **Graceful degradation** - Return partial results if later phases fail
4. **Clear error messages** - User-friendly error descriptions

### Performance Targets

- Phase 1: ~5 minutes (3 sequential runs)
- Phase 2: ~8-10 minutes (6-7 parallel runs)
- Phase 3: ~5 minutes (3 sequential runs)
- Total: 18-20 minutes for comprehensive analysis

### Cost Estimates

- Estimated tokens per run: 15,000-30,000
- Total tokens: ~200,000-350,000
- Estimated cost: $3-7 per comprehensive analysis

---

## Success Criteria

The implementation is successful when:

1. **Depth**: Each output category has 3x more detail than current
2. **Accuracy**: State-specific information is current and cited
3. **Actionability**: Every recommendation has implementation steps
4. **Progress visibility**: User sees real-time progress updates
5. **Reliability**: System handles errors gracefully
6. **Performance**: Complete analysis in under 25 minutes

---

## Notes for Implementation

1. **Start with Phase A** - Get database infrastructure in place first
2. **Test prompts individually** - Before building executor, test each prompt manually
3. **Build progress UI early** - Users need feedback during long analysis
4. **Keep old system running** - Feature flag to switch between v1 and v2
5. **Commit after each sub-phase** - Maintain working state throughout
6. **Test with real intake data** - Use actual client scenarios, not just fixtures

---

## Questions to Resolve During Planning

1. Should Phase 2 runs have access to each other's outputs, or only Phase 1 context?
2. What's the minimum viable set of runs if we need to reduce scope?
3. Should we support partial re-runs (e.g., just re-run tax optimization)?
4. How do we handle rate limiting if running 7 parallel Claude calls?
5. Should final report be generated by Claude or aggregated programmatically?

---

*End of Implementation Prompt*
