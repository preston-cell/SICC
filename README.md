# EstateAI: Conversational Estate Planning Platform

## Opportunity Summary

Estate planning affects nearly every adult, yet the process remains intimidating, expensive, and inaccessible. Traditional options force a choice between:
- **Expensive attorneys** ($1,000-$5,000+ for basic documents)
- **Rigid form-filling tools** that lack personalization and state-specific accuracy
- **DIY templates** that often produce legally inadequate documents

**EstateAI** bridges this gap with an AI-guided conversational system that:
- Feels like talking to a knowledgeable professional
- Adapts questions based on user responses (no rigid forms)
- Produces state-specific, legally compliant documents
- Offers unique "import-and-improve" capability for existing documents
- Provides transparent explanations and optional attorney review

### The Problem We Solve
- 67% of Americans lack basic estate planning documents
- Existing digital tools have <5% completion rates due to complexity
- State-specific requirements create significant compliance risk
- Existing documents become outdated but full rewrites are expensive

### Our Differentiation
1. **Conversational AI Interface** - Natural dialogue, not forms
2. **Import & Improve** - Analyze existing documents, recommend targeted updates
3. **State-Specific Rules Engine** - LLM + jurisdictional logic for compliance
4. **Transparent Control** - Before/after comparisons, plain-English explanations
5. **Flexible Pricing** - Pay only for what you need (full docs or amendments)

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
- [ ] Single state support (California - largest market)
- [ ] Simple Will generation via conversational interface
- [ ] Basic document import (PDF/DOCX text extraction)
- [ ] Gap analysis for imported documents
- [ ] Document preview and download (PDF)
- [ ] Execution guidance (witness/notary requirements)

**Out of Scope for MVP:**
- Multi-state support
- Trusts, POA, Healthcare Proxy (Phase 2)
- Integrated notary services
- Attorney review network
- Amendment/codicil generation
- Mobile apps

### User Journey (MVP)
1. User selects state (CA) and document type (Simple Will)
2. Conversational AI asks adaptive questions
3. System generates structured data from responses
4. Document assembled with state-specific clauses
5. User previews, edits if needed, downloads
6. Execution checklist provided

### Import Flow (MVP)
1. User uploads existing will (PDF/DOCX)
2. System extracts text, parses key elements
3. Gap analysis displayed with recommendations
4. User can proceed to update or start fresh

---

## Tooling Plan

### AI/LLM Stack
| Component | Tool | Rationale |
|-----------|------|-----------|
| Primary LLM | Claude API (Sonnet/Opus) | Superior reasoning, safety, long context |
| Embeddings | Voyage AI / OpenAI | Document similarity, search |
| Orchestration | LangGraph or custom | Conversation state management |

### Backend
| Component | Tool | Rationale |
|-----------|------|-----------|
| Framework | FastAPI (Python) | Async, type hints, OpenAPI docs |
| Database | PostgreSQL + pgvector | Relational + vector search |
| Document Generation | python-docx, WeasyPrint | DOCX and PDF output |
| Document Parsing | PyMuPDF, python-docx, Unstructured.io | Multi-format extraction |

### Frontend
| Component | Tool | Rationale |
|-----------|------|-----------|
| Framework | Next.js 14 (App Router) | React, SSR, API routes |
| UI Components | shadcn/ui + Tailwind | Accessible, customizable |
| State Management | Zustand or React Context | Lightweight, simple |
| Chat Interface | Custom or Vercel AI SDK | Streaming responses |

### Infrastructure
| Component | Tool | Rationale |
|-----------|------|-----------|
| Hosting | Vercel (FE) + Railway/Render (BE) | Simple deployment, scaling |
| Auth | Clerk or NextAuth | Quick setup, secure |
| Storage | S3-compatible (R2/S3) | Document storage |
| Monitoring | Sentry + PostHog | Errors + analytics |

### Development
| Component | Tool | Rationale |
|-----------|------|-----------|
| Version Control | GitHub | Standard, CI/CD integration |
| CI/CD | GitHub Actions | Automated testing, deployment |
| Testing | Pytest (BE), Vitest (FE) | Fast, modern |
| Documentation | MkDocs or Docusaurus | Technical docs |

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
