# Backend

The backend for EstateAI is implemented using **Convex** -- a real-time serverless database and functions platform. Rather than a traditional Express/Django backend, all server-side logic lives in Convex functions.

## Where to find backend code

| Directory | Contents |
|-----------|----------|
| [`../convex/`](../convex/) | Convex schema, queries, mutations, and actions (22 tables) |
| [`../app/api/`](../app/api/) | Next.js API routes (gap analysis orchestration, document generation, notifications) |
| [`../lib/`](../lib/) | Shared server-side libraries (document templates, gap analysis prompts, email/push services) |

## Key backend files

- `convex/schema.ts` -- Database schema (22 tables)
- `convex/gapAnalysis.ts` -- Core AI gap analysis action
- `convex/gapAnalysisOrchestration.ts` -- Three-phase analysis orchestration
- `convex/documentGeneration.ts` -- AI document generation action
- `convex/documentAnalysis.ts` -- Uploaded document AI review
- `app/api/gap-analysis/orchestrate/route.ts` -- Gap analysis API endpoint
- `app/api/document-generation/route.ts` -- Document generation API endpoint
