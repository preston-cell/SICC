# EstateAI: Architecture Overview

## System Architecture for Gap Analysis Platform

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │   Web App       │  │   Mobile Web    │  │   Future:       │            │
│  │   (Next.js)     │  │   (Responsive)  │  │   Advisor Portal│            │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘            │
│           │                    │                    │                      │
│           └────────────────────┼────────────────────┘                      │
│                                │                                           │
└────────────────────────────────┼───────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  FastAPI Application                                                 │   │
│  │  • Authentication / Authorization                                    │   │
│  │  • Rate Limiting                                                     │   │
│  │  • Request Validation                                                │   │
│  │  • API Versioning                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└────────────────────────────────┬───────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  Document        │  │  Gap Analysis    │  │  Report          │         │
│  │  Processing Svc  │  │  Engine          │  │  Generation Svc  │         │
│  │                  │  │                  │  │                  │         │
│  │  • Upload mgmt   │  │  • Element       │  │  • Report        │         │
│  │  • PDF parsing   │  │    extraction    │  │    compilation   │         │
│  │  • OCR fallback  │  │  • Rules check   │  │  • PDF render    │         │
│  │  • Text extract  │  │  • Gap detect    │  │  • Plain English │         │
│  │  • Structure ID  │  │  • Risk scoring  │  │    summaries     │         │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘         │
│           │                     │                     │                    │
│           └─────────────────────┼─────────────────────┘                    │
│                                 │                                          │
│                                 ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ANALYSIS ORCHESTRATION                           │   │
│  │                    (LangGraph / Custom Pipeline)                    │   │
│  │                                                                     │   │
│  │  • Multi-document coordination                                      │   │
│  │  • Analysis workflow management                                     │   │
│  │  • Error handling & retry                                           │   │
│  │  • Progress tracking                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└────────────────────────────────┬───────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI/ML LAYER                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  Claude API      │  │  Rules Engine    │  │  Gap Taxonomy    │         │
│  │  (Anthropic)     │  │                  │  │  Database        │         │
│  │                  │  │  • State rules   │  │                  │         │
│  │  • Extraction    │  │  • Compliance    │  │  • Gap types     │         │
│  │  • Gap detection │  │  • Validation    │  │  • Risk weights  │         │
│  │  • Explanation   │  │  • Requirements  │  │  • Best practices│         │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘         │
│           │                     │                     │                    │
│           └─────────────────────┼─────────────────────┘                    │
│                                 │                                          │
└────────────────────────────────┬───────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │  PostgreSQL      │  │  Object Storage  │  │  Vector Store    │         │
│  │                  │  │  (S3/R2)         │  │  (pgvector)      │         │
│  │  • Users         │  │                  │  │                  │         │
│  │  • Analyses      │  │  • Uploaded docs │  │  • Clause        │         │
│  │  • Reports       │  │  • Generated     │  │    embeddings    │         │
│  │  • State rules   │  │    reports       │  │  • Pattern       │         │
│  │  • Gap taxonomy  │  │  • Encrypted     │  │    matching      │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Data Flows

### Flow 1: Document Upload & Processing

```
User                    Frontend            Backend             Storage
  │                        │                   │                    │
  │  Upload estate plan   │                   │                    │
  │  documents (PDF/DOCX) │                   │                    │
  │───────────────────────>│                   │                    │
  │                        │  POST /upload     │                    │
  │                        │──────────────────>│                    │
  │                        │                   │  Validate file     │
  │                        │                   │  type & size       │
  │                        │                   │                    │
  │                        │                   │  Encrypt & store   │
  │                        │                   │───────────────────>│
  │                        │                   │                    │
  │                        │                   │  Queue for         │
  │                        │                   │  processing        │
  │                        │                   │                    │
  │                        │  Upload confirmed │                    │
  │                        │<──────────────────│                    │
  │  "Documents received" │                   │                    │
  │<───────────────────────│                   │                    │
  │                        │                   │                    │
```

### Flow 2: Gap Analysis Pipeline

```
Document              Extraction            Rules Engine         Gap Detector
Processing            Service               Service              Service
  │                        │                   │                    │
  │  Raw text +           │                   │                    │
  │  structure            │                   │                    │
  │───────────────────────>│                   │                    │
  │                        │  Claude API:      │                    │
  │                        │  Extract elements │                    │
  │                        │                   │                    │
  │                        │  Structured data: │                    │
  │                        │  • Executors      │                    │
  │                        │  • Trustees       │                    │
  │                        │  • Beneficiaries  │                    │
  │                        │  • Assets         │                    │
  │                        │  • Provisions     │                    │
  │                        │                   │                    │
  │                        │  Validate against │                    │
  │                        │  state rules      │                    │
  │                        │──────────────────>│                    │
  │                        │                   │  Check:            │
  │                        │                   │  • Execution reqs  │
  │                        │                   │  • Witness rules   │
  │                        │                   │  • Notary reqs     │
  │                        │                   │  • Statutory lang  │
  │                        │                   │                    │
  │                        │  Compliance       │                    │
  │                        │  findings         │                    │
  │                        │<──────────────────│                    │
  │                        │                   │                    │
  │                        │  Run gap detection│                    │
  │                        │──────────────────────────────────────>│
  │                        │                   │                    │
  │                        │                   │  Compare to:       │
  │                        │                   │  • Gap taxonomy    │
  │                        │                   │  • Best practices  │
  │                        │                   │  • Multi-doc check │
  │                        │                   │                    │
  │                        │                   │  Gap findings +    │
  │                        │                   │  risk scores       │
  │                        │<──────────────────────────────────────│
  │                        │                   │                    │
```

### Flow 3: Report Generation

```
Gap Detector          Report Service        Claude API          User
Service
  │                        │                   │                    │
  │  Gap findings +       │                   │                    │
  │  risk scores          │                   │                    │
  │───────────────────────>│                   │                    │
  │                        │  Generate         │                    │
  │                        │  explanations     │                    │
  │                        │──────────────────>│                    │
  │                        │                   │  Plain-English     │
  │                        │                   │  summaries for     │
  │                        │                   │  each gap          │
  │                        │<──────────────────│                    │
  │                        │                   │                    │
  │                        │  Compile report   │                    │
  │                        │  • Executive sum  │                    │
  │                        │  • Critical gaps  │                    │
  │                        │  • High priority  │                    │
  │                        │  • Medium/Advisory│                    │
  │                        │  • Recommendations│                    │
  │                        │                   │                    │
  │                        │  Render PDF       │                    │
  │                        │                   │                    │
  │                        │                   │  Deliver report    │
  │                        │──────────────────────────────────────>│
  │                        │                   │                    │
```

---

## Key Components

### 1. Document Processing Service

**Purpose:** Ingest, parse, and extract text from uploaded estate planning documents

**Key Responsibilities:**
- Accept PDF, DOCX uploads
- Validate file types and sizes
- Extract text with structure preservation
- OCR fallback for scanned documents
- Identify document type (will, trust, POA, etc.)
- Store encrypted documents

**Technology:**
- PyMuPDF for native PDF extraction
- python-docx for Word documents
- Tesseract/AWS Textract for OCR
- S3/R2 for encrypted storage

**Document Types Supported:**
```
├── Wills
│   ├── Simple Will
│   ├── Pour-over Will
│   └── Holographic Will (text extraction only)
├── Trusts
│   ├── Revocable Living Trust
│   ├── Irrevocable Trust
│   └── Trust Amendments
├── Powers of Attorney
│   ├── Durable POA (Financial)
│   └── Limited POA
└── Healthcare
    ├── Healthcare Proxy
    ├── Living Will
    └── HIPAA Authorization
```

### 2. Gap Analysis Engine

**Purpose:** Identify gaps, risks, and issues in estate planning documents

**Key Responsibilities:**
- Extract key elements (fiduciaries, beneficiaries, assets)
- Check compliance with state-specific rules
- Compare against gap taxonomy
- Score risks by severity
- Coordinate multi-document analysis

**Technology:**
- Claude API for intelligent extraction and analysis
- PostgreSQL for rules storage
- Custom scoring algorithm

**Gap Detection Categories:**

```python
GAP_CATEGORIES = {
    "critical": {
        "weight": 100,
        "examples": [
            "deceased_fiduciary",
            "improper_execution",
            "unfunded_trust"
        ]
    },
    "high": {
        "weight": 75,
        "examples": [
            "outdated_beneficiary",
            "missing_incapacity_planning",
            "missing_digital_assets"
        ]
    },
    "medium": {
        "weight": 50,
        "examples": [
            "missing_contingent_beneficiary",
            "state_law_changes",
            "asset_changes"
        ]
    },
    "advisory": {
        "weight": 25,
        "examples": [
            "tax_optimization",
            "family_governance",
            "charitable_planning"
        ]
    }
}
```

### 3. Rules Engine

**Purpose:** Validate documents against state-specific legal requirements

**Key Responsibilities:**
- Store state-specific rules
- Check execution requirements
- Validate statutory language
- Flag compliance issues
- Track law changes

**Technology:**
- PostgreSQL for rules storage
- JSON Schema for rule definitions
- Version tracking for law changes

**Sample Rule Structure:**

```json
{
  "state": "CA",
  "document_type": "will",
  "version": "2024.1",
  "effective_date": "2024-01-01",
  "requirements": {
    "execution": {
      "witnesses": {
        "count": 2,
        "requirements": [
          "Must be 18 or older",
          "Must sign in presence of testator",
          "Should not be beneficiaries (recommended)"
        ]
      },
      "notarization": {
        "required": false,
        "self_proving_affidavit": true,
        "benefit": "Simplifies probate"
      },
      "testator_signature": {
        "required": true,
        "location": "End of will"
      }
    },
    "content": {
      "revocation_clause": "recommended",
      "residuary_clause": "required",
      "attestation_clause": "required"
    }
  },
  "common_issues": [
    {
      "id": "ca_holographic",
      "description": "Holographic wills valid in CA but risky",
      "check": "No witness signatures + handwritten"
    }
  ]
}
```

### 4. Report Generation Service

**Purpose:** Compile analysis findings into actionable, professional reports

**Key Responsibilities:**
- Aggregate gap findings
- Generate plain-English explanations
- Create risk-prioritized report
- Render PDF output
- Include recommendations

**Technology:**
- Jinja2 for templating
- WeasyPrint for PDF generation
- Claude API for explanation generation

**Report Structure:**

```
┌────────────────────────────────────────────────────────┐
│                    ESTATE PLAN                         │
│                  ANALYSIS REPORT                       │
│                                                        │
│  Prepared for: [Client Name]                          │
│  Date: [Analysis Date]                                │
│  Documents Analyzed: [List]                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  EXECUTIVE SUMMARY                                     │
│  ─────────────────                                     │
│  Overall Risk Score: [X/100]                          │
│  Critical Issues: [N]                                 │
│  High Priority: [N]                                   │
│  Medium Priority: [N]                                 │
│  Advisory Items: [N]                                  │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  CRITICAL ISSUES (Immediate Action Required)          │
│  ───────────────────────────────────────────          │
│                                                        │
│  ⚠️ Issue 1: [Title]                                  │
│     What we found: [Description]                      │
│     Why it matters: [Impact]                          │
│     Recommended action: [Action]                      │
│                                                        │
│  ⚠️ Issue 2: ...                                      │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  HIGH PRIORITY ITEMS                                   │
│  ───────────────────                                   │
│  [Similar structure]                                  │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  RECOMMENDATIONS                                       │
│  ───────────────                                       │
│  1. [Prioritized action item]                         │
│  2. [Prioritized action item]                         │
│  ...                                                  │
│                                                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  NEXT STEPS                                           │
│  ──────────                                           │
│  □ Connect with an estate planning attorney           │
│  □ Schedule annual review                             │
│                                                        │
│  [Attorney Referral CTA]                              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Data Models (Draft)

### User
```
User
├── id: UUID
├── email: string
├── created_at: timestamp
├── state: string (2-letter code)
├── net_worth_range: enum ($2M-$5M, $5M-$10M, $10M-$25M, $25M-$50M)
├── analyses: Analysis[]
└── subscription: Subscription (nullable)
```

### Analysis
```
Analysis
├── id: UUID
├── user_id: UUID
├── status: enum (pending, processing, completed, failed)
├── created_at: timestamp
├── completed_at: timestamp (nullable)
├── documents: Document[]
├── findings: Finding[]
├── risk_score: int (0-100)
├── report_url: string (nullable)
└── metadata: JSON
```

### Document
```
Document
├── id: UUID
├── analysis_id: UUID
├── type: enum (will, trust, poa, healthcare_proxy, other)
├── file_url: string (encrypted)
├── file_hash: string
├── parsed_text: text
├── extracted_data: JSON
├── state: string
├── execution_date: date (nullable)
└── created_at: timestamp
```

### Finding
```
Finding
├── id: UUID
├── analysis_id: UUID
├── document_id: UUID (nullable - for cross-document findings)
├── gap_type_id: UUID
├── severity: enum (critical, high, medium, advisory)
├── title: string
├── description: text
├── impact: text
├── recommendation: text
├── confidence: float (0-1)
└── metadata: JSON
```

### GapType
```
GapType
├── id: UUID
├── code: string (unique)
├── name: string
├── description: text
├── severity_default: enum
├── weight: int
├── detection_rules: JSON
├── applicable_documents: string[] (document types)
└── state_specific: boolean
```

### StateRule
```
StateRule
├── id: UUID
├── state: string
├── document_type: string
├── version: string
├── effective_date: date
├── rules: JSON
└── created_at: timestamp
```

---

## Security Architecture

### Data Protection

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Transport Security                                  │   │
│  │  • TLS 1.3 for all connections                      │   │
│  │  • Certificate pinning for mobile                   │   │
│  │  • HSTS enabled                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Application Security                                │   │
│  │  • OAuth 2.0 / OIDC authentication                  │   │
│  │  • JWT tokens with short expiry                     │   │
│  │  • Role-based access control                        │   │
│  │  • Rate limiting per user/IP                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Data Security                                       │   │
│  │  • AES-256 encryption at rest                       │   │
│  │  • Customer-specific encryption keys                │   │
│  │  • PII detection and handling                       │   │
│  │  • Automatic data retention policies                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Compliance                                          │   │
│  │  • SOC 2 Type II (target)                           │   │
│  │  • CCPA compliant                                   │   │
│  │  • Document access audit logging                    │   │
│  │  • User consent tracking                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Document Handling

- Documents encrypted with AES-256 before storage
- Encryption keys managed per-customer
- Automatic deletion after configurable retention period
- Access logging for all document operations
- No document content in application logs

---

## Scalability Approach

### MVP (Single Server)
- Single FastAPI instance
- PostgreSQL on same server
- S3 for document storage
- Suitable for ~500 analyses/month

### Growth Phase
- Multiple API instances behind load balancer
- Managed PostgreSQL (RDS/Supabase)
- Redis for job queuing and caching
- Background workers for analysis pipeline
- Suitable for ~5,000 analyses/month

### Scale Phase
- Kubernetes deployment
- Read replicas for database
- Distributed job processing
- CDN for report delivery
- Suitable for ~50,000+ analyses/month

---

## API Design (Draft)

### Key Endpoints

```
POST   /api/v1/analyses              # Start new analysis
GET    /api/v1/analyses/{id}         # Get analysis status/results
POST   /api/v1/analyses/{id}/documents  # Upload document to analysis
GET    /api/v1/analyses/{id}/report  # Download report PDF

GET    /api/v1/user/analyses         # List user's analyses
GET    /api/v1/user/profile          # Get user profile
PUT    /api/v1/user/profile          # Update user profile

GET    /api/v1/gap-types             # List available gap types
GET    /api/v1/states/{state}/rules  # Get rules for state
```

### Webhook Events

```
analysis.started        # Analysis processing begun
analysis.completed      # Analysis finished successfully
analysis.failed         # Analysis failed
document.processed      # Individual document processed
report.ready            # Report PDF generated
```

---

## Open Architecture Questions

1. **Processing Pipeline:** Synchronous vs. async? (Recommendation: async with webhooks)
2. **Multi-document Coordination:** How to handle cross-document gap detection?
3. **Confidence Scoring:** How to calibrate and communicate AI confidence?
4. **Rules Engine:** Build custom vs. adapt existing rules engine?
5. **Report Customization:** How much user customization to allow?

---

## Next Steps

1. [ ] Finalize gap taxonomy and detection rules
2. [ ] Design rules engine schema
3. [ ] Build document parsing spike
4. [ ] Create report template designs
5. [ ] Security architecture review
