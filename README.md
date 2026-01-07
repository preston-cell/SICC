# EstateAI: AI-Powered Estate Plan Gap Analysis for High-Net-Worth Individuals

## Opportunity Summary

High-net-worth individuals with $2M–$50M in assets represent a critically underserved segment in estate planning. They face a frustrating dilemma:

- **Too complex for DIY tools** — Multiple asset types, trusts, and beneficiary structures require professional-grade analysis
- **Not complex enough for white-glove services** — $15,000–$50,000+ legal fees are hard to justify
- **Existing plans go stale** — Life changes create gaps, but full rewrites are expensive and unnecessary

**EstateAI** is an AI-powered platform that analyzes existing wills and trusts to identify gaps, risks, and optimization opportunities—delivering professional-grade insights at a fraction of traditional costs.

### Why $2M–$50M?

| Segment | Typical Behavior | Fit for AI |
|---------|------------------|------------|
| **<$2M** | Basic needs—beneficiary designations on retirement accounts and home deed often suffice | Limited |
| **$2M–$50M** | Complex enough for trusts, multiple assets, beneficiary issues—but underserved by traditional legal services | **Ideal** |
| **>$50M** | Ultra-high complexity—family offices, dynasty trusts, multi-jurisdiction planning. Requires human experts | Partial |

### The Problem We Solve

- **Existing estate plans have hidden gaps** — Outdated beneficiaries, missing provisions, state law changes
- **Review is expensive** — Attorneys charge $300–$600/hour for document review
- **No visibility into risk** — Clients don't know what they don't know
- **Life changes create drift** — Marriage, divorce, new children, asset changes invalidate original plans

### Our Solution: AI-Powered Gap Analysis

1. **Upload existing documents** — Wills, trusts, POAs, beneficiary designations
2. **AI extracts and analyzes** — Key provisions, beneficiaries, asset coverage, execution requirements
3. **Gap report generated** — Missing provisions, outdated elements, state compliance issues
4. **Actionable recommendations** — Prioritized fixes with plain-English explanations
5. **Attorney handoff (optional)** — Connect to vetted estate planning attorneys for complex fixes

### Our Differentiation

1. **Gap Analysis First** — Primary value is reviewing existing plans, not just creating new ones
2. **HNW-Focused Complexity** — Built for multi-asset, trust-based estate structures
3. **State-Specific Rules Engine** — LLM + jurisdictional logic for compliance validation
4. **Risk Scoring** — Quantified gap severity with dollar-value-at-risk estimates
5. **Transparent Pricing** — Flat fees for analysis; pay only for what you need

---

## Team Members

| Name | Role | Responsibilities |
|------|------|------------------|
| [Team Member 1] | [Role] | [Key responsibilities] |
| [Team Member 2] | [Role] | [Key responsibilities] |
| [Team Member 3] | [Role] | [Key responsibilities] |
| [Team Member 4] | [Role] | [Key responsibilities] |

---

## MVP Scope

### Phase 1: Core Functionality (MVP)

**In Scope:**
- [ ] Document upload and parsing (PDF/DOCX wills and trusts)
- [ ] AI-powered element extraction (beneficiaries, executors, trustees, assets)
- [ ] Gap analysis engine with state-specific rules (California first)
- [ ] Risk scoring and prioritized recommendations
- [ ] Plain-English gap report generation
- [ ] User dashboard for document management

**Out of Scope for MVP:**
- Document generation/editing
- Multi-state support (Phase 2)
- Attorney marketplace integration
- Trust funding analysis
- Mobile apps

### User Journey (MVP)

1. User creates account, confirms net worth range ($2M–$50M)
2. User uploads existing estate planning documents
3. AI extracts document structure and key elements
4. System runs gap analysis against state rules and best practices
5. User receives prioritized gap report with recommendations
6. User can download report or connect to attorney for fixes

### Target Documents (MVP)

- Last Will and Testament
- Revocable Living Trust
- Pour-over Will
- Durable Power of Attorney
- Healthcare Proxy / Advance Directive

---

## Tooling Plan

### AI/LLM Stack
| Component | Tool | Rationale |
|-----------|------|-----------|
| Primary LLM | Claude API (Sonnet/Opus) | Superior reasoning, long context for full documents |
| Embeddings | Voyage AI / OpenAI | Document similarity, clause matching |
| Orchestration | LangGraph or custom | Multi-step analysis workflows |

### Backend
| Component | Tool | Rationale |
|-----------|------|-----------|
| Framework | FastAPI (Python) | Async, type hints, OpenAPI docs |
| Database | PostgreSQL + pgvector | Relational + vector search for clause matching |
| Document Parsing | PyMuPDF, python-docx, Unstructured.io | Multi-format extraction |
| Report Generation | WeasyPrint, Jinja2 | Professional PDF reports |

### Frontend
| Component | Tool | Rationale |
|-----------|------|-----------|
| Framework | Next.js 14 (App Router) | React, SSR, API routes |
| UI Components | shadcn/ui + Tailwind | Professional, accessible design |
| State Management | Zustand or React Context | Lightweight, simple |
| Document Viewer | react-pdf | In-browser document preview |

### Infrastructure
| Component | Tool | Rationale |
|-----------|------|-----------|
| Hosting | Vercel (FE) + Railway/Render (BE) | Simple deployment, scaling |
| Auth | Clerk or NextAuth | Secure authentication |
| Storage | S3-compatible (R2/S3) | Encrypted document storage |
| Monitoring | Sentry + PostHog | Errors + analytics |

---

## Repository Structure

```
├── README.md           # This file
├── docs/               # Documentation
│   ├── business-plan.md
│   ├── tam-analysis.md
│   ├── research-notes.md
│   └── architecture.md
├── mvp/                # MVP implementation
│   ├── backend/
│   ├── frontend/
│   └── agents/
├── scripts/            # Utility scripts
├── data/
│   ├── sample-data/    # Test documents
│   └── schemas/        # Data schemas
├── slides/             # Pitch materials
└── demo/               # Demo resources
```

---

## Getting Started

*Technical setup instructions will be added once development begins.*

---

## License

[To be determined]

---

## Contact

[Contact information]
