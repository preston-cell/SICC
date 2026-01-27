# EstateAI: Technical Architecture

## System Overview

EstateAI is built on a modern full-stack architecture using **Next.js 16** for the frontend and API layer, **PostgreSQL** via **Prisma ORM** for the database, **SWR** for client-side data fetching, and **E2B** for isolated AI execution. Claude API and Claude Code CLI run inside E2B sandboxes to analyze estate planning documents and generate draft legal documents.

---

## Architecture Diagram

```
+-------------------------------------------------------------------------+
|                            CLIENT LAYER                                  |
|-------------------------------------------------------------------------|
|                                                                          |
|  +-------------------------------------------------------------------+  |
|  |                    Next.js 16 (App Router)                         |  |
|  |                                                                    |  |
|  |  +------------------+  +------------------+  +------------------+  |  |
|  |  |  Intake Wizard   |  |  Analysis View   |  |  Documents       |  |  |
|  |  |  * Guided (8     |  |  * Gap report    |  |  * Generation    |  |  |
|  |  |    steps)        |  |  * Score/risks   |  |  * Upload/       |  |  |
|  |  |  * Comprehensive |  |  * Visualization |  |    analysis      |  |  |
|  |  |  * Upload        |  |  * Reminders     |  |  * Preview       |  |  |
|  |  +--------+---------+  +--------+---------+  +--------+---------+  |  |
|  |           |                     |                     |             |  |
|  |           |    SWR hooks (usePrismaQueries.ts)        |             |  |
|  |           |    fetch('/api/...') + sessionId/auth     |             |  |
|  |           +---------------------+---------------------+             |  |
|  |                                 |                                   |  |
|  +---------------------------------+-----------------------------------+  |
|                                    |                                     |
+------------------------------------+-------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        NEXT.JS API LAYER                                 |
|-------------------------------------------------------------------------|
|                                                                          |
|  +-------------------------------------------------------------------+  |
|  |                  27 REST API Routes (app/api/)                     |  |
|  |                                                                    |  |
|  |  +----------------+  +----------------+  +----------------+        |  |
|  |  |  Estate Plans  |  |  Gap Analysis  |  |  Documents     |        |  |
|  |  |  CRUD + nested |  |  Quick + Orch. |  |  Gen + Upload  |        |  |
|  |  +----------------+  +----------------+  +----------------+        |  |
|  |  +----------------+  +----------------+  +----------------+        |  |
|  |  |  Intake Data   |  |  Reminders     |  |  Users + Auth  |        |  |
|  |  |  5 sections    |  |  Life events   |  |  Clerk/session |        |  |
|  |  +----------------+  +----------------+  +----------------+        |  |
|  |                                                                    |  |
|  +-------------------------------------------------------------------+  |
|                                    |                                     |
|  +-------------------------------------------------------------------+  |
|  |              Prisma ORM (lib/db.ts)                                |  |
|  |                                                                    |  |
|  |  +----------------------------+  +-----------------------------+   |  |
|  |  |     19 Database Models     |  |      Indexes & Relations    |   |  |
|  |  |                            |  |                             |   |  |
|  |  |  User, EstatePlan,        |  |  Cascade deletes            |   |  |
|  |  |  IntakeData, Document,    |  |  Composite indexes          |   |  |
|  |  |  GapAnalysis, Reminder,   |  |  Full-text search           |   |  |
|  |  |  BeneficiaryDesignation,  |  |  Session + User ownership   |   |  |
|  |  |  GapAnalysisRun/Phase,    |  |                             |   |  |
|  |  |  UploadedDocument, etc.   |  |                             |   |  |
|  |  +----------------------------+  +-----------------------------+   |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+----------------------------------+--------------------------------------+
                                   |
                                   v
+-------------------------------------------------------------------------+
|                         POSTGRESQL DATABASE                              |
|-------------------------------------------------------------------------|
|  Local development or AWS RDS (production)                               |
|  SSL/TLS required for RDS connections                                    |
|  Prisma Accelerate supported for connection pooling                      |
+-------------------------------------------------------------------------+

                                   |
                                   v (for AI analysis)
+-------------------------------------------------------------------------+
|                           E2B SANDBOX                                    |
|-------------------------------------------------------------------------|
|                                                                          |
|  +-------------------------------------------------------------------+  |
|  |                 Isolated Execution Environment                     |  |
|  |                                                                    |  |
|  |  +--------------------------------------------------------------+ |  |
|  |  |               Claude Code CLI + Claude API                    | |  |
|  |  |                                                               | |  |
|  |  |  3-Phase Comprehensive Analysis:                              | |  |
|  |  |  Phase 1: Research (state law, client context, doc inventory) | |  |
|  |  |  Phase 2: Analysis (7 parallel runs - tax, medicaid, etc.)   | |  |
|  |  |  Phase 3: Synthesis (scenarios, priority matrix, report)      | |  |
|  |  |                                                               | |  |
|  |  |  Document Generation:                                         | |  |
|  |  |  Wills, trusts, POAs, healthcare directives, HIPAA            | |  |
|  |  |                                                               | |  |
|  |  +--------------------------------------------------------------+ |  |
|  |                                                                    |  |
|  |  Security: Isolated filesystem, network restrictions, time limits  |  |
|  |                                                                    |  |
|  +-------------------------------------------------------------------+  |
|                                                                          |
+-------------------------------------------------------------------------+
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | User interface, server-side rendering |
| **Styling** | Tailwind CSS 4, Framer Motion | Responsive design, animations |
| **Data Fetching** | SWR | Client-side caching, revalidation |
| **API** | Next.js Route Handlers | 27 REST API endpoints |
| **Database** | PostgreSQL via Prisma ORM 7.3 | Relational data, 19 models |
| **Auth** | Clerk (optional) + session-based | Authentication with anonymous fallback |
| **AI** | Claude API (Anthropic SDK) + Claude Code CLI | Document analysis and generation |
| **Sandboxing** | E2B SDK | Isolated code execution for AI |
| **Validation** | Zod | Request/response schema validation |
| **Hosting** | Vercel (frontend) + AWS RDS (database) | Production deployment |

---

## Core Components

### 1. Frontend (Next.js App Router)

**Location:** `mvp/app/`

```
app/
├── page.tsx                    # Landing page / dashboard
├── layout.tsx                  # Root layout (Clerk + auth providers)
├── intake/                     # Intake wizard (3 modes)
│   ├── guided/[step]/          # 8-step conversational flow
│   ├── personal/               # Comprehensive form sections
│   ├── family/, assets/, goals/
│   └── upload/                 # Document upload for AI extraction
├── analysis/[estatePlanId]/    # Gap analysis results
│   ├── visualization/          # Charts and what-if scenarios
│   ├── prepare/                # Preparation tasks during analysis
│   └── reminders/              # Reminder management
├── documents/                  # Document generation & upload
├── hooks/                      # SWR data fetching hooks
│   └── usePrismaQueries.ts    # All API query hooks
└── components/                 # UI components
```

**Key Features:**
- SWR-based data fetching with automatic caching and revalidation
- Session-based anonymous auth (localStorage sessionId)
- Optional Clerk integration for registered users
- Auto-save with 2-second debounce on intake forms

**Data Fetching Pattern:**
```typescript
// SWR hooks for data fetching
const { data: plan } = useEstatePlan(estatePlanId);
const { data: analysis } = useLatestGapAnalysis(estatePlanId);

// Mutations via fetch to API routes
await authFetch(`/api/estate-plans/${id}/intake/personal`, {
  method: 'PUT',
  body: JSON.stringify({ data, isComplete: true }),
});
```

### 2. API Layer (Next.js Route Handlers)

**Location:** `mvp/app/api/`

27 REST endpoints organized by resource:

```
api/
├── estate-plans/               # GET, POST
│   └── [id]/                   # GET, PATCH, DELETE
│       ├── intake/             # GET, PUT (by section)
│       ├── guided-intake/      # GET, POST, PUT
│       ├── gap-analysis/       # GET, POST
│       ├── gap-analysis-runs/  # GET, POST, PUT
│       ├── documents/          # GET, POST
│       ├── uploaded-documents/ # GET, POST, DELETE, PATCH
│       ├── beneficiaries/      # GET, POST, PUT
│       ├── reminders/          # GET, POST
│       ├── life-events/        # GET, POST, PATCH
│       ├── family-contacts/    # GET, POST, PUT, DELETE
│       ├── attorney-questions/ # GET, POST, PUT, DELETE
│       └── document-checklist/ # GET, POST, PUT, DELETE
├── gap-analysis/               # POST (quick mode)
│   └── orchestrate/            # POST (comprehensive 3-phase)
├── document-generation/        # POST
├── upload/                     # POST (PDF upload)
├── users/                      # GET, POST, PATCH
└── reminders/[id]/             # PATCH, DELETE
```

**Auth Pattern:**
```typescript
// All routes use ownership verification
const { authContext, error } = await requireAuthOrSessionAndOwnership(id, request);
if (error) return error;
```

### 3. Database (Prisma + PostgreSQL)

**Location:** `mvp/prisma/schema.prisma`

19 models with comprehensive relationships:

| Model | Purpose |
|-------|---------|
| User | Authenticated user accounts (Clerk integration) |
| EstatePlan | Core entity — links all resources |
| IntakeData | 5-section intake data (personal, family, assets, existing docs, goals) |
| GuidedIntakeProgress | Step-by-step guided flow tracking |
| Document | Generated legal documents (7 types) |
| GapAnalysis | Analysis results with scoring |
| GapAnalysisRun | Multi-phase orchestration tracking |
| GapAnalysisPhase | Individual phase status |
| GapAnalysisRunResult | Per-run results within phases |
| UploadedDocument | User-uploaded PDFs for AI analysis |
| ExtractedIntakeData | AI-extracted data from uploads |
| Reminder | Automated & manual reminders |
| LifeEvent | Life event tracking (marriage, birth, etc.) |
| BeneficiaryDesignation | Retirement, insurance, TOD/POD tracking |
| FamilyContact | Family members & advisor contacts |
| AttorneyQuestion | Questions to discuss with attorney |
| DocumentChecklistItem | Document preparation checklist |
| AgentRun | AI execution run tracking |
| GeneratedFile | Files produced by AI runs |

### 4. E2B Sandbox + AI

**Location:** `mvp/lib/e2b-executor.ts`, `mvp/lib/gap-analysis/`

**Two AI integration modes:**

1. **Direct Claude API** — Used for uploaded document analysis (PDF extraction + cross-referencing)
2. **E2B Sandbox + Claude Code CLI** — Used for comprehensive gap analysis and document generation

**3-Phase Comprehensive Analysis:**

| Phase | Runs | Execution | Duration |
|-------|------|-----------|----------|
| 1: Research | State law, client context, document inventory | Sequential | ~15 min |
| 2: Analysis | 7 specialized runs (tax, medicaid, beneficiary, etc.) | Parallel | ~7 min |
| 3: Synthesis | Scenario modeling, priority matrix, final report | Sequential | ~18 min |

---

## Data Flow

### Flow 1: Estate Plan Creation & Intake

```
User                    Next.js              API Routes           PostgreSQL
  |                        |                     |                    |
  |  Start guided intake   |                     |                    |
  |----------------------->|                     |                    |
  |                        |  POST /api/estate-  |                    |
  |                        |  plans              |                    |
  |                        |-------------------->|                    |
  |                        |                     |  prisma.estate     |
  |                        |                     |  Plan.create()     |
  |                        |                     |------------------->|
  |                        |                     |                    |
  |  Answer questions      |                     |                    |
  |  (auto-save 2s)        |                     |                    |
  |----------------------->|                     |                    |
  |                        |  PUT /api/estate-   |                    |
  |                        |  plans/[id]/guided  |                    |
  |                        |  -intake            |                    |
  |                        |-------------------->|                    |
  |                        |                     |  prisma.guided     |
  |                        |                     |  IntakeProgress    |
  |                        |                     |  .upsert()         |
  |                        |                     |------------------->|
```

### Flow 2: Gap Analysis (Comprehensive)

```
User                    Next.js              API Routes           E2B Sandbox
  |                        |                     |                    |
  |  Run analysis          |                     |                    |
  |----------------------->|                     |                    |
  |                        |  POST /api/gap-     |                    |
  |                        |  analysis/          |                    |
  |                        |  orchestrate        |                    |
  |                        |-------------------->|                    |
  |                        |                     |  Create            |
  |                        |                     |  GapAnalysisRun    |
  |                        |                     |                    |
  |                        |                     |  Phase 1: Research |
  |                        |                     |------------------->|
  |                        |                     |  (sequential)      |
  |                        |                     |                    |
  |  Poll for progress     |                     |  Phase 2: Analysis |
  |  (SWR revalidation)    |                     |------------------->|
  |<---------------------->|                     |  (7 parallel runs) |
  |                        |                     |                    |
  |                        |                     |  Phase 3: Synthesis|
  |                        |                     |------------------->|
  |                        |                     |  (sequential)      |
  |                        |                     |                    |
  |  View results          |                     |  Save GapAnalysis  |
  |<-----------------------|                     |  to PostgreSQL     |
```

### Flow 3: Document Upload & AI Analysis

```
User                    Next.js              API Routes           Claude API
  |                        |                     |                    |
  |  Upload PDF            |                     |                    |
  |----------------------->|                     |                    |
  |                        |  POST /api/upload   |                    |
  |                        |  (FormData)         |                    |
  |                        |-------------------->|                    |
  |                        |                     |  Validate PDF      |
  |                        |                     |  (magic bytes)     |
  |                        |                     |  Save to disk      |
  |                        |                     |                    |
  |  Trigger analysis      |                     |                    |
  |----------------------->|                     |                    |
  |                        |  POST /api/.../     |                    |
  |                        |  analyze            |                    |
  |                        |-------------------->|                    |
  |                        |                     |  Extract text      |
  |                        |                     |------------------->|
  |                        |                     |  (Claude Sonnet 4) |
  |                        |                     |                    |
  |                        |                     |  Cross-reference   |
  |                        |                     |  with intake data  |
  |                        |                     |------------------->|
  |                        |                     |                    |
  |  View analysis         |                     |  Save results      |
  |<-----------------------|                     |  to PostgreSQL     |
```

---

## Estate Planning Domain Logic

The estate planning domain logic runs inside Claude Code (E2B sandbox) and Claude API. The AI is prompted with context about:

### Document Types Supported

```
├── Core Incapacity Documents
│   ├── Durable Power of Attorney (financial)
│   ├── Limited/Special Power of Attorney
│   ├── Springing Power of Attorney
│   ├── Healthcare Power of Attorney
│   ├── Advance Healthcare Directive/Living Will
│   ├── HIPAA Authorization
│   ├── Mental Health Treatment Declaration
│   ├── Anatomical Gift/Organ Donation Authorization
│   ├── POLST/MOLST
│   └── Supported Decision-Making Agreement
├── Core Death & Transfer Documents
│   ├── Last Will and Testament
│   ├── Pour-Over Will
│   ├── Codicil
│   ├── Revocable Living Trust
│   ├── Trust Restatement / Amendment
│   ├── Irrevocable Trust
│   ├── Letter of Instruction
│   └── Memorandum of Personal Property
├── Trust Sub-Types
│   ├── Asset Protection/Tax (Grantor, IDGT, SLAT, QPRT, Dynasty, DAPT)
│   ├── Benefit-Specific (SNT, Spendthrift, Education, Minor's, Incentive)
│   └── Charitable (CRT, CLT, Private Foundation, DAF Agreement)
├── Business Documents
│   ├── Buy-Sell Agreement
│   ├── Operating Agreement (LLC)
│   └── Succession Documents
├── Family & Relationship Documents
│   ├── Prenuptial/Postnuptial Agreements
│   ├── Guardianship Nomination
│   └── UTMA/UGMA Documents
└── Digital Assets
    ├── Digital Asset Authorization (RUFADAA-compliant)
    ├── Cryptocurrency Custody Instructions
    └── Online Account Access Memorandum
```

### Gap Detection Categories

The AI identifies gaps across four severity levels:

| Severity | Weight | Examples |
|----------|--------|----------|
| **Critical** | 100 | Deceased fiduciary, improper execution, unfunded trust |
| **High** | 75 | Outdated beneficiary, missing incapacity planning |
| **Medium** | 50 | Missing contingent beneficiary, asset changes |
| **Advisory** | 25 | Tax optimization, family governance |

### Wealth-Based Recommendations

Claude Code uses wealth tier logic to recommend appropriate documents:

| Net Worth | Core Recommendations |
|-----------|---------------------|
| $0-$25K | Healthcare POA, Living Will, HIPAA |
| $25K-$100K | + Simple Will, Durable POA |
| $100K-$250K | + Revocable Trust, Pour-over Will |
| $250K-$1M | + Funded trust, digital assets |
| $1M-$5M | + Irrevocable trusts, SLAT |
| $5M-$25M | + GRATs, IDGTs, ILIT |
| $25M-$50M | + Dynasty trusts, family governance |

### Non-Asset Override Conditions

Certain situations require specific documents regardless of asset level:

| Condition | Required Documents |
|-----------|-------------------|
| Minor children | Guardianship nomination, Minor's trusts |
| Business owner | Buy-sell agreement, Succession planning |
| Disabled beneficiary | Special Needs Trust |
| Blended family | Trusts (not just wills), QTIP provisions |
| High liability profession | Asset protection trusts |

---

## Security Architecture

### Transport Security
- All connections use HTTPS/TLS
- PostgreSQL connections use SSL (required for AWS RDS)
- Prisma Accelerate supported for connection pooling

### Application Security
- Clerk handles authentication (optional, with session-based fallback)
- Ownership verification on all API routes (user or session)
- Rate limiting: 100 requests/minute per IP (middleware)
- Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- API keys stored as environment variables, never exposed to client
- Zod schema validation on all API inputs

### Data Security
- PostgreSQL with encryption at rest (AWS RDS)
- File uploads validated via magic bytes (PDF verification)
- Upload size limit: 20MB
- Sensitive content never logged
- E2B sandboxes are isolated and ephemeral

### Sandbox Security
- E2B sandboxes are fully isolated
- No network access to internal services
- Time limits prevent runaway processes (configurable, up to 60 min)
- Sandboxes are destroyed after use

---

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://...          # PostgreSQL connection
ANTHROPIC_API_KEY=sk-ant-...           # For Claude API + Claude Code
E2B_API_KEY=e2b_...                    # For E2B sandboxes

# Optional
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...  # Clerk auth (public)
CLERK_SECRET_KEY=sk_...                    # Clerk auth (server)
```

---

## Deployment Architecture

### Development
```
Local Machine
├── Next.js dev server (localhost:3000)
├── PostgreSQL (localhost:5432)
├── Prisma Studio (localhost:5555)
└── E2B sandboxes (cloud)
```

### Production
```
+-------------------+     +-------------------+     +-------------------+
|      Vercel       |     |    AWS RDS        |     |       E2B         |
|   (Frontend +     |---->|   (PostgreSQL)    |     |   (Sandboxes)     |
|    API Routes)    |     |                   |     |                   |
|                   |     |  19 tables        |     |  Claude Code CLI  |
|  Next.js SSR      |     |  SSL encrypted    |     |  Isolated exec    |
|  Edge middleware   |     |  Auto backups     |     |  Up to 60 min     |
+-------------------+     +-------------------+     +-------------------+
```

---

## Scalability

### Current Architecture Supports
- Vercel edge functions for API routes
- PostgreSQL connection pooling via Prisma Accelerate
- Concurrent E2B sandbox executions
- SWR client-side caching reduces API load

### Limits
- E2B sandbox timeout: configurable (up to 60 min for comprehensive analysis)
- PostgreSQL: standard RDS scaling (read replicas, instance sizing)
- Claude API: subject to Anthropic rate limits
- Vercel: 15-minute function timeout (extended for analysis routes)
