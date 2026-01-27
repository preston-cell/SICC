# Migration Guide: Convex to Prisma/PostgreSQL

This guide documents the architectural differences between the `main` branch (Convex) and the `postgres-migration-estateai` branch (Prisma/PostgreSQL), and provides step-by-step instructions for developers migrating to the new architecture.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Key Differences Summary](#key-differences-summary)
3. [Environment Variables](#environment-variables)
4. [Database Schema Migration](#database-schema-migration)
5. [API Layer Changes](#api-layer-changes)
6. [Frontend Data Fetching](#frontend-data-fetching)
7. [New Features](#new-features)
8. [Step-by-Step Migration](#step-by-step-migration)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Main Branch (Convex)

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                         │
│  └── useQuery/useMutation (convex/react)                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket (real-time)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Convex Backend (convex/)                                   │
│  ├── schema.ts      (database schema)                       │
│  ├── queries.ts     (read operations)                       │
│  ├── mutations.ts   (write operations)                      │
│  └── actions.ts     (external API calls)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Convex Cloud (managed database + serverless functions)     │
└─────────────────────────────────────────────────────────────┘
```

### Postgres Branch (Prisma)

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                         │
│  └── useSWR + custom hooks (usePrismaQueries.ts)           │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP (REST)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js API Routes (app/api/)                              │
│  ├── /api/estate-plans/...    (27 route files)             │
│  ├── /api/gap-analysis/...                                  │
│  └── /api/document-generation/...                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Prisma Client
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  PostgreSQL (AWS RDS / local)                               │
│  └── 19 tables (prisma/schema.prisma)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Differences Summary

| Aspect | Main (Convex) | Postgres (Prisma) |
|--------|--------------|-------------------|
| **Database** | Convex Cloud | PostgreSQL (AWS RDS) |
| **ORM** | Convex SDK | Prisma |
| **Data Fetching** | `useQuery`/`useMutation` | SWR + REST APIs |
| **Real-time** | Built-in WebSocket | SWR polling |
| **API Routes** | 4 files | 27 files |
| **Database Tables** | 12 tables | 19 models |
| **Auth** | Convex + Clerk | sessionId + Clerk |
| **Schema Location** | `convex/schema.ts` | `prisma/schema.prisma` |
| **Backend Code** | `convex/*.ts` | `app/api/**/*.ts` |

---

## Environment Variables

### Main Branch (Convex)

```env
# Convex
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
E2B_API_KEY=e2b_...

# Clerk (optional)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Postgres Branch (Prisma)

```env
# Database (REQUIRED - replaces Convex)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# AI Services (same)
ANTHROPIC_API_KEY=sk-ant-...
E2B_API_KEY=e2b_...

# Clerk (optional - same)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# App URL (for internal API calls)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Key Changes:**
- Remove `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Add `DATABASE_URL` pointing to PostgreSQL
- Add `NEXT_PUBLIC_APP_URL` for internal API calls

---

## Database Schema Migration

### Tables Comparison

| Convex Table | Prisma Model | Status |
|--------------|--------------|--------|
| `agentRuns` | `AgentRun` | Migrated |
| `generatedFiles` | `GeneratedFile` | Migrated |
| `users` | `User` | Migrated |
| `estatePlans` | `EstatePlan` | Migrated |
| `intakeData` | `IntakeData` | Migrated |
| `documents` | `Document` | Migrated |
| `gapAnalysis` | `GapAnalysis` | Migrated |
| `uploadedDocuments` | `UploadedDocument` | Migrated |
| `extractedIntakeData` | `ExtractedIntakeData` | Migrated |
| `reminders` | `Reminder` | Migrated (enhanced) |
| `lifeEvents` | `LifeEvent` | Migrated |
| `beneficiaryDesignations` | `BeneficiaryDesignation` | Migrated |
| - | `GuidedIntakeProgress` | **NEW** |
| - | `FamilyContact` | **NEW** |
| - | `AttorneyQuestion` | **NEW** |
| - | `DocumentChecklistItem` | **NEW** |
| - | `GapAnalysisRun` | **NEW** |
| - | `GapAnalysisPhase` | **NEW** |
| - | `GapAnalysisRunResult` | **NEW** |

### Schema Syntax Differences

**Convex (JavaScript-based schema):**
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  estatePlans: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    name: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("intake_in_progress"),
      // ...
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),
});
```

**Prisma (schema definition language):**
```prisma
// prisma/schema.prisma
model EstatePlan {
  id               String           @id @default(cuid())
  userId           String?
  user             User?            @relation(fields: [userId], references: [id])
  sessionId        String?
  name             String           @default("My Estate Plan")
  status           EstatePlanStatus @default(draft)
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  // Relations
  intakeData       IntakeData[]
  documents        Document[]
  // ...

  @@index([userId])
  @@index([sessionId])
}

enum EstatePlanStatus {
  draft
  intake_in_progress
  intake_complete
  analysis_complete
  documents_generated
  complete
}
```

### Key Differences

1. **IDs**: Convex uses `v.id("tableName")`, Prisma uses `String @id @default(cuid())`
2. **Timestamps**: Convex uses `v.number()` (Unix ms), Prisma uses `DateTime`
3. **Enums**: Convex uses `v.union(v.literal(...))`, Prisma uses `enum`
4. **Relations**: Convex implicit via ID fields, Prisma explicit with `@relation`
5. **Indexes**: Convex `.index()` chain, Prisma `@@index([])` decorator

---

## API Layer Changes

### Convex Approach

In Convex, backend logic is in `convex/*.ts` files:

```typescript
// convex/estatePlanning.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createEstatePlan = mutation({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db.insert("estatePlans", {
      sessionId,
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getEstatePlan = query({
  args: { id: v.id("estatePlans") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
```

### Prisma Approach

In Prisma, backend logic is in Next.js API routes:

```typescript
// app/api/estate-plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  const estatePlan = await prisma.estatePlan.create({
    data: {
      sessionId,
      status: "draft",
    },
  });

  return NextResponse.json(estatePlan);
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");

  const estatePlans = await prisma.estatePlan.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(estatePlans);
}
```

### API Routes Mapping

| Convex Function | Prisma API Route | Method |
|-----------------|------------------|--------|
| `estatePlanning.createEstatePlan` | `/api/estate-plans` | POST |
| `queries.getEstatePlan` | `/api/estate-plans/[id]` | GET |
| `estatePlanning.updateEstatePlan` | `/api/estate-plans/[id]` | PUT |
| `estatePlanning.updateIntakeData` | `/api/estate-plans/[id]/intake/[section]` | PUT |
| `queries.getIntakeData` | `/api/estate-plans/[id]/intake/[section]` | GET |
| `gapAnalysis.runGapAnalysis` | `/api/gap-analysis` | POST |
| `queries.getGapAnalysis` | `/api/estate-plans/[id]/gap-analysis` | GET |
| `uploadedDocuments.saveUploadedDocument` | `/api/estate-plans/[id]/uploaded-documents` | POST |
| `reminders.createReminder` | `/api/estate-plans/[id]/reminders` | POST |

---

## Frontend Data Fetching

### Convex Approach

```tsx
// Using Convex React hooks
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function MyComponent({ estatePlanId }) {
  // Read data (auto-updates via WebSocket)
  const estatePlan = useQuery(api.queries.getEstatePlan, { id: estatePlanId });

  // Write data
  const updatePlan = useMutation(api.estatePlanning.updateEstatePlan);

  const handleUpdate = async () => {
    await updatePlan({ estatePlanId, name: "New Name" });
    // No manual refetch needed - Convex auto-updates
  };

  if (!estatePlan) return <Loading />;
  return <div>{estatePlan.name}</div>;
}
```

### Prisma Approach

```tsx
// Using SWR + custom hooks
import { useEstatePlan, updateEstatePlan } from "@/app/hooks/usePrismaQueries";

function MyComponent({ estatePlanId }) {
  // Read data (polls at configured interval)
  const { data: estatePlan, mutate } = useEstatePlan(estatePlanId);

  const handleUpdate = async () => {
    await updateEstatePlan(estatePlanId, { name: "New Name" });
    // Manually trigger refetch
    mutate();
  };

  if (!estatePlan) return <Loading />;
  return <div>{estatePlan.name}</div>;
}
```

### Hook Migration Reference

| Convex Pattern | Prisma Hook |
|----------------|-------------|
| `useQuery(api.queries.getEstatePlan, { id })` | `useEstatePlan(id)` |
| `useQuery(api.queries.getIntakeData, { estatePlanId, section })` | `useIntakeData(estatePlanId, section)` |
| `useQuery(api.queries.getGapAnalysis, { estatePlanId })` | `useLatestGapAnalysis(estatePlanId)` |
| `useQuery(api.queries.getReminders, { estatePlanId })` | `useReminders(estatePlanId)` |
| `useMutation(api.estatePlanning.createEstatePlan)` | `createEstatePlan(sessionId)` |
| `useMutation(api.estatePlanning.updateIntakeData)` | `saveIntakeData(estatePlanId, section, data)` |

### Session ID Authentication

The Prisma branch uses `sessionId` for anonymous user authentication:

```typescript
// Getting sessionId (client-side)
function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('estatePlanSessionId');
}

// All API calls include sessionId
const response = await fetch(`/api/estate-plans?sessionId=${sessionId}`);
```

This replaces Convex's built-in session handling.

---

## New Features

The Prisma branch includes several new features not in the Convex branch:

### 1. Guided Intake Flow

**New Files:**
- `app/intake/guided/page.tsx` - Main guided flow page
- `app/intake/guided/[step]/page.tsx` - Individual step pages
- `lib/intake/guided-flow-config.ts` - Step configuration

**New Model:**
```prisma
model GuidedIntakeProgress {
  id             String     @id @default(cuid())
  estatePlanId   String     @unique
  currentStep    Int        @default(1)
  completedSteps Int[]      @default([])
  stepData       Json       @default("{}")
  flowMode       String     @default("guided")
}
```

### 2. Preparation Tasks

**New Pages:**
- `app/analysis/[estatePlanId]/prepare/page.tsx`
- `app/analysis/[estatePlanId]/prepare/documents/page.tsx`
- `app/analysis/[estatePlanId]/prepare/contacts/page.tsx`
- `app/analysis/[estatePlanId]/prepare/questions/page.tsx`

**New Models:**
```prisma
model FamilyContact { ... }
model AttorneyQuestion { ... }
model DocumentChecklistItem { ... }
```

### 3. Comprehensive Gap Analysis Orchestration

**New Files:**
- `lib/gap-analysis/orchestrator.ts` - Multi-phase analysis
- `lib/gap-analysis/prompts/*.ts` - Phase-specific prompts
- `app/api/gap-analysis/orchestrate/route.ts` - Orchestration endpoint

**New Models:**
```prisma
model GapAnalysisRun {
  id              String             @id @default(cuid())
  estatePlanId    String
  status          GapRunStatus       @default(pending)
  currentPhase    Int                @default(1)
  totalPhases     Int                @default(3)
  progressPercent Int                @default(0)
  phases          GapAnalysisPhase[]
}

model GapAnalysisPhase {
  id            String                 @id @default(cuid())
  runId         String
  phaseNumber   Int
  name          String
  status        GapRunStatus
  runResults    GapAnalysisRunResult[]
}
```

### 4. Enhanced Reminders

Reminders model now includes:
- Parent/child relationships for sub-tasks
- Auto-generation from gap analysis
- Source tracking (`sourceType`, `sourceId`)

---

## Step-by-Step Migration

### For Developers Switching to Postgres Branch

#### Step 1: Get the Branch

```bash
git fetch origin
git checkout postgres-migration-estateai
```

#### Step 2: Install Dependencies

```bash
cd mvp
npm install
```

New dependencies added:
- `@prisma/client` - Prisma ORM
- `@prisma/adapter-pg` - PostgreSQL adapter
- `@prisma/extension-accelerate` - Connection pooling
- `pg` - PostgreSQL driver
- `swr` - Data fetching
- `dotenv` - Environment variables

Removed dependencies:
- `convex` (in devDependencies)

#### Step 3: Set Up Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/estate_planning"
ANTHROPIC_API_KEY="sk-ant-api03-..."
E2B_API_KEY="e2b_..."

# Optional
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

#### Step 4: Set Up Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb estate_planning

# Run migrations
npx prisma migrate dev
```

**Option B: AWS RDS**
1. Create RDS PostgreSQL instance
2. Configure security groups for your IP
3. Update `DATABASE_URL` with RDS endpoint
4. Run migrations:
```bash
npx prisma migrate deploy
```

#### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

#### Step 6: Start Development Server

```bash
npm run dev
```

#### Step 7: Verify Setup

1. Open http://localhost:3000
2. Create a new estate plan
3. Complete some intake steps
4. Verify data persists (check with `npx prisma studio`)

---

## Common Patterns

### Converting Convex Query to Prisma

**Before (Convex):**
```tsx
const estatePlan = useQuery(api.queries.getEstatePlan,
  estatePlanId ? { id: estatePlanId as Id<"estatePlans"> } : "skip"
);
```

**After (Prisma):**
```tsx
const { data: estatePlan } = useEstatePlan(estatePlanId);
```

### Converting Convex Mutation to Prisma

**Before (Convex):**
```tsx
const createPlan = useMutation(api.estatePlanning.createEstatePlan);

const handleCreate = async () => {
  const id = await createPlan({ sessionId });
  router.push(`/intake?planId=${id}`);
};
```

**After (Prisma):**
```tsx
const handleCreate = async () => {
  const plan = await createEstatePlan(sessionId);
  router.push(`/intake?planId=${plan.id}`);
};
```

### Handling Loading States

**Before (Convex):**
```tsx
if (estatePlan === undefined) return <Loading />;
if (estatePlan === null) return <NotFound />;
```

**After (Prisma):**
```tsx
const { data: estatePlan, isLoading, error } = useEstatePlan(id);

if (isLoading) return <Loading />;
if (error) return <Error />;
if (!estatePlan) return <NotFound />;
```

### Manual Cache Invalidation

Convex auto-updates via WebSocket. With SWR, manually invalidate:

```tsx
import { mutate } from "swr";

// After mutation
await updateEstatePlan(id, data);

// Invalidate specific key
mutate(`/api/estate-plans/${id}`);

// Or invalidate pattern
mutate(
  (key) => typeof key === 'string' && key.includes('/api/estate-plans'),
  undefined,
  { revalidate: true }
);
```

---

## Troubleshooting

### Common Issues

#### 1. "PrismaClientInitializationError"

**Cause:** Database URL not configured or invalid.

**Fix:**
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

#### 2. "401 Unauthorized" on API calls

**Cause:** Missing sessionId in request.

**Fix:** Ensure all API calls include sessionId:
```typescript
const sessionId = localStorage.getItem('estatePlanSessionId');
fetch(`/api/estate-plans?sessionId=${sessionId}`);
```

#### 3. "ECONNREFUSED" to localhost:5432

**Cause:** PostgreSQL not running.

**Fix:**
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
net start postgresql-x64-14
```

#### 4. Data not updating after mutation

**Cause:** SWR cache not invalidated.

**Fix:** Call `mutate()` after mutations:
```typescript
const { mutate } = useSWR('/api/estate-plans');
await createEstatePlan(data);
mutate(); // Refresh cache
```

#### 5. "prisma studio" not working

**Cause:** Prisma 7.3+ removed `url` from schema.

**Fix:**
```bash
npx prisma studio --url "$DATABASE_URL"
```

### Getting Help

- Check API route for the endpoint being called
- Verify sessionId is being passed
- Check browser Network tab for request/response
- Check terminal for server-side errors
- Use `npx prisma studio` to inspect database

---

## Files Reference

### Removed (Convex-specific)

```
convex/
├── _generated/
├── schema.ts
├── queries.ts
├── mutations.ts
├── estatePlanning.ts
├── gapAnalysis.ts
├── uploadedDocuments.ts
├── reminders.ts
└── ...

app/ConvexClientProvider.tsx
app/hooks/useAuthSync.ts
```

### Added (Prisma-specific)

```
prisma/
└── schema.prisma

lib/
├── db.ts
├── auth-helper.ts
├── gap-analysis/
│   ├── orchestrator.ts
│   ├── prompts/
│   └── ...
└── intake/
    └── guided-flow-config.ts

app/api/
├── estate-plans/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       ├── intake/
│       ├── gap-analysis/
│       ├── reminders/
│       └── ...
├── gap-analysis/
│   ├── route.ts
│   └── orchestrate/
└── ...

app/hooks/
├── usePrismaQueries.ts
└── useAuthSyncPrisma.ts

app/intake/guided/
├── page.tsx
└── [step]/page.tsx

app/analysis/[estatePlanId]/prepare/
├── page.tsx
├── documents/page.tsx
├── contacts/page.tsx
└── questions/page.tsx
```

---

## Summary

The migration from Convex to Prisma/PostgreSQL provides:

1. **More control** over database and infrastructure
2. **Standard SQL** database with full query capabilities
3. **Self-hosted option** (no vendor lock-in)
4. **New features** (guided intake, preparation tasks, comprehensive analysis)

Trade-offs:
- More boilerplate code (API routes vs Convex functions)
- Manual cache management (SWR vs Convex real-time)
- More infrastructure to manage (PostgreSQL server)

The architecture is more conventional and portable, making it easier for developers familiar with REST APIs and SQL databases.
