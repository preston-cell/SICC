# EstateAI: AI-Powered Estate Planning Assistant

> **Draft Documents Only** - This tool generates draft legal documents for informational purposes only. All generated documents should be reviewed by a licensed attorney before use. This is not a substitute for professional legal advice.

---

## Overview

EstateAI is an AI-powered estate planning tool that provides **gap analysis** of existing estate plans and generates **draft legal documents**. Built with Next.js, Convex, and E2B, using Claude Code to intelligently analyze user situations and generate customized legal documents.

### What It Does

1. **Gap Analysis**: Upload or describe your current estate planning situation, and receive AI-powered analysis identifying missing documents, outdated provisions, or potential issues
2. **Document Generation**: Generate draft legal documents (wills, trusts, powers of attorney, healthcare directives, etc.) tailored to your specific situation
3. **Guided Experience**: Walk through estate planning step-by-step with AI assistance

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 | User interface |
| **Backend** | Convex | Real-time database + serverless functions |
| **Sandboxing** | E2B SDK | Isolated code execution for document generation |
| **AI** | Claude Code CLI (@anthropic-ai/claude-code) | Document analysis and generation |

---

## Project Structure

```
├── app/
│   ├── components/
│   │   └── FilePreviewModal.tsx    # Modal for previewing generated documents
│   ├── ConvexClientProvider.tsx    # Convex React client setup
│   ├── layout.tsx                  # Root layout with metadata
│   ├── page.tsx                    # Main UI: prompt input, status, document list
│   └── globals.css                 # Tailwind CSS
├── convex/
│   ├── schema.ts                   # Database schema (agentRuns, generatedFiles)
│   ├── mutations.ts                # Internal mutations (createRun, updateRun, saveFile)
│   ├── queries.ts                  # Queries (getRun, listRuns, getFilesForRun)
│   └── runAgent.ts                 # Main action: runs Claude Code in E2B sandbox
├── docs/                           # Business documentation
│   ├── business-plan.md            # Opportunity refinement brief
│   ├── tam-analysis.md             # Market sizing analysis
│   ├── research-notes.md           # Research and insights
│   └── architecture.md             # Technical architecture details
├── mvp/                            # MVP implementation
│   └── feasibility-spike.md        # Technical validation spikes
├── slides/                         # Pitch materials
│   └── final-deck.md               # Pitch deck outline
├── demo/                           # Demo resources
│   ├── demo-script.md              # Demo walkthrough script
│   └── setup-instructions.md       # Demo setup guide
└── package.json
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐   │
│  │ Estate Input  │→ │ Analysis View │  │   Documents    │   │
│  │ (situation,   │  │ (gap report,  │  │   (download,   │   │
│  │  goals, assets│  │  suggestions) │  │    preview)    │   │
│  └───────────────┘  └───────────────┘  └────────────────┘   │
│           │                ↑                   ↑            │
│           ↓                │                   │            │
│    useAction(runAgent)   useQuery(getRun, getFilesForRun)   │
└───────────────┬─────────────────────────────────┬───────────┘
                │                                 │
                ↓                                 ↓
┌─────────────────────────────────────────────────────────────┐
│                      Convex Backend                          │
│  ┌──────────────────┐       ┌─────────────────────────────┐ │
│  │  runAgent Action │       │         Queries             │ │
│  │                  │       └─────────────────────────────┘ │
│  │  1. Create run   │                    ↑                  │
│  │  2. Start E2B    │       ┌────────────┴────────────────┐ │
│  │  3. Run Claude   │──────→│        Database             │ │
│  │  4. Save docs    │       │    (runs, documents)        │ │
│  └──────────────────┘       └─────────────────────────────┘ │
│           │                                                  │
└───────────┼──────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────┐
│                   E2B Sandbox (isolated)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Claude Code analyzes estate planning situation        │ │
│  │  and generates:                                        │ │
│  │  - Gap analysis reports                                │ │
│  │  - Draft legal documents                               │ │
│  │  - Checklists and recommendations                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Convex)

### `agentRuns` Table

| Field | Type | Description |
|-------|------|-------------|
| `prompt` | string | User's estate planning request/situation |
| `status` | enum | `"pending"` \| `"running"` \| `"completed"` \| `"failed"` |
| `output` | string? | Agent analysis and reasoning |
| `error` | string? | Error message if failed |
| `createdAt` | number | Timestamp of creation |
| `completedAt` | number? | Timestamp of completion |

### `generatedFiles` Table

| Field | Type | Description |
|-------|------|-------------|
| `runId` | Id<"agentRuns"> | Reference to parent run |
| `path` | string | Document filename (e.g., `"last_will.docx"`, `"gap_analysis.md"`) |
| `content` | string | Base64 for binary files, plain text otherwise |
| `isBinary` | boolean | Whether content is base64 encoded |
| `size` | number | File size in bytes |

---

## Current Features (MVP)

- [x] Enter estate planning situation or request
- [x] Real-time processing status (pending → running → completed/failed)
- [x] Preview generated documents in modal
- [x] Download individual documents or all at once
- [x] View AI reasoning and analysis
- [x] Browse session history

---

## Planned Features

### Estate Planning Intake
- [ ] Guided questionnaire for family situation, assets, goals
- [ ] State selection (Massachusetts first, then expansion)
- [ ] Net worth tier assessment for document recommendations

### Document Types
- [ ] Last Will and Testament
- [ ] Revocable Living Trust
- [ ] Pour-Over Will
- [ ] Durable Power of Attorney (Financial)
- [ ] Healthcare Power of Attorney
- [ ] Advance Healthcare Directive / Living Will
- [ ] HIPAA Authorization
- [ ] Beneficiary Designations Review
- [ ] Digital Asset Authorization

### Gap Analysis Engine
- [ ] Identify missing documents based on situation
- [ ] Flag outdated provisions
- [ ] Beneficiary consistency check across documents
- [ ] State-specific compliance review
- [ ] Risk scoring and prioritization

### User Experience
- [ ] User authentication and saved plans
- [ ] Document versioning and change tracking
- [ ] PDF and DOCX export
- [ ] Attorney review workflow integration
- [ ] Multi-language support

---

## Key Insights Embedded

The system is built on these estate planning principles:

1. **"There is no single estate plan — there is a document ecosystem"**
2. **Outcome priority order:** Asset title → Beneficiary forms → Trust instruments → Contracts → Wills → State default law
3. **"Most estate failures occur not because documents are missing, but because they conflict"**
4. **Risk progression:** Incapacity risk → Probate inefficiency → Behavioral risk → Tax risk → Governance risk
5. **"If the state default result is unacceptable, a document is required"**

---

## Target Market

**Primary:** Individuals with net worth between $2M and $50M

| Segment | Fit |
|---------|-----|
| **<$2M** | Basic needs — DIY tools often suffice |
| **$2M–$50M** | Complex enough for professional analysis, underserved by traditional services |
| **>$50M** | Requires white-glove human services |

**Initial Geographic Focus:** Massachusetts (with planned expansion to NY, CA, FL)

---

## Team

| Name | Role | Responsibilities |
|------|------|------------------|
| Preston Dinh | [Role] | [Key responsibilities] |
| Ezekiel Dube-Garrett | [Role] | [Key responsibilities] |
| Keegan Harrison | [Role] | [Key responsibilities] |
| Colton Pozniak | [Role] | [Key responsibilities] |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account
- E2B account
- Anthropic API key

### Environment Variables

Create a `.env.local` file with:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
E2B_API_KEY=your_e2b_api_key
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### Installation

```bash
# Clone the repository
git clone https://github.com/preston-cell/SICC.git
cd SICC

# Install dependencies
npm install

# Start Convex development server
npx convex dev

# In a separate terminal, start Next.js
npm run dev

# Open http://localhost:3000
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Business Plan](docs/business-plan.md) | Opportunity refinement, personas, pricing |
| [TAM Analysis](docs/tam-analysis.md) | Market sizing and geographic prioritization |
| [Research Notes](docs/research-notes.md) | User research, competitive analysis, legal considerations |
| [Architecture](docs/architecture.md) | Technical architecture and data flows |
| [Feasibility Spike](mvp/feasibility-spike.md) | Technical validation approach |

---

## Legal Disclaimer

**IMPORTANT: This tool is for informational and educational purposes only.**

- Generated documents are **drafts** that require review by a licensed attorney
- This tool does **not** provide legal advice
- No attorney-client relationship is formed by using this tool
- Laws vary by state; documents should be reviewed for state-specific compliance
- Users should consult with a qualified estate planning attorney before executing any legal documents

---

## License

[To be determined]

---

## Contact

[Contact information]
