# EstateAI: Research Notes

## Legal Research

### Unauthorized Practice of Law (UPL) Considerations

#### Key Findings
- Document preparation services are generally permitted if they don't involve legal advice
- Key distinction: "scrivener" services (filling in blanks) vs. legal advice (recommending strategies)
- Most states allow non-attorney document preparation with proper disclaimers
- California Business & Professions Code Section 6400-6401 specifically addresses Legal Document Assistants

#### State-by-State Status (Initial Research)

| State | UPL Risk Level | Notes |
|-------|----------------|-------|
| California | Low | LDA registration, clear rules |
| Texas | Low-Medium | Case law supports document prep |
| Florida | Medium | Stricter interpretation |
| New York | Medium | Active bar association |
| Arizona | Low | Allows non-attorney legal services |

#### Mitigation Strategies
1. Clear disclaimers that service is document preparation, not legal advice
2. No specific recommendations on legal strategies
3. Offer attorney review option for complex matters
4. Register as LDA in California
5. User acknowledges understanding limitations

### Estate Planning Legal Requirements

#### Will Requirements by State (Sample)

| State | Min. Age | Witnesses | Notary | Holographic Allowed |
|-------|----------|-----------|--------|---------------------|
| California | 18 | 2 | Optional | Yes |
| Texas | 18 | 2 | Optional (self-proving) | Yes |
| Florida | 18 | 2 | Required (self-proving) | No |
| New York | 18 | 2 | Optional | No |

#### Trust Requirements
- Generally fewer formalities than wills
- Funding requirements vary
- Pour-over will typically recommended

---

## Competitive Research

### LegalZoom Deep Dive

**Strengths:**
- Brand recognition (20+ years)
- Full service offering
- Physical presence (attorneys in some states)
- SEO dominance

**Weaknesses:**
- High prices ($249+ for basic will)
- Form-based, not adaptive
- Slow (days/weeks for delivery)
- Complaints about upselling

**User Reviews Analysis:**
- Common complaints: hidden fees, slow delivery, generic documents
- Positive: brand trust, peace of mind
- Average rating: 3.5-4.0 stars

### Trust & Will Deep Dive

**Strengths:**
- Modern UX
- Lower prices ($159 for comprehensive)
- Mobile-friendly
- Good completion rates

**Weaknesses:**
- Limited customization
- No import capability
- Limited state coverage initially
- Less brand recognition

**User Reviews Analysis:**
- Common praise: easy to use, affordable
- Common complaints: limited customization, generic feel
- Average rating: 4.0-4.5 stars

### Gaps in Current Market
1. **No import & improve** - Everyone forces new document creation
2. **Limited AI use** - Still mostly branching logic forms
3. **Poor explanations** - Legal jargon not explained
4. **No before/after** - Changes not visualized
5. **Binary pricing** - Full price or nothing, no targeted updates

---

## Technology Research

### LLM Capabilities for Legal

#### Tested Scenarios (Using Claude)

| Task | Quality | Confidence | Notes |
|------|---------|------------|-------|
| Explain legal concepts | Excellent | High | Clear, accurate |
| Generate will provisions | Good | Medium | Needs validation |
| Identify document gaps | Good | Medium | Useful starting point |
| State-specific rules | Variable | Low | Needs rules engine |
| Legal strategy advice | N/A | N/A | Should not provide |

#### Key Technical Findings
1. LLMs excellent for conversation, explanation, drafting
2. LLMs unreliable for state-specific statutory requirements
3. Hybrid approach needed: LLM + rules engine
4. Structured output modes helpful for data extraction
5. Long context windows enable full document analysis

### Document Parsing Research

#### PDF Extraction Options

| Tool | Quality | Cost | Notes |
|------|---------|------|-------|
| PyMuPDF | Good | Free | Fast, reliable |
| Adobe PDF Services | Excellent | Paid | Best quality |
| AWS Textract | Excellent | Paid | Good for scans |
| Unstructured.io | Very Good | Free/Paid | Good all-rounder |

#### Parsing Challenges
- Scanned documents need OCR
- Multi-column layouts
- Tables and lists
- Legal formatting conventions
- Handwritten additions

### Architecture Patterns

#### Similar Systems Researched
1. **Lex Machina** - Legal analytics, ML for document analysis
2. **DoNotPay** - Conversational legal robot
3. **Harvey AI** - LLM for legal professionals
4. **Casetext/CoCounsel** - AI legal assistant

#### Key Patterns
- Retrieval Augmented Generation (RAG) for legal knowledge
- Multi-step reasoning with validation
- Human-in-the-loop for high-stakes outputs
- Audit trails and explainability

---

## User Research

### Informal User Interviews (N=12)

#### Key Quotes
> "I know I need a will but every time I look into it, it seems too complicated and expensive."

> "I have a will from 10 years ago when we only had one kid. Now we have three and own a house. I know it needs updating but I don't want to start from scratch."

> "The online forms I've tried all feel like they're not really understanding my situation. They just march you through the same questions regardless."

> "I'd love something that just asks me questions like a person would and figures out what I need."

#### Pain Points Summary
1. Cost perceived as prohibitive (even when it's not)
2. Complexity and legal jargon intimidating
3. Time commitment unclear
4. Forms feel impersonal and rigid
5. Uncertainty about whether output is valid
6. Update process as frustrating as initial creation

### Desired Features (Ranked)
1. Plain English explanations
2. Adaptive questions (not one-size-fits-all)
3. Clear pricing upfront
4. Ability to update specific parts
5. Confidence that documents are legally valid
6. Attorney review option available

---

## Market Research

### Search Volume Analysis (Monthly US)

| Keyword | Volume | Competition | CPC |
|---------|--------|-------------|-----|
| "online will" | 18,100 | High | $15 |
| "make a will online" | 9,900 | High | $18 |
| "free will template" | 8,100 | Medium | $8 |
| "estate planning" | 27,100 | High | $25 |
| "living trust" | 22,200 | High | $20 |
| "how to write a will" | 14,800 | Medium | $12 |
| "update my will" | 1,900 | Low | $10 |
| "codicil to will" | 2,400 | Low | $8 |

**Opportunity:** "Update" keywords low competition, high intent

### Conversion Benchmarks

| Metric | Industry Avg | Top Performers |
|--------|--------------|----------------|
| Visitor to Start | 3-5% | 8-10% |
| Start to Complete | 15-25% | 40-50% |
| Complete to Purchase | 60-70% | 80%+ |
| Overall Conversion | 0.3-0.9% | 2-4% |

---

## References

### Legal
- California Business & Professions Code §6400-6415
- ABA Model Rules of Professional Conduct
- State bar association UPL guidelines
- Unauthorized Practice of Law Committee opinions

### Technical
- LangChain documentation
- Anthropic API documentation
- python-docx documentation
- WeasyPrint documentation

### Market
- IBISWorld Industry Reports
- Caring.com Annual Survey
- Gallup Estate Planning Poll
- US Census Bureau

### Academic
- "AI and Access to Justice" - Stanford Law
- "Legal Document Assembly Systems" - MIT
- "Conversational AI in Professional Services" - Harvard Business Review

---

## Open Questions

### Legal
- [ ] Detailed UPL analysis for top 10 states
- [ ] LDA registration process in California
- [ ] Required disclaimers by state
- [ ] Malpractice insurance requirements

### Technical
- [ ] Best approach for document parsing accuracy
- [ ] State rules database schema design
- [ ] Conversation state management approach
- [ ] Testing strategy for legal accuracy

### Market
- [ ] Detailed competitive pricing analysis
- [ ] User willingness to pay validation
- [ ] B2B channel partner research
- [ ] International expansion feasibility

### Product
- [ ] Minimum viable document set
- [ ] Attorney review partnership model
- [ ] Notary integration options
- [ ] Subscription vs. transactional pricing
