# Agents

AI agent capabilities for EstateAI are implemented through **skills** (structured knowledge files) and **Convex actions** (serverless functions that call the Claude API).

## Where to find agent code

| Directory | Contents |
|-----------|----------|
| [`../skills/`](../skills/) | AI skill definitions with reference materials |
| [`../convex/gapAnalysis.ts`](../convex/gapAnalysis.ts) | Core gap analysis AI action |
| [`../convex/gapAnalysisOrchestration.ts`](../convex/gapAnalysisOrchestration.ts) | Three-phase orchestration |
| [`../convex/documentGeneration.ts`](../convex/documentGeneration.ts) | Document generation AI action |
| [`../convex/documentAnalysis.ts`](../convex/documentAnalysis.ts) | Document review AI action |
| [`../lib/gap-analysis/`](../lib/gap-analysis/) | Orchestrator, prompts, and aggregation logic |

## AI Skills

| Skill | Purpose |
|-------|---------|
| `estate-document-analyzer` | Analyzes uploaded legal documents, extracts provisions, translates to plain English |
| `financial-profile-classifier` | Classifies net worth tiers to determine which documents are needed |
| `ma-estate-planning-analyzer` | Massachusetts-specific compliance, MassHealth planning, tax strategies |
| `us-estate-planning-analyzer` | 50-state legal requirements with per-state reference files |

Each skill has a `SKILL.md` definition and a `references/` directory with domain knowledge.

## Three-Phase Gap Analysis

1. **Phase 1 -- Research**: State law research, estate complexity classification
2. **Phase 2 -- Analysis**: Document inventory, family protection, asset protection
3. **Phase 3 -- Synthesis**: Scenario modeling, priority matrix, final recommendations
