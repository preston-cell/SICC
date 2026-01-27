# EstateAI MVP

AI-powered estate planning platform built with Next.js, Convex, and Claude API.

---

## Features

### Guided Intake Wizard
Five-step questionnaire (personal info, family situation, assets, existing documents, goals) with a guided wizard mode, progress persistence, and auto-save. Supports both anonymous sessions and authenticated users.

### Three-Phase AI Gap Analysis
Orchestrated analysis pipeline powered by Claude:
1. **Phase 1 -- Research**: State-specific law research, estate complexity classification
2. **Phase 2 -- Analysis**: Document inventory, family protection, and asset protection analysis
3. **Phase 3 -- Synthesis**: Scenario modeling (8 what-if scenarios), priority matrix, final recommendations

Produces risk-scored findings with severity levels (critical, high, medium, advisory) and plain-English explanations.

### Document Generation
Generates draft legal documents for 7 document types, compliant with all 50 US states:
- Last Will and Testament
- Revocable Living Trust
- Durable Power of Attorney (Financial)
- Healthcare Power of Attorney
- Healthcare Directive / Living Will
- HIPAA Authorization
- Instruction Letters

### Document Upload and AI Review
Upload existing PDFs for AI-powered analysis:
- Text extraction and document understanding
- Provision-by-provision analysis with plain-English explanations
- Cross-referencing against intake data (detects conflicts, outdated provisions, missing beneficiaries)
- Hypothetical scenario exploration ("What if I become incapacitated?")

### Additional Features
- **Estate Visualization** -- Family tree and asset flow diagrams (Recharts)
- **Beneficiary Tracking** -- Retirement accounts, life insurance, TOD/POD designations
- **Reminder System** -- Document review reminders with life event triggers
- **Legal Glossary** -- Inline tooltips for legal terminology
- **Notification System** -- Email (Resend) and web push notifications

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.1.1 |
| UI | React, TypeScript | 19.2.3, 5.x |
| Styling | Tailwind CSS, Framer Motion | 4.x, 12.x |
| Backend | Convex (real-time DB + serverless) | 1.31.4 |
| AI | Anthropic Claude API | 0.71.2 |
| Sandbox | E2B SDK | 2.10.1 |
| Auth | Clerk (optional) | 6.36.7 |
| Charts | Recharts | 3.6.0 |
| PDF Export | html2pdf.js | 0.14.0 |
| Notifications | Resend, web-push | -- |

---

## Project Structure

```
mvp/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout (Clerk + Convex providers)
│   ├── intake/                    # Intake wizard (5 steps + guided mode)
│   │   ├── personal/             # Step 1: Personal information
│   │   ├── family/               # Step 2: Family situation
│   │   ├── assets/               # Step 3: Assets and net worth
│   │   ├── existing/             # Step 4: Existing documents
│   │   ├── goals/                # Step 5: Estate planning goals
│   │   ├── upload/               # Document upload during intake
│   │   └── guided/               # Guided wizard mode
│   ├── analysis/[estatePlanId]/   # Gap analysis results and preparation
│   ├── documents/
│   │   ├── generate/[estatePlanId]/ # Document generation
│   │   └── upload/[estatePlanId]/   # Document upload and AI review
│   ├── api/                       # API routes
│   │   ├── gap-analysis/          # Gap analysis + orchestration
│   │   ├── document-generation/   # Document generation
│   │   ├── notifications/         # Notification processing
│   │   └── push/                  # Push notification delivery
│   └── components/                # Page-level UI components (40+)
│       └── ui/                    # Base UI component library
├── convex/                        # Convex backend
│   ├── schema.ts                  # Database schema (22 tables)
│   ├── queries.ts                 # Read operations
│   ├── mutations.ts               # Write operations
│   ├── gapAnalysis.ts             # Core gap analysis action
│   ├── gapAnalysisOrchestration.ts # 3-phase orchestration
│   ├── documentGeneration.ts      # Document generation action
│   ├── documentAnalysis.ts        # AI document review action
│   └── ...                        # Reminders, notifications, users, etc.
├── lib/                           # Shared libraries
│   ├── documentTemplates/         # Legal document templates (7 types)
│   ├── gap-analysis/              # Orchestrator, prompts, aggregators
│   ├── intake/                    # Guided flow config, question helpers
│   ├── email/                     # Resend integration
│   └── push/                      # Push notification subscriptions
├── skills/                        # AI skill definitions
│   ├── estate-document-analyzer/  # Document analysis skill + references
│   ├── financial-profile-classifier/ # Net worth tier classification
│   ├── ma-estate-planning-analyzer/  # Massachusetts-specific analysis
│   └── us-estate-planning-analyzer/  # 50-state analysis framework
├── components/                    # Shared components (intake navigation, etc.)
├── types/                         # TypeScript type definitions
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── middleware.ts                  # Clerk auth middleware
└── .env.example                   # Environment variable template
```

---

## Setup

### Prerequisites

- Node.js 20+
- npm
- [Convex](https://convex.dev) account
- [Anthropic](https://console.anthropic.com) API key
- [E2B](https://e2b.dev) API key

### Installation

```bash
cd mvp

# Install dependencies
npm install

# Copy environment template and add your keys
cp .env.example .env.local

# Start Convex backend (terminal 1)
npx convex dev

# Start Next.js dev server (terminal 2)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [`.env.example`](.env.example) for all variables. The required ones are:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL |
| `ANTHROPIC_API_KEY` | Yes | Claude API for AI features |
| `E2B_API_KEY` | Yes | Sandbox execution environment |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | No | Enables authentication (anonymous mode without) |
| `RESEND_API_KEY` | No | Email notifications |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | No | Web push notifications |

### Convex Setup

1. Create an account at [convex.dev](https://convex.dev)
2. Run `npx convex dev` -- this initializes the project and syncs the schema
3. Copy the deployment URL to `NEXT_PUBLIC_CONVEX_URL` in `.env.local`

---

## Scripts

```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npx convex dev    # Start Convex dev backend
```

---

## Deployment

```bash
# Deploy Convex backend to production
npx convex deploy --yes

# Deploy frontend to Vercel
npx vercel --prod --yes
```

---

## Database Schema

The Convex backend uses 22 tables. Key tables:

| Table | Purpose |
|-------|---------|
| `estatePlans` | Main container for each estate plan session |
| `intakeData` | Questionnaire responses by section |
| `gapAnalysis` | Gap analysis results with scores and recommendations |
| `gapAnalysisRuns` | 3-phase orchestration tracking |
| `documents` | Generated legal documents |
| `uploadedDocuments` | User-uploaded PDFs with analysis status |
| `beneficiaryDesignations` | Beneficiary tracking across accounts |
| `reminders` | Review reminders with recurrence patterns |
| `users` | User accounts (optional auth) |

See [`convex/schema.ts`](convex/schema.ts) for the full schema definition.

---

## AI Skills

The `skills/` directory contains structured knowledge that guides Claude's analysis:

| Skill | Purpose |
|-------|---------|
| `estate-document-analyzer` | Analyzes uploaded legal documents, extracts key provisions |
| `financial-profile-classifier` | Classifies net worth tiers for document recommendations |
| `ma-estate-planning-analyzer` | Massachusetts-specific compliance, MassHealth, tax strategies |
| `us-estate-planning-analyzer` | 50-state legal requirements with per-state reference files |

---

## Development Roadmap

See [ROADMAP.md](ROADMAP.md) for completed phases (1-9) and planned future work.
