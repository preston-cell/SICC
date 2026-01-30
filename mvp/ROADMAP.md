# Estate Planning Assistant - Development Roadmap

## Overview

AI-powered estate planning platform that helps users create legally-compliant documents, analyze their estate plans, and receive personalized recommendations.

---

## Current Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 (CSS-based config) |
| Database | PostgreSQL via Prisma 7 ORM |
| Data Fetching | SWR (React hooks) |
| Auth | Clerk (optional) + session-based anonymous |
| AI | Claude API (Anthropic) |
| Sandbox | E2B for secure AI code execution |
| Hosting | Vercel (frontend) + AWS RDS (database) |

---

## Completed Phases

### Phase 1: Core Infrastructure
- [x] Next.js 16 + TypeScript setup
- [x] PostgreSQL + Prisma ORM integration
- [x] Basic routing and layout structure
- [x] Tailwind CSS 4 styling system
- [x] SWR data fetching hooks

### Phase 2: Intake Wizard
- [x] Multi-step questionnaire (Personal, Family, Assets, Existing Documents, Goals)
- [x] Progress persistence across sessions
- [x] Session-based anonymous user flow
- [x] Form validation and error handling
- [x] Guided intake flow (8-step conversational wizard)
- [x] Comprehensive form mode for detailed input

### Phase 3: Gap Analysis Engine
- [x] AI-powered analysis using Claude via E2B sandbox
- [x] Missing document identification
- [x] Inconsistency detection
- [x] State-specific recommendations
- [x] Beneficiary designation analysis
- [x] Multi-phase comprehensive orchestration (3 phases, 7 parallel runs)

### Phase 4: User Experience Enhancements
- [x] 4.1 - Legal glossary with tooltips
- [x] 4.2 - Intake wizard UX improvements

### Phase 5: Advanced Features
- [x] 5.1 - Estate visualization (family tree, asset distribution)
- [x] 5.2 - Beneficiary designation tracking

### Phase 6: Reminders & Notifications
- [x] Reminder system for document reviews
- [x] Life event triggers
- [x] Due date tracking
- [x] Auto-generated action items from gap analysis

### Phase 7: Design & Polish
- [x] 7.1 - Design system implementation
- [x] 7.2 - Analysis page redesign
- [x] Landing page modernization

### Phase 8: Document Generation
- [x] Comprehensive document templates based on Nolo/WillMaker structure
- [x] 7 document types: Will, Trust, Financial POA, Healthcare POA, Healthcare Directive, HIPAA, Instruction Letters
- [x] State-specific requirements for all 50 US states
- [x] AI-enhanced generation with Claude
- [x] Document preview and download functionality

### Phase 9: Document Upload & AI Analysis
- [x] Drag-and-drop PDF upload UI
- [x] PDF text extraction via Claude's document understanding
- [x] Provision-by-provision analysis
- [x] Cross-reference analysis with intake data
- [x] Hypothetical scenarios ("What if I become incapacitated?")
- [x] Actionable insights with priority ranking

### Phase 10: Preparation Phase Features
- [x] Document checklist (gathering documents for attorney meeting)
- [x] Family contacts management (executors, trustees, etc.)
- [x] Attorney questions tracker
- [x] Preparation task cards

---

## In Progress

*No active development phases*

---

## Future Phases

### Phase 11: Polish & Performance
- [ ] Loading states and skeleton screens
- [ ] Error boundaries and fallbacks
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG compliance)

### Phase 12: Authentication & Multi-User
- [ ] User accounts and authentication
- [ ] Multiple estate plans per user
- [ ] Sharing/collaboration features
- [ ] Role-based access (attorney review)

### Phase 13: Export & Integration
- [ ] PDF export with proper formatting
- [ ] Word document export
- [ ] Print-optimized layouts
- [ ] E-signature integration (DocuSign/HelloSign)

### Phase 14: Attorney Network
- [ ] Attorney review request system
- [ ] Attorney directory by state
- [ ] Review tracking and communication

---

## Deployment

**Local Development:**
```bash
cd mvp
npm install
cp .env.example .env
# Configure DATABASE_URL, ANTHROPIC_API_KEY, E2B_API_KEY
npx prisma migrate dev
npm run dev
```

**Deploy Commands:**
```bash
# Deploy database migrations to production
npx prisma migrate deploy

# Deploy to Vercel
npx vercel --prod
```

---

## Database Architecture

19 Prisma models across 6 categories:

**Core:**
- User, EstatePlan, AgentRun, GeneratedFile

**Intake:**
- IntakeData, GuidedIntakeProgress

**Documents:**
- Document, UploadedDocument, ExtractedIntakeData

**Analysis:**
- GapAnalysis, GapAnalysisRun, GapAnalysisPhase, GapAnalysisRunResult

**Reminders & Events:**
- Reminder, LifeEvent, BeneficiaryDesignation

**Preparation:**
- FamilyContact, AttorneyQuestion, DocumentChecklistItem

---

## API Architecture

30 REST API routes organized by resource:

- `/api/estate-plans` - Estate plan CRUD
- `/api/estate-plans/[id]/intake` - Intake data by section
- `/api/estate-plans/[id]/guided-intake` - Guided flow progress
- `/api/estate-plans/[id]/gap-analysis` - Analysis results
- `/api/estate-plans/[id]/gap-analysis-runs` - Multi-phase orchestration
- `/api/estate-plans/[id]/documents` - Generated documents
- `/api/estate-plans/[id]/uploaded-documents` - User uploads + AI analysis
- `/api/estate-plans/[id]/beneficiaries` - Beneficiary designations
- `/api/estate-plans/[id]/reminders` - Reminder management
- `/api/estate-plans/[id]/life-events` - Life event tracking
- `/api/estate-plans/[id]/family-contacts` - Contact management
- `/api/estate-plans/[id]/attorney-questions` - Questions tracker
- `/api/estate-plans/[id]/document-checklist` - Document gathering
- `/api/gap-analysis` - Quick analysis mode
- `/api/gap-analysis/orchestrate` - Comprehensive 3-phase analysis
- `/api/document-generation` - AI document generation
- `/api/upload` - File upload handling
- `/api/users` - User management

---

## Contributing

This project was built during an internship at Link Studio.

For questions or contributions, please open an issue.
