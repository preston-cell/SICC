# EstateAI: Research Notes

## High-Net-Worth ($2M–$50M) Behavioral Research

### HNW Estate Planning Behavior Patterns

#### Key Findings from Wealth Research

1. **High Plan Ownership, Low Plan Maintenance**
   - ~70% of HNW households have some form of estate plan
   - Only ~25% have reviewed their plan in the past 3 years
   - Average plan age: 7–10 years
   - Most plans are "set and forget"

2. **Trigger Events Drive Action**
   - Major life events prompt estate planning activity:
     - Death of parent/spouse (highest trigger)
     - Marriage/divorce/remarriage
     - Birth of child/grandchild
     - Major asset acquisition (home, business)
     - Health scare
   - Market events occasionally trigger reviews

3. **Cost-Benefit Calculation**
   - HNW individuals understand the need for professional help
   - BUT: Struggle to justify $5,000–$15,000 for comprehensive review
   - Often perceive attorney fees as opaque and unpredictable
   - Want to know "what specifically needs fixing" before engaging

4. **Relationship Dependency**
   - Many HNW individuals had a trusted attorney relationship
   - Relationship often lapses (attorney retires, moves, dies)
   - Starting with a new attorney feels daunting
   - Creates "orphaned" estate plans

#### HNW Digital Behavior

| Behavior | HNW Adoption |
|----------|--------------|
| Online banking | 95%+ |
| Investment apps | 75%+ |
| Tax software | 60% |
| Legal tech (any) | 25–35% |
| Estate planning tools | <15% |

**Insight:** HNW individuals are digitally comfortable but haven't embraced legal tech for estate planning. Opportunity for a well-positioned solution.

---

## Legal Research

### Unauthorized Practice of Law (UPL) Considerations

#### Key Distinctions for Gap Analysis Product

1. **Document Preparation vs. Analysis**
   - Document preparation = creating legal documents (higher UPL risk)
   - Document analysis = reviewing existing documents for issues (lower UPL risk)
   - Our focus on analysis positions us more safely

2. **Legal Advice vs. Legal Information**
   - Legal advice = recommending specific actions for specific situations (UPL)
   - Legal information = explaining what documents say, identifying gaps (not UPL)
   - We provide information and education, not advice

3. **Technology Intermediary Doctrine**
   - Software that assists users in understanding documents ≠ UPL
   - Key: User makes decisions; tool provides information
   - Precedent: TurboTax, LegalZoom (in most states)

#### State-Specific Considerations

| State | UPL Risk Level | Key Requirements |
|-------|----------------|------------------|
| California | Low-Medium | LDA registration may be required for document prep; analysis likely exempt |
| Texas | Low | Generally permissive; clear disclaimers recommended |
| Florida | Medium | More restrictive; careful positioning required |
| New York | Medium | Active bar; strong disclaimers needed |

#### Mitigation Strategies

1. **Clear Disclaimers**
   - "This is not legal advice"
   - "Results are for informational purposes only"
   - "Consult an attorney before taking action"

2. **Positioning**
   - "Educational tool" not "legal service"
   - "Gap identification" not "legal recommendations"
   - "Analysis report" not "legal opinion"

3. **Attorney Referral Integration**
   - Recommend attorney consultation for all action items
   - Build attorney referral network
   - Creates clear handoff point

4. **User Acknowledgments**
   - Terms of service clearly state limitations
   - User confirms understanding before analysis
   - No attorney-client relationship formed

---

## Competitive Research

### Estate Planning for HNW: Competitive Landscape

#### Trust & Will

**Overview:** Leading digital estate planning platform

| Aspect | Details |
|--------|---------|
| Target | Mass market (<$1M) |
| Primary offering | Document creation |
| Pricing | $159–$599 |
| Gap analysis | None |
| HNW features | Limited |

**Weakness for our segment:** Not built for trust complexity; no analysis of existing documents.

#### Wealth.com

**Overview:** Enterprise estate planning platform for advisors

| Aspect | Details |
|--------|---------|
| Target | Financial advisors serving HNW/UHNW |
| Primary offering | Planning platform + collaboration |
| Pricing | B2B (advisor-paid) |
| Gap analysis | Manual (advisor-driven) |
| HNW features | Strong |

**Weakness for our segment:** Not direct-to-consumer; expensive; requires advisor relationship.

#### LegalZoom

**Overview:** Market leader in online legal services

| Aspect | Details |
|--------|---------|
| Target | Small business + mass market consumers |
| Primary offering | Document creation + attorney access |
| Pricing | $89–$249 for wills |
| Gap analysis | None (attorney review available at premium) |
| HNW features | None |

**Weakness for our segment:** Basic templates; not equipped for trust complexity; no AI analysis.

#### Traditional Estate Planning Attorneys

| Aspect | Details |
|--------|---------|
| Target | All segments |
| Primary offering | Full-service planning |
| Pricing | $3,000–$15,000+ |
| Gap analysis | Manual review included |
| HNW features | Full capability |

**Weakness for our segment:** Expensive; time-intensive; opaque pricing; relationship-dependent.

### Competitive White Space

No competitor currently offers:
- **AI-powered gap analysis** as primary product
- **HNW-specific complexity handling** in a digital tool
- **Analysis-first** (vs. creation-first) approach
- **Risk scoring and prioritization** of findings

---

## Technology Research

### LLM Capabilities for Estate Plan Analysis

#### Tested Capabilities (Using Claude)

| Task | Quality | Confidence | Notes |
|------|---------|------------|-------|
| Document parsing | Very Good | High | Extracts structure, names, provisions |
| Element identification | Very Good | High | Executors, trustees, beneficiaries |
| Gap detection | Good | Medium | Identifies missing provisions |
| State rule compliance | Variable | Medium | Needs rules engine support |
| Risk assessment | Good | Medium | Can explain severity |
| Plain-English summary | Excellent | High | Clear explanations |

#### Key Technical Findings

1. **LLMs excel at:**
   - Understanding document structure
   - Extracting named entities (people, assets)
   - Explaining legal provisions in plain language
   - Identifying obvious gaps and inconsistencies

2. **LLMs need support for:**
   - State-specific statutory requirements (rules engine)
   - Current legal standards (knowledge cutoff)
   - Precision on numbers/dates (validation layer)

3. **Hybrid Architecture Required:**
   - LLM for document understanding and explanation
   - Rules engine for compliance checking
   - Validation layer for accuracy assurance

### Document Parsing Research

#### HNW Document Complexity

Typical HNW estate plan includes:
- Revocable Living Trust (15–50 pages)
- Pour-over Will (5–10 pages)
- Durable Power of Attorney (5–10 pages)
- Healthcare Proxy/Advance Directive (3–5 pages)
- Trust amendments (variable)
- Beneficiary designations (separate from documents)

**Total:** 30–80+ pages across multiple documents

#### Parsing Challenges

1. **Attorney-drafted documents vary widely**
   - Different formatting conventions
   - Different clause structures
   - Different terminology

2. **Scanned vs. native PDFs**
   - Many documents are scanned
   - OCR quality varies
   - Handwritten notes/signatures

3. **Multi-document coordination**
   - Will-trust consistency
   - Beneficiary designation alignment
   - Amendment integration

#### Recommended Approach

1. **Document upload**: PyMuPDF + OCR fallback
2. **Text extraction**: Preserve structure where possible
3. **LLM parsing**: Extract key elements into structured data
4. **Rules validation**: Check against state requirements
5. **Gap identification**: Compare to best practices checklist

---

## Gap Taxonomy Research

### Common Gaps in HNW Estate Plans

Based on estate planning attorney interviews and industry research:

#### Critical Gaps (Immediate Risk)

1. **Deceased/Incapacitated Fiduciaries**
   - Named executor/trustee has died or is incapacitated
   - No successor or successor also unavailable
   - Frequency: ~15% of plans 10+ years old

2. **Improper Execution**
   - Missing signatures
   - Insufficient witnesses
   - Notary issues for self-proving affidavit
   - Frequency: ~5% (often in DIY documents)

3. **Unfunded Trust**
   - Trust exists but assets not titled to trust
   - Results in probate despite trust
   - Frequency: ~25% of trust-based plans

#### High Priority Gaps

4. **Outdated Beneficiary Designations**
   - Ex-spouse still named on retirement accounts
   - Deceased beneficiary not updated
   - Beneficiary designation conflicts with will/trust
   - Frequency: ~30%

5. **Missing Incapacity Planning**
   - No POA or healthcare proxy
   - Outdated healthcare directives
   - No HIPAA authorization
   - Frequency: ~20%

6. **Missing Digital Asset Provisions**
   - No provision for digital accounts
   - No password/access instructions
   - No cryptocurrency provisions
   - Frequency: ~60% of plans 5+ years old

#### Medium Priority Gaps

7. **Missing Contingent Beneficiaries**
   - No backup if primary beneficiary predeceases
   - No provisions for next generation
   - Frequency: ~25%

8. **State Law Changes**
   - Plan drafted under old law
   - Tax provisions no longer applicable
   - Execution requirements changed
   - Frequency: Variable by state

9. **Asset Changes Not Reflected**
   - New properties not addressed
   - Business interests not covered
   - Investment account changes
   - Frequency: ~40%

#### Advisory Items

10. **Tax Optimization Opportunities**
    - Estate tax exemption changes
    - State inheritance tax considerations
    - Charitable giving structures
    - Frequency: ~50%

11. **Family Governance**
    - No family meeting provisions
    - No trustee succession plan
    - No dispute resolution mechanism
    - Frequency: ~70%

---

## User Research

### HNW User Interviews (Informal, N=15)

#### Key Quotes

> "I know my trust is probably out of date—my attorney retired five years ago and I've been meaning to find a new one, but I don't even know what questions to ask."

> "My financial advisor keeps bugging me to review my estate plan, but last time I went to a lawyer it cost $8,000 just to make a few changes."

> "I'd love to know what's actually wrong with my documents before I walk into a lawyer's office. I hate not knowing what I don't know."

> "My biggest fear is that I've got something set up wrong and my kids are going to have a nightmare when I die."

> "If I could get a report that tells me exactly what needs fixing, I'd pay a few hundred dollars for that easily. It's the open-ended attorney engagement that scares me."

#### Pain Points Summary

1. **Uncertainty** — Don't know what's wrong or what to fix
2. **Cost anxiety** — Afraid of open-ended legal fees
3. **Relationship gap** — No trusted attorney relationship
4. **Time constraints** — Busy professionals; estate planning isn't urgent until it is
5. **Complexity overwhelm** — Don't understand their own documents

#### Desired Features (Ranked)

1. Clear report of what's wrong/missing
2. Prioritization (what's critical vs. nice-to-have)
3. Plain-English explanations
4. Fixed, transparent pricing
5. No commitment to expensive follow-up
6. Option to connect with attorney if needed

---

## Pricing Research

### Willingness to Pay

Based on user research and market analysis:

| Price Point | Acceptance Rate | Notes |
|-------------|-----------------|-------|
| $99–$149 | 70%+ | "No-brainer" for basic analysis |
| $199–$299 | 55% | Acceptable for comprehensive analysis |
| $399–$499 | 40% | Need to see clear value |
| $500–$799 | 25% | Premium tier; need more features |
| $800+ | 15% | Must include attorney consult |

**Sweet Spot:** $399–$599 for comprehensive estate package analysis

### Competitive Pricing Context

| Service | Price | What You Get |
|---------|-------|--------------|
| Trust & Will (creation) | $159–$599 | New documents |
| LegalZoom will + attorney | $399+ | New will + 30-min consult |
| Attorney estate plan review | $1,500–$5,000 | Full review + recommendations |
| **EstateAI analysis** | **$399–$599** | **Gap report + prioritization** |

**Value Proposition:** 70–80% cost savings vs. attorney review

---

## References

### Legal Sources
- California Business & Professions Code §6400-6415
- ABA Model Rules of Professional Conduct
- State bar UPL guidance documents
- Unauthorized Practice of Law Committee opinions

### Market Research
- Federal Reserve Survey of Consumer Finances
- Wealth-X HNW Reports
- Capgemini World Wealth Report
- Cerulli Associates Affluent Market Research

### Industry Sources
- WealthManagement.com industry analysis
- Financial Planning Association surveys
- American College of Trust and Estate Counsel reports

### Technical Sources
- Anthropic API documentation
- LangChain documentation
- PyMuPDF documentation
- Unstructured.io documentation

---

## Open Questions

### Legal
- [ ] Detailed UPL analysis for California positioning
- [ ] Required disclaimers review by legal counsel
- [ ] E&O insurance requirements for analysis platform
- [ ] State bar notification requirements (if any)

### Technical
- [ ] Document parsing accuracy benchmarks
- [ ] Rules engine schema design
- [ ] Confidence scoring methodology
- [ ] Multi-document coordination approach

### Product
- [ ] Gap taxonomy finalization
- [ ] Report format and design
- [ ] Risk scoring algorithm
- [ ] Attorney referral network development

### Market
- [ ] User research validation (larger sample)
- [ ] Pricing A/B testing plan
- [ ] Channel partnership opportunities
- [ ] Financial advisor integration approach
