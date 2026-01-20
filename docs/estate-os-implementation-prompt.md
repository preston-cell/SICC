# Claude Code Implementation Prompt: Estate Planning Operating System

> **Instructions for Claude Code**: Use **planning mode** (shift-tab twice) before beginning implementation. This is a strategic product evolution based on business discovery. Think through each phase carefully, identify dependencies, and draft a comprehensive plan. Once approved, write the plan with detailed todos to `estate-os-implementation-todos.md`. Implement phase by phase, updating status as you go.

---

## Strategic Context

We are pivoting from "AI-powered gap analysis" to positioning as an **Operating System for Estate Planning Readiness**. This reframe changes how we build, what we prioritize, and how features serve our true customers: **estate planning attorneys and their firms**.

### Key Business Insights

| Insight | Implication |
|---------|-------------|
| "Operating system" not "AI tool" | De-emphasize AI messaging, emphasize workflow integration |
| Attorneys are the customer, not consumers | B2B focus, help attorneys serve more clients better |
| "10x more prepared clients" | Our value = time compression + client quality |
| Multiple revenue streams needed | Lead source + time compression + proactive monitoring |
| Estate planning relationships have failed | Intelligence around family dynamics is the moat |
| 3 scores maximum | Simplify scoring, "Estate Readiness Score" is primary |
| "Educated consumer ready to go" | Output = prepared client, not just documents |

### Positioning Statement
> "An operating system that creates educated, prepared clients—so attorneys can have the most meaningful interactions from day one."

---

## Our Moat (What We Do Better)

These are the core intelligence areas that differentiate us:

1. **Document Completeness Analysis** - What's missing, outdated, or invalid
2. **Beneficiary Coordination** - Misalignments across accounts
3. **Improper Titling Detection** - Assets titled wrong for the estate plan
4. **State Tax Exposure** - State-specific estate/inheritance tax issues
5. **Guardian Conflicts** - Inconsistent or problematic guardian nominations
6. **Trustee Conflicts** - Inappropriate or conflicting trustee selections
7. **Special Needs Intelligence** - Family members requiring SNTs
8. **Family Dynamics** - Blended families, estrangements, unequal distributions
9. **Business Succession** - Business owners without succession plans

---

## Development Phases

### PHASE 1: Scoring System Redesign
**Priority**: Critical | **Goal**: Simplify to 3 core scores

#### Current State
- Single overall score (0-100) with letter grade
- Too many metrics scattered across UI
- Doesn't communicate clear value to attorneys

#### Target State: Three Scores

```
┌─────────────────────────────────────────────────────────────┐
│                   ESTATE READINESS SCORE                     │
│                          ┌───┐                               │
│                          │ 72│  ← Primary score (0-100)      │
│                          └───┘                               │
│                                                              │
│   ┌─────────────────┐  ┌─────────────────┐                  │
│   │ DOCUMENT SCORE  │  │ FAMILY SCORE    │                  │
│   │      68%        │  │     78%         │                  │
│   │ 4 of 6 docs     │  │ Low conflict    │                  │
│   └─────────────────┘  └─────────────────┘                  │
│                                                              │
│   "This client is 72% prepared for their estate planning    │
│    consultation. Estimated time savings: 2.5 hours."        │
└─────────────────────────────────────────────────────────────┘
```

**Three Scores**:
1. **Estate Readiness Score** (Primary, 0-100)
   - Overall preparation level
   - Weighted combination of document + family scores
   - Maps to attorney time savings

2. **Document Score** (0-100%)
   - Document completeness
   - Document currency (age)
   - Beneficiary alignment
   - Titling correctness

3. **Family Complexity Score** (0-100 or Low/Medium/High)
   - Family structure complexity
   - Conflict potential
   - Special circumstances (special needs, business, multi-state)

#### Implementation Tasks

**File changes**:
- `lib/gap-analysis/scoring.ts` (new) - Scoring engine
- `convex/schema.ts` - Update gapAnalysis table for new scores
- `app/analysis/[estatePlanId]/page.tsx` - New score display UI
- `components/scores/EstateReadinessScore.tsx` (new)
- `components/scores/DocumentScore.tsx` (new)
- `components/scores/FamilyComplexityScore.tsx` (new)

**Scoring Algorithm**:
```typescript
interface ScoringResult {
  estateReadiness: {
    score: number; // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    timeSavingsHours: number; // Estimated attorney time saved
    summary: string;
  };
  document: {
    score: number; // 0-100
    completeness: number; // % of needed docs present
    currency: number; // % of docs current (< 5 years)
    alignment: number; // % beneficiaries aligned
    titling: number; // % assets properly titled
    issues: DocumentIssue[];
  };
  familyComplexity: {
    score: number; // 0-100 (higher = more complex)
    level: 'low' | 'medium' | 'high';
    factors: ComplexityFactor[];
    conflictRisk: number; // 0-100
  };
}
```

---

### PHASE 2: Attorney Dashboard & Workflow Integration
**Priority**: High | **Goal**: Serve attorneys, not just consumers

#### Concept
Attorneys need a dashboard to:
- See all their clients' readiness at a glance
- Prioritize who to follow up with
- Track margin expansion (time saved)
- Receive qualified leads

#### New Features

**2A: Attorney Portal** (`/attorney/dashboard`)
```
┌─────────────────────────────────────────────────────────────┐
│  ATTORNEY DASHBOARD                        [Firm: Smith Law] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 THIS MONTH                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 12       │ │ 8        │ │ 34 hrs   │ │ $8,500   │       │
│  │ Clients  │ │ Ready    │ │ Saved    │ │ Value    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│  📋 CLIENT PIPELINE                                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Name          │ Readiness │ Complexity │ Action        ││
│  ├───────────────┼───────────┼────────────┼───────────────┤│
│  │ Johnson, M.   │ 92% ✓     │ Low        │ Schedule      ││
│  │ Williams, T.  │ 78%       │ High       │ Need docs     ││
│  │ Garcia, R.    │ 45%       │ Medium     │ Follow up     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  🔔 ALERTS                                                   │
│  • Williams: Life event detected (new child)                │
│  • Chen: Documents expiring in 30 days                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**2B: Client Quality Filter** (ICP Matching)
- Define ideal client profile for the firm
- Score incoming leads against ICP
- Help attorneys focus on right-fit clients

**2C: Time Compression Metrics**
- Track time saved per client
- Calculate margin expansion
- Generate reports for firm leadership

#### Implementation Tasks

**Database**:
- `convex/schema.ts` - Add `firms`, `attorneys`, `firmClients` tables
- `convex/firms.ts` - Firm management mutations
- `convex/attorneys.ts` - Attorney user management

**API Routes**:
- `app/api/attorney/` - Attorney-specific endpoints
- `app/api/firm/` - Firm management endpoints

**UI**:
- `app/attorney/dashboard/page.tsx` - Main dashboard
- `app/attorney/clients/page.tsx` - Client list
- `app/attorney/settings/page.tsx` - Firm settings, ICP definition
- `components/attorney/` - Dashboard components

---

### PHASE 3: Proactive Monitoring System
**Priority**: High | **Goal**: Ongoing engagement, not one-time analysis

#### Concept
The system should proactively monitor for:
- **Life events** - Marriage, divorce, birth, death, relocation
- **Economic events** - Market changes affecting estate, tax law changes
- **Document events** - Approaching expiration, beneficiary changes needed

This creates ongoing value and retention.

#### Features

**3A: Life Event Detection & Alerts**
```typescript
interface LifeEvent {
  type: 'marriage' | 'divorce' | 'birth' | 'death' | 'relocation' |
        'retirement' | 'inheritance' | 'business_sale' | 'health_change';
  detectedAt: Date;
  source: 'user_reported' | 'inferred' | 'integration';
  impactedDocuments: string[];
  recommendedActions: Action[];
  urgency: 'immediate' | 'soon' | 'routine';
}
```

**3B: Economic Event Monitoring**
- Federal estate tax exemption changes
- State law changes
- Market events affecting estate value
- Interest rate changes (for certain trusts)

**3C: Proactive Outreach System**
- Automated reminders to clients
- Attorney notification when action needed
- "Why it was smart to choose us" touchpoints

#### Implementation Tasks

**Database**:
- `convex/lifeEvents.ts` - Life event tracking
- `convex/alerts.ts` - Alert management
- `convex/outreach.ts` - Outreach scheduling

**Background Jobs**:
- `lib/monitoring/life-event-detector.ts`
- `lib/monitoring/economic-event-monitor.ts`
- `lib/monitoring/document-expiry-checker.ts`

**Notifications**:
- Email integration for alerts
- In-app notification system
- Attorney digest emails

---

### PHASE 4: Family Dynamics Intelligence
**Priority**: High | **Goal**: This is our core moat

#### Concept
Deep understanding of family complexity that templates and basic tools miss:

**4A: Family Relationship Mapping**
```
┌─────────────────────────────────────────────────────────────┐
│  FAMILY DYNAMICS MAP                                         │
│                                                              │
│                    ┌─────────┐                               │
│                    │ John    │ ← Client                      │
│                    │ (68)    │                               │
│                    └────┬────┘                               │
│           ┌────────────┼────────────┐                       │
│           │            │            │                        │
│      ┌────┴────┐  ┌────┴────┐  ┌────┴────┐                  │
│      │ Sarah   │  │ Michael │  │ Emily   │                  │
│      │ (42)    │  │ (38)    │  │ (35)    │                  │
│      │ ⚠️ Est. │  │ ✓ Close │  │ 🔸 Spec │                  │
│      └─────────┘  └─────────┘  └─────────┘                  │
│                                                              │
│  ⚠️ DETECTED DYNAMICS                                        │
│  • Sarah: Estranged (no contact 5+ years)                   │
│  • Emily: Special needs - requires SNT                      │
│  • Unequal distribution likely needed                       │
│  • Conflict risk: HIGH if equal distribution                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**4B: Conflict Prediction**
- Analyze family structure for litigation risk
- Recommend protective provisions (no-contest clauses)
- Flag when family meeting advisable

**4C: Blended Family Intelligence**
- Track "his kids, her kids, our kids"
- Identify QTIP trust needs
- Handle ex-spouse beneficiary cleanup

**4D: Business Succession Analysis**
- Identify family businesses
- Analyze active vs. passive family members
- Recommend buy-sell agreements, succession structures

#### Implementation Tasks

**Data Model**:
```typescript
interface FamilyMember {
  id: string;
  name: string;
  relationship: RelationshipType;
  dateOfBirth?: Date;
  isMinor: boolean;

  // Dynamics
  relationshipQuality: 'close' | 'normal' | 'distant' | 'estranged';
  specialCircumstances: SpecialCircumstance[];

  // Business
  businessInvolvement?: 'active' | 'passive' | 'none';

  // Distribution
  intendedShare?: number;
  distributionNotes?: string;
}

interface FamilyDynamics {
  structure: 'nuclear' | 'blended' | 'single_parent' | 'complex';
  complexityFactors: string[];
  conflictRisk: number;
  recommendedProvisions: Provision[];
}
```

**UI Components**:
- `components/family/FamilyTreeVisual.tsx`
- `components/family/DynamicsAnalysis.tsx`
- `components/family/ConflictRiskCard.tsx`

**Analysis Engine**:
- `lib/family-dynamics/analyzer.ts`
- `lib/family-dynamics/conflict-predictor.ts`
- `lib/family-dynamics/provision-recommender.ts`

---

### PHASE 5: Multi-Revenue Stream Infrastructure
**Priority**: Medium | **Goal**: Sustainable business model

#### Revenue Streams

**5A: Lead Source (Referral Fees)**
- Consumer completes readiness assessment
- System matches to appropriate attorney
- Track conversion, charge referral fee

**5B: Time Compression SaaS (Subscription)**
- Monthly fee per attorney seat
- Based on clients processed / time saved
- Tiered pricing by firm size

**5C: Proactive Monitoring (Premium)**
- Ongoing monitoring subscription
- Life event alerts
- Economic event monitoring
- Premium support

#### Implementation Tasks

**Billing Integration**:
- Stripe integration for subscriptions
- Usage tracking for metered billing
- Invoice generation

**Analytics**:
- Time saved tracking
- Conversion tracking (lead → client)
- ROI calculator for attorneys

---

### PHASE 6: Intake Flow Redesign
**Priority**: Medium | **Goal**: Create "educated consumer ready to go"

#### Concept
Redesign intake to:
- Educate client during process
- Capture family dynamics naturally
- Feel like conversation, not form
- Output = client ready for attorney meeting

#### Features

**6A: Conversational Intake**
- Progressive disclosure
- Explain why each question matters
- Adapt based on answers

**6B: Family Dynamics Capture**
- Natural questions about relationships
- Visual family tree building
- Gentle probing on sensitive topics

**6C: Readiness Summary for Client**
- "Here's what you learned about your estate"
- "Here's what to discuss with your attorney"
- Educational content based on gaps

---

## Implementation Order

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: Scoring Redesign                    [Week 1-2]    │
│  ────────────────────────────────────────────────────────── │
│  • 3-score system                                           │
│  • Estate Readiness as primary                              │
│  • Time savings calculation                                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: Family Dynamics (Parallel with 2)   [Week 2-4]    │
│  ────────────────────────────────────────────────────────── │
│  • Family relationship mapping                              │
│  • Conflict prediction                                      │
│  • This is our moat - prioritize                           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: Attorney Dashboard                  [Week 3-5]    │
│  ────────────────────────────────────────────────────────── │
│  • Basic dashboard                                          │
│  • Client pipeline view                                     │
│  • Time savings metrics                                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: Proactive Monitoring                [Week 5-7]    │
│  ────────────────────────────────────────────────────────── │
│  • Life event detection                                     │
│  • Alert system                                             │
│  • Outreach automation                                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 6: Intake Redesign                     [Week 7-9]    │
│  ────────────────────────────────────────────────────────── │
│  • Conversational flow                                      │
│  • Family dynamics capture                                  │
│  • Educational output                                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 5: Revenue Infrastructure              [Week 9-11]   │
│  ────────────────────────────────────────────────────────── │
│  • Billing integration                                      │
│  • Usage tracking                                           │
│  • Multi-stream support                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Considerations

### Database Schema Additions

```typescript
// Firms (B2B customers)
firms: defineTable({
  name: v.string(),
  location: v.string(),
  size: v.union(v.literal("solo"), v.literal("small"), v.literal("medium"), v.literal("large")),
  icpDefinition: v.optional(v.string()), // JSON: ideal client profile
  subscription: v.optional(v.string()), // JSON: billing info
  createdAt: v.number(),
}),

// Attorneys (users within firms)
attorneys: defineTable({
  firmId: v.id("firms"),
  userId: v.string(), // Clerk user ID
  name: v.string(),
  email: v.string(),
  role: v.union(v.literal("admin"), v.literal("attorney"), v.literal("paralegal")),
}),

// Family members (for dynamics)
familyMembers: defineTable({
  estatePlanId: v.id("estatePlanning"),
  name: v.string(),
  relationship: v.string(),
  dateOfBirth: v.optional(v.string()),
  relationshipQuality: v.optional(v.string()),
  specialCircumstances: v.optional(v.string()), // JSON array
  businessInvolvement: v.optional(v.string()),
  intendedShare: v.optional(v.number()),
  notes: v.optional(v.string()),
}),

// Life events (monitoring)
lifeEvents: defineTable({
  estatePlanId: v.id("estatePlanning"),
  type: v.string(),
  detectedAt: v.number(),
  source: v.string(),
  status: v.string(), // pending, acknowledged, actioned
  impactAnalysis: v.optional(v.string()), // JSON
}),

// Alerts
alerts: defineTable({
  recipientType: v.union(v.literal("client"), v.literal("attorney")),
  recipientId: v.string(),
  estatePlanId: v.optional(v.id("estatePlanning")),
  type: v.string(),
  title: v.string(),
  message: v.string(),
  urgency: v.string(),
  status: v.string(), // unread, read, dismissed
  createdAt: v.number(),
}),
```

### Messaging Guidelines

**DO say**:
- "Operating system for estate planning readiness"
- "Creates prepared, educated clients"
- "Time compression for your practice"
- "Margin expansion through efficiency"
- "The most meaningful client interactions"

**DON'T say**:
- "AI-powered"
- "Replaces paralegals"
- "Automated estate planning"
- "Robot lawyer"

---

## Questions to Resolve During Planning

1. **Firm onboarding flow** - How do attorneys sign up? Individual or firm-wide?
2. **Client-attorney matching** - How do we match leads to the right attorney?
3. **Data ownership** - When client uses our system, who owns the data?
4. **White-label option** - Do firms want their branding or ours?
5. **Integration priorities** - Which practice management systems to integrate first?
6. **Boston pilot** - Which firms to approach? What's the pilot structure?

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Attorney time saved per client | 2+ hours | Before/after comparison |
| Client readiness score improvement | +30 points | Pre/post intake |
| Attorney retention (monthly) | >90% | Subscription renewals |
| Lead conversion rate | >25% | Leads → paying clients |
| NPS (attorneys) | >50 | Quarterly survey |
| NPS (clients) | >60 | Post-meeting survey |

---

## Appendix: ICP (Ideal Client Profile) Framework

Attorneys should be able to define their ICP:

```typescript
interface IdealClientProfile {
  // Estate size
  minEstateValue?: number;
  maxEstateValue?: number;

  // Complexity preference
  complexityPreference: 'simple' | 'moderate' | 'complex' | 'any';

  // Family situations
  acceptsBlendedFamilies: boolean;
  acceptsBusinessSuccession: boolean;
  acceptsSpecialNeeds: boolean;

  // Geography
  states: string[]; // States they're licensed in

  // Other
  minAge?: number;
  requiresExistingDocuments: boolean;
}
```

When a client completes intake, we score them against firm ICPs and route appropriately.

---

*End of Implementation Prompt*
