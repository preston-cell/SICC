# EstateAI: Architecture Overview

## System Architecture Sketch

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Web App       │  │   Mobile Web    │  │   Future:       │             │
│  │   (Next.js)     │  │   (Responsive)  │  │   Native Apps   │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                      │
│           └────────────────────┼────────────────────┘                      │
│                                │                                           │
└────────────────────────────────┼───────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  FastAPI Application                                                 │   │
│  │  • Authentication / Authorization                                    │   │
│  │  • Rate Limiting                                                     │   │
│  │  • Request Validation                                                │   │
│  │  • API Versioning                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└────────────────────────────────┬───────────────────────────────────────────-┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │  Conversation    │  │  Document        │  │  Document        │          │
│  │  Service         │  │  Import Service  │  │  Generation Svc  │          │
│  │                  │  │                  │  │                  │          │
│  │  • Chat mgmt     │  │  • PDF parsing   │  │  • Template      │          │
│  │  • State mgmt    │  │  • Text extract  │  │    selection     │          │
│  │  • Context       │  │  • Element ID    │  │  • Clause        │          │
│  │    building      │  │  • Gap analysis  │  │    assembly      │          │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘          │
│           │                     │                     │                    │
│           └─────────────────────┼─────────────────────┘                    │
│                                 │                                          │
│                                 ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ORCHESTRATION LAYER                              │   │
│  │                    (LangGraph / Custom)                             │   │
│  │                                                                     │   │
│  │  • Conversation flow management                                     │   │
│  │  • Multi-step reasoning                                             │   │
│  │  • Tool/function calling                                            │   │
│  │  • State persistence                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────┬───────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI/ML LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │  Claude API      │  │  Rules Engine    │  │  Embedding       │           │
│  │  (Anthropic)     │  │                  │  │  Service         │           │
│  │                  │  │  • State rules   │  │                  │           │
│  │  • Conversation  │  │  • Validation    │  │  • Similarity    │           │
│  │  • Extraction    │  │  • Compliance    │  │  • Search        │           │
│  │  • Generation    │  │  • Requirements  │  │  • RAG           │           │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘           │
│           │                     │                     │                     │
│           └─────────────────────┼─────────────────────┘                     │
│                                 │                                           │
└────────────────────────────────┬─────────────────────────────────────────-──┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐           │
│  │  PostgreSQL      │  │  Object Storage  │  │  Vector Store    │           │
│  │                  │  │  (S3/R2)         │  │  (pgvector)      │           │
│  │  • Users         │  │                  │  │                  │           │
│  │  • Sessions      │  │  • Documents     │  │  • Embeddings    │           │
│  │  • Documents     │  │  • Uploads       │  │  • Legal refs    │           │
│  │  • State rules   │  │  • Generated     │  │                  │           │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Data Flows

### Flow 1: Conversational Document Creation

```
User                    Frontend            Backend             Claude API
  │                        │                   │                    │
  │  "I want to create     │                   │                    │
  │   a will"              │                   │                    │
  │───────────────────────>│                   │                    │
  │                        │  POST /chat       │                    │
  │                        │──────────────────>│                    │
  │                        │                   │  Build context     │
  │                        │                   │  + system prompt   │
  │                        │                   │                    │
  │                        │                   │  API call          │
  │                        │                   │───────────────────>│
  │                        │                   │                    │
  │                        │                   │  "Great! Let me    │
  │                        │                   │   ask a few        │
  │                        │                   │   questions..."    │
  │                        │                   │<───────────────────│
  │                        │                   │                    │
  │                        │  Stream response  │                    │
  │                        │<──────────────────│                    │
  │  "Great! Let me..."    │                   │                    │
  │<───────────────────────│                   │                    │
  │                        │                   │                    │
  │  [Multiple turns of conversation]          │                    │
  │                        │                   │                    │
  │                        │                   │  Extract           │
  │                        │                   │  structured data   │
  │                        │                   │                    │
  │                        │                   │  Validate with     │
  │                        │                   │  Rules Engine      │
  │                        │                   │                    │
  │                        │                   │  Generate          │
  │                        │                   │  document          │
  │                        │                   │                    │
  │                        │  Document ready   │                    │
  │                        │<──────────────────│                    │
  │  Preview document      │                   │                    │
  │<───────────────────────│                   │                    │
  │                        │                   │                    │
```

### Flow 2: Document Import & Analysis

```
User                    Frontend            Backend             Claude API
  │                        │                   │                    │
  │  Upload existing       │                   │                    │
  │  will (PDF)            │                   │                    │
  │───────────────────────>│                   │                    │
  │                        │  POST /upload     │                    │
  │                        │──────────────────>│                    │
  │                        │                   │  Store file        │
  │                        │                   │                    │
  │                        │                   │  Extract text      │
  │                        │                   │  (PyMuPDF)         │
  │                        │                   │                    │
  │                        │                   │  Parse elements    │
  │                        │                   │───────────────────>│
  │                        │                   │                    │
  │                        │                   │  {executor: "...", │
  │                        │                   │   guardian: "...", │
  │                        │                   │   ...}             │
  │                        │                   │<───────────────────│
  │                        │                   │                    │
  │                        │                   │  Gap analysis      │
  │                        │                   │───────────────────>│
  │                        │                   │                    │
  │                        │                   │  Recommendations   │
  │                        │                   │<───────────────────│
  │                        │                   │                    │
  │                        │                   │  Validate with     │
  │                        │                   │  Rules Engine      │
  │                        │                   │                    │
  │                        │  Analysis report  │                    │
  │                        │<──────────────────│                    │
  │  View gaps &           │                   │                    │
  │  recommendations       │                   │                    │
  │<───────────────────────│                   │                    │
  │                        │                   │                    │
```

---

## Key Components

### 1. Conversation Engine

**Purpose:** Manage adaptive, multi-turn conversations for data gathering

**Key Responsibilities:**
- Build conversation context with system prompts
- Track conversation state and gathered data
- Determine next questions based on responses
- Handle clarification and follow-ups
- Extract structured data from natural language

**Technology:**
- LangGraph for conversation flow management
- Claude API (Sonnet for conversation, Opus for complex reasoning)
- PostgreSQL for session persistence

### 2. Rules Engine

**Purpose:** Ensure state-specific legal compliance

**Key Responsibilities:**
- Store state-specific legal requirements
- Validate gathered data against requirements
- Determine required clauses and provisions
- Check execution requirements (witnesses, notary)
- Flag potential issues or conflicts

**Technology:**
- PostgreSQL for rules storage
- Python rules evaluation engine
- JSON Schema for rule definitions

**Sample Rule Structure:**
```json
{
  "state": "CA",
  "document_type": "will",
  "requirements": {
    "minimum_age": 18,
    "witnesses": {
      "count": 2,
      "requirements": [
        "Must be adults (18+)",
        "Cannot be beneficiaries",
        "Must sign in testator's presence"
      ]
    },
    "notarization": {
      "required": false,
      "recommended": true,
      "reason": "Makes will self-proving"
    }
  },
  "clauses": {
    "required": ["revocation", "signature", "witness_attestation"],
    "conditional": {
      "minor_children": ["guardian_nomination", "trust_for_minors"],
      "real_property": ["real_property_disposition"]
    }
  }
}
```

### 3. Document Parser

**Purpose:** Extract structured information from uploaded documents

**Key Responsibilities:**
- Handle multiple file formats (PDF, DOCX, images)
- OCR for scanned documents
- Extract text while preserving structure
- Identify document type and sections
- Parse key elements (names, relationships, assets)

**Technology:**
- PyMuPDF for PDF extraction
- python-docx for Word documents
- Tesseract for OCR if needed
- Claude for element extraction (structured output)

### 4. Document Generator

**Purpose:** Assemble legally compliant documents from structured data

**Key Responsibilities:**
- Select appropriate templates
- Insert state-specific clauses
- Handle conditional sections
- Generate execution instructions
- Produce PDF and DOCX outputs

**Technology:**
- python-docx for document assembly
- Jinja2 for templating
- WeasyPrint for PDF generation
- Custom clause library

---

## Data Models (Draft)

### User
```
User
├── id: UUID
├── email: string
├── created_at: timestamp
├── state: string (2-letter code)
└── documents: Document[]
```

### Document
```
Document
├── id: UUID
├── user_id: UUID
├── type: enum (will, trust, poa, healthcare_proxy)
├── status: enum (draft, complete, superseded)
├── state: string
├── created_at: timestamp
├── updated_at: timestamp
├── data: JSON (structured data)
├── versions: DocumentVersion[]
└── files: File[]
```

### Conversation Session
```
Session
├── id: UUID
├── user_id: UUID
├── document_id: UUID (nullable)
├── type: enum (create, import, update)
├── status: enum (active, complete, abandoned)
├── state_data: JSON
├── messages: Message[]
└── created_at: timestamp
```

### State Rules
```
StateRule
├── id: UUID
├── state: string
├── document_type: string
├── version: int
├── effective_date: date
├── rules: JSON
└── clauses: Clause[]
```

---

## Security Considerations

### Data Protection
- All data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- PII handling per state privacy laws
- Document access controls

### Authentication
- OAuth 2.0 / OpenID Connect
- MFA for document access
- Session management with secure tokens

### Audit Trail
- All document actions logged
- Conversation history preserved
- Version control for documents

---

## Scalability Approach

### MVP (Single Server)
- Single FastAPI instance
- PostgreSQL on same server
- File storage on local disk
- Suitable for ~100 concurrent users

### Growth Phase
- Multiple API instances behind load balancer
- Managed PostgreSQL (RDS/Supabase)
- S3/R2 for file storage
- Redis for session caching
- Suitable for ~1000 concurrent users

### Scale Phase
- Kubernetes deployment
- Read replicas for database
- CDN for static assets
- Async job processing (Celery/RQ)
- Suitable for ~10,000+ concurrent users

---

## Open Architecture Questions

1. **Conversation State:** LangGraph vs. custom state machine?
2. **Rules Engine:** Build custom vs. use existing rules engine?
3. **Document Templates:** Store as files vs. database?
4. **Multi-tenancy:** Single tenant MVP vs. multi-tenant from start?
5. **Offline Capability:** Needed for MVP?

---

## Next Steps

1. [ ] Finalize conversation flow design
2. [ ] Design rules engine schema
3. [ ] Create document template structure
4. [ ] Build feasibility spike for core flows
5. [ ] Security review and threat modeling
