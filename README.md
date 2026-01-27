# EstateAI: AI-Powered Estate Planning Assistant

> **Draft Documents Only** -- This tool generates draft legal documents for informational purposes only. All generated documents should be reviewed by a licensed attorney before use. This is not a substitute for professional legal advice.

---

## Overview

EstateAI is an AI-powered estate planning platform that helps high-net-worth individuals ($2M--$50M) understand, analyze, and improve their estate plans. Users complete a guided intake questionnaire, receive an AI-driven gap analysis of their estate plan, upload existing legal documents for review, and generate draft legal documents -- all tailored to their state's specific legal requirements.

### Key Capabilities

- **Guided Intake Wizard** -- Multi-step questionnaire covering personal info, family, assets, existing documents, and estate planning goals
- **AI Gap Analysis** -- Three-phase orchestrated analysis (state law research, document analysis, synthesis) producing risk-scored findings and prioritized recommendations
- **Document Generation** -- Draft generation of 7 legal document types (wills, trusts, POAs, healthcare directives, HIPAA authorizations, instruction letters) with 50-state compliance
- **Document Upload and AI Review** -- Upload existing PDFs for AI-powered analysis, cross-referencing against intake data to detect conflicts and outdated provisions
- **Estate Visualization** -- Interactive family tree and asset distribution diagrams
- **Beneficiary Tracking** -- Track designations across retirement accounts, life insurance, and TOD/POD accounts
- **Reminder System** -- Automated notifications for document reviews and life event triggers

---

## Repository Structure

```
SICC/
├── README.md                 # This file
├── mvp/                      # MVP application (Next.js + Convex)
│   ├── app/                  # Next.js App Router (pages, API routes, components)
│   ├── convex/               # Convex backend (schema, queries, mutations, actions)
│   ├── backend/              # Backend architecture overview
│   ├── frontend/             # Frontend architecture overview
│   ├── agents/               # AI agent architecture overview
│   ├── components/           # Shared React components
│   ├── lib/                  # Document templates, gap analysis orchestration, utilities
│   ├── skills/               # AI skill definitions (estate analyzer, financial classifier)
│   ├── types/                # TypeScript type definitions
│   ├── package.json          # Dependencies and scripts
│   ├── .env.example          # Environment variable template
│   └── README.md             # MVP-specific setup and development docs
├── docs/                     # Business and technical documentation
│   ├── architecture.md       # System architecture and data flows
│   ├── business-plan.md      # Opportunity brief, personas, revenue model
│   ├── research-notes.md     # User research, competitive analysis, legal considerations
│   ├── tam-analysis.md       # Total addressable market sizing
│   └── budget-summary.md     # Development budget and cost analysis
├── data/                     # Data assets
│   ├── sample-data/          # Sample data for testing and demos
│   └── schemas/              # Data schema definitions
├── scripts/                  # Utility scripts
├── demo/                     # Demo materials
│   ├── demo-script.md        # 5-7 minute demo walkthrough script
│   └── setup-instructions.md # Demo environment setup guide
└── slides/
    └── final-deck.md         # Pitch deck content outline
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 16, React 19, TypeScript | App framework with SSR and App Router |
| Styling | Tailwind CSS 4, Framer Motion | Utility-first CSS and animations |
| Backend | Convex | Real-time database and serverless functions |
| AI | Anthropic Claude API | Gap analysis, document generation, document review |
| Sandboxing | E2B SDK | Isolated code execution environment |
| Auth | Clerk | User authentication and session management |
| Notifications | Resend, Web Push | Email and push notification delivery |
| Deployment | Vercel + Convex Cloud | Frontend hosting and backend infrastructure |

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16)                        │
│                                                                  │
│   Intake Wizard ──→ Gap Analysis ──→ Document     ──→ Document   │
│   (5 steps +        (3-phase         Generation       Upload &   │
│    guided mode)      orchestration)   (7 doc types)   AI Review  │
│                                                                  │
│   Estate Visualization │ Beneficiary Tracking │ Reminders        │
└───────────────┬──────────────────────────────────┬───────────────┘
                │          Convex SDK              │
                ▼                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Convex Backend                               │
│                                                                  │
│   22 tables │ Real-time queries │ Serverless actions │ Cron jobs │
│                                                                  │
│   Gap Analysis Orchestration (3 phases):                         │
│     Phase 1: State law research                                  │
│     Phase 2: Document/family/asset analysis                      │
│     Phase 3: Scenario synthesis + priority matrix                │
└───────────────┬──────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────┐
│   Claude API (Anthropic)  │  E2B Sandbox (isolated execution)   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A [Convex](https://convex.dev) account (free tier available)
- An [Anthropic](https://console.anthropic.com) API key
- An [E2B](https://e2b.dev) API key

### Quick Start

```bash
# Clone the repository
git clone https://github.com/preston-cell/SICC.git
cd SICC/mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see .env.example for details)

# Start the Convex backend (in one terminal)
npx convex dev

# Start the Next.js dev server (in another terminal)
npm run dev

# Open http://localhost:3000
```

### Optional: Authentication

Clerk authentication is optional. Without Clerk keys, the app runs in anonymous session mode. To enable auth, add your Clerk keys to `.env.local` (see `.env.example`).

---

## Documentation

| Document | Description |
|----------|-------------|
| [MVP README](mvp/README.md) | Development setup, project structure, and deployment |
| [Architecture](docs/architecture.md) | System architecture, data flows, and technical design |
| [Business Plan](docs/business-plan.md) | Opportunity brief, customer personas, revenue model |
| [TAM Analysis](docs/tam-analysis.md) | Market sizing and geographic prioritization |
| [Research Notes](docs/research-notes.md) | User research, competitive analysis, legal considerations |
| [Budget Summary](docs/budget-summary.md) | Development costs and infrastructure budget |
| [Demo Script](demo/demo-script.md) | 5-7 minute demo walkthrough |
| [Demo Setup](demo/setup-instructions.md) | Demo environment configuration |
| [Pitch Deck](slides/final-deck.md) | Investor pitch deck outline |

---

## Target Market

**Primary:** Individuals with net worth between $2M and $50M

| Segment | Fit |
|---------|-----|
| <$2M | Basic needs -- DIY tools often suffice |
| **$2M--$50M** | **Complex enough for professional analysis, underserved by traditional services** |
| >$50M | Requires white-glove human services |

**Initial Geographic Focus:** Massachusetts (with planned expansion to NY, CA, FL)

---

## Key Design Principles

1. **"There is no single estate plan -- there is a document ecosystem"** -- Analysis examines cross-document relationships, not just individual documents
2. **"Most estate failures occur not because documents are missing, but because they conflict"** -- The system prioritizes conflict detection across beneficiary designations, trustees, and asset ownership
3. **"If the state default result is unacceptable, a document is required"** -- Gap analysis compares user situations against state intestacy laws to identify coverage gaps

---

## Team

| Name | Role |
|------|------|
| Preston Dinh | Developer |
| Ezekiel Dube-Garrett | Developer |
| Keegan Harrison | Developer |
| Colton Pozniak | Developer |

Built at [Link Studio](https://linkstudio.io).

---

## Legal Disclaimer

**This tool is for informational and educational purposes only.**

- Generated documents are **drafts** that require review by a licensed attorney
- This tool does **not** provide legal advice
- No attorney-client relationship is formed by using this tool
- Laws vary by state; documents should be reviewed for state-specific compliance
- Users should consult with a qualified estate planning attorney before executing any legal documents

---

## License

Proprietary -- Link Studio
