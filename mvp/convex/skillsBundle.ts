// Auto-generated skills bundle
// Skills are bundled as TypeScript strings to be injected into E2B sandbox

export interface SkillFile {
  path: string;
  content: string;
}

export interface Skill {
  name: string;
  files: SkillFile[];
}

const estate_document_analyzer_SKILL_md = `---
name: estate-document-analyzer
description: Analyzes estate planning legal documents (wills, trusts, powers of attorney, beneficiary designations, and 100+ document types) by extracting key information, translating legal jargon into plain English, and producing comprehensive summaries. Use when a user uploads estate planning documents for analysis, translation, or summarization. Handles PDF (text and scanned/image), and text files. Outputs a plain-language table mapping key points to source locations and original legal language, plus a detailed markdown summary. Massachusetts jurisdiction focus.
---

# Estate Document Analyzer

## Overview

Extract and translate legal language from estate planning documents into plain English while maintaining full traceability to source text. Produce two outputs:
1. **In-conversation table**: Key points mapped to source locations and original legal language
2. **Markdown summary file**: Exhaustive analysis of every operative clause and provision

## Workflow

\`\`\`
1. Receive uploaded document(s)
2. Detect file type (PDF text, PDF image, text file)
3. If image PDF → Run OCR via Tesseract
4. Auto-detect document type → Confirm with user if uncertain
5. If non-estate document → Ask user to confirm intent → Decline analysis
6. Extract all operative clauses, parties, dates, and provisions
7. Translate legal language → plain English
8. Generate in-conversation table (full unless user requests condensed)
9. Generate comprehensive markdown summary
10. If multiple documents → Map cross-document relationships
\`\`\`

## Document Type Detection

Auto-detect from taxonomy in \`references/document-types.md\`. If confidence is low, ask user:
> "This document appears to be a [detected type]. Is this correct, or would you like to specify the document type?"

## File Processing

### Text-Based PDFs
\`\`\`python
import pdfplumber

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\\n"
    return text
\`\`\`

### Image-Based PDFs (OCR)
Run \`scripts/ocr_processor.py\` for scanned documents:
\`\`\`bash
python scripts/ocr_processor.py <input_pdf> <output_text_file>
\`\`\`

If OCR confidence < 70%, notify user:
> "The document appears to be a scanned image. OCR was attempted but text quality may be reduced. Please verify extracted content for accuracy."

### Text Files
Read directly with UTF-8 encoding.

## Extraction Requirements

### Key Parties (Extract When Present)
| Role | Description |
|------|-------------|
| Grantor / Testator / Principal | Person creating the document |
| Trustee / Successor Trustee | Person(s) managing trust assets |
| Executor / Personal Representative | Person administering estate |
| Beneficiaries (Primary) | First-line recipients |
| Beneficiaries (Contingent) | Backup recipients |
| Agent (POA) | Person granted authority |
| Guardian | Person caring for minor children |
| Witnesses | Persons attesting to execution |
| Notary | Official acknowledging signatures |

### Document Metadata (Always Extract)
- Document title/type
- Execution date
- Effective date (if different)
- Jurisdiction/governing law
- References to prior versions or related documents
- Amendment history

### Asset Schedules
- **In conversation**: Summarize (e.g., "Schedule A lists 4 real properties and 3 financial accounts")
- **In markdown summary**: Itemize in full detail

### Digital Asset Provisions
Give special attention when present. Extract:
- Digital asset definitions
- Fiduciary access provisions
- Platform-specific instructions
- Cryptocurrency/private key references

## Output Formats

### In-Conversation Table
Return full table unless user requests condensed version:

\`\`\`
| Key Point (Plain English) | Source Location | Original Legal Language |
|---------------------------|-----------------|-------------------------|
| [Plain language translation] | [Article/Section/Para] | [Exact quoted text] |
\`\`\`

**Rules**:
- Include source location column
- Omit fields where information is ambiguous or missing
- Full length by default

### Markdown Summary File
Generate comprehensive \`.md\` file. Follow structure in \`references/summary-template.md\`.

## Multi-Document Analysis

When multiple documents uploaded:
1. Process each document individually
2. Map explicit relationships (Pour-Over Will → Trust, Amendments → Original)
3. Compare beneficiaries across documents
4. Note version/date sequencing
5. Flag multiple versions of same document type
6. Include cross-document observations section

## Non-Estate Document Handling

1. Ask user to confirm intent:
   > "This document appears to be a [type], which is outside the scope of estate planning analysis. Did you intend to upload this document?"

2. If confirmed non-estate, decline firmly but politely:
   > "This skill is designed specifically for estate planning documents such as wills, trusts, powers of attorney, and related instruments. I am unable to analyze [document type] as it falls outside this scope. Please upload an estate planning document for analysis."

3. Do not process regardless of insistence.

## Communication Style

- Formal and professional tone
- Educated but accessible language
- Avoid unnecessary jargon in explanations
- When uncertain, ask for confirmation politely

## Confidentiality Notice

Include at end of every markdown summary. See \`references/summary-template.md\`.

## Resources

- \`scripts/ocr_processor.py\` - Tesseract OCR for scanned PDFs
- \`references/summary-template.md\` - Markdown summary structure
- \`references/document-types.md\` - Complete document taxonomy
- \`references/legal-glossary.md\` - Legal terms → plain English
`;

const estate_document_analyzer_references_document_types_md = `# Estate Planning Document Types

Complete taxonomy of estate planning documents with extraction guidance.

## I. Core Lifetime Authority & Incapacity Documents

Prevent court control while alive.

| Document | Key Extractions |
|----------|-----------------|
| **Durable Power of Attorney (Financial)** | Principal, Agent, Successor Agent, Powers granted, Effective date, Durability clause |
| **Limited/Special Power of Attorney** | Principal, Agent, Specific powers, Expiration date, Purpose limitation |
| **Springing Power of Attorney** | Principal, Agent, Triggering conditions, Who determines incapacity |
| **Healthcare Power of Attorney** | Principal, Agent, Scope of medical decisions, HIPAA authorization |
| **Advance Healthcare Directive/Living Will** | Declarant, Life-sustaining treatment preferences, Pain management, Nutrition/hydration |
| **HIPAA Authorization** | Patient, Authorized persons, Scope of information, Expiration |
| **Mental Health Treatment Declaration** | Declarant, Preferences for mental health treatment, Agent for mental health |
| **Anatomical Gift/Organ Donation** | Donor, Organs/tissues specified, Purposes (transplant, research), Limitations |
| **POLST/MOLST** | Patient, CPR preference, Medical interventions level, Comfort measures |
| **Supported Decision-Making Agreement** | Individual, Supporters, Decision areas, Duration |

## II. Core Death & Transfer Documents

Govern disposition at death.

| Document | Key Extractions |
|----------|-----------------|
| **Last Will and Testament** | Testator, Executor, Beneficiaries, Specific bequests, Residuary clause, Guardian nominations, No-contest clause |
| **Pour-Over Will** | Testator, Executor, Trust referenced, Trust date, Residuary pour-over clause |
| **Codicil** | Testator, Original will date, Specific amendments, Republication clause |
| **Revocable Living Trust** | Grantor, Trustee, Successor Trustee, Beneficiaries, Distribution provisions, Amendment/revocation rights, Trust property |
| **Trust Restatement** | Grantor, Original trust date, Complete restated terms, Effective date |
| **Trust Amendment** | Grantor, Original trust date, Specific sections amended, Amendment number |
| **Testamentary Trust** | Testator, Trustee, Beneficiaries, Funding source, Distribution terms |
| **Irrevocable Trust** | Grantor, Trustee, Beneficiaries, Irrevocability statement, Trust purpose |
| **Letter of Instruction** | Author, Intended recipients, Personal wishes, Asset locations, Funeral preferences |
| **Memorandum of Personal Property** | Author, Referenced will/trust, Specific items and recipients |

## III. Trust Sub-Types

### Asset Protection / Tax

| Document | Key Extractions |
|----------|-----------------|
| **Grantor Trust** | Grantor, Trustee, Grantor trust powers (IRC provisions), Income tax treatment |
| **Non-Grantor Trust** | Grantor, Trustee, Separate taxpayer status, EIN |
| **Intentionally Defective Grantor Trust (IDGT)** | Grantor, Trustee, Defect provisions, Gift/estate tax treatment |
| **Spousal Lifetime Access Trust (SLAT)** | Grantor spouse, Beneficiary spouse, Trustee, Distribution standards, Reciprocal trust concerns |
| **Qualified Personal Residence Trust (QPRT)** | Grantor, Trustee, Property description, Retained term, Remainder beneficiaries |
| **Dynasty Trust** | Grantor, Trustee, GST allocation, Perpetuities provisions, Multi-generational beneficiaries |
| **Domestic Asset Protection Trust (DAPT)** | Grantor, Trustee, State of formation, Spendthrift provisions, Distribution standards |
| **Offshore Asset Protection Trust** | Grantor, Trustee, Jurisdiction, Protector, Flight clause |

### Benefit-Specific

| Document | Key Extractions |
|----------|-----------------|
| **Special Needs Trust (First-Party)** | Beneficiary, Trustee, Funding source, Medicaid payback provision, Distribution standards |
| **Special Needs Trust (Third-Party)** | Grantor, Beneficiary, Trustee, No payback provision, Supplemental purpose |
| **Supplemental Needs Trust** | Same as Special Needs Trust |
| **Spendthrift Trust** | Grantor, Beneficiary, Trustee, Spendthrift clause, Creditor protection |
| **Education Trust** | Grantor, Beneficiaries, Trustee, Qualified education expenses, Distribution triggers |
| **Minor's Trust** | Grantor, Minor beneficiary, Trustee, Age of distribution, 2503(c) provisions |
| **Incentive Trust** | Grantor, Beneficiaries, Trustee, Incentive conditions, Milestone triggers |

### Charitable

| Document | Key Extractions |
|----------|-----------------|
| **Charitable Remainder Trust (CRT)** | Grantor, Trustee, Income beneficiaries, Charitable remainder beneficiary, Payout rate, Term |
| **Charitable Lead Trust (CLT)** | Grantor, Trustee, Charitable lead beneficiary, Remainder beneficiaries, Lead term |
| **Private Foundation** | Founders, Directors, Purpose, Minimum distribution requirements |
| **Donor-Advised Fund Agreement** | Donor, Sponsoring organization, Advisory privileges, Succession advisors |

## IV. Asset-Specific Transfer Instruments

Often override wills and trusts.

| Document | Key Extractions |
|----------|-----------------|
| **Beneficiary Designation Form** | Account holder, Account type, Primary beneficiary, Percentage/share |
| **Contingent Beneficiary Designation** | Account holder, Contingent beneficiaries, Triggering conditions |
| **Transfer-on-Death (TOD) Deed** | Owner, Property description, TOD beneficiary, Recording information |
| **Pay-on-Death (POD) Designation** | Account holder, Institution, POD beneficiary |
| **TOD Securities Registration** | Owner, Securities described, TOD beneficiary |
| **Vehicle TOD Title** | Owner, Vehicle description, TOD beneficiary |
| **Community Property Agreement** | Spouses, Property covered, Survivorship provisions |
| **Joint Tenancy Deed** | Joint tenants, Property description, Right of survivorship |
| **Tenancy by Entirety Deed** | Spouses, Property description, Entireties language |

## V. Business & Professional Interest Documents

| Document | Key Extractions |
|----------|-----------------|
| **Buy-Sell Agreement** | Owners, Entity, Triggering events, Valuation method, Funding mechanism |
| **Operating Agreement (LLC)** | Members, Membership interests, Management structure, Transfer restrictions, Death provisions |
| **Shareholder Agreement** | Shareholders, Corporation, Share restrictions, Death/disability provisions |
| **Partnership Agreement** | Partners, Partnership interests, Management, Dissolution provisions |
| **Corporate Bylaws** | Corporation, Officers, Directors, Stock transfer provisions |
| **Professional Practice Succession** | Professional, Successor, Practice valuation, Transition terms |
| **Key-Person Insurance Agreement** | Insured, Owner, Beneficiary, Purpose |
| **Business Valuation Agreement** | Entity, Valuation method, Appraiser selection, Binding effect |
| **Assignment of Membership Interest** | Assignor, Assignee, Interest assigned, Effective date |

## VI. Family & Relationship Documents

| Document | Key Extractions |
|----------|-----------------|
| **Prenuptial Agreement** | Parties, Separate property definitions, Waiver of rights, Disclosure schedules |
| **Postnuptial Agreement** | Spouses, Property division, Support provisions |
| **Marital Property Agreement** | Spouses, Property characterization, Transmutation provisions |
| **Cohabitation Agreement** | Partners, Property rights, Support obligations |
| **Separation Agreement** | Spouses, Property division, Support, Estate waivers |
| **Divorce Decree** | Parties, Property division, QDRO provisions, Estate-impacting orders |
| **Adoption Decree** | Adoptive parents, Adopted child, Inheritance rights |
| **Guardianship Nomination** | Nominator, Nominated guardian, Minor children |
| **Standby Guardianship** | Parent, Standby guardian, Triggering conditions |
| **UTMA/UGMA Election** | Donor, Custodian, Minor beneficiary, Age of termination |

## VII. Tax & Wealth Transfer Documents

| Document | Key Extractions |
|----------|-----------------|
| **Gift Tax Return (Form 709)** | Donor, Donees, Gifts reported, Annual exclusion, Lifetime exemption used |
| **Estate Tax Return (Form 706)** | Decedent, Executor, Gross estate, Deductions, Tax due |
| **GST Allocation Election** | Transferor, Trusts/transfers, Inclusion ratio, Exempt status |
| **Qualified Disclaimer** | Disclaimant, Property disclaimed, Timing, Taker in default |
| **Portability Election** | Deceased spouse, Surviving spouse, DSUE amount |

## VIII. Digital & Intangible Assets

Give special attention to these provisions.

| Document | Key Extractions |
|----------|-----------------|
| **Digital Asset Authorization (RUFADAA)** | Principal, Fiduciary, Digital assets defined, Access scope, Platform-specific instructions |
| **Cryptocurrency Custody Instructions** | Owner, Custodian/fiduciary, Wallet types, Exchange accounts |
| **Private Key Access Instructions** | Owner, Key storage locations, Access procedures, Hardware wallet locations |
| **Online Account Memorandum** | Account holder, Accounts listed, Access credentials location, Disposition wishes |
| **IP Assignments** | Assignor, Assignee, IP described, Rights transferred |
| **Domain Transfer Instructions** | Owner, Domains listed, Registrar information, Transfer procedures |

## IX-XV. Additional Document Categories

### Death-Care Documents
Funeral Instructions, Disposition of Remains, Burial/Cremation Authorization, Cemetery Deed, Pre-Need Funeral Contract

### Government & Benefits Documents
Social Security Representative Payee, Veterans Benefits Designation, Medicaid Asset Protection Trust, SSI Preservation Documents

### Real Estate Documents
Life Estate Deed, Lady Bird Deed (Enhanced Life Estate), Real Estate Trust Assignment, Mortgage Assumptions

### Court-Related Documents
Guardianship Petition, Conservatorship Petition, Trustee Acceptance, Executor Acceptance, Bond Waivers, Renunciations

### Execution & Validation Documents
Self-Proving Affidavit, Witness Declaration, Notary Acknowledgment, Remote Online Notarization Certificate

### Meta-Documents
Master Estate Inventory, Asset Location Schedule, Password Vault Instructions, Fiduciary Contact List, Professional Advisor Directory

## Detection Patterns

Common phrases/terms to identify document types:

| Document Type | Identifying Language |
|---------------|---------------------|
| Will | "Last Will and Testament", "I hereby revoke all prior wills", "I devise and bequeath" |
| Revocable Trust | "Revocable Living Trust", "Declaration of Trust", "Grantor reserves the right to amend" |
| Irrevocable Trust | "Irrevocable Trust", "Grantor hereby relinquishes", "cannot be amended or revoked" |
| POA | "Power of Attorney", "I appoint as my agent", "attorney-in-fact" |
| Healthcare Directive | "Advance Directive", "Living Will", "life-sustaining treatment" |
| Pour-Over Will | "pour over", "to the Trustee of the [Name] Trust" |
| Trust Amendment | "Amendment to", "hereby amends", "Section X is amended to read" |

## Non-Estate Documents (Decline Analysis)

If detected, ask user to confirm then decline:
- Employment contracts
- Lease agreements
- Business contracts (non-succession)
- Insurance policies (except as estate planning context)
- Loan documents
- Service agreements
`;

const estate_document_analyzer_references_legal_glossary_md = `# Legal Glossary

Common estate planning legal terms translated to plain English.

## A

| Legal Term | Plain English |
|------------|---------------|
| **Abatement** | Reducing gifts in a will when there aren't enough assets to pay all debts and gifts |
| **Ademption** | When a gift in a will fails because the item no longer exists at death |
| **Administrator** | Person appointed by the court to manage an estate when there's no will |
| **Advance directive** | Written instructions about your medical care if you can't speak for yourself |
| **Affidavit** | A written statement made under oath |
| **Agent** | Person you authorize to act on your behalf |
| **Ancillary probate** | Additional probate in another state where the deceased owned property |
| **Annuity** | A contract that pays regular income, often for life |
| **Applicable exclusion amount** | The amount you can give away tax-free during life or at death |
| **Attestation clause** | Statement at the end of a will where witnesses confirm they watched the signing |
| **Attorney-in-fact** | Person authorized to act for you under a power of attorney (same as agent) |

## B

| Legal Term | Plain English |
|------------|---------------|
| **Basis** | The value used to calculate gain or loss when property is sold |
| **Beneficiary** | Person or organization that receives assets from a will, trust, or account |
| **Bequest** | A gift of personal property in a will |
| **Bond** | Insurance that protects the estate if the executor or trustee mismanages assets |

## C

| Legal Term | Plain English |
|------------|---------------|
| **Capacity** | Legal ability to make decisions (being of sound mind) |
| **Charitable remainder trust** | Trust that pays you income now, then gives the rest to charity |
| **Codicil** | A document that changes part of an existing will |
| **Community property** | In some states, property owned equally by married couples |
| **Conservator** | Person appointed by court to manage finances for someone who can't |
| **Contingent beneficiary** | Backup person who receives assets if the primary beneficiary can't |
| **Corpus** | The principal or body of a trust (the assets in it) |
| **Crummey power** | Right to withdraw gifts to a trust, making them qualify for the gift tax exclusion |
| **Curtesy** | A husband's legal right to a portion of his deceased wife's property |

## D

| Legal Term | Plain English |
|------------|---------------|
| **Decedent** | The person who has died |
| **Declaration of trust** | Document creating a trust |
| **Devise** | A gift of real estate in a will |
| **Devisee** | Person who receives real estate in a will |
| **Disclaimer** | Formal refusal to accept an inheritance |
| **Discretionary trust** | Trust where the trustee decides when and how much to distribute |
| **Domicile** | Your permanent legal home |
| **Donee** | Person receiving a gift |
| **Donor** | Person making a gift |
| **Dower** | A wife's legal right to a portion of her deceased husband's property |
| **Durable power of attorney** | Power of attorney that continues even if you become incapacitated |
| **Dynasty trust** | Trust designed to last for many generations |

## E

| Legal Term | Plain English |
|------------|---------------|
| **Elective share** | Spouse's right to claim a portion of the estate regardless of the will |
| **Escheat** | Property going to the state when there are no heirs |
| **Estate** | Everything you own at death |
| **Estate tax** | Federal tax on large estates (over $13.61 million in 2024) |
| **Executor** | Person named in will to manage the estate |
| **Exordium clause** | Opening statement in a will identifying the person making it |

## F

| Legal Term | Plain English |
|------------|---------------|
| **Fee simple** | Complete ownership of property |
| **Fiduciary** | Person with legal duty to act in another's best interest |
| **Fiduciary duty** | Legal obligation to act honestly and in someone else's best interest |
| **Funded trust** | Trust that has assets transferred into it |
| **Future interest** | Right to receive property at a future time |

## G

| Legal Term | Plain English |
|------------|---------------|
| **Generation-skipping transfer (GST) tax** | Tax on gifts to grandchildren or others two or more generations younger |
| **Gift tax** | Tax on giving away property during your lifetime |
| **Grantor** | Person who creates a trust |
| **Grantor trust** | Trust where the creator is taxed on the income |
| **Gross estate** | Total value of everything you own at death, before debts |
| **Guardian** | Person legally responsible for caring for a minor or incapacitated adult |
| **Guardian ad litem** | Person appointed by court to represent someone's interests in legal proceedings |

## H

| Legal Term | Plain English |
|------------|---------------|
| **Health care proxy** | Person you authorize to make medical decisions for you |
| **Heir** | Person entitled to inherit under state law when there's no will |
| **Holographic will** | Will written entirely in the testator's handwriting |

## I

| Legal Term | Plain English |
|------------|---------------|
| **In terrorem clause** | Provision that disinherits anyone who contests the will |
| **Incapacity** | Unable to make decisions due to mental or physical condition |
| **Incidents of ownership** | Rights over a life insurance policy that could include it in your estate |
| **Income beneficiary** | Person entitled to receive income from a trust |
| **Inheritance tax** | State tax paid by the person receiving an inheritance |
| **Inter vivos trust** | Trust created during your lifetime (living trust) |
| **Intestate** | Dying without a valid will |
| **Irrevocable trust** | Trust that generally cannot be changed or cancelled |
| **Issue** | All descendants (children, grandchildren, etc.) |

## J

| Legal Term | Plain English |
|------------|---------------|
| **Joint tenancy** | Ownership by two or more people with right of survivorship |
| **Joint tenancy with right of survivorship (JTWROS)** | When one owner dies, their share automatically goes to the other owner(s) |

## L

| Legal Term | Plain English |
|------------|---------------|
| **Lapse** | When a gift in a will fails because the beneficiary died first |
| **Legacy** | Gift of money in a will |
| **Legatee** | Person who receives a gift in a will |
| **Letters of administration** | Court document authorizing administrator to act |
| **Letters testamentary** | Court document authorizing executor to act |
| **Life estate** | Right to use property during your lifetime |
| **Life tenant** | Person with a life estate |
| **Living trust** | Trust you create and can change during your lifetime |
| **Living will** | Document stating your wishes about end-of-life medical care |

## M

| Legal Term | Plain English |
|------------|---------------|
| **Marital deduction** | Unlimited estate and gift tax deduction for transfers to spouse |
| **Marital trust** | Trust for spouse's benefit that qualifies for marital deduction |
| **Minor** | Person under age 18 |

## N

| Legal Term | Plain English |
|------------|---------------|
| **Net estate** | Estate value after debts and expenses |
| **No-contest clause** | Provision disinheriting anyone who challenges the will |
| **Nuncupative will** | Oral will (only valid in limited circumstances) |

## P

| Legal Term | Plain English |
|------------|---------------|
| **Pay-on-death (POD)** | Beneficiary designation on bank accounts |
| **Per capita** | Distribution method giving equal shares to all living beneficiaries |
| **Per stirpes** | Distribution method where deceased beneficiary's share goes to their children |
| **Personal property** | Everything you own except real estate |
| **Personal representative** | Modern term for executor or administrator |
| **POLST** | Physician Orders for Life-Sustaining Treatment - medical orders for end-of-life care |
| **Portability** | Ability to transfer unused estate tax exemption to surviving spouse |
| **Pour-over will** | Will that transfers assets into a trust |
| **Power of appointment** | Authority to decide who receives trust property |
| **Power of attorney** | Document authorizing someone to act on your behalf |
| **Pretermitted heir** | Child born after will was made who may be entitled to share |
| **Principal** | Person who grants power of attorney; also, trust assets (corpus) |
| **Probate** | Court process to validate a will and distribute assets |
| **Probate estate** | Assets that go through probate (not jointly owned or with beneficiaries) |
| **Prudent investor rule** | Standard requiring trustees to invest wisely and diversify |

## Q

| Legal Term | Plain English |
|------------|---------------|
| **QDRO** | Qualified Domestic Relations Order - court order dividing retirement accounts in divorce |
| **QPRT** | Qualified Personal Residence Trust - transfers home at reduced gift tax value |
| **QTIP trust** | Trust for spouse that qualifies for marital deduction while controlling ultimate beneficiaries |
| **Qualified disclaimer** | Formal refusal to accept inheritance that meets IRS requirements |

## R

| Legal Term | Plain English |
|------------|---------------|
| **Real property** | Land and buildings |
| **Remainder** | What's left in a trust after the income interest ends |
| **Remainder beneficiary** | Person who receives trust assets after the income beneficiary's interest ends |
| **Residuary estate** | Everything left after specific gifts and debts are paid |
| **Residuary clause** | Part of will that distributes the residuary estate |
| **Restatement** | Complete rewriting of a trust document |
| **Revocable trust** | Trust you can change or cancel |
| **Right of survivorship** | Automatic transfer to surviving owner when one owner dies |

## S

| Legal Term | Plain English |
|------------|---------------|
| **Self-proving affidavit** | Notarized statement that makes probate easier |
| **Separate property** | Property owned individually by one spouse |
| **Settlor** | Person who creates a trust (same as grantor) |
| **Simultaneous death clause** | Provision addressing what happens if beneficiary dies at same time as you |
| **Sound mind** | Mentally capable of making legal decisions |
| **Special needs trust** | Trust that provides for disabled person without affecting government benefits |
| **Spendthrift clause** | Provision protecting trust assets from beneficiary's creditors |
| **Springing power** | Power of attorney that only becomes effective upon incapacity |
| **Stepped-up basis** | Increase in asset value for tax purposes when inherited |
| **Successor trustee** | Person who takes over as trustee if original trustee can't serve |
| **Surety bond** | Insurance protecting estate from executor/trustee mismanagement |
| **Surviving spouse** | Widow or widower |

## T

| Legal Term | Plain English |
|------------|---------------|
| **Tangible personal property** | Physical items you can touch (not money or investments) |
| **Tenancy by the entirety** | Special joint ownership for married couples |
| **Tenancy in common** | Ownership where each person's share passes to their heirs |
| **Testament** | Another word for will |
| **Testamentary** | Related to a will; taking effect at death |
| **Testamentary capacity** | Mental ability to make a valid will |
| **Testamentary trust** | Trust created by a will |
| **Testate** | Dying with a valid will |
| **Testator/Testatrix** | Person making a will (male/female) |
| **TOD (Transfer on Death)** | Beneficiary designation on securities or real estate |
| **Trust** | Legal arrangement where one person holds property for another's benefit |
| **Trust protector** | Person with power to oversee or modify trust |
| **Trustee** | Person or institution managing trust assets |
| **Trustor** | Person who creates a trust (same as grantor/settlor) |

## U

| Legal Term | Plain English |
|------------|---------------|
| **Unfunded trust** | Trust that hasn't had assets transferred into it |
| **Unified credit** | Amount that offsets estate and gift taxes |
| **Uniform Transfers to Minors Act (UTMA)** | Law allowing custodial accounts for minors |
| **Undue influence** | Improper pressure that overcomes someone's free will |

## W

| Legal Term | Plain English |
|------------|---------------|
| **Ward** | Person under guardianship or conservatorship |
| **Will** | Legal document directing how your property is distributed at death |
| **Witness** | Person who watches the signing of a legal document |

## Common Phrases

| Legal Phrase | Plain English |
|--------------|---------------|
| "I give, devise, and bequeath" | I leave / I give |
| "All my right, title, and interest" | Everything I own |
| "Heirs and assigns" | Your beneficiaries and anyone they might transfer to |
| "Of sound mind and memory" | Mentally capable |
| "Free from undue influence" | Making this decision voluntarily |
| "Hereby revoke all prior wills" | This cancels any previous wills |
| "Rest, residue, and remainder" | Everything that's left |
| "Per stirpes" | By family line - if someone dies, their share goes to their children |
| "Per capita" | By head count - divided equally among survivors |
| "In the event of my death" | When I die |
| "Survive me by thirty (30) days" | Must be alive 30 days after I die to inherit |
| "Predecease" | Die before |
| "Then living" | Alive at that time |
| "Issue" | Children, grandchildren, and all descendants |
| "Absolute discretion" | Complete freedom to decide |
| "HEMS standard" | Health, Education, Maintenance, and Support - common trust distribution standard |
| "Ascertainable standard" | Distribution rules based on beneficiary's needs |
`;

const estate_document_analyzer_references_summary_template_md = `# Summary Template

Use this structure for all comprehensive markdown summary outputs.

## Template Structure

\`\`\`markdown
# Estate Document Analysis Summary

**Analysis Date:** [Current Date]  
**Documents Analyzed:** [Number] document(s)  
**Jurisdiction:** Massachusetts / Federal

---

## Document Overview

| Document | Type | Execution Date | Pages |
|----------|------|----------------|-------|
| [Filename] | [Document Type] | [Date] | [#] |

---

## Key Parties Identified

### [Document 1 Name]

| Role | Name(s) | Notes |
|------|---------|-------|
| Grantor/Testator/Principal | [Name] | |
| Trustee | [Name] | |
| Successor Trustee | [Name] | |
| Executor/Personal Representative | [Name] | |
| Beneficiaries (Primary) | [Names] | [Relationship if stated] |
| Beneficiaries (Contingent) | [Names] | [Conditions] |
| Agent (POA) | [Name] | [Scope of authority] |
| Guardian | [Name] | [For whom] |
| Witnesses | [Names] | |
| Notary | [Name] | [Date notarized] |

[Repeat for each document]

---

## Document-by-Document Analysis

### [Document 1: Full Title]

**Document Type:** [Type]  
**Execution Date:** [Date]  
**Effective Date:** [Date if different]  
**Governing Law:** [State]  
**References to Other Documents:** [List any]

#### Operative Provisions

##### [Article/Section I: Title]

| Provision | Plain English Meaning | Source Text |
|-----------|----------------------|-------------|
| [Clause name/number] | [Translation] | "[Exact quote]" |

[Note: Flag ambiguous clauses with neutral observation]
> **Observation:** This clause contains language that may be interpreted in multiple ways: "[quoted text]". The intended meaning may require clarification.

##### [Article/Section II: Title]

[Continue for all sections...]

#### Asset Schedules (if present)

**Schedule A: [Title]**

| Item | Description | Value (if stated) |
|------|-------------|-------------------|
| 1 | [Full description] | [Amount] |

[Continue for all schedules...]

#### Digital Asset Provisions (if present)

| Provision Type | Details | Source Location |
|----------------|---------|-----------------|
| Digital Asset Definition | [How document defines digital assets] | [Section] |
| Fiduciary Access | [What access is granted] | [Section] |
| Specific Platforms | [Any named platforms/accounts] | [Section] |
| Cryptocurrency | [Any crypto-specific provisions] | [Section] |

#### Execution Details

| Element | Present | Details |
|---------|---------|---------|
| Testator/Grantor Signature | Yes/No | [Date, location] |
| Witness Signatures | Yes/No | [Number, names] |
| Notarization | Yes/No | [Date, notary name] |
| Self-Proving Affidavit | Yes/No | |

---

[Repeat "### [Document N]" section for each additional document]

---

## Cross-Document Analysis

[Include only if multiple documents were analyzed]

### Document Relationships

| Document | References | Relationship |
|----------|------------|--------------|
| [Pour-Over Will] | [Trust Name, Date] | Directs assets to trust |
| [Trust Amendment] | [Original Trust, Date] | Modifies original trust |

### Beneficiary Comparison

| Beneficiary | [Doc 1] | [Doc 2] | [Doc 3] | Notes |
|-------------|---------|---------|---------|-------|
| [Name] | Primary | Primary | Not listed | Consistent |
| [Name] | Contingent | Primary | N/A | Differs between documents |

### Version/Date Sequencing

| Document Type | Versions Found | Most Recent |
|---------------|----------------|-------------|
| [Type] | [Count] | [Date] |

### Observations

[Neutral observations about cross-document relationships, not risk assessments]

- The Pour-Over Will dated [X] references a Revocable Living Trust dated [Y].
- Beneficiary designations in the 401(k) form name [Person A], while the Will names [Person B] as residuary beneficiary.
- Two Trust Amendments were provided; Amendment #2 dated [X] is the most recent.

---

## Complete Provision Index

[Alphabetical index of all provisions across all documents]

| Provision Topic | Document | Location | Page |
|-----------------|----------|----------|------|
| Anatomical gifts | Will | Article VII | 12 |
| Beneficiary (primary) | Trust | Section 4.1 | 8 |
| [Continue...] | | | |

---

## Confidentiality Notice

This analysis is provided for informational purposes only and does not constitute legal advice. The information contained herein is confidential and intended solely for the use of the individual or entity to whom it is addressed. 

This analysis should not be relied upon as a substitute for consultation with a qualified estate planning attorney. Laws vary by jurisdiction and change over time. The analysis focuses on Massachusetts state law and applicable federal law as of the analysis date.

For legal advice specific to your situation, please consult a licensed attorney in your jurisdiction.

---

*Generated by Estate Document Analyzer*
\`\`\`

## Guidelines for Using This Template

1. **Exhaustive but Efficient**: Include every operative clause, but write concisely
2. **Source Traceability**: Always quote exact source text for each provision
3. **Neutral Observations**: Flag ambiguous clauses without characterizing as "risks" or "gaps"
4. **Consistent Formatting**: Use tables for structured data, prose for observations
5. **Cross-References**: When multiple documents exist, always include relationship mapping
6. **Digital Assets**: Give special attention section when digital asset provisions exist
7. **Confidentiality Notice**: Always include at end of every summary
`;

const estate_document_analyzer_scripts_ocr_processor_py = `#!/usr/bin/env python3
"""
OCR Processor for Estate Document Analyzer

Processes scanned/image-based PDFs using Tesseract OCR.
Converts PDF pages to images, runs OCR, and outputs extracted text.

Usage:
    python ocr_processor.py <input_pdf> <output_text_file>
    python ocr_processor.py <input_pdf>  # Outputs to stdout

Requirements:
    - tesseract-ocr (apt install tesseract-ocr)
    - pdf2image (pip install pdf2image)
    - pytesseract (pip install pytesseract)
    - poppler-utils (apt install poppler-utils)
"""

import sys
import os
from pathlib import Path

try:
    from pdf2image import convert_from_path
    import pytesseract
    from PIL import Image
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install pdf2image pytesseract pillow --break-system-packages")
    sys.exit(1)


def check_tesseract_installed():
    """Verify Tesseract is installed and accessible."""
    import shutil
    if not shutil.which("tesseract"):
        print("Error: Tesseract OCR is not installed.")
        print("Install with: apt install tesseract-ocr")
        return False
    return True


def is_image_pdf(pdf_path: str) -> bool:
    """
    Detect if a PDF is image-based (scanned) vs text-based.
    Returns True if PDF appears to be image-based.
    """
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            total_text = ""
            for page in pdf.pages[:3]:  # Check first 3 pages
                text = page.extract_text() or ""
                total_text += text
            # If very little text extracted, likely image-based
            return len(total_text.strip()) < 100
    except:
        # If pdfplumber fails, assume image-based
        return True


def extract_text_with_ocr(pdf_path: str, dpi: int = 300) -> tuple[str, float]:
    """
    Extract text from PDF using Tesseract OCR.
    
    Args:
        pdf_path: Path to input PDF file
        dpi: Resolution for PDF to image conversion (higher = better quality, slower)
    
    Returns:
        Tuple of (extracted_text, confidence_score)
    """
    if not check_tesseract_installed():
        return "", 0.0
    
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        print(f"Error: File not found: {pdf_path}")
        return "", 0.0
    
    print(f"Converting PDF to images at {dpi} DPI...")
    try:
        images = convert_from_path(str(pdf_path), dpi=dpi)
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
        print("Ensure poppler-utils is installed: apt install poppler-utils")
        return "", 0.0
    
    all_text = []
    confidence_scores = []
    
    for i, image in enumerate(images):
        print(f"Processing page {i + 1} of {len(images)}...")
        
        # Get OCR data with confidence scores
        ocr_data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        
        # Extract text
        page_text = pytesseract.image_to_string(image)
        all_text.append(f"--- Page {i + 1} ---\\n{page_text}")
        
        # Calculate confidence for this page
        confidences = [int(c) for c in ocr_data['conf'] if int(c) > 0]
        if confidences:
            page_confidence = sum(confidences) / len(confidences)
            confidence_scores.append(page_confidence)
    
    full_text = "\\n\\n".join(all_text)
    avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
    
    return full_text, avg_confidence


def process_pdf(input_path: str, output_path: str = None) -> dict:
    """
    Process a PDF file, detecting if OCR is needed.
    
    Args:
        input_path: Path to input PDF
        output_path: Optional path for output text file
    
    Returns:
        Dict with keys: text, confidence, ocr_used, message
    """
    result = {
        "text": "",
        "confidence": 100.0,
        "ocr_used": False,
        "message": ""
    }
    
    # First, try to detect if this is an image-based PDF
    if is_image_pdf(input_path):
        print("Detected image-based PDF. Running OCR...")
        result["ocr_used"] = True
        text, confidence = extract_text_with_ocr(input_path)
        result["text"] = text
        result["confidence"] = confidence
        
        if confidence < 70:
            result["message"] = (
                "OCR confidence is low ({:.1f}%). The document appears to be a scanned image "
                "with reduced text quality. Please verify extracted content for accuracy."
            ).format(confidence)
        else:
            result["message"] = f"OCR completed successfully with {confidence:.1f}% confidence."
    else:
        print("Detected text-based PDF. Extracting text directly...")
        try:
            import pdfplumber
            with pdfplumber.open(input_path) as pdf:
                pages_text = []
                for i, page in enumerate(pdf.pages):
                    page_text = page.extract_text() or ""
                    pages_text.append(f"--- Page {i + 1} ---\\n{page_text}")
                result["text"] = "\\n\\n".join(pages_text)
                result["message"] = "Text extracted directly from PDF (no OCR needed)."
        except Exception as e:
            print(f"Direct extraction failed: {e}. Falling back to OCR...")
            result["ocr_used"] = True
            text, confidence = extract_text_with_ocr(input_path)
            result["text"] = text
            result["confidence"] = confidence
    
    # Write to output file if specified
    if output_path and result["text"]:
        Path(output_path).write_text(result["text"], encoding="utf-8")
        print(f"Output written to: {output_path}")
    
    return result


def main():
    if len(sys.argv) < 2:
        print("Usage: python ocr_processor.py <input_pdf> [output_text_file]")
        print("\\nExamples:")
        print("  python ocr_processor.py scanned_will.pdf extracted_text.txt")
        print("  python ocr_processor.py trust_document.pdf  # Outputs to stdout")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    if not os.path.exists(input_pdf):
        print(f"Error: File not found: {input_pdf}")
        sys.exit(1)
    
    result = process_pdf(input_pdf, output_file)
    
    print(f"\\n{result['message']}")
    
    if result["ocr_used"] and result["confidence"] < 70:
        print("\\n⚠️  WARNING: Low OCR confidence. Manual review recommended.")
    
    if not output_file:
        print("\\n" + "=" * 60)
        print("EXTRACTED TEXT:")
        print("=" * 60)
        print(result["text"])
    
    # Return non-zero if confidence is very low
    if result["ocr_used"] and result["confidence"] < 50:
        sys.exit(2)
    
    sys.exit(0)


if __name__ == "__main__":
    main()
`;

const estate_goals_profiler_SKILL_md = `---
name: estate-goals-profiler
description: Interactive estate planning goals discovery through structured hypothetical Q&A. Use when a user wants to explore, clarify, or document their estate planning wishes and intentions. Takes input from estate-document-analyzer (conversational table) and financial-profile-classifier (financial profile), then conducts a comprehensive interview covering distribution, incapacity, guardianship, business succession, charitable giving, and more. Produces a detailed markdown summary of the individual's estate goals. Handles users with existing documents OR those starting fresh.
---

# Estate Goals Profiler

## Overview

Conduct structured hypothetical Q&A to build a comprehensive profile of an individual's estate planning goals. Two modes:
1. **With existing documents**: Review each point from estate-document-analyzer output, verify satisfaction, explore alternatives
2. **Without documents**: Explore goals from scratch using structured topic categories

Produces a markdown file mirroring the estate-document-analyzer summary structure, documenting what the individual WANTS.

## Required Inputs

| Input | Source | Required |
|-------|--------|----------|
| Conversational table | estate-document-analyzer | Yes, unless user has no documents |
| Financial profile | financial-profile-classifier | Yes |
| "No documents" flag | User statement | Alternative to conversational table |

If user states they have no significant estate documents, proceed with exploratory mode.

## Workflow

\`\`\`
1. Receive inputs (document table + financial profile, OR "no documents" + financial profile)
2. Determine mode: Document Review OR Exploratory
3. Adjust question depth based on net worth bracket and asset complexity
4. Begin structured Q&A (2-3 questions per group, max 4, NEVER 5+)
5. Track covered topics and progress
6. For each topic:
   - If Document Review: Present current legal outcome → Ask if satisfied
     - Satisfied → Note and continue
     - Not satisfied → Explore desired alternative
   - If Exploratory: Ask hypotheticals to discover preferences
7. Answer user hypotheticals (if estate-related)
8. Continue until all topics exhausted or user concludes
9. Generate goals summary markdown file
\`\`\`

## Question Grouping Rules

- Group 2-3 related questions together (standard)
- Maximum 4 questions only if absolutely necessary for context
- NEVER 5 or more questions in a single message
- User may explicitly request different pacing

## Communication Style

- **Direct and professional** tone
- Use clear language: "if you die" not "if something happens to you"
- If user's tone is sensitive or somber, adapt **only slightly** (maintain professionalism)
- Formal but accessible vocabulary

## Mode 1: Document Review

When conversational table is provided:

### Step-by-Step Process

1. Present each key point from the table:
   > "Your current documents state: [Plain English meaning]
   > 
   > Source: [Location] — '[Original legal language]'
   > 
   > This means [explanation of legal outcome]. Are you satisfied with this arrangement?"

2. If **satisfied**: Record confirmation, move to next point

3. If **not satisfied**: 
   > "I understand. Let me explore what you would prefer instead."
   
   Then ask targeted follow-up questions:
   - What outcome would you want?
   - Under what circumstances?
   - Are there exceptions?
   - Who should be involved?

4. After completing table review, proceed to any topics NOT covered in existing documents (see Topic Categories)

## Mode 2: Exploratory (No Documents)

When user has no existing estate documents:

1. Acknowledge starting point:
   > "Since you don't have existing estate documents, I'll guide you through a comprehensive exploration of your wishes across all major estate planning topics."

2. Work through all Topic Categories systematically

3. Adjust depth based on financial profile:
   - Higher net worth / complex assets → More detailed questions
   - Simpler situations → Focused on essentials

## Topic Categories

Cover all applicable categories. See \`references/topic-questions.md\` for specific questions.

### 1. Distribution of Assets at Death
- Primary beneficiaries (who gets what)
- Percentage vs. specific asset distribution
- Equal vs. unequal distribution among children
- Timing of distributions (outright vs. staged)
- Conditions on inheritance

### 2. Order of Passing Scenarios
- Spouse dies first
- You die first
- Simultaneous death
- Child predeceases you
- All primary beneficiaries predecease you

### 3. Minor Children
- Guardian nominations (primary and backup)
- Age of inheritance
- Trust structures for minors
- Education funding priorities
- Special considerations for each child

### 4. Incapacity Planning
- Financial decision-maker
- Healthcare decision-maker
- Life-sustaining treatment preferences
- Nursing home / long-term care preferences
- Mental health treatment preferences

### 5. Business Interests
- Succession plans
- Buyout preferences
- Key employee considerations
- Family involvement vs. sale
- Valuation methods

### 6. Charitable Intent
- Specific charities
- Timing (at death vs. during life)
- Amounts or percentages
- Charitable structures (trusts, foundations)
- Family involvement in philanthropy

### 7. Digital Assets
- Access provisions
- Disposition of accounts
- Cryptocurrency handling
- Social media / digital legacy
- Password and key management

### 8. Family Dynamics
- Blended family considerations
- Estranged family members
- Special needs beneficiaries
- Spendthrift concerns
- Potential conflicts

### 9. Debts and Obligations
- Debt payment priorities
- Mortgage handling
- Business debts
- Support obligations

### 10. Funeral and End-of-Life
- Burial vs. cremation
- Service preferences
- Organ donation
- Memorial wishes

## Answering User Hypotheticals

When user asks hypothetical questions:

1. **Scope check**: Must be at least somewhat related to estate planning
   - Related: tax implications, Medicaid, divorce impact on estate, inheritance scenarios
   - Not related: investment strategies, unrelated legal matters, off-topic subjects

2. **If related**: Answer based on:
   - Massachusetts state law
   - Federal law where applicable
   - General estate planning principles
   - Their current documents (if provided)
   - Their stated goals (from conversation)

3. **If not related**: Politely redirect
   > "That question falls outside the scope of estate planning. Let's stay focused on your estate goals. [Return to current topic]"

4. **Always caveat** specialized areas:
   > "This touches on [tax law / Medicaid planning / etc.], which has additional complexities. For detailed guidance, consult a specialist in that area."

## Depth Adjustment by Net Worth

Based on financial-profile-classifier output:

| Net Worth Bracket | Question Depth |
|-------------------|----------------|
| $2M - $5M | Essential topics, straightforward scenarios |
| $5M - $13M | Moderate depth, some tax-aware questions |
| $13M - $50M | Comprehensive depth, complex scenarios, tax planning awareness |

## Asset Complexity Adjustments

Tailor questions to assets present:

| Asset Type | Additional Questions |
|------------|---------------------|
| Business interests | Full business succession section |
| Real estate (multiple properties) | Property-specific distribution |
| Retirement accounts | Beneficiary coordination |
| Investment accounts | Distribution timing, tax considerations |
| Digital assets / crypto | Full digital assets section |
| Collectibles / tangible property | Specific bequest preferences |

## Progress Tracking

Maintain and communicate progress:

### During Session
After completing each major category:
> "We've now covered [completed topics]. Remaining topics include [remaining topics]. Would you like to continue, take a break, or focus on a specific area?"

### Progress Summary (for pausing)
If user needs to pause, generate progress summary:

\`\`\`markdown
# Estate Goals Profiler - Progress Summary

**Session Date:** [Date]
**Status:** In Progress

## Completed Topics
- [Topic 1]: [Brief summary of decisions]
- [Topic 2]: [Brief summary of decisions]

## Remaining Topics
- [Topic 3]
- [Topic 4]

## Key Decisions So Far
- [Decision 1]
- [Decision 2]

## Notes for Resumption
[Any context needed to continue]
\`\`\`

User can provide this summary to resume later.

## Session Continuity

If user provides a previous progress summary:
1. Acknowledge prior session
2. Briefly confirm key decisions already made
3. Resume from remaining topics
4. Allow user to revisit completed topics if requested

## Output: Goals Summary Document

Generate markdown file mirroring estate-document-analyzer structure. See \`references/goals-template.md\` for complete template.

Key sections:
- Document Overview (goals document metadata)
- Key Parties Identified (desired roles)
- Topic-by-Topic Goals
- Cross-Topic Observations
- Confidentiality Notice

## Confidentiality Notice

Include at end of all output documents:

\`\`\`
---
## Confidentiality Notice

This goals summary is provided for informational purposes only and does not constitute legal advice. The information contained herein reflects the individual's stated preferences and intentions as of the session date, and should be reviewed by a qualified estate planning attorney before implementation.

This document should not be relied upon as a substitute for properly drafted legal documents. Laws vary by jurisdiction and change over time. For legal advice specific to your situation, please consult a licensed attorney in Massachusetts.
\`\`\`

## Resources

- \`references/topic-questions.md\` - Detailed questions for each topic category
- \`references/goals-template.md\` - Output document template
`;

const estate_goals_profiler_references_goals_template_md = `# Goals Summary Template

Output document structure mirroring estate-document-analyzer format. Documents what the individual WANTS.

## Template Structure

\`\`\`markdown
# Estate Planning Goals Summary

**Session Date:** [Date]
**Status:** Complete / In Progress
**Jurisdiction:** Massachusetts

---

## Document Overview

| Item | Details |
|------|---------|
| Session Type | Document Review / Exploratory |
| Financial Profile | [Net worth bracket from financial-profile-classifier] |
| Existing Documents Reviewed | [List if applicable] |
| Topics Covered | [List of completed topics] |

---

## Key Parties Identified

### Desired Roles

| Role | Named Individual(s) | Backup | Notes |
|------|---------------------|--------|-------|
| Spouse/Partner | [Name] | N/A | |
| Executor/Personal Representative | [Name] | [Backup name] | [Any conditions] |
| Trustee | [Name] | [Successor] | [Type of trust if specified] |
| Guardian (Minor Children) | [Name] | [Backup name] | [Reasons if stated] |
| Financial Agent (POA) | [Name] | [Backup name] | [Scope preferences] |
| Healthcare Agent | [Name] | [Backup name] | |
| Digital Asset Agent | [Name] | [Backup name] | |

### Beneficiaries (Desired)

| Beneficiary | Relationship | Share/Assets | Conditions |
|-------------|--------------|--------------|------------|
| [Name] | [Relationship] | [% or specific assets] | [Any conditions] |

---

## Topic-by-Topic Goals

### 1. Distribution of Assets at Death

#### Primary Distribution Intent

| Recipient | Relationship | Intended Share | Timing | Conditions |
|-----------|--------------|----------------|--------|------------|
| [Name] | [Relationship] | [Amount/Percentage] | [Outright/Staged] | [If any] |

#### Specific Bequests

| Item/Asset | Intended Recipient | Notes |
|------------|-------------------|-------|
| [Description] | [Name] | [Context] |

#### Distribution Method Preferences
- [ ] Equal among children
- [ ] Unequal (reasons: _______)
- [ ] Specific assets to specific people
- [ ] Percentage-based
- [ ] Outright distribution
- [ ] Staged distribution (ages: _______)
- [ ] Trust-based distribution

#### User Statements
> "[Direct quote from user about distribution wishes]"

---

### 2. Order of Passing Scenarios

#### If Spouse Dies First
[Description of user's wishes]

**User Statement:**
> "[Quote]"

#### If User Dies First
[Description of user's wishes]

**User Statement:**
> "[Quote]"

#### Simultaneous Death
[Description of user's wishes]

- Survivorship period preferred: [X days]

#### Child Predeceases User
- Per stirpes (to deceased child's children): Yes / No
- Redistribute to surviving children: Yes / No
- Other arrangement: [Description]

#### All Beneficiaries Predecease
Ultimate fallback beneficiaries:
1. [Name/Organization]
2. [Name/Organization]

---

### 3. Minor Children

#### Guardian Nominations

| Priority | Named Guardian | Relationship | Location | Reasons |
|----------|---------------|--------------|----------|---------|
| Primary | [Name] | [Relationship] | [City/State] | [Why chosen] |
| Backup | [Name] | [Relationship] | [City/State] | [Why chosen] |

#### Excluded Individuals
| Name | Relationship | Reason |
|------|--------------|--------|
| [Name] | [Relationship] | [Stated reason] |

#### Financial Management for Minors
- Same as guardian: Yes / No
- Separate financial manager: [Name]
- Professional trustee preferred: Yes / No

#### Inheritance Age/Staging
| Age | Percentage | Purpose |
|-----|------------|---------|
| [Age] | [%] | [e.g., General distribution] |

#### Education Priorities
- Highest level to fund: [High school / College / Graduate]
- Private school: Yes / No / Trustee discretion
- Special programs: [If any]

#### Individual Child Considerations
| Child | Special Considerations |
|-------|----------------------|
| [Name] | [Any specific wishes] |

---

### 4. Incapacity Planning

#### Financial Decision-Making
- Primary Agent: [Name]
- Backup Agent: [Name]
- Effective: Immediately / Upon incapacity
- Incapacity determination: [Who decides]

#### Healthcare Decision-Making
- Primary Agent: [Name]
- Backup Agent: [Name]

#### Life-Sustaining Treatment Preferences
| Scenario | Preference |
|----------|------------|
| Terminal illness, no recovery | Continue / Withdraw life support |
| Permanent unconsciousness | Continue / Withdraw life support |
| Artificial nutrition/hydration | Continue / Withdraw |
| Pain management priority | Yes / No |

**User Statement:**
> "[Quote about end-of-life wishes]"

#### Long-Term Care Preferences
- Preferred setting: Home / Facility / No preference
- Geographic preferences: [If any]
- Funding approach: [If discussed]

---

### 5. Business Interests

[Include only if applicable based on financial profile]

#### Business Overview
| Business | Role | Ownership % | Type |
|----------|------|-------------|------|
| [Name] | [Owner/Partner/etc.] | [%] | [LLC/Corp/etc.] |

#### Succession Preferences
- Preferred successor: [Name/Role]
- Family involvement desired: Yes / No
- Sale preference: Keep in family / Sell / Partner buyout

#### Buyout Provisions
- Partners should buy out: Yes / No
- Valuation method preference: [If stated]
- Family right to retain: Yes / No

#### Key Employee Considerations
| Employee | Consideration |
|----------|--------------|
| [Name] | [Retention bonus / Opportunity to purchase / etc.] |

---

### 6. Charitable Intent

#### Charitable Beneficiaries

| Organization | Amount/Percentage | Purpose | Timing |
|--------------|-------------------|---------|--------|
| [Name] | [Amount or %] | [Restricted/Unrestricted] | [At death / Ongoing] |

#### Charitable Structure Preferences
- [ ] Direct bequests
- [ ] Donor-advised fund
- [ ] Charitable remainder trust
- [ ] Private foundation
- [ ] Family involvement in giving decisions

#### Family Philanthropy
- Children involved in decisions: Yes / No
- Philanthropic values to instill: [If stated]

---

### 7. Digital Assets

#### Digital Asset Agent
- Primary: [Name]
- Backup: [Name]

#### Account Handling Preferences

| Account Type | Preference |
|--------------|------------|
| Email accounts | Delete / Preserve / Transfer to [Name] |
| Social media | Delete / Memorialize / Transfer |
| Financial accounts | Transfer to [Name] |
| Cloud storage | Transfer to [Name] / Download and distribute |

#### Cryptocurrency/Digital Investments
| Asset | Location | Intended Recipient |
|-------|----------|-------------------|
| [Type] | [Exchange/Wallet] | [Name] |

#### Access Information
- Password storage location known to agent: Yes / No
- Method: [Password manager / Document / etc.]

---

### 8. Family Dynamics

#### Blended Family Considerations
[If applicable]
- Children from prior relationships: [Names]
- Stepchildren to include: Yes / No
- Balance between spouse and prior children: [Description]

#### Estranged Relationships
| Individual | Relationship | Treatment |
|------------|--------------|-----------|
| [Name] | [Relationship] | Exclude / Minimal provision / [Other] |

#### Special Needs Beneficiaries
| Beneficiary | Consideration |
|-------------|--------------|
| [Name] | [Special needs trust / etc.] |

#### Spendthrift Protections
| Beneficiary | Protection Needed | Reason |
|-------------|-------------------|--------|
| [Name] | Yes / No | [If stated] |

#### Conflict Prevention
- No-contest clause desired: Yes / No
- Mediation requirement: Yes / No
- Other measures: [If stated]

---

### 9. Debts and Obligations

#### Debt Payment Priorities
1. [First priority]
2. [Second priority]

#### Mortgage Handling
- Pay off from estate: Yes / No
- Beneficiary inherits with mortgage: Yes / No
- Life insurance designated for mortgage: Yes / No

#### Support Obligations
| Obligation | Handling |
|------------|----------|
| [Type] | [How to handle] |

#### Loans to Family Members
| Borrower | Amount | Treatment at Death |
|----------|--------|-------------------|
| [Name] | [Amount] | Forgive / Collect from inheritance |

---

### 10. Funeral and End-of-Life Wishes

#### Disposition of Remains
- Preference: Burial / Cremation
- Location: [Cemetery / Scattering location]
- Pre-arrangements made: Yes / No

#### Service Preferences
- Type: Funeral / Memorial / Celebration of Life / None
- Religious/Secular: [Preference]
- Specific requests: [If any]

#### Organ Donation
- Donor: Yes / No
- Limitations: [If any]

#### Memorial Wishes
[Any specific wishes stated]

---

## Cross-Topic Observations

[Note any themes, priorities, or connections across topics]

- Primary concern appears to be: [Theme]
- Recurring priority: [Theme]
- Potential coordination needed: [Areas requiring alignment]

---

## Comparison to Current Documents

[Include only if Document Review mode was used]

### Aligned with Current Documents
| Topic | Current Document Provision | User Confirms Satisfaction |
|-------|---------------------------|---------------------------|
| [Topic] | [What documents say] | Yes |

### Differs from Current Documents
| Topic | Current Document Provision | User's Desired Change |
|-------|---------------------------|----------------------|
| [Topic] | [What documents say] | [What user wants instead] |

### Not Addressed in Current Documents
| Topic | User's Stated Wish |
|-------|-------------------|
| [Topic] | [What user wants] |

---

## Session Notes

### Topics Requiring Follow-Up
- [ ] [Topic needing more exploration]
- [ ] [Decision that was uncertain]

### User Questions Asked
| Question | Response Summary |
|----------|-----------------|
| [User's hypothetical question] | [Brief answer provided] |

### Recommendations for Attorney Discussion
[Note any areas where professional legal guidance is particularly important]

---

## Confidentiality Notice

This goals summary is provided for informational purposes only and does not constitute legal advice. The information contained herein reflects the individual's stated preferences and intentions as of the session date, and should be reviewed by a qualified estate planning attorney before implementation.

This document should not be relied upon as a substitute for properly drafted legal documents. Laws vary by jurisdiction and change over time. For legal advice specific to your situation, please consult a licensed attorney in Massachusetts.

---

*Generated by Estate Goals Profiler*
*Session Date: [Date]*
\`\`\`

## Usage Guidelines

1. **Complete all applicable sections** based on topics covered
2. **Include direct user quotes** where they add clarity to intent
3. **Mark sections N/A** if topic was not covered or not applicable
4. **Cross-reference with existing documents** if Document Review mode was used
5. **Note any unresolved questions** for follow-up
6. **Always include confidentiality notice**

## Section Applicability

| Section | Always Include | Include If Applicable |
|---------|----------------|----------------------|
| Document Overview | ✓ | |
| Key Parties | ✓ | |
| Distribution | ✓ | |
| Order of Passing | ✓ | |
| Minor Children | | Has minor children |
| Incapacity | ✓ | |
| Business Interests | | Has business interests |
| Charitable Intent | | Has charitable wishes |
| Digital Assets | ✓ | |
| Family Dynamics | | Complex family situation |
| Debts | | Significant debts/obligations |
| Funeral | ✓ | |
| Cross-Topic | ✓ | |
| Comparison to Current | | Document Review mode |
| Session Notes | ✓ | |
| Confidentiality | ✓ | |
`;

const estate_goals_profiler_references_topic_questions_md = `# Topic Questions Reference

Structured hypothetical questions for each estate planning topic category. Group 2-3 questions together (max 4, NEVER 5+).

## 1. Distribution of Assets at Death

### Primary Beneficiaries
- Who do you want to receive your assets when you die?
- Should your spouse receive everything, or should some assets go directly to children or others?
- Are there any individuals you specifically want to exclude from inheriting?

### Distribution Method
- Do you prefer equal distribution among your children, or do you have reasons for unequal shares?
- Should beneficiaries receive specific assets (e.g., "the house to John, investments to Mary") or percentages of the total estate?
- Are there any specific items with sentimental value you want to go to particular people?

### Timing and Conditions
- Should beneficiaries receive their inheritance outright and immediately, or in stages over time?
- At what age should children receive full control of their inheritance? (Common: 25, 30, 35)
- Are there any conditions you want to place on inheritance (e.g., completing education, maintaining employment)?

### Residuary Estate
- After specific gifts are distributed, who should receive everything that remains?
- If your primary beneficiaries cannot inherit, who should receive their share?

## 2. Order of Passing Scenarios

### Spouse Dies First
- If your spouse dies before you, does your distribution plan change?
- Would you want assets to go directly to children, or to a trust for their benefit?
- Are there any special provisions for your spouse's family (in-laws) in this scenario?

### You Die First
- If you die first, do you want your spouse to have complete control over the assets?
- Should any assets be protected or restricted for eventual distribution to children?
- Do you want to provide for your spouse while ensuring children ultimately inherit?

### Simultaneous Death
- If you and your spouse die at the same time (or close together), who should receive your combined estate?
- How long must someone survive you to inherit (common: 30-90 days)?
- Should the distribution be different if you die together versus separately?

### Child Predeceases You
- If one of your children dies before you, should their share go to their children (your grandchildren)?
- Or should it be redistributed among your surviving children?
- What if the deceased child has no children of their own?

### All Primary Beneficiaries Predecease
- If all your primary beneficiaries die before you, who should inherit?
- Would you want assets to go to extended family, friends, or charity?
- Is there a specific organization that should receive your estate as a last resort?

## 3. Minor Children

### Guardian Nominations
- Who do you want to raise your minor children if both parents die?
- Do you have a backup guardian if your first choice cannot serve?
- Are there any individuals you specifically do NOT want as guardians?

### Financial Management for Minors
- Should the guardian also manage the children's inheritance, or should someone else handle finances?
- Do you want a professional trustee (bank, trust company) involved?
- How much oversight should there be over spending for the children?

### Age of Inheritance
- At what age should your children receive their inheritance outright?
- Should they receive it all at once, or in stages (e.g., 1/3 at 25, 1/3 at 30, 1/3 at 35)?
- Should a trustee be able to distribute funds earlier for specific purposes (education, home purchase)?

### Education and Support
- Is funding education a priority? Through what level (college, graduate school)?
- Should funds be available for private school, tutoring, extracurriculars?
- What standard of living should the children maintain?

### Individual Child Considerations
- Do any of your children have special needs or circumstances requiring different treatment?
- Are there concerns about any child's ability to manage money responsibly?
- Should inheritance be protected from a child's potential divorce or creditors?

## 4. Incapacity Planning

### Financial Decision-Making
- If you become unable to manage your finances, who should take over?
- Do you want this person to have authority immediately, or only after incapacity is determined?
- Who should determine that you are incapacitated?

### Healthcare Decision-Making
- Who should make medical decisions for you if you cannot?
- Is this the same person as your financial agent, or different?
- Do you have a backup healthcare agent?

### Life-Sustaining Treatment
- If you are terminally ill with no reasonable hope of recovery, do you want life support continued?
- What about artificial nutrition and hydration (feeding tubes)?
- Do you want to be kept comfortable even if pain medication might hasten death?

### Long-Term Care
- If you need nursing home care, do you have preferences about facilities or location?
- Would you prefer in-home care if possible?
- How should long-term care be funded?

### Mental Health
- Do you have specific preferences about mental health treatment?
- Are there treatments you would refuse (e.g., electroconvulsive therapy)?
- Who should make mental health decisions if you cannot?

## 5. Business Interests

### Succession Planning
- If you die, who should take over your role in the business?
- Should the business be sold, or kept in the family?
- Are any family members involved in the business who should continue?

### Buyout Provisions
- If you have business partners, should they be required to buy out your interest?
- How should the business be valued for buyout purposes?
- Should your family have the option to keep your interest instead of selling?

### Key Employees
- Are there key employees who should be retained or rewarded?
- Should any employees have the opportunity to purchase the business?
- Are there employment agreements that should be honored?

### Family vs. Outside Management
- Should family members have first right to run the business?
- Would you prefer professional outside management?
- What if family members disagree about the business's future?

### Business Debts and Obligations
- How should business debts be handled?
- Should personal assets be used to pay business obligations?
- Are there guarantees or obligations your family should know about?

## 6. Charitable Intent

### Specific Charities
- Are there specific charities or causes you want to support?
- Are these organizations you currently donate to, or new beneficiaries?
- Should donations be unrestricted or for specific purposes?

### Timing of Gifts
- Do you want charitable gifts made at your death, or during your lifetime?
- Should charity receive a specific amount, or a percentage of your estate?
- Should charitable giving depend on how much remains after family is provided for?

### Charitable Structures
- Are you interested in creating a family foundation?
- Would a donor-advised fund be appropriate for your charitable goals?
- Should charitable giving involve your children or grandchildren?

### Family Involvement
- Do you want family members involved in charitable decisions?
- Should charitable giving continue after your death through a trust?
- Are there values you want to instill in future generations through philanthropy?

## 7. Digital Assets

### Account Access
- Who should have access to your digital accounts (email, social media, financial)?
- Should they have full access, or limited access for specific purposes?
- Are there accounts that should be deleted vs. preserved?

### Cryptocurrency and Digital Investments
- Do you own cryptocurrency or other digital investments?
- Who knows how to access these assets (private keys, passwords)?
- Should these be distributed differently than traditional assets?

### Online Business Interests
- Do you have online businesses, websites, or income-generating digital assets?
- Who should manage or inherit these?
- Are there domain names, intellectual property, or content libraries?

### Digital Legacy
- What should happen to your social media accounts after death?
- Do you want accounts memorialized, deleted, or transferred?
- Are there digital files (photos, documents) with specific distribution wishes?

### Security and Access
- Where are your passwords and access credentials stored?
- Does your digital asset agent know how to find this information?
- Are there two-factor authentication barriers to consider?

## 8. Family Dynamics

### Blended Families
- Do you have children from prior relationships?
- How should assets be divided between your spouse and children from prior relationships?
- Do you want to provide for stepchildren?

### Estranged Relationships
- Are there family members you are estranged from?
- Should they be explicitly excluded from inheriting?
- Is reconciliation possible, and should the plan account for that possibility?

### Special Needs Beneficiaries
- Do any beneficiaries have disabilities that affect their ability to manage money?
- Do any beneficiaries receive government benefits that could be affected by inheritance?
- Should a special needs trust be considered?

### Spendthrift Concerns
- Are there beneficiaries with spending problems, addiction issues, or creditor problems?
- Should their inheritance be protected in a trust?
- Who should control distributions to them?

### Potential Conflicts
- Do you anticipate any disputes among beneficiaries?
- Are there family members who do not get along?
- Should a no-contest clause discourage challenges to your plan?

## 9. Debts and Obligations

### Debt Payment
- How should your debts be paid at death?
- Should specific assets be sold to pay debts?
- Are there debts you want paid first before others?

### Mortgage
- What should happen to your home's mortgage?
- Should the home be sold to pay off the mortgage, or should beneficiaries inherit it with the debt?
- Is there life insurance designated to pay off the mortgage?

### Support Obligations
- Do you have ongoing support obligations (alimony, child support)?
- How should these be handled after your death?
- Are there family members who depend on your ongoing financial support?

### Loans to Family
- Have you made loans to family members?
- Should these be forgiven at your death, or collected from their inheritance?
- Are there any debts owed to you that should be addressed?

## 10. Funeral and End-of-Life

### Disposition of Remains
- Do you prefer burial or cremation?
- Do you have a specific location in mind (cemetery, scattering of ashes)?
- Have you made any pre-arrangements?

### Service Preferences
- Do you want a funeral, memorial service, or celebration of life?
- Religious or secular?
- Any specific requests about the service?

### Organ Donation
- Do you want to be an organ donor?
- Are there limitations on what can be donated?
- Are there religious or personal objections to donation?

### Memorial Wishes
- Are there any specific memorial wishes?
- Charitable donations in lieu of flowers?
- Any messages or letters to be shared?

## Adjustment Guidelines

### By Net Worth Bracket

**$2M - $5M (Essential Depth)**
- Focus on core distribution, guardianship, incapacity
- Basic order of passing scenarios
- Skip complex charitable structures
- Brief business questions only if applicable

**$5M - $13M (Moderate Depth)**
- All essential topics plus tax awareness
- More detailed trust considerations
- Charitable giving exploration
- Full business section if applicable

**$13M - $50M (Comprehensive Depth)**
- All topics in full depth
- Complex family dynamics exploration
- Detailed charitable structures discussion
- Full business succession planning
- Tax-aware distribution timing

### By Asset Type

**Business Owners**: Full Section 5, coordinate with family dynamics
**Multiple Properties**: Property-specific questions in distribution
**Retirement Heavy**: Beneficiary designation coordination
**Digital Assets / Crypto**: Full Section 7
**Collectibles**: Specific bequest questions in distribution
`;

const financial_profile_classifier_SKILL_md = `---
name: financial-profile-classifier
description: Estate planning financial profile classification assistant. Use when classifying a person's financial situation for estate planning purposes, when analyzing income and asset documents to determine estate complexity, or when the user needs a structured financial profile. Extracts and categorizes total asset range, primary asset types, income range, liquidity level, and asset concentration from provided documents. Outputs a structured Markdown profile for downstream use.
---

# Financial Profile Classifier

Classify financial profiles for estate planning by extracting key metrics from documents and outputting a structured Markdown profile.

## Workflow

### Step 1: Request Documents

Request the following documents from the user:

- Recent tax returns (1-2 years)
- Bank and savings account statements
- Investment/brokerage account summaries
- Retirement account statements (401k, IRA, etc.)
- Property records or mortgage statements
- Business valuations or ownership documents (if applicable)

Explain that more complete documentation leads to more accurate classification.

### Step 2: Extract Financial Data

Review provided documents and extract:

| Field | Categories |
|-------|------------|
| **Total Asset Range** | Under $250K / $250K–$1M / $1M–$5M / $5M+ |
| **Primary Asset Types** | Home, Cash, Investments, Retirement Accounts, Business Ownership |
| **Income Range** | Low (<$75K) / Moderate ($75K–$200K) / High ($200K+) |
| **Liquidity Level** | Mostly Liquid / Mixed / Mostly Illiquid |
| **Asset Concentration** | Diversified / Moderately Concentrated / Highly Concentrated |

### Step 3: Fill Gaps Manually

If any field cannot be determined from documents, ask the user directly:

- "What is your approximate total asset value?"
- "What are your primary asset types?"
- "What is your approximate annual household income?"
- "Are your assets mostly liquid (cash, stocks) or illiquid (real estate, business)?"
- "Is your wealth spread across multiple assets or concentrated in one?"

### Step 4: Determine Estate Complexity

Calculate estate complexity based on extracted data:

**Low Complexity:**
- Assets under $1M
- Primarily home + retirement accounts
- No business ownership
- Simple asset structure

**Moderate Complexity:**
- Assets $1M–$5M
- Multiple asset types
- May include rental property or small business interest
- Some illiquid holdings

**High Complexity:**
- Assets $5M+
- Business ownership or significant illiquid assets
- Highly concentrated holdings
- Multiple property types or complex investment structures

### Step 5: Output Profile

Generate the profile using this template:

\`\`\`markdown
# Financial Profile Classification

**Generated:** [Date]

## Summary

| Metric | Classification |
|--------|----------------|
| Total Asset Range | [value] |
| Income Range | [value] |
| Liquidity Level | [value] |
| Asset Concentration | [value] |
| Estate Complexity | [Low/Moderate/High] |

## Asset Breakdown

**Primary Asset Types:**
- [List identified asset types with approximate percentages if known]

## Notes

[Any relevant observations, data gaps, or considerations for estate planning]

## Data Sources

- [List documents used for classification]
\`\`\`

## Classification Thresholds

These thresholds can be customized in \`references/thresholds.md\`.

### Income Ranges
- **Low:** Under $75,000/year
- **Moderate:** $75,000–$200,000/year
- **High:** Over $200,000/year

### Asset Ranges
- **Under $250K:** Minimal estate planning needs
- **$250K–$1M:** Standard estate planning
- **$1M–$5M:** Comprehensive estate planning recommended
- **$5M+:** Complex estate planning required

### Liquidity Assessment
- **Mostly Liquid:** >70% in cash, stocks, bonds, mutual funds
- **Mixed:** 30-70% liquid
- **Mostly Illiquid:** <30% liquid (heavy real estate, business, collectibles)

### Concentration Assessment
- **Diversified:** No single asset >40% of total
- **Moderately Concentrated:** One asset 40-70% of total
- **Highly Concentrated:** One asset >70% of total (common: primary home)
`;

const financial_profile_classifier_references_thresholds_md = `# Classification Thresholds

Customize these thresholds to match your estate planning practice's standards.

## Income Ranges

| Tier | Annual Income |
|------|---------------|
| Low | Under $75,000 |
| Moderate | $75,000 – $200,000 |
| High | Over $200,000 |

## Asset Ranges

| Tier | Total Assets | Estate Planning Implication |
|------|--------------|----------------------------|
| Tier 1 | Under $250,000 | Minimal planning needs |
| Tier 2 | $250,000 – $1,000,000 | Standard planning |
| Tier 3 | $1,000,000 – $5,000,000 | Comprehensive planning |
| Tier 4 | Over $5,000,000 | Complex planning required |

## Liquidity Thresholds

| Classification | Liquid Asset Percentage |
|----------------|------------------------|
| Mostly Liquid | Greater than 70% |
| Mixed | 30% – 70% |
| Mostly Illiquid | Less than 30% |

**Liquid assets include:** Cash, checking/savings, money market, stocks, bonds, mutual funds, ETFs

**Illiquid assets include:** Real estate, business ownership, collectibles, private equity, restricted stock

## Concentration Thresholds

| Classification | Single Asset Percentage |
|----------------|------------------------|
| Diversified | No asset exceeds 40% |
| Moderately Concentrated | One asset is 40% – 70% |
| Highly Concentrated | One asset exceeds 70% |

## Estate Complexity Matrix

| Complexity | Asset Range | Additional Factors |
|------------|-------------|-------------------|
| Low | Under $1M | Simple structure, no business |
| Moderate | $1M – $5M | Multiple types, some illiquid |
| High | Over $5M | Business ownership, complex structure |

Complexity may be elevated regardless of asset level if:
- Business ownership is present
- Multiple real estate holdings exist
- Significant illiquid or hard-to-value assets
- Complex family situations (blended families, trusts)
`;

const us_estate_planning_analyzer_SKILL_md = `---
name: us-estate-planning-analyzer
description: Comprehensive analysis of estate planning documents (wills, trusts, powers of attorney, healthcare proxies, beneficiary designations) for all 50 US states. Analyzes legal compliance, tax optimization (estate and inheritance taxes), Medicaid planning, and document coordination. Supports multi-state analysis for users with assets in multiple states, domicile optimization recommendations, and document validity analysis when users have relocated. Handles community property analysis for 9 states, inheritance tax calculations for 5 states, and state-specific Medicaid planning. Use when analyzing estate documents for any US state, comparing document versions, identifying compliance issues, optimizing tax strategies, or generating reports. Integrates with companion skills for structured financial data and goal inputs.
---

# US Estate Planning Analyzer (50 States)

Analyze estate planning documents for legal compliance, tax efficiency, Medicaid planning, and goal alignment across all 50 US states. Generate unified reports with estimated dollar impacts and domicile optimization recommendations.

## Workflow Overview

1. **Identify user type** → Ask if individual, attorney, or paralegal
2. **State identification** → Determine primary state and any additional states with assets
3. **Web search for current rates** → Verify tax thresholds, Medicaid limits for relevant states
4. **Document intake** → Receive documents + financial data + goals from companion skill
5. **Validate documents** → Check readability; request clearer copies if needed
6. **Analyze documents** → Run compliance, tax, Medicaid, and multi-state coordination analysis
7. **Ask clarifying questions** → When encountering unclear areas during analysis
8. **Generate reports** → Deliver unified report organized by state, then topic
9. **Compare versions** → If revised documents provided, compare old vs. new

## Step 1: User Type Identification

Ask upfront:
> "Before I begin, are you an individual reviewing your own estate plan, or are you an attorney/paralegal analyzing client documents? This helps me tailor my analysis and output format."

Store response and adjust output accordingly:
- **Individual**: Explanatory language, avoid legal jargon, include "questions to ask your attorney"
- **Attorney/Paralegal**: Technical language, include state statute citations, case law references, IRS code sections

## Step 2: State Identification

After user type, ask:
> "Which state is your primary residence (domicile)? Also, do you own property or have significant assets in any other states?"

If documents mention other states not identified by user, flag and ask for clarification.

### Multi-State Triggers
- Property in multiple states mentioned in documents
- User identifies assets in multiple states
- Documents reference out-of-state property
- User has relocated from another state

For multi-state situations:
- Analyze under all relevant states' laws
- Optimize recommendations for maximum tax savings across states
- Provide domicile comparison if user is flexible on residence

## Step 3: Web Search for Current Rates

**CRITICAL**: Before any analysis, search the web to verify current rates for the relevant state(s):
- State estate tax thresholds and rates
- State inheritance tax rates and exemptions
- Federal estate tax exemption (currently ~$13.99M per person for 2025)
- Medicaid asset limits and penalty divisors
- Community Spouse Resource Allowance (CSRA)
- Any recent law changes

Search only for the specific states relevant to the user—not all 50 states.

## Step 4: Document Intake

Accept documents in any format: PDF, Word (.docx), scanned images. If a document is illegible or poor quality, stop and request a clearer copy before proceeding.

Supported document types:
- Wills (including pour-over wills)
- Revocable and irrevocable trusts
- Powers of attorney (financial, healthcare)
- Healthcare proxies / advance directives
- Beneficiary designations (retirement accounts, life insurance)
- Deed transfers and property documents

**Input from companion skill**: Expect structured JSON with asset values and natural language description of goals/beneficiary intentions.

## Step 5: Document Analysis

### 5.1 Multi-Document Coordination
When multiple documents are uploaded, analyze how they work together:
- Check for inconsistencies between will and trust provisions
- Verify assets are properly titled to fund trusts
- Confirm beneficiary designations align with estate plan intent
- Flag conflicting instructions across documents

### 5.2 DIY vs. Attorney-Drafted Detection
Identify DIY documents by indicators:
- Generic templates, missing customization
- Lack of attorney attestation
- Common form-based language

**For DIY documents**: Apply more rigorous execution review. Flag all potential defects.

### 5.3 Moved States Detection
If documents were drafted in a different state than current domicile:
- Check validity under both states' execution requirements
- Note which state's requirements apply
- Flag if re-execution recommended
- For POA/healthcare proxy: Recommend re-executing in new state (institutions prefer local forms)

### 5.4 Rewrite Recommendation
Flag when documents should be entirely rewritten:
- Multiple critical compliance failures
- Significant law changes since execution
- Fundamental structural issues
- Documents predating major life changes

Still provide complete analysis even when recommending rewrite.

## Step 6: State-Specific Analysis

Load the appropriate state reference file(s) from \`references/[state].md\` for each relevant state.

### 6.1 Compliance Analysis
Check state-specific requirements for:
- **Will execution**: Witness requirements, notarization, attestation clauses
- **Trust validity**: Proper funding, trustee succession, distribution standards
- **POA requirements**: Statutory form compliance, agent powers, durability
- **Healthcare directives**: State-specific forms, HIPAA authorization

### 6.2 Tax Analysis

#### Estate Tax States (12 + DC)
Connecticut, Hawaii, Illinois, Maine, Maryland, Massachusetts, Minnesota, New York, Oregon, Rhode Island, Vermont, Washington, District of Columbia

For these states, analyze:
- Current exemption threshold
- Tax rate structure
- Cliff effects (MA, NY, OR)
- State-specific planning opportunities

#### Inheritance Tax States (5)
Kentucky, Maryland, Nebraska, New Jersey, Pennsylvania

For these states:
- Calculate estimated inheritance tax per beneficiary
- Analyze beneficiary classifications and exemptions
- For Maryland (has both): Show combined estate + inheritance tax impact

#### No State Estate/Inheritance Tax (33 states)
Focus on federal tax planning and other state-specific benefits (homestead protection, asset protection, etc.)

### 6.3 Tax Optimization Strategies

Present options based on estate size. Allow user to choose aggressiveness level:

**Conservative**:
- Credit shelter trusts (especially important in non-portability states)
- Portability elections (federal)
- Annual gift exclusion usage

**Moderate**:
- Irrevocable life insurance trusts (ILITs)
- Qualified personal residence trusts (QPRTs)
- Charitable remainder trusts

**Advanced**:
- Grantor retained annuity trusts (GRATs)
- Dynasty trusts
- Family limited partnerships
- Charitable lead trusts

Calculate dollar impact for each recommendation.

### 6.4 Community Property Analysis

For the 9 community property states:
**Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin**

Plus opt-in states: Alaska, Florida, Kentucky, South Dakota, Tennessee

Analyze:
- Whether assets are properly characterized as community vs. separate property
- Impact on estate distribution
- Step-up in basis advantages
- If couple moved between community property and common law states, flag characterization issues

### 6.5 Medicaid/State Medicaid Planning

For each relevant state, analyze:
- Look-back period (60 months in most states; CA has 30 months)
- Asset limits and countable vs. exempt assets
- Whether irrevocable trusts properly exclude assets
- Penalty divisor for the state
- Community Spouse Resource Allowance
- Recent transfers that could trigger penalties
- State-specific exceptions and strategies

### 6.6 Business Interest Analysis

For estates with business interests:
- Analyze how estate documents handle ownership transfer
- Succession planning provisions
- Buy-sell agreement coordination (if referenced)
- Valuation methods specified
- State-specific business transfer rules

## Step 7: Domicile Optimization

If user has assets/connections in multiple states OR indicates flexibility:

### 7.1 Comparison Factors
Consider all laws affecting the person:
- Estate tax (threshold, rates, cliff effects)
- Inheritance tax
- Income tax (for beneficiaries)
- Asset protection laws
- Homestead exemptions
- Medicaid planning advantages
- Trust-friendly laws (for dynasty trusts, asset protection trusts)

### 7.2 Ranked Comparison
Provide ranked comparison of relevant states:
> "Based on your $X estate, here's how your relevant states compare:
> 1. Florida: $0 state estate tax (no estate tax), strong homestead protection
> 2. Massachusetts: ~$X state estate tax (due to $2M threshold + cliff)
> Potential savings by establishing Florida domicile: $X"

### 7.3 User Choice
Allow user to specify preferred domicile and optimize for that choice even if not the most tax-efficient option.

## Step 8: Clarifying Questions

During analysis, when encountering unclear areas:
- Pause and ask specific questions
- Reference the specific document section
- Explain why the information matters

## Step 9: Report Generation

Generate **unified report organized by state first, then topic**:

### Report Structure

\`\`\`
═══════════════════════════════════════════════════
[STATE NAME] ANALYSIS
═══════════════════════════════════════════════════

Key Differences: [What makes this state unique]

COMPLIANCE ISSUES
─────────────────
[Document] - [Issue] - [Urgency: Critical/Important/Recommended]
• [Details]
• [For attorneys: Statute citation]

TAX OPTIMIZATION OPPORTUNITIES
──────────────────────────────
Current Exposure: $X
Recommended Strategies:
• [Strategy 1]: Savings $X
• [Strategy 2]: Savings $X

MEDICAID PLANNING
─────────────────
[Analysis specific to state]

[Repeat for each relevant state]

═══════════════════════════════════════════════════
MULTI-STATE COORDINATION ISSUES
═══════════════════════════════════════════════════
[Cross-state inconsistencies, titling problems, etc.]

═══════════════════════════════════════════════════
COMBINED SAVINGS SUMMARY
═══════════════════════════════════════════════════
Current Total Tax Exposure: $X
If All Recommendations Implemented: $X
TOTAL POTENTIAL SAVINGS: $X

═══════════════════════════════════════════════════
PRIORITIZED ACTION LIST
═══════════════════════════════════════════════════
[Numbered list by urgency]

QUESTIONS TO ASK YOUR ATTORNEY
──────────────────────────────
[For individuals only]
\`\`\`

## Step 10: Version Comparison

When user provides revised documents:
1. Compare old and new versions
2. Confirm which issues have been addressed
3. List remaining unresolved issues
4. Identify any new issues introduced
5. Update dollar impact calculations

## Disclaimers

Include in every report:

> "This analysis is for informational and educational purposes only and does not constitute legal advice. Estate planning involves complex legal and tax considerations that vary based on individual circumstances and change over time. Please consult with a qualified estate planning attorney licensed in your state before making any changes to your legal documents."

## Quick Reference Tables

### States with Estate Tax (2025)
| State | Exemption | Top Rate | Notes |
|-------|-----------|----------|-------|
| Connecticut | $13.99M | 12% | Matches federal |
| Hawaii | $5.49M | 20% | |
| Illinois | $4M | 16% | No inflation adjustment |
| Maine | $7M | 12% | |
| Maryland | $5M | 16% | Also has inheritance tax |
| Massachusetts | $2M | 16% | Cliff effect |
| Minnesota | $3M | 16% | |
| New York | $7.16M | 16% | Cliff effect (105%) |
| Oregon | $1M | 16% | Lowest threshold |
| Rhode Island | $1.8M | 16% | Indexed for inflation |
| Vermont | $5M | 16% | Flat rate |
| Washington | $2.193M | 20% | Highest top rate |
| DC | $4.87M | 16% | Indexed for inflation |

### States with Inheritance Tax (2025)
| State | Top Rate | Exempt Classes |
|-------|----------|----------------|
| Kentucky | 16% | Class A (spouse, children, parents) |
| Maryland | 10% | Spouse, children, parents, grandparents |
| Nebraska | 18% | Spouse; reduced rates for relatives |
| New Jersey | 16% | Class A (spouse, children, parents, grandparents) |
| Pennsylvania | 15% | Spouse (0%), direct descendants (4.5%) |

### Community Property States
Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin

Opt-in: Alaska, Florida, Kentucky, South Dakota, Tennessee

### Medicaid Look-Back Period Exceptions
- **California**: 30 months (being phased, changes expected 2026)
- **New York**: 60 months for nursing home; no look-back for Community Medicaid (30-month implementation pending)
- **All other states**: 60 months

## References

Each state has a dedicated reference file: \`references/[state-name].md\`

Files include:
- Key differences from other states
- Will/trust/POA execution requirements
- Estate and inheritance tax details (if applicable)
- Medicaid program specifics
- Homestead and asset protection laws
- Community property rules (if applicable)
- Unique state features
`;

const us_estate_planning_analyzer_references_alabama_md = `# Alabama

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Homestead exemption up to $16,450 (bankruptcy) but unlimited for state purposes against certain creditors
- Relatively simple probate process

## Will Requirements
**Statutory Basis**: Alabama Code Title 43, Chapter 8

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign in presence of testator

### Self-Proving Affidavit
- Available under Alabama Code § 43-8-132
- Signed by testator and witnesses before notary
- Recommended to avoid witness testimony at probate

### Holographic Wills
- **Not recognized** in Alabama

## Trust Requirements
- No specific statutory execution requirements
- Must have identifiable trust property
- Must have ascertainable beneficiaries
- Revocable trusts commonly used for probate avoidance

## Power of Attorney
**Statutory Basis**: Alabama Uniform Power of Attorney Act (2012)

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults**
- Must be notarized
- Durability language required to survive incapacity

### Statutory Form
- Alabama provides statutory form (recommended but not required)
- Non-statutory forms valid if properly executed

## Healthcare Directive / Advance Directive
**Statutory Basis**: Alabama Natural Death Act

### Requirements
- Must be signed by declarant
- Must be witnessed by **2 adults**
- Witnesses cannot be related by blood or marriage
- Witnesses cannot be entitled to any portion of estate

### Living Will
- Recognized in Alabama
- Allows direction regarding life-sustaining treatment

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- Only federal estate tax applies if estate exceeds federal threshold

## Medicaid Planning (Alabama Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum (~$154,140)

### Exempt Assets
- Primary residence (equity limit ~$713,000)
- One vehicle
- Personal belongings
- Prepaid burial

### Penalty Divisor
- Verify current rate via web search (approximately $7,500-8,500/month)

## Homestead Protection
- Unlimited homestead exemption for head of household up to 160 acres
- Protects against most creditors (not federal tax liens or mortgages)
- Must be primary residence

## Unique State Features
- Simplified small estate procedures for estates under $25,000
- Independent administration available
- No state income tax on inherited assets
- Relatively low cost of living affects Medicaid planning
`;

const us_estate_planning_analyzer_references_alaska_md = `# Alaska

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- **Opt-in community property** available via community property trust/agreement
- Strong asset protection trust laws (Domestic Asset Protection Trust - DAPT)
- No state income tax
- Unique permanent fund dividend considerations

## Will Requirements
**Statutory Basis**: Alaska Statutes Title 13 (Uniform Probate Code)

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign within reasonable time after witnessing testator's signature

### Self-Proving Affidavit
- Available under AS 13.12.504
- Recommended for smooth probate

### Holographic Wills
- **Recognized** if material portions in testator's handwriting and signed by testator

## Trust Requirements
- Alaska Trust Act is very favorable for trust creation
- Allows self-settled asset protection trusts (DAPTs)
- Dynasty trusts permitted (no rule against perpetuities for trusts)
- Community property trusts available

### Alaska Asset Protection Trust (DAPT)
- Settlor can be discretionary beneficiary
- 10-year statute of limitations for creditor claims (reduced from original)
- Must have Alaska trustee
- Some Alaska-situs assets required

## Power of Attorney
**Statutory Basis**: AS 13.26

### Requirements
- Must be signed by principal
- Must be witnessed and notarized
- Durable POA requires specific durability language

## Healthcare Directive
**Statutory Basis**: AS 13.52 (Health Care Decisions Act)

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults** or notarized
- Witnesses cannot be healthcare provider or their employee

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- Only federal estate tax applies

## Opt-In Community Property

### Community Property Agreement
- Spouses can agree to treat property as community property
- Must be in writing and signed by both spouses
- Creates community property ownership

### Community Property Trust
- Alternative method to create community property
- Both spouses must be grantors and beneficiaries
- Provides double step-up in basis benefit at first death

### Benefits
- Full step-up in basis on both halves of community property at first spouse's death
- Can provide significant income tax savings

## Medicaid Planning (Alaska Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

### Alaska-Specific Considerations
- Higher cost of living affects penalty divisor
- Remote location considerations for care options
- Permanent Fund Dividend counts as income

## Homestead Protection
- Up to $72,900 exemption for primary residence
- Must be recorded to be effective
- Automatic for head of household

## Unique State Features

### Dynasty Trusts
- No rule against perpetuities for trusts created after 1997
- Trusts can last indefinitely
- Popular jurisdiction for multi-generational wealth transfer

### Asset Protection Trusts
- One of first states to allow DAPTs (1997)
- Strong creditor protection
- 10-year lookback for fraudulent transfers

### No State Income Tax
- No income tax on trust income for Alaska trusts
- Attractive for out-of-state settlors (with limitations)

### Planning Opportunities
- Establish Alaska trust for asset protection
- Use community property agreement for step-up in basis
- Dynasty trust for multi-generational planning
- Combine federal and Alaska planning for maximum benefit
`;

const us_estate_planning_analyzer_references_arizona_md = `# Arizona

## Key Differences from Other States
- **Community property state**
- No state estate tax
- No state inheritance tax
- Strong homestead protection
- Beneficiary deed available for real property transfer
- Relatively simple probate procedures

## Community Property Rules

### Classification
- All property acquired during marriage is community property
- Separate property includes: property owned before marriage, gifts, inheritance
- Income from separate property is **separate property** (American Rule)
- Commingling can convert separate to community property

### Estate Planning Implications
- Each spouse owns 50% of community property
- Full step-up in basis for both halves at first spouse's death
- Each spouse can dispose of their 50% by will
- Cannot disinherit spouse's 50% share

### Quasi-Community Property
- Property acquired while living outside Arizona treated as community property for estate/divorce purposes if it would have been community property had couple lived in Arizona

## Will Requirements
**Statutory Basis**: Arizona Revised Statutes Title 14

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign within reasonable time

### Self-Proving Affidavit
- Available under ARS § 14-2504
- Recommended for efficient probate

### Holographic Wills
- **Recognized** if material portions in testator's handwriting and signed

## Trust Requirements
- No specific statutory formalities beyond common law
- Must be in writing for real property
- Community property should be properly transferred to trust

### Community Property Trusts
- Can hold community property and maintain its character
- Important for maintaining step-up in basis benefits

## Power of Attorney
**Statutory Basis**: ARS § 14-5501 et seq.

### Requirements
- Must be signed by principal
- Must be witnessed and notarized
- Durable if includes durability language

### Statutory Form
- Arizona provides statutory form
- Other forms valid if properly executed

## Healthcare Directive
**Statutory Basis**: ARS § 36-3221 et seq.

### Requirements
- Must be signed by principal
- Must be witnessed by **1 adult** or notarized
- Witness cannot be healthcare agent

### Living Will
- Recognized in Arizona
- Can specify end-of-life care preferences

## Estate and Inheritance Tax
- **No state estate tax** (repealed 2006)
- **No state inheritance tax**
- Only federal estate tax applies

## Medicaid Planning (AHCCCS - Arizona Health Care Cost Containment System)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum (~$154,140)

### Exempt Assets
- Primary residence (equity limit applies)
- One vehicle
- Personal belongings
- Household goods
- Prepaid burial

### Arizona-Specific Considerations
- AHCCCS (Arizona's Medicaid) has unique managed care structure
- Long-term care services through ALTCS (Arizona Long Term Care System)
- Community property rules affect asset division for married couples

### Community Property and Medicaid
- All community property considered available to institutionalized spouse
- CSRA protects portion for community spouse
- Important to properly characterize separate vs. community property

## Homestead Protection
- Unlimited value exemption for up to $150,000 equity
- Property cannot exceed 10 acres (city) or 40 acres (rural)
- Must be primary residence
- Automatically applies (no filing required)

## Beneficiary Deed
**ARS § 33-405**

### Features
- Transfer real property on death without probate
- Revocable during owner's lifetime
- Does not affect owner's rights during lifetime
- Simple alternative to trust for real property

### Requirements
- Must be recorded before owner's death
- Must identify beneficiary
- Must include specific statutory language

## Unique State Features

### Simplified Probate
- Small estate affidavit for personal property under $75,000
- Summary administration for real property under $100,000
- Informal probate available for uncontested estates

### Spousal Protection
- Surviving spouse has right to remain in homestead
- Allowance for family support during administration
- Community property provides automatic 50% ownership

### No State Income Tax on Retirement
- Social Security not taxed
- Favorable treatment of retirement income
- Benefits beneficiaries receiving inherited retirement accounts

### Planning Considerations
- Use community property agreement to ensure proper classification
- Consider beneficiary deeds for real property
- Community property trust can maintain character in revocable trust
- Coordinate federal and community property planning for maximum basis step-up
`;

const us_estate_planning_analyzer_references_arkansas_md = `# Arkansas

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Dower and curtesy rights still recognized (unusual)
- Homestead protection constitutionally guaranteed
- Simplified small estate procedures

## Will Requirements
**Statutory Basis**: Arkansas Code Title 28

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator at end of will
- Must be signed by at least **2 witnesses**
- Witnesses must sign in presence of testator

### Self-Proving Affidavit
- Available under Arkansas Code § 28-25-106
- Signed by testator and witnesses before notary

### Holographic Wills
- **Recognized** if entirely in testator's handwriting and signed
- No witness requirement for holographic wills

## Trust Requirements
- No specific statutory formalities
- Must have identifiable trust property
- Must have ascertainable beneficiaries
- Arkansas Trust Code governs administration

## Power of Attorney
**Statutory Basis**: Arkansas Code § 28-68-101 et seq.

### Requirements
- Must be signed by principal
- Must be acknowledged (notarized)
- Durable if includes specific durability language

### Statutory Form
- Arkansas provides statutory form
- Other forms valid if properly executed

## Healthcare Directive
**Statutory Basis**: Arkansas Rights of the Terminally Ill or Permanently Unconscious Act

### Requirements
- Must be signed by declarant
- Must be witnessed by **2 adults**
- Witnesses cannot be related by blood or marriage
- Witnesses cannot be entitled to estate

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- Only federal estate tax applies

## Dower and Curtesy Rights
**Unique to Arkansas** (and few other states)

### Dower (Surviving Wife's Rights)
- Life estate in 1/3 of real property husband owned during marriage
- Cannot be defeated by will
- Must be released during lifetime or barred by prenup

### Curtesy (Surviving Husband's Rights)
- Life estate in all real property wife owned during marriage (if children born)
- Life estate in 1/2 if no children
- Same release requirements as dower

### Estate Planning Implications
- **Must account for dower/curtesy in estate plans**
- Spouse must join in deeds to convey clear title
- Can be waived by prenuptial agreement
- Affects trust funding strategies

## Medicaid Planning (Arkansas Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum (~$154,140)

### Exempt Assets
- Primary residence (equity limit ~$713,000)
- One vehicle
- Personal belongings
- Prepaid burial

### Arkansas-Specific Considerations
- ARChoices program for home and community-based services
- PACE program available in some areas
- Lower cost of living affects penalty divisor

## Homestead Protection
**Constitutional Protection** (Arkansas Constitution Article 9)

### Exemption Amount
- Rural: 160 acres outside city, no value limit
- Urban: 1 acre in city, no value limit (or 1/4 acre in city of 1st class)
- Unlimited dollar value protection

### Requirements
- Must be head of household or married
- Must be primary residence
- Must file homestead declaration for full protection

### Scope of Protection
- Protected from most creditors
- Does not protect against mortgages, tax liens, mechanics liens
- Survives death for benefit of surviving spouse and minor children

## Unique State Features

### Small Estate Procedures
- Affidavit procedure for estates under $100,000
- Simplified administration for small estates
- No court supervision required

### Independent Administration
- Available if will authorizes or heirs agree
- Reduces court involvement and costs

### Transfer on Death Deed
- Available for real property
- Revocable during lifetime
- Avoids probate for real property

### Income Tax Considerations
- No state tax on Social Security
- Favorable retirement income treatment
- No state estate tax burden

### Planning Considerations
- **Always address dower/curtesy rights** in estate planning
- Consider prenuptial agreement to waive dower/curtesy
- Use transfer on death deeds for real property
- Homestead protection provides significant creditor protection
- Coordinate with spouse for all real property transactions
`;

const us_estate_planning_analyzer_references_california_md = `# California

## Key Differences from Other States
- **Community property state** with strict rules
- No state estate tax
- No state inheritance tax
- **Unique Medicaid look-back**: 30 months (changes expected 2026)
- Strong tenant protections and homestead
- Complex probate system (expensive and time-consuming)
- Transfer on Death Deed available

## Community Property Rules

### Classification
- All property acquired during marriage is community property
- Separate property includes: property owned before marriage, gifts, inheritance
- Income from separate property is **separate property** (American Rule)
- Transmutation requires express written declaration

### Quasi-Community Property
- Property acquired while living outside California treated as community property for death/divorce if would have been CP in California
- Important for couples who moved to California

### Estate Planning Implications
- Each spouse owns 50% of community property
- **Full step-up in basis** for both halves at first spouse's death (IRC § 1014(b)(6))
- Each spouse can dispose of their 50% by will
- Cannot disinherit spouse without waiver

### Transmutation Rules (Family Code § 850)
- Written declaration required to change character of property
- Must be signed by spouse whose interest is adversely affected
- Gift between spouses must be express

## Will Requirements
**Statutory Basis**: California Probate Code §§ 6100-6113

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must understand it's a will
- Witnesses must sign during testator's lifetime

### Self-Proving Affidavit
- Not traditionally used in California (witnesses appear at probate)
- Cal. Prob. Code § 8220 allows affidavit in lieu of testimony

### Holographic Wills
- **Recognized** if material provisions in testator's handwriting and signed
- No witness requirement

### Statutory Will
- California provides fill-in-the-blank statutory will form
- Valid if properly completed

## Trust Requirements
- Must be in writing for real property
- No witness requirement for revocable trusts
- Community property trust maintains CP character

### Community Property Trusts
- Property transferred to trust retains community property character
- Critical for maintaining step-up in basis benefits
- Must be drafted to preserve CP status

## Power of Attorney
**Statutory Basis**: California Probate Code §§ 4000-4545

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults** OR notarized
- If signing real property documents, must be notarized
- Durable if includes durability language

### Statutory Form
- California has statutory form (recommended)
- Other forms valid but may face resistance from third parties

### Advance Health Care Directive
- Combines healthcare proxy and living will
- Must be witnessed by **2 adults** OR notarized
- At least one witness cannot be healthcare provider

## Estate and Inheritance Tax
- **No state estate tax** (repealed 1982)
- **No state inheritance tax**
- Only federal estate tax applies

## Medicaid Planning (Medi-Cal)

### Look-Back Period
- **30 months** (significantly shorter than other states)
- **Important**: California eliminated asset limits Jan 1, 2024, reinstated Jan 1, 2026
- Look-back period changes expected - verify current rules

### Asset Limits (Verify Current)
- Rules in flux - California eliminated then reinstated asset limits
- Individual: historically $2,000, now varies
- Married: CSRA rules apply

### Exempt Assets
- Primary residence (equity limit ~$1,071,000 for California)
- One vehicle
- Personal belongings
- Prepaid burial

### California-Specific Considerations
- Medi-Cal has unique income and asset rules
- AB 133 (2021) made significant changes
- Share of cost requirements for some beneficiaries
- Higher cost of living affects nursing home costs significantly

### Community Property and Medi-Cal
- Community property rules complicate Medi-Cal planning
- CSRA protects community spouse's share
- Proper characterization critical

## Homestead Protection
**California Code of Civil Procedure § 704.710 et seq.**

### Exemption Amounts (2025 - indexed for inflation)
- Automatic homestead: ~$300,000 - $600,000+ (varies by county median home price)
- Declared homestead: Same amounts, additional protections

### Requirements
- Must be principal dwelling
- Automatic protection applies without filing
- Declared homestead provides additional sale proceeds protection

## Transfer on Death Deed
**Probate Code § 5600 et seq.** (effective 2016)

### Features
- Revocable transfer of real property on death
- Avoids probate for the property
- Does not affect Prop 13 reassessment until transfer

### Requirements
- Must use statutory form
- Must be notarized
- Must be recorded within 60 days of signing
- Revocable until death

## Probate Process
- California probate is expensive (statutory fees) and slow
- Fees based on gross estate value (not net)
- Can take 1-2+ years
- Strong incentive to use revocable trusts

### Statutory Probate Fees
| Estate Value | Attorney Fee | Executor Fee |
|--------------|--------------|--------------|
| First $100K | 4% | 4% |
| Next $100K | 3% | 3% |
| Next $800K | 2% | 2% |
| Next $9M | 1% | 1% |
| Over $10M | 0.5% | 0.5% |

## Unique State Features

### Proposition 13 and 19
- Property tax limited to 1% of assessed value
- Reassessment triggered by change in ownership
- Prop 19 (2021) limits parent-child exclusion
- Inherited property may be reassessed

### Creditor Protection
- Strong homestead exemption
- 401(k) and IRA protections
- Limited asset protection trust options

### No State Income Tax Benefits
- California has high state income tax
- Trust income taxed to California if California trustee or beneficiary
- Consider trust situs planning

### Planning Considerations
- **Revocable trust essential** to avoid expensive probate
- Community property agreement/trust for proper characterization
- Transfer on death deed for real property outside trust
- Consider Prop 19 implications for inherited real estate
- Medi-Cal planning should account for shorter look-back
- High cost of care makes Medicaid planning important
- Step-up in basis on 100% of community property is major advantage
`;

const us_estate_planning_analyzer_references_colorado_md = `# Colorado

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state (but allows marital agreements)
- Strong homestead protection
- Beneficiary deed available
- Informal probate process available

## Will Requirements
**Statutory Basis**: Colorado Revised Statutes Title 15 (Uniform Probate Code)

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Self-Proving Affidavit
- Available under CRS § 15-11-504
- Recommended for efficient probate

### Holographic Wills
- **Recognized** if material portions in testator's handwriting and signed

## Trust Requirements
- Uniform Trust Code adopted
- No specific formalities beyond writing requirement
- Must have trust property and beneficiaries

## Power of Attorney
**Statutory Basis**: CRS § 15-14-701 et seq.

### Requirements
- Must be signed by principal
- Must be notarized
- Durable if includes durability language
- Statutory form available

## Healthcare Directive
### Requirements
- Living will and healthcare proxy combined in advance directive
- Must be signed and witnessed by **2 adults** OR notarized
- CPR Directive available for emergency situations

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- Only federal estate tax applies

## Medicaid Planning (Health First Colorado)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

## Homestead Protection
- Up to $250,000 equity protected
- Higher for elderly (60+) and disabled: $350,000
- Must be principal residence

## Beneficiary Deed
- Available for real property transfer on death
- Revocable during lifetime
- Avoids probate

## Unique State Features
- Informal probate available for uncontested estates
- Small estate procedures for estates under $74,000
- Designated beneficiary agreements for unmarried couples
- TABOR limits affect state services
`;

const us_estate_planning_analyzer_references_connecticut_md = `# Connecticut

## Key Differences from Other States
- **Has state estate tax** (matches federal exemption ~$13.99M in 2025)
- **Has state gift tax** (unified with estate tax)
- No state inheritance tax
- Common law property state
- Highest estate tax exemption among estate tax states
- Gift tax is unified with estate tax (lifetime gifts count against exemption)

## Estate Tax

### Exemption (2025)
- **$13.99 million** (matches federal exemption)
- Indexed to federal exemption
- One of only states with gift tax

### Tax Rates
- Graduated rates from 11.6% to 12%
- Top rate: **12%** (lowest among estate tax states)
- Tax capped at $15 million maximum

### Calculation
- Based on federal taxable estate with Connecticut modifications
- Add back Connecticut taxable gifts made on or after Jan 1, 2005
- Add back Connecticut gift tax paid in 3 years before death

### QTIP Elections
- Connecticut recognizes separate state QTIP election
- Can make different election for federal and state purposes

## Gift Tax
**Connecticut is one of only two states with a gift tax** (with Minnesota technically having one)

### Exemption
- Unified with estate tax exemption ($13.99M in 2025)
- Lifetime gifts reduce available estate tax exemption

### Annual Exclusion
- Follows federal annual exclusion ($18,000 per recipient in 2024)
- Gifts under annual exclusion not taxable

### Filing Requirements
- Must file Connecticut gift tax return for taxable gifts
- Due April 15 following year of gift

## Will Requirements
**Statutory Basis**: Connecticut General Statutes Chapter 802a

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign in presence of testator

### Self-Proving Affidavit
- Available
- Recommended for probate efficiency

### Holographic Wills
- **Not recognized** in Connecticut

## Trust Requirements
- No specific statutory formalities
- Must have identifiable trust property
- Uniform Trust Code provisions apply

## Power of Attorney
**Statutory Basis**: CGS § 1-350 et seq.

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults**
- Should be acknowledged (notarized) for real property
- Durable if includes durability language

### Statutory Short Form
- Connecticut provides statutory short form POA
- Widely recognized

## Healthcare Directive
**Statutory Basis**: CGS § 19a-570 et seq.

### Requirements
- Health Care Instructions (Living Will)
- Appointment of Health Care Representative
- Must be signed and witnessed by **2 adults**

## Medicaid Planning (Connecticut Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $1,600 (lower than federal standard)
- Married (community spouse): CSRA up to federal maximum

### Exempt Assets
- Primary residence (equity limit applies)
- One vehicle
- Personal belongings
- Prepaid burial

### Connecticut-Specific Considerations
- Lower individual asset limit than most states
- Connecticut Home Care Program for Elders
- Higher cost of care affects planning

## Homestead Protection
- **No homestead exemption** in Connecticut
- One of few states without homestead protection
- Creditors can reach home equity

## Unique State Features

### Unified Gift and Estate Tax
- Unlike most states, Connecticut taxes lifetime gifts
- Planning must account for gift tax
- Gifts count against estate tax exemption

### No Homestead Protection
- Major planning consideration
- Consider other asset protection strategies
- Trusts more important for creditor protection

### High Cost of Living
- Higher nursing home costs
- Higher penalty divisor for Medicaid
- May justify more aggressive planning

### Probate Process
- Each town has probate court
- Can be efficient for simple estates
- Fees based on estate value

### Planning Considerations
- **Account for gift tax** in lifetime planning
- High exemption means fewer estates subject to tax
- No homestead - consider trust-based asset protection
- QTIP elections can be state-specific
- Coordinate federal and Connecticut planning
- Annual gift exclusion important for reducing estate
`;

const us_estate_planning_analyzer_references_delaware_md = `# Delaware

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- **Premier trust jurisdiction** - very favorable trust laws
- Directed trusts, dynasty trusts, asset protection trusts
- No rule against perpetuities for trusts
- No state income tax on trust income (with qualifications)

## Will Requirements
**Statutory Basis**: Delaware Code Title 12

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses** (credible witnesses)

### Self-Proving Affidavit
- Available under 12 Del. C. § 1305
- Recommended for smooth probate

### Holographic Wills
- **Not recognized** in Delaware

## Trust Requirements
- Delaware Trust Act is very favorable
- Permits dynasty trusts (no perpetuities)
- Permits directed trusts
- Asset protection trusts available

### Delaware Dynasty Trusts
- No rule against perpetuities
- Trusts can last indefinitely
- Popular for multi-generational wealth

### Delaware Asset Protection Trust (DAPT)
- Self-settled trusts with creditor protection
- 4-year statute of limitations
- Must have Delaware trustee

### Directed Trusts
- Investment direction can be separated from distribution
- Trust protector provisions allowed
- Flexibility in trust administration

## Power of Attorney
**Statutory Basis**: 12 Del. C. Chapter 49A

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults**
- Must be notarized
- Durable if includes durability language

## Healthcare Directive
**Statutory Basis**: 16 Del. C. Chapter 25

### Requirements
- Advance Health Care Directive
- Must be signed and witnessed by **2 adults**
- Or notarized
- Includes healthcare agent designation and living will

## Estate and Inheritance Tax
- **No state estate tax** (repealed 2018)
- **No state inheritance tax**
- Only federal estate tax applies

## Medicaid Planning (Delaware Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

## Homestead Protection
- Very limited homestead exemption
- Up to $125,000 for home
- Must be head of household

## Trust Jurisdiction Advantages

### No State Income Tax on Trusts
- Delaware does not tax trust income if:
  - No Delaware beneficiaries receive distributions
  - Trustee is Delaware resident or trust company
- Attractive for out-of-state settlors

### Trust Decanting
- Allows modifying irrevocable trusts
- Transfer to new trust with different terms
- Flexibility for changing circumstances

### Quiet Trusts
- Beneficiaries need not be informed of trust
- Until certain age or event
- Privacy for settlors

### Trust Protectors
- Can modify trust terms
- Can change trustees
- Can adjust for tax law changes

## Unique State Features

### Business-Friendly Laws
- Corporation haven
- Limited liability companies favorable
- Business succession planning advantages

### Chancery Court
- Specialized court for business and trust matters
- Sophisticated judges
- Predictable outcomes

### Planning Considerations
- **Consider Delaware situs for trusts** even if not Delaware resident
- Dynasty trusts for multi-generational wealth
- Directed trusts for sophisticated planning
- Asset protection trusts for creditor concerns
- No state estate tax reduces planning urgency
- Trust income tax planning for high-income families
`;

const us_estate_planning_analyzer_references_florida_md = `# Florida

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- **No state income tax**
- Common law property state (but opt-in community property trust available)
- **Strongest homestead protection in US** (constitutionally protected, unlimited value)
- Popular retirement destination - domicile optimization target
- Elective share protections for surviving spouse
- Lady Bird deeds available

## Will Requirements
**Statutory Basis**: Florida Statutes Chapter 732

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator **at the end**
- Must be signed by at least **2 witnesses**
- Witnesses must sign in presence of testator and each other
- **Strict compliance required** - even minor defects can invalidate

### Self-Proving Affidavit
- Available under F.S. § 732.503
- **Strongly recommended** - widely used in Florida

### Holographic Wills
- **Not recognized** in Florida (even if valid where executed)
- Exception: Military personnel in combat

### Foreign Wills
- Will valid where executed is valid in Florida
- But holographic wills from other states may not be accepted

## Trust Requirements
- Florida Trust Code (Chapter 736)
- Must be in writing
- Must have identifiable property and beneficiaries

### Community Property Trust
- Florida allows opt-in community property trusts
- Provides double step-up in basis benefits
- Must meet statutory requirements

## Power of Attorney
**Statutory Basis**: F.S. Chapter 709

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults**
- Must be **notarized**
- Durable if includes durability language
- **Statutory form strongly recommended** - many institutions reject non-statutory forms

### Special Considerations
- Florida POA law changed significantly in 2011
- Pre-2011 POAs may not be accepted
- Third parties can refuse non-compliant POAs

## Healthcare Directive
**Statutory Basis**: F.S. Chapters 765

### Requirements
- Designation of Health Care Surrogate
- Living Will
- Must be signed by principal
- Must be witnessed by **2 adults**
- **One witness cannot be spouse or blood relative**

### HIPAA Authorization
- Should be included
- Allows surrogate access to medical information

## Estate and Inheritance Tax
- **No state estate tax** (constitutionally prohibited)
- **No state inheritance tax**
- **No state income tax** (constitutionally prohibited)
- Only federal estate tax applies

## Homestead Protection
**Florida Constitution Article X, Section 4**

### Exemption
- **Unlimited value** protection
- Limited to 1/2 acre in municipality or 160 acres outside
- Must be primary residence

### Protections
- Cannot be forced to sell for most debts
- Protected from judgment creditors
- **Exceptions**: Mortgages, property taxes, mechanics liens, HOA assessments

### Devise Restrictions
- **Cannot devise homestead away from spouse or minor children**
- If survived by spouse: spouse gets life estate, remainder to descendants
- Or spouse can elect 50% fee simple
- Major estate planning consideration

### Homestead and Trusts
- Homestead in revocable trust retains protection
- Must be properly structured
- Careful drafting required

## Elective Share
**F.S. § 732.201 et seq.**

### Amount
- 30% of elective estate
- Includes more than just probate assets
- Cannot completely disinherit spouse

### Elective Estate Includes
- Probate estate
- Revocable trust assets
- Joint property
- Retirement accounts
- Other specified assets

## Medicaid Planning (Florida Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum (~$154,140)

### Exempt Assets
- Primary residence (unlimited for homestead)
- One vehicle
- Personal belongings
- Prepaid irrevocable burial

### Florida-Specific Considerations
- Strong homestead protection affects Medicaid planning
- High nursing home costs in South Florida
- SMMC (Statewide Medicaid Managed Care) system
- Estate recovery from probate estate

### Homestead and Medicaid
- Homestead exempt while living
- Subject to estate recovery at death (with exceptions)
- Proper planning can protect for surviving spouse

## Lady Bird Deed (Enhanced Life Estate Deed)
- Retain life estate with power to sell, mortgage, or revoke
- Property passes to remainderman at death
- Avoids probate
- Preserves homestead
- Does not trigger Medicaid transfer issues (when properly structured)

## Unique State Features

### No State Income Tax
- No tax on retirement income
- No tax on Social Security
- No tax on investment income
- Major advantage for retirees

### Domicile Planning
- Popular for establishing domicile to avoid state taxes
- Must genuinely be primary residence
- Evidence: driver's license, voter registration, where you spend most time

### Asset Protection
- Homestead unlimited
- Tenancy by entireties protects marital property
- Annuities protected from creditors
- Retirement accounts protected

### Tenancy by the Entireties
- For married couples
- Creditor of one spouse cannot reach
- Must be careful with titling

### Probate Process
- Summary administration for estates under $75,000
- Formal administration can be costly
- Revocable trusts recommended for larger estates

### Planning Considerations
- **Homestead devise restrictions critical** - cannot leave home away from spouse/minors
- Lady Bird deeds useful for Medicaid and probate planning
- Community property trust for step-up in basis
- Tenancy by entireties for asset protection
- No state tax makes Florida attractive for domicile
- Strict will execution requirements - ensure compliance
- POA should use statutory form
- Consider declaring Florida domicile for tax benefits
`;

const us_estate_planning_analyzer_references_georgia_md = `# Georgia

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Year's support for surviving spouse and minor children
- Relatively simple probate process
- No requirement for attorney in probate

## Will Requirements
**Statutory Basis**: O.C.G.A. Title 53

### Execution Requirements
- Testator must be 14+ years old (younger than most states)
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign in presence of testator

### Self-Proving Affidavit
- Available under O.C.G.A. § 53-4-24
- Recommended for probate efficiency

### Holographic Wills
- **Not recognized** in Georgia

## Trust Requirements
- Georgia Trust Code (O.C.G.A. Title 53, Article 12)
- Must be in writing for real property
- No specific statutory formalities

## Power of Attorney
**Statutory Basis**: O.C.G.A. § 10-6B

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults**
- Must be notarized
- Durable if includes durability language

### Statutory Form
- Georgia provides statutory form
- Other forms valid if properly executed

## Healthcare Directive
**Statutory Basis**: O.C.G.A. § 31-32

### Requirements
- Georgia Advance Directive for Health Care
- Must be signed by principal
- Must be witnessed by **2 adults**
- One witness cannot be healthcare provider

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- Only federal estate tax applies

## Year's Support
**Unique Georgia provision** (O.C.G.A. § 53-3-1)

### Purpose
- Provides support for surviving spouse and minor children
- Takes priority over most debts and bequests
- Set aside from estate before distribution

### Amount
- No fixed amount - based on circumstances
- Consider: standard of living, estate size, needs
- Court determines if contested

### Significance
- Can substantially reduce estate available for distribution
- Cannot be waived in will
- Must be considered in estate planning

## Medicaid Planning (Georgia Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

### Georgia-Specific Considerations
- Georgia Pathways program
- HCBS waiver programs with waiting lists
- Lower cost of living in many areas

## Homestead Protection
- Up to $21,500 equity exemption
- Limited protection compared to other states
- Must be head of family

## Unique State Features

### Low Age for Will Execution
- Only 14 years old required (unusual)
- Other capacity requirements still apply

### Year's Support Priority
- **Critical planning consideration**
- Can override will provisions
- Must be filed within specified time

### Probate Process
- Solemn form vs. common form probate
- Solemn form provides more protection
- No attorney required but recommended

### Planning Considerations
- Account for year's support in estate planning
- Consider impact on specific bequests
- Prenuptial agreements may address year's support
- Limited homestead protection - consider other strategies
- Relatively straightforward probate process
`;

const us_estate_planning_analyzer_references_hawaii_md = `# Hawaii

## Key Differences from Other States
- **Has state estate tax** (exemption ~$5.49M)
- No state inheritance tax
- Common law property state
- **Highest top estate tax rate**: 20%
- Portability available for state estate tax (unique)
- Strong homestead protections
- Transfer on Death Deed available

## Estate Tax

### Exemption (2025)
- **$5,490,000** (historically tied to 2018 federal amount)
- Verify current - may change

### Tax Rates
- Graduated rates from 10% to **20%**
- Highest top rate in the nation for estate tax
- Progressive brackets

### Hawaii Estate Tax Brackets
| Taxable Amount | Rate |
|----------------|------|
| $0 - $1M | 10% |
| $1M - $2.5M | 13% |
| $2.5M - $5M | 14% |
| $5M - $7M | 15% |
| $7M - $10M | 16% |
| Over $10M | 20% |

### Portability
- Hawaii allows portability (DSUE - Deceased Spousal Unused Exclusion)
- Surviving spouse can use deceased spouse's unused exemption
- Unique among state estate tax jurisdictions
- Must elect on Hawaii estate tax return

### QTIP Elections
- Hawaii recognizes QTIP trusts
- Can make separate state QTIP election

## Will Requirements
**Statutory Basis**: Hawaii Revised Statutes Chapter 560 (UPC)

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Self-Proving Affidavit
- Available under HRS § 560:2-504
- Recommended for efficient probate

### Holographic Wills
- **Recognized** if material provisions in testator's handwriting and signed

## Trust Requirements
- Hawaii Trust Code
- No specific formalities beyond common law
- Must have trust property and beneficiaries

## Power of Attorney
**Statutory Basis**: HRS Chapter 551E (Uniform POA Act)

### Requirements
- Must be signed by principal
- Must be notarized
- Durable if includes durability language
- Statutory form available

## Healthcare Directive
**Statutory Basis**: HRS Chapter 327E

### Requirements
- Advance Health Care Directive
- Must be signed by principal
- Must be witnessed by **2 adults** OR notarized
- One witness cannot be healthcare provider

## Medicaid Planning (Med-QUEST)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

### Hawaii-Specific Considerations
- High cost of living significantly affects planning
- Very high nursing home costs
- Island-specific considerations for care options

## Homestead Protection
- Up to $30,000 equity for head of household
- Up to $20,000 for others
- Limited compared to some states

## Transfer on Death Deed
- Available for real property
- Revocable during lifetime
- Avoids probate

## Unique State Features

### High Estate Tax Rates
- 20% top rate is highest in nation
- Significant planning needed for large estates
- Portability helps married couples

### Portability
- **Unique among states** with estate tax
- Surviving spouse can use deceased spouse's unused exemption
- Must file Hawaii estate tax return to elect

### High Cost of Living
- Affects Medicaid planning significantly
- Higher nursing home costs
- Higher penalty divisor

### Island Considerations
- Care options may be limited
- Moving between islands for care
- Transportation costs for family

### Planning Considerations
- **Portability election important** for married couples
- Credit shelter trusts still useful despite portability
- High rates justify aggressive tax planning
- ILIT for life insurance critical
- Consider out-of-state trust situs for income tax
- High nursing home costs make Medicaid planning essential
- Lifetime gifting to reduce estate below exemption
`;

const us_estate_planning_analyzer_references_idaho_md = `# Idaho

## Key Differences from Other States
- **Community property state**
- No state estate tax
- No state inheritance tax
- Common law property abolished (dower/curtesy)
- Strong homestead protections
- Simple probate procedures

## Community Property Rules

### Classification
- All property acquired during marriage is community property
- Separate property includes: property owned before marriage, gifts, inheritance
- Income from separate property is **community property** (Civil Law Rule - unlike CA)
- Commingling can convert separate to community property

### Estate Planning Implications
- Each spouse owns 50% of community property
- Full step-up in basis for both halves at first spouse's death
- Each spouse can dispose of their 50% by will
- Cannot disinherit spouse's 50% share

### Quasi-Community Property
- Not specifically recognized in Idaho
- Property acquired elsewhere may be treated differently

## Will Requirements
**Statutory Basis**: Idaho Code Title 15 (Uniform Probate Code)

### Execution Requirements
- Testator must be 18+ years old (or emancipated minor)
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Self-Proving Affidavit
- Available under Idaho Code § 15-2-504
- Recommended for probate efficiency

### Holographic Wills
- **Recognized** if material provisions in testator's handwriting and signed

## Trust Requirements
- Idaho Trust Code
- No specific statutory formalities
- Must have trust property and beneficiaries

### Community Property Trusts
- Can hold community property and maintain character
- Important for preserving step-up in basis

## Power of Attorney
**Statutory Basis**: Idaho Code § 15-12

### Requirements
- Must be signed by principal
- Must be notarized
- Durable if includes durability language

## Healthcare Directive
**Statutory Basis**: Idaho Code § 39-4501 et seq.

### Requirements
- Living Will
- Durable Power of Attorney for Health Care
- Must be signed and witnessed by **2 adults**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- Only federal estate tax applies

## Medicaid Planning (Idaho Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA up to federal maximum

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

### Community Property and Medicaid
- All community property considered available to institutionalized spouse
- CSRA protects portion for community spouse
- Proper characterization critical

## Homestead Protection
- Up to $175,000 equity in dwelling
- Increases for 65+ and disabled
- Must be head of family

## Unique State Features

### Community Property Income Rule
- Income from separate property is community property (Civil Law Rule)
- Different from California and some other CP states
- Affects planning strategies

### Simple Probate
- Uniform Probate Code adopted
- Informal probate available
- Small estate procedures for estates under $100,000

### Agricultural Considerations
- Farm and ranch planning important
- Special use valuation may apply
- Family farm succession planning

### Planning Considerations
- Community property provides automatic step-up in basis
- Income from separate property becomes community - plan accordingly
- Simple probate may reduce need for trust
- Consider community property trust for clear classification
- Coordinate federal and community property planning
`;

const us_estate_planning_analyzer_references_illinois_md = `# Illinois

## Key Differences from Other States
- **Has state estate tax** (exemption $4M)
- No state inheritance tax
- Common law property state
- No portability for state estate tax
- Exemption not indexed for inflation
- Independent administration available

## Estate Tax

### Exemption (2025)
- **$4,000,000** per person
- Not indexed for inflation
- No portability (unlike federal)

### Tax Rates
- Graduated rates
- Top rate: **16%**
- Uses federal credit for state death taxes table

### Calculation
- Based on federal taxable estate
- Illinois modifications may apply
- Credit for state death taxes methodology

### No Portability
- **Cannot use deceased spouse's unused exemption**
- Credit shelter trusts more important in Illinois
- Each spouse should use their own exemption

### QTIP Elections
- Illinois recognizes QTIP trusts
- Can make separate state QTIP election
- Important for estates between state and federal thresholds

## Will Requirements
**Statutory Basis**: 755 ILCS 5/4

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign in testator's presence

### Self-Proving Affidavit
- Available under Illinois law
- Recommended for probate efficiency

### Holographic Wills
- **Not recognized** in Illinois

## Trust Requirements
- Illinois Trust Code
- Must be in writing for real property
- No specific formalities for personal property trusts

## Power of Attorney
**Statutory Basis**: 755 ILCS 45 (Power of Attorney Act)

### Requirements
- Must be signed by principal
- Must be witnessed by **1 adult**
- Must be notarized
- Statutory short form available and recommended

### Statutory Short Form
- Widely accepted
- Should be updated if older than 10 years
- Agent powers specifically enumerated

## Healthcare Directive
**Statutory Basis**: 755 ILCS 35 (Health Care Surrogate Act)

### Requirements
- Power of Attorney for Health Care
- Living Will
- Must be signed and witnessed by **1 adult**

## Medicaid Planning (Illinois Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married (community spouse): CSRA may be lower than federal max (~$135,648)

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

### Illinois-Specific Considerations
- Community Care Program for home services
- Cook County has different considerations
- Large state with varying costs

## Homestead Protection
- Up to $15,000 equity
- Limited protection
- Must be head of household

## Unique State Features

### No Portability
- **Critical planning consideration**
- Credit shelter trusts essential for married couples
- Each spouse's $4M exemption must be used or lost

### Estate Tax Planning Strategies
- Credit shelter trust (bypass trust) critical
- ILIT for life insurance
- Lifetime gifting to reduce estate
- QTIP trust for flexibility

### Independent Administration
- Available if will provides
- Reduces court supervision
- More efficient administration

### Transfer on Death Instrument
- Available for real property
- Revocable during lifetime
- Avoids probate

### Chicago/Cook County Considerations
- Higher real estate values
- More estates may be subject to tax
- Transfer taxes on real property

### Planning Considerations
- **Credit shelter trust essential** for married couples with estates over $4M
- No portability means planning cannot wait
- ILIT to remove life insurance from estate
- Consider lifetime gifting
- QTIP provides flexibility for state vs. federal planning
- Lower exemption than many states justifies aggressive planning
- Independent administration recommended in will
`;

const us_estate_planning_analyzer_references_indiana_md = `# Indiana

## Key Differences from Other States
- No state estate tax
- No state inheritance tax (repealed 2013)
- Common law property state
- Transfer on Death Deed available
- Simplified probate for small estates

## Will Requirements
**Statutory Basis**: Indiana Code Title 29

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Self-Proving Affidavit
- Available
- Recommended for probate

### Holographic Wills
- **Not recognized** in Indiana

## Trust Requirements
- Indiana Trust Code (IC 30-4)
- Must have identifiable property
- Standard formalities apply

## Power of Attorney
### Requirements
- Must be signed by principal
- Must be notarized
- Durable if includes durability language

## Healthcare Directive
### Requirements
- Health Care Representative appointment
- Living Will Declaration
- Must be signed and witnessed

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax** (repealed January 1, 2013)
- Only federal estate tax applies

## Medicaid Planning (Indiana Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Unlimited value protection
- Limited to specific acreage
- Must be head of household

## Transfer on Death Deed
- Available for real property
- Revocable during lifetime
- Avoids probate

## Unique State Features
- No state death taxes simplifies planning
- Transfer on Death Deed useful tool
- Unlimited homestead value protection
`;

const us_estate_planning_analyzer_references_iowa_md = `# Iowa

## Key Differences from Other States
- No state estate tax
- **Inheritance tax REPEALED effective January 1, 2025**
- Common law property state
- Previously had inheritance tax with low rates (2% top rate in 2024)
- Transfer on Death Deed available

## Will Requirements
**Statutory Basis**: Iowa Code Chapter 633

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Self-Proving Affidavit
- Available
- Recommended

### Holographic Wills
- **Not recognized** in Iowa

## Trust Requirements
- Iowa Trust Code
- Standard formalities apply
- Must have identifiable property

## Power of Attorney
### Requirements
- Must be signed by principal
- Must be notarized
- Statutory form available

## Healthcare Directive
### Requirements
- Durable Power of Attorney for Health Care
- Living Will
- Must be signed and witnessed

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax** (repealed effective January 1, 2025)
- Previously inheritance tax was phased out 2021-2024
- Only federal estate tax applies

### Historical Context
- Iowa phased out inheritance tax over 4 years (2021-2024)
- SF 619 (2021) eliminated the tax
- Rates decreased 20% each year
- Fully repealed January 1, 2025

## Medicaid Planning (Iowa Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Unlimited value for up to 1/2 acre in city
- Up to 40 acres rural
- Strong protection

## Transfer on Death Deed
- Available for real property
- Revocable during lifetime
- Avoids probate

## Unique State Features
- Recent repeal of inheritance tax simplifies planning
- Strong homestead protection
- Agricultural estate planning important
- Family farm succession planning common
`;

const us_estate_planning_analyzer_references_kansas_md = `# Kansas

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Strong homestead protection (unlimited rural)
- Transfer on Death Deed available

## Will Requirements
**Statutory Basis**: Kansas Statutes Chapter 59

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Self-Proving Affidavit
- Available
- Recommended

### Holographic Wills
- **Not recognized** in Kansas

## Trust Requirements
- Kansas Uniform Trust Code
- Standard formalities
- Must have identifiable property

## Power of Attorney
### Requirements
- Must be signed by principal
- Must be notarized
- Durable if specified

## Healthcare Directive
### Requirements
- Durable Power of Attorney for Health Care Decisions
- Declaration (Living Will)
- Must be signed and witnessed by **2 adults** and notarized

## Estate and Inheritance Tax
- **No state estate tax** (repealed)
- **No state inheritance tax**
- Only federal estate tax applies

## Medicaid Planning (KanCare)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Unlimited value for up to 1 acre in city
- **160 acres rural - unlimited value**
- Very strong protection for rural property

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Unique State Features
- Strong rural homestead protection (160 acres unlimited value)
- Agricultural estate planning important
- No state death taxes
- KanCare managed care Medicaid system
`;

const us_estate_planning_analyzer_references_kentucky_md = `# Kentucky

## Key Differences from Other States
- No state estate tax
- **Has state inheritance tax** (top rate 16%)
- Common law property state
- Opt-in community property trust available
- Class-based inheritance tax system
- Close relatives exempt from inheritance tax

## Inheritance Tax

### Tax Structure
- Tax on beneficiaries based on relationship to decedent
- Three classes of beneficiaries with different rates
- Exemptions vary by class

### Class A (Exempt)
- Surviving spouse
- Parents
- Children (including adopted and stepchildren)
- Grandchildren
- Brothers and sisters
- **No inheritance tax for Class A beneficiaries**

### Class B
- Nieces and nephews
- Daughters-in-law and sons-in-law
- Aunts and uncles
- Great-grandchildren

**Class B Rates:**
| Amount | Rate |
|--------|------|
| First $1,000 | Exempt |
| $1,000 - $10,000 | 4% |
| $10,000 - $20,000 | 5% |
| $20,000 - $30,000 | 6% |
| Over $30,000 | 8% |

### Class C
- All other beneficiaries
- Friends
- Cousins
- Charities (some exemptions)
- Corporations

**Class C Rates:**
| Amount | Rate |
|--------|------|
| First $500 | Exempt |
| $500 - $10,000 | 6% |
| $10,000 - $20,000 | 8% |
| $20,000 - $30,000 | 10% |
| $30,000 - $45,000 | 12% |
| $45,000 - $60,000 | 14% |
| Over $60,000 | **16%** |

### Calculating Inheritance Tax
- Each beneficiary's inheritance taxed separately
- Based on fair market value received
- Deductions for funeral expenses, debts, administration costs

## Will Requirements
**Statutory Basis**: KRS Chapter 394

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign in presence of testator

### Self-Proving Affidavit
- Available
- Recommended

### Holographic Wills
- **Recognized** if entirely in testator's handwriting and signed

## Trust Requirements
- Kentucky Trust Code
- Standard formalities
- Must have identifiable property

### Community Property Trust
- Kentucky allows opt-in community property trusts
- Provides double step-up in basis
- Must meet statutory requirements

## Power of Attorney
**Statutory Basis**: KRS Chapter 457

### Requirements
- Must be signed by principal
- Must be witnessed and notarized
- Durable if includes durability language

## Healthcare Directive
### Requirements
- Advance Directive
- Living Will
- Must be signed and witnessed by **2 adults** or notarized

## Estate and Inheritance Tax
- **No state estate tax**
- **Has state inheritance tax** (rates above)
- Only federal estate tax applies for estates exceeding federal threshold

## Medicaid Planning (Kentucky Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married: CSRA up to federal maximum

### Exempt Assets
- Primary residence
- One vehicle
- Personal belongings
- Prepaid burial

## Homestead Protection
- Up to $5,000 equity
- Very limited protection
- One of lowest in nation

## Unique State Features

### Inheritance Tax Planning
- **Structure bequests to maximize Class A beneficiaries**
- Leave assets to spouse/children instead of others when possible
- Use trusts to benefit distant relatives indirectly
- Consider charitable planning for Class C beneficiaries

### Low Homestead Protection
- Only $5,000 protected
- Consider other asset protection strategies
- Trust planning more important

### Community Property Trust
- Opt-in option for married couples
- Provides double step-up in basis
- Unusual for non-community property state

### Planning Considerations
- **Identify beneficiary classes** early in planning
- Maximize Class A bequests
- Use trusts to minimize inheritance tax
- Consider life insurance owned by beneficiaries
- Spousal bequests completely exempt
- Charitable bequests may have exemptions
- Consider establishing trust for Class C beneficiaries
- Community property trust for income tax benefits
`;

const us_estate_planning_analyzer_references_louisiana_md = `# Louisiana

## Key Differences from Other States
- **Community property state** (based on civil law/Napoleonic Code)
- No state estate tax
- No state inheritance tax
- **Forced heirship** provisions (unique in US)
- Civil law system (different from all other states)
- Successions instead of probate
- Usufruct rights for surviving spouse

## Community Property Rules

### Civil Law Foundation
- Louisiana's system based on French/Spanish civil law
- Terminology and concepts differ from other CP states
- "Acquets and gains" instead of community property

### Classification
- All property acquired during marriage is community property
- Separate property includes: property owned before marriage, gifts, inheritance
- Income from separate property may remain separate (varies by source)
- Fruits (income) of separate property: complex rules

### Estate Planning Implications
- Each spouse owns 50% of community property
- Full step-up in basis for both halves at first spouse's death
- **Forced heirship restricts testamentary freedom** (see below)

## Forced Heirship
**Louisiana Civil Code Articles 1493-1514**

### Forced Heirs
- Children under 24 years old
- Children of any age who are permanently incapable of caring for themselves
- These heirs have **forced portion** rights

### Forced Portion (Legitime)
- If one forced heir: 1/4 of estate
- If two or more forced heirs: 1/2 of estate
- **Cannot disinherit forced heirs** (limited exceptions)

### Disposable Portion
- Portion of estate that can be freely disposed
- 3/4 if one forced heir
- 1/2 if two or more forced heirs

### Estate Planning Implications
- **Must account for forced heirship in estate plans**
- Limited ability to disinherit minor children
- Can disinherit adult children (over 24) who aren't incapacitated
- Strategic planning needed for blended families

## Will Requirements
**Louisiana Civil Code**

### Types of Wills
1. **Notarial Will** (most common)
   - Signed before notary and **2 witnesses**
   - Notary reads will aloud or testator declares contents
   - Most secure form

2. **Olographic Will** (Holographic)
   - Entirely in testator's handwriting
   - Dated and signed
   - No witness requirement

3. **Statutory Will** (simplified form available)

### Requirements (Notarial)
- Testator must be 16+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator, notary, and **2 witnesses**
- Notary must be present throughout

## Trust Requirements
- Louisiana Trust Code
- Must be in writing
- More formal requirements than some states
- Trust income taxed at entity level in Louisiana

## Power of Attorney (Mandate/Procuration)
### Requirements
- Must be signed by principal
- Must be notarized for authentic form
- Can be in private form with witnesses
- Called "mandate" under civil law

## Healthcare Directive
### Requirements
- Living Declaration
- Must be signed and witnessed by **2 adults**
- Notarization recommended

## Succession Process (Not "Probate")

### Terminology
- "Succession" not "probate"
- "Decedent" not "testator" (for intestate)
- "Legatee" not "beneficiary"
- "Executor" called "Succession Representative"

### Types of Succession
- **Independent Administration** - if will provides, minimal court oversight
- **Simple Putting in Possession** - for small estates
- **Judicial Partition** - when disputes exist

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- Only federal estate tax applies

## Medicaid Planning (Louisiana Medicaid)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married: CSRA up to federal maximum

### Community Property and Medicaid
- Community property rules affect eligibility
- CSRA protects community spouse
- Usufruct may affect asset treatment

## Homestead Protection
- Up to $35,000 of equity
- Up to 160 acres in rural areas
- Limited compared to some states

## Usufruct (Life Estate Equivalent)

### Legal Usufruct
- Surviving spouse has usufruct over deceased spouse's community property
- If children from marriage exist
- **Cannot sell without consent**

### Testamentary Usufruct
- Can grant usufruct in will
- More flexible than legal usufruct
- Common planning tool

## Unique State Features

### Civil Law System
- **Different legal concepts** than common law states
- Requires Louisiana-licensed attorney
- Out-of-state documents may not work

### Forced Heirship
- **Major planning constraint**
- Cannot freely disinherit minor children
- Plan around forced portion limitations

### Parish System
- Louisiana has parishes, not counties
- Succession filed in parish of domicile

### Immovable vs. Movable Property
- "Immovable" = real property
- "Movable" = personal property
- Different rules for each

### Planning Considerations
- **Use Louisiana-specific documents**
- Account for forced heirship in all planning
- Consider usufruct for surviving spouse
- Community property provides basis step-up
- Succession process differs from probate
- Trust planning must comply with Louisiana Trust Code
- Consider forced portion when planning for children
- Blended families require careful forced heirship analysis
`;

const us_estate_planning_analyzer_references_maine_md = `# Maine

## Key Differences from Other States
- **Has state estate tax** (exemption $7M in 2025)
- No state inheritance tax
- Common law property state
- Lowest top estate tax rate (12%)
- Exemption indexed for inflation

## Estate Tax

### Exemption (2025)
- **$7,000,000** per person
- Indexed for inflation
- Increased from $6.8M in 2024

### Tax Rates
- Graduated rates from 8% to **12%**
- Lowest top rate among estate tax states
- Progressive brackets

### Maine Estate Tax Brackets
| Taxable Amount | Rate |
|----------------|------|
| $0 - $6M | 8% |
| $6M - $9M | 10% |
| Over $9M | 12% |

### No Portability
- Maine does not allow portability
- Credit shelter trusts recommended for married couples
- Each spouse should use their own exemption

### QTIP Elections
- Maine recognizes QTIP trusts
- Can make separate state QTIP election

## Will Requirements
**Statutory Basis**: Maine Revised Statutes Title 18-C (Uniform Probate Code)

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Self-Proving Affidavit
- Available
- Recommended

### Holographic Wills
- **Recognized** if material provisions in testator's handwriting and signed

## Trust Requirements
- Maine Uniform Trust Code
- Standard formalities
- Must have identifiable property

## Power of Attorney
**Statutory Basis**: 18-C M.R.S. Article 5

### Requirements
- Must be signed by principal
- Must be notarized
- Statutory form available

## Healthcare Directive
### Requirements
- Advance Health Care Directive
- Must be signed and witnessed by **2 adults**
- One witness cannot be healthcare provider

## Medicaid Planning (MaineCare)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $10,000 (higher than many states)
- Married: CSRA up to federal maximum

### MaineCare Specific
- Higher individual asset limit ($10,000)
- More generous than many states
- Home and community-based services available

## Homestead Protection
- Up to $80,000 equity
- Higher for 60+ and disabled: $160,000
- Must be primary residence

## Unique State Features

### Low Estate Tax Rates
- 12% top rate is lowest among estate tax states
- Less aggressive than MA or WA
- Still requires planning for large estates

### Higher Medicaid Asset Limit
- $10,000 individual limit more generous
- Provides more flexibility

### Seasonal Residents
- Many out-of-state residents have Maine property
- May trigger Maine estate tax on Maine property
- Domicile planning important

### Planning Considerations
- Credit shelter trusts for married couples
- Higher exemption ($7M) means fewer estates affected
- Consider domicile if choosing between ME and no-tax state
- Lower rates reduce urgency but planning still valuable
- Account for seasonal property ownership
`;

const us_estate_planning_analyzer_references_maryland_md = `# Maryland

## Key Differences from Other States
- **Has BOTH state estate tax AND inheritance tax** (only state with both)
- Estate tax exemption $5M
- Inheritance tax 10% flat rate
- Close relatives exempt from inheritance tax
- Common law property state
- Combined tax can be significant

## Estate Tax

### Exemption (2025)
- **$5,000,000** per person
- Not indexed for inflation

### Tax Rate
- **16%** flat rate on taxable estate above exemption

### No Portability
- Maryland does not allow portability
- Credit shelter trusts important for married couples

### Interaction with Inheritance Tax
- Estate tax reduced by inheritance tax paid
- Not taxed twice on same transfer

## Inheritance Tax

### Tax Rate
- **10%** flat rate

### Exempt Beneficiaries (No Inheritance Tax)
- Surviving spouse
- Parents
- Grandparents
- Children (including stepchildren and adopted)
- Siblings
- Lineal descendants
- Spouse of child

### Taxable Beneficiaries (10% Rate)
- All other beneficiaries (nieces, nephews, friends, cousins, etc.)

## Combined Tax Planning
**Only state requiring planning for BOTH taxes**

Example: $6M estate
- To spouse: No estate tax (marital deduction), No inheritance tax
- To children: Subject to estate tax, No inheritance tax  
- To friend: Subject to estate tax AND 10% inheritance tax

## Will Requirements
### Execution Requirements
- Testator must be 18+ years old
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Holographic Wills
- **Not recognized**

## Power of Attorney
- Must be signed, witnessed by **2 adults**, and notarized

## Healthcare Directive
- Must be signed and witnessed by **2 adults**

## Medicaid Planning
### Look-Back Period
- **60 months** (5 years)

### Asset Limits
- Individual: $2,500
- Married: CSRA up to federal maximum

## Homestead Protection
- No general homestead exemption
- Tenancy by entireties provides some protection

## Planning Considerations
- **Both taxes apply** - comprehensive planning essential
- Structure bequests to exempt beneficiaries when possible
- Credit shelter trusts critical (no portability)
- ILIT for life insurance to avoid both taxes
- Consider lifetime gifts to non-exempt beneficiaries
`;

const us_estate_planning_analyzer_references_massachusetts_md = `# Massachusetts

## Key Differences from Other States
- **Has state estate tax** (exemption $2M - one of lowest)
- **Cliff effect** - entire estate taxed once threshold exceeded
- No state inheritance tax
- Common law property state
- No portability for state estate tax

## Estate Tax

### Exemption (2025)
- **$2,000,000** per person
- One of lowest thresholds in nation (tied with Oregon for lowest)
- Not indexed for inflation

### CLIFF EFFECT - CRITICAL
- **Once estate exceeds $2M, ENTIRE estate is taxed**
- Not just the excess over $2M
- Estate of $1,999,999 = $0 MA tax
- Estate of $2,000,001 = ~$99,600 MA tax
- Creates significant planning incentive to stay below threshold

### Tax Rates
- Graduated rates from 0.8% to 16%
- Based on federal credit for state death taxes table
- Rates increase with estate size

### Credit Against Tax
- $99,600 credit available (effective 2023)
- Reduces but does not eliminate cliff effect

### No Portability
- Cannot use deceased spouse's unused exemption
- Credit shelter trusts essential for married couples

## Will Requirements
**Statutory Basis**: MGL Chapter 190B (Uniform Probate Code)

### Execution Requirements
- Testator must be 18+ years old
- Must be of sound mind
- Must be in writing
- Must be signed by testator
- Must be signed by at least **2 witnesses**
- Witnesses must sign within reasonable time after testator

### Self-Proving Affidavit
- Available under MGL c. 190B, § 2-504
- Strongly recommended

### Holographic Wills
- **Not recognized** in Massachusetts

## Trust Requirements
- Must be in writing
- Must have identifiable trust property
- Must have ascertainable beneficiaries

## Power of Attorney
**Statutory Basis**: MGL c. 190B, Article V

### Requirements
- Must be signed by principal
- Must be witnessed by **2 disinterested witnesses**
- Must be notarized
- Durability language required

## Healthcare Proxy
**Statutory Basis**: MGL Chapter 201D

### Requirements
- Must be signed by principal
- Must be witnessed by **2 adults**
- Witnesses cannot be healthcare agent or provider

## Medicaid Planning (MassHealth)

### Look-Back Period
- **60 months** (5 years)

### Asset Limits (2025)
- Individual: $2,000
- Married: CSRA up to federal maximum (~$154,140)

### Irrevocable Trust Requirements
- Must be truly irrevocable
- Grantor cannot access principal
- 5+ years before MassHealth application

## Homestead Protection
### Automatic Homestead
- $125,000 protection automatic

### Declared Homestead
- Up to $500,000 protection
- Must be recorded at Registry of Deeds

## Planning Strategies

### Avoiding the Cliff
- Lifetime gifting to reduce estate below $2M
- Irrevocable life insurance trust (ILIT)
- Charitable giving
- Credit shelter trust for married couples

### Credit Shelter Trust
- Essential for married couples
- Preserves each spouse's $2M exemption
- No portability makes this critical

### Tax Calculation Example
Estate: $3,000,000
- MA estate tax: ~$182,000
- Effective rate: ~6%

With proper planning (gifts reduce to $1.9M):
- MA estate tax: $0
- Savings: $182,000

## Unique State Features
- **Cliff effect creates urgency** for estates near $2M
- Low threshold affects many middle-class families
- Real estate values in Greater Boston push many over threshold
- Credit shelter trusts more important than most states
- Consider domicile change for very large estates
`;

const us_estate_planning_analyzer_references_michigan_md = `# Michigan

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Lady Bird Deed available
- Homestead exemption with unique features

## Will Requirements
### Execution Requirements
- Testator must be 18+ years old
- Must be signed by testator
- Must be signed by at least **2 witnesses**

### Holographic Wills
- **Recognized** if material provisions in testator's handwriting and signed

## Power of Attorney
- Must be signed and witnessed or notarized
- Statutory form available

## Healthcare Directive
- Patient Advocate Designation
- Must be signed and witnessed by **2 adults**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Lady Bird Deed (Enhanced Life Estate)
- Retains full control during lifetime
- Transfers property at death without probate
- Does not trigger Medicaid transfer penalty

## Homestead Protection
- Up to $40,475 (indexed)
- Must be primary residence

## Unique Features
- Lady Bird Deed widely used
- No state death taxes
- Efficient probate alternatives available
`;

const us_estate_planning_analyzer_references_minnesota_md = `# Minnesota

## Key Differences from Other States
- **Has state estate tax** (exemption $3M)
- Has state gift tax (limited)
- No state inheritance tax
- Common law property state
- No portability

## Estate Tax

### Exemption (2025)
- **$3,000,000** per person
- Not indexed for inflation

### Tax Rates
- Graduated rates from 13% to **16%**

### No Portability
- Credit shelter trusts recommended

## Gift Tax
- Minnesota may tax certain gifts made within 3 years of death
- Added to estate for tax calculation

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **Has state estate tax** ($3M exemption)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $3,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $480,000 (or 160 acres rural)
- Strong protection

## Planning Considerations
- Credit shelter trusts essential
- $3M threshold lower than federal
- Consider lifetime gifting
- Account for 3-year gift add-back
`;

const us_estate_planning_analyzer_references_mississippi_md = `# Mississippi

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Homestead exemption with unique features

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**
- Witnesses must sign in testator's presence

### Holographic Wills
- **Recognized** if entirely in testator's handwriting

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $4,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $75,000 and 160 acres
- Must be head of family

## Unique Features
- Higher Medicaid asset limit ($4,000)
- No state death taxes
- Lower cost of living affects planning
`;

const us_estate_planning_analyzer_references_missouri_md = `# Missouri

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Beneficiary Deed available
- Lady Bird Deed available

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning (MO HealthNet)
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $5,000 (higher than most)
- Married: CSRA up to federal maximum

## Beneficiary Deed
- Transfer on death deed available
- Revocable during lifetime
- Avoids probate

## Homestead Protection
- Up to $15,000 (limited)
- Must be head of family

## Unique Features
- Higher Medicaid asset limit ($5,000)
- Beneficiary deeds widely used
- No state death taxes
`;

const us_estate_planning_analyzer_references_montana_md = `# Montana

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Transfer on Death Deed available
- Strong homestead protection

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $350,000
- Strong protection
- Must be primary residence

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Unique Features
- Strong homestead exemption
- Agricultural estate planning important
- No state death taxes
`;

const us_estate_planning_analyzer_references_nebraska_md = `# Nebraska

## Key Differences from Other States
- No state estate tax
- **Has state inheritance tax** (top rate 18%)
- Common law property state
- Highest inheritance tax rate in nation
- County inheritance tax (collected by counties)

## Inheritance Tax

### Tax Structure
- Tax on beneficiaries based on relationship
- Collected by county, not state
- Three classes with different rates

### Class 1 (Immediate Family)
- Spouse, children, parents, grandparents, siblings, grandchildren
- **1%** on amounts over $100,000 exemption

### Class 2 (Remote Relatives)
- Aunts, uncles, nieces, nephews, their descendants
- **11%** on amounts over $40,000 exemption

### Class 3 (All Others)
- Friends, cousins, non-relatives
- **18%** on amounts over $25,000 exemption
- **Highest inheritance tax rate in US**

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **Has state inheritance tax** (rates above)

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $4,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $60,000 or 160 acres
- Must be head of household

## Planning Considerations
- **18% rate for Class 3 is highest in US**
- Structure bequests to lower-rate classes
- Use trusts for distant relatives
- Consider charitable giving for Class 3 beneficiaries
- Immediate family pays only 1%
`;

const us_estate_planning_analyzer_references_nevada_md = `# Nevada

## Key Differences from Other States
- **Community property state**
- No state estate tax
- No state inheritance tax
- **No state income tax**
- Strong asset protection trust laws
- Dynasty trusts permitted
- Popular for trust situs

## Community Property Rules
- All property acquired during marriage is community property
- Separate property: before marriage, gifts, inheritance
- Full step-up in basis at first spouse's death
- Each spouse owns 50%

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- **No state income tax**

## Asset Protection Trusts
- Self-settled spendthrift trusts allowed
- 2-year fraudulent transfer lookback
- Must have Nevada trustee

## Dynasty Trusts
- 365-year rule against perpetuities
- Essentially allows perpetual trusts
- Popular for multi-generational planning

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $605,000
- Must be primary residence
- Very strong protection

## Planning Considerations
- Community property provides basis step-up
- No state taxes makes Nevada attractive
- Consider Nevada trust situs for asset protection
- Dynasty trusts for multi-generational wealth
- Strong homestead adds creditor protection
`;

const us_estate_planning_analyzer_references_new_hampshire_md = `# New Hampshire

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- **No state income tax** (except interest/dividends, phasing out)
- Common law property state
- No sales tax

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses** (must be "credible")
- Witnesses sign in testator's presence

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Income Tax Note
- Interest and dividends tax being phased out
- Fully eliminated by 2027
- Will have no broad-based income tax

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,500
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $120,000
- Must be primary residence

## Unique Features
- Tax-friendly state (no income, sales, estate tax)
- Popular retirement destination
- Domicile planning attractive
- Border with MA creates planning opportunities
`;

const us_estate_planning_analyzer_references_new_jersey_md = `# New Jersey

## Key Differences from Other States
- No state estate tax (repealed 2018)
- **Has state inheritance tax** (top rate 16%)
- Common law property state
- Class-based inheritance tax system
- Close relatives exempt

## Inheritance Tax

### Tax Structure
- Tax on beneficiaries based on relationship
- Four classes (A, C, D, E - no Class B)

### Class A (Exempt)
- Spouse, domestic partner
- Children, stepchildren, adopted children
- Parents, grandparents
- Grandchildren, great-grandchildren
- **No inheritance tax**

### Class C
- Siblings
- Son-in-law, daughter-in-law
- **11-16%** on amounts over $25,000

### Class D
- All others not in A, C, or E
- **15-16%** on amounts over $0 (no exemption)

### Class E
- Charities, religious, educational organizations
- **Exempt**

### Class C Rates
| Amount | Rate |
|--------|------|
| $0-$25,000 | Exempt |
| $25,000-$1.1M | 11% |
| $1.1M-$1.4M | 13% |
| $1.4M-$1.7M | 14% |
| Over $1.7M | 16% |

### Class D Rates
| Amount | Rate |
|--------|------|
| $0-$700,000 | 15% |
| Over $700,000 | 16% |

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax** (repealed January 1, 2018)
- **Has state inheritance tax** (rates above)

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- No homestead exemption
- Very limited creditor protection for home

## Planning Considerations
- **Class D has no exemption** - plan carefully for non-relatives
- Siblings (Class C) have better treatment than friends
- Use trusts to benefit Class D beneficiaries
- Life insurance owned by beneficiary avoids tax
- Charities are exempt (Class E)
- No estate tax since 2018
`;

const us_estate_planning_analyzer_references_new_mexico_md = `# New Mexico

## Key Differences from Other States
- **Community property state**
- No state estate tax
- No state inheritance tax
- Full step-up in basis for community property
- Transfer on Death Deed available

## Community Property Rules
- All property acquired during marriage is community property
- Separate property: before marriage, gifts, inheritance
- Income from separate property is **community property** (civil law rule)
- Full step-up in basis at first spouse's death

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $60,000
- Must be head of household
- Moderate protection

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Planning Considerations
- Community property provides basis step-up
- Income from separate property becomes community
- No state death taxes simplifies planning
- Consider community property trust for clarity
`;

const us_estate_planning_analyzer_references_new_york_md = `# New York

## Key Differences from Other States
- **Has state estate tax** (exemption ~$7.16M in 2025)
- **Cliff effect at 105%** of exemption
- No state inheritance tax
- Common law property state
- No portability
- 3-year gift add-back rule

## Estate Tax

### Exemption (2025)
- **$7,160,000** per person
- Indexed for inflation

### CLIFF EFFECT - CRITICAL
- If taxable estate exceeds **105%** of exemption (~$7.52M), exemption is completely lost
- Entire estate taxed from dollar one
- More gradual than MA cliff but still significant

### Tax Rates
- Graduated rates from 3.06% to **16%**

### 3-Year Gift Add-Back
- Taxable gifts made within 3 years of death added back to NY estate
- Different from federal rule
- Affects deathbed planning

### No Portability
- Credit shelter trusts important for married couples

## Will Requirements
- Testator must be 18+
- Signed at end of will
- Signed by **2 witnesses** within 30 days
- Witnesses must sign in presence of each other

### Holographic Wills
- **Not recognized** (except military)

### Strict Compliance
- NY courts strictly interpret will requirements
- Minor defects can invalidate

## Estate and Inheritance Tax
- **Has state estate tax** (~$7.16M exemption)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months** for nursing home
- **No look-back** for Community Medicaid (changes pending)

### Asset Limits
- Individual: ~$31,175 (higher for community Medicaid)
- Married: CSRA up to federal maximum

## Homestead Protection
- Varies by county ($75,000-$300,000)
- NYC and suburbs: $300,000
- Limited protection compared to some states

## Unique Features
- **Cliff effect** at 105% creates planning urgency
- 3-year gift add-back is unusual
- No Community Medicaid look-back (for now)
- Credit shelter trusts essential
- Higher exemption than MA but cliff still applies

## Planning Considerations
- Stay below 105% of exemption to avoid cliff
- Account for 3-year gift add-back
- Credit shelter trusts for married couples
- ILIT for life insurance
- Consider domicile change for very large estates
- Strict will execution requirements
`;

const us_estate_planning_analyzer_references_north_carolina_md = `# North Carolina

## Key Differences from Other States
- No state estate tax (repealed 2013)
- No state inheritance tax
- Common law property state
- Elective share protections for spouse

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**
- Testator must sign or acknowledge in presence of witnesses

### Holographic Wills
- **Recognized** if entirely in testator's handwriting

## Estate and Inheritance Tax
- **No state estate tax** (repealed July 1, 2013)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $35,000 ($60,000 if 65+)
- Limited protection

## Elective Share
- Surviving spouse can claim portion of estate
- Based on length of marriage
- Cannot be completely disinherited

## Unique Features
- No state death taxes since 2013
- Popular retirement destination
- Moderate cost of living
- Elective share protects surviving spouse
`;

const us_estate_planning_analyzer_references_north_dakota_md = `# North Dakota

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Transfer on Death Deed available
- Strong homestead protection

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $3,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $150,000
- Strong protection for homestead

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Unique Features
- Higher Medicaid asset limit ($3,000)
- Strong homestead exemption
- Agricultural estate planning important
- No state death taxes
`;

const us_estate_planning_analyzer_references_ohio_md = `# Ohio

## Key Differences from Other States
- No state estate tax (repealed 2013)
- No state inheritance tax
- Common law property state
- Transfer on Death Deed available
- Transfer on Death Affidavit for vehicles

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**
- Witnesses must sign in presence of testator

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax** (repealed January 1, 2013)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $145,425 (indexed)
- Must be primary residence

## Transfer on Death Deed
- Available for real property
- Called Transfer on Death Designation Affidavit
- Avoids probate

## Unique Features
- No state death taxes since 2013
- Transfer on Death tools widely used
- Moderate homestead exemption
- Industrial and agricultural economy affects planning
`;

const us_estate_planning_analyzer_references_oklahoma_md = `# Oklahoma

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Transfer on Death Deed available
- Unlimited homestead protection

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- **Unlimited value** for up to 1 acre urban or 160 acres rural
- Very strong protection (similar to Texas/Florida)

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Unique Features
- Unlimited homestead value (very strong protection)
- No state death taxes
- Oil/gas mineral rights planning important
- Agricultural estate planning common
`;

const us_estate_planning_analyzer_references_oregon_md = `# Oregon

## Key Differences from Other States
- **Has state estate tax** (exemption $1M - LOWEST in nation)
- No state inheritance tax
- Common law property state
- No portability
- No sales tax

## Estate Tax

### Exemption (2025)
- **$1,000,000** per person
- **Lowest threshold in US** (tied with MA for lowest)
- Not indexed for inflation

### Tax Rates
- Graduated rates from 10% to **16%**

### No Cliff Effect
- Unlike MA, only excess over $1M is taxed
- But low threshold affects many estates

### No Portability
- Credit shelter trusts essential for married couples

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **Has state estate tax** ($1M exemption)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $40,000 ($50,000 for 2 owners)
- Limited protection
- Some exemptions for 65+

## No Sales Tax
- No state sales tax
- Affects overall tax burden

## Planning Considerations
- **$1M threshold is very low** - many middle-class estates affected
- Real estate appreciation pushes estates over limit
- Credit shelter trusts critical for married couples
- Aggressive lifetime gifting may be warranted
- ILIT for life insurance
- Consider domicile change for large estates
- No sales tax partially offsets estate tax burden
`;

const us_estate_planning_analyzer_references_pennsylvania_md = `# Pennsylvania

## Key Differences from Other States
- No state estate tax
- **Has state inheritance tax** (rates vary by class)
- Common law property state
- Relatively high inheritance tax rates for non-spouse
- Spouse completely exempt

## Inheritance Tax

### Tax Structure
- Flat rates based on relationship
- No exemption amounts (tax from first dollar for non-spouse)

### Tax Rates by Beneficiary Class

| Beneficiary | Rate |
|-------------|------|
| Surviving spouse | **0%** (fully exempt) |
| Children, grandchildren, parents | **4.5%** |
| Siblings | **12%** |
| All others | **15%** |

### Key Points
- **Spouse pays nothing**
- Lineal descendants pay 4.5%
- Siblings pay 12%
- Friends, nieces/nephews, others pay 15%
- No threshold - tax applies from first dollar (except spouse)

### Calculation
- Based on fair market value of inheritance
- Paid by estate before distribution
- Due within 9 months of death (5% discount if paid within 3 months)

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **Has state inheritance tax** (rates above)

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,400 (slightly higher)
- Married: CSRA up to federal maximum

### Pennsylvania Exception
- PA allows $500/month gifting without penalty
- Unique exception to federal rules

## Homestead Protection
- **No homestead exemption** in Pennsylvania
- One of few states without homestead protection
- Tenancy by entireties provides some protection

## Unique Features
- **No homestead protection** - major planning consideration
- 5% discount for early payment of inheritance tax
- Spousal exemption is complete
- Lineal descendants have low 4.5% rate
- PA allows small monthly gifts for Medicaid

## Planning Considerations
- Maximize bequests to spouse (0% rate)
- Lineal descendants preferable to siblings
- Consider trusts for higher-rate beneficiaries
- Life insurance owned by beneficiary avoids tax
- No homestead - consider other asset protection
- Take advantage of 5% early payment discount
- PA gift exception for Medicaid planning
`;

const us_estate_planning_analyzer_references_rhode_island_md = `# Rhode Island

## Key Differences from Other States
- **Has state estate tax** (exemption ~$1.8M)
- No state inheritance tax
- Common law property state
- Exemption indexed for inflation
- Cliff effect similar to MA

## Estate Tax

### Exemption (2025)
- **$1,802,431** per person
- Indexed for inflation (CPI-U)

### CLIFF EFFECT
- Entire estate taxed once threshold exceeded
- Similar to Massachusetts approach

### Tax Rates
- Graduated rates using federal credit table
- Top rate: **16%**

### No Portability
- Credit shelter trusts recommended

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **Has state estate tax** (~$1.8M exemption)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $4,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $500,000
- Must be primary residence
- Strong protection

## Unique Features
- Inflation-indexed exemption (rare)
- Cliff effect creates planning urgency
- Higher Medicaid asset limit ($4,000)
- Strong homestead exemption
- Small state with proximity to MA

## Planning Considerations
- Low threshold affects many estates
- Credit shelter trusts essential
- Consider lifetime gifting to stay below exemption
- Cliff effect means small amount over triggers full tax
`;

const us_estate_planning_analyzer_references_south_carolina_md = `# South Carolina

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- No state income tax on Social Security

## Will Requirements
- Testator must be 18+
- Signed by testator and **3 witnesses** (unusual - most states require 2)

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA lower than federal max (~$66,480)

## Homestead Protection
- Up to $66,075 (indexed)
- Must be head of household

## Unique Features
- **Requires 3 witnesses** for wills (unusual)
- No state death taxes
- Popular retirement destination
- Lower CSRA for Medicaid than most states
- Tax-friendly for retirees
`;

const us_estate_planning_analyzer_references_south_dakota_md = `# South Dakota

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- **No state income tax**
- Common law property state (but opt-in community property trust available)
- **Premier trust jurisdiction** - dynasty trusts, asset protection
- No rule against perpetuities

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- **No state income tax**

## Community Property Trust
- Opt-in community property trust available
- Provides double step-up in basis
- Must meet statutory requirements

## Dynasty Trusts
- **No rule against perpetuities**
- Trusts can last forever
- Popular for multi-generational wealth

## Asset Protection Trusts
- Self-settled spendthrift trusts allowed
- Strong creditor protection
- 2-year fraudulent transfer lookback

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Unlimited value for up to 1 acre urban or 160 acres rural
- Very strong protection

## Unique Features
- **Premier trust jurisdiction** - consider SD situs even for non-residents
- No state income tax on trust income
- Dynasty trusts for perpetual wealth transfer
- Asset protection trusts available
- Community property trust for basis step-up
- Unlimited homestead value

## Planning Considerations
- Consider South Dakota trust situs for:
  - Dynasty trusts (no perpetuities)
  - Asset protection trusts
  - No state income tax on trust income
- Community property trust for married couples
- Strong homestead protection
`;

const us_estate_planning_analyzer_references_tennessee_md = `# Tennessee

## Key Differences from Other States
- No state estate tax (repealed 2016)
- No state inheritance tax (repealed 2016)
- **No state income tax** (Hall Tax repealed 2021)
- Common law property state (but opt-in community property trust available)
- Strong asset protection trust laws

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax** (repealed January 1, 2016)
- **No state inheritance tax** (repealed)
- **No state income tax**

## Community Property Trust
- Opt-in community property trust available
- Provides double step-up in basis
- Tennessee Community Property Trust Act (2010)

## Asset Protection Trusts
- Tennessee Investment Services Trust Act
- Self-settled spendthrift trusts allowed
- Strong creditor protection

## Medicaid Planning (TennCare)
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $5,000 (very limited)
- Up to $7,500 for joint owners
- One of lowest in nation

## Unique Features
- **No state death taxes** since 2016
- **No state income tax** since 2021
- Very tax-friendly state
- Community property trust available
- Asset protection trusts available
- Very low homestead protection - consider other strategies

## Planning Considerations
- Tax-friendly domicile for wealthy individuals
- Community property trust for step-up in basis
- Limited homestead - use trusts for asset protection
- Consider Tennessee trust situs for asset protection
`;

const us_estate_planning_analyzer_references_texas_md = `# Texas

## Key Differences from Other States
- **Community property state**
- No state estate tax
- No state inheritance tax
- **No state income tax**
- **Strongest homestead protection** (unlimited value, 10/200 acres)
- Independent administration widely used

## Community Property Rules

### Classification
- All property acquired during marriage is community property
- Separate property: before marriage, gifts, inheritance
- Income from separate property is **community property**
- Full step-up in basis at first spouse's death

### Estate Planning Implications
- Each spouse owns 50% of community property
- Full step-up in basis for both halves at first death
- Each spouse can dispose of their 50% by will

### Marital Property Agreements
- Spouses can agree to convert community to separate (and vice versa)
- Must be in writing and signed by both spouses

## Will Requirements
- Testator must be 18+ (or married, or in military)
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized** if entirely in testator's handwriting

### Self-Proved Will
- Affidavit attached makes will self-proved
- Strongly recommended

## Estate and Inheritance Tax
- **No state estate tax** (constitutionally prohibited)
- **No state inheritance tax**
- **No state income tax** (constitutionally prohibited)

## Independent Administration
- Texas strongly favors independent administration
- Minimal court supervision
- Will should specifically authorize
- Much simpler than dependent administration

## Medicaid Planning (Texas Medicaid)
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
**Texas Constitution Article XVI**

### Exemption
- **Unlimited value**
- Urban: Up to 10 acres
- Rural: Up to 200 acres (100 for single adult)
- Among strongest protections in US

### Protections
- Cannot be forced to sell for most debts
- Survives death for surviving spouse and minor children
- Protected from most creditors

## Lady Bird Deed (Transfer on Death Deed)
- Enhanced life estate deed
- Retains full control during lifetime
- Avoids probate
- Does not trigger Medicaid transfer penalty

## Unique State Features

### Tax Advantages
- No state income tax
- No state estate tax
- No state inheritance tax
- Property tax can be high but no death taxes

### Community Property Benefits
- Full step-up in basis on both halves at first death
- Significant income tax savings

### Homestead
- Strongest in nation (with Florida)
- Unlimited value protection
- Major creditor protection

### Independent Administration
- Will should always authorize
- Avoids court supervision
- Much more efficient

## Planning Considerations
- Community property provides automatic step-up
- Homestead is major asset protection tool
- Lady Bird deeds for real property transfer
- Independent administration in every will
- No state tax planning needed (focus on federal)
- Consider Texas domicile for tax benefits
`;

const us_estate_planning_analyzer_references_utah_md = `# Utah

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Transfer on Death Deed available
- Informal probate available

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $45,800 (indexed)
- Must be primary residence

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Unique Features
- No state death taxes
- Informal probate available (UPC state)
- Moderate homestead exemption
- LDS Church influence on estate planning culture
`;

const us_estate_planning_analyzer_references_vermont_md = `# Vermont

## Key Differences from Other States
- **Has state estate tax** (exemption $5M)
- No state inheritance tax
- Common law property state
- Flat 16% rate (no graduated brackets)

## Estate Tax

### Exemption (2025)
- **$5,000,000** per person
- Not indexed for inflation

### Tax Rate
- **16% flat rate** on taxable estate above exemption
- No graduated brackets
- Simpler calculation than some states

### No Portability
- Credit shelter trusts recommended for married couples

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses** (at least 3 recommended)

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **Has state estate tax** ($5M exemption)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $125,000
- Must be primary residence

## Unique Features
- Flat 16% rate simplifies calculations
- $5M exemption is moderate
- Credit shelter trusts important
- Rural state with agricultural planning needs
- Second home planning for out-of-state owners
`;

const us_estate_planning_analyzer_references_virginia_md = `# Virginia

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Transfer on Death Deed available
- Elective share for surviving spouse

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**
- Witnesses sign in testator's presence

### Holographic Wills
- **Recognized** if entirely in testator's handwriting

## Estate and Inheritance Tax
- **No state estate tax** (repealed 2007)
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $25,000 (very limited)
- Additional exemption for veterans

## Transfer on Death Deed
- Available for real property (since 2013)
- Revocable during lifetime
- Avoids probate

## Elective Share
- Surviving spouse can elect against will
- Generally 1/3 to 1/2 of estate depending on children
- Cannot completely disinherit spouse

## Unique Features
- No state death taxes
- Very limited homestead protection
- Transfer on Death Deeds available
- DC/MD/VA tri-state planning considerations
- Elective share protects surviving spouse
`;

const us_estate_planning_analyzer_references_washington_dc_md = `# Washington DC (District of Columbia)

## Key Differences from Other States
- **Has estate tax** (exemption ~$4.87M)
- No inheritance tax
- Common law jurisdiction
- Exemption indexed for inflation

## Estate Tax

### Exemption (2025)
- **$4,873,200** per person
- Indexed for inflation (cost-of-living adjustment)

### Tax Rate
- **16%** flat rate on taxable estate above exemption

### No Portability
- Credit shelter trusts recommended

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**
- Witnesses sign in testator's presence

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **Has estate tax** (~$4.87M exemption)
- **No inheritance tax**

## Medicaid Planning (DC Medicaid)
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $4,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Very limited
- Some exemptions available

## Unique Features
- Exemption indexed for inflation (increases annually)
- Moderate threshold ($4.87M)
- 16% flat rate
- High cost of living
- Federal employees domicile considerations
- MD/VA/DC tri-state planning

## Planning Considerations
- Determine true domicile (DC vs. MD vs. VA)
- Credit shelter trusts for married couples
- Higher exemption than MD but lower than some states
- Federal employee benefits planning
`;

const us_estate_planning_analyzer_references_washington_md = `# Washington

## Key Differences from Other States
- **Community property state**
- **Has state estate tax** (exemption ~$2.193M, highest top rate 20%)
- No state inheritance tax
- **No state income tax**
- Highest estate tax rates in nation (10-20%)

## Estate Tax

### Exemption (2025)
- **$2,193,000** per person (indexed)
- Increased to $3,000,000 effective July 1, 2025

### Tax Rates
- Graduated rates from **10% to 20%**
- **Highest top rate in US** (increased from 20% in 2025)

### Estate Tax Brackets (as of July 2025)
| Taxable Amount | Rate |
|----------------|------|
| $0 - $1M | 10% |
| $1M - $2M | 14% |
| $2M - $3M | 15% |
| $3M - $4M | 16% |
| $4M - $6M | 18% |
| $6M - $7M | 19% |
| $7M - $9M | 19.5% |
| Over $9M | 20% |

### No Portability
- Credit shelter trusts important

### QFOBI Deduction
- Qualified Family-Owned Business Interest deduction
- Can reduce taxable estate for family businesses

## Community Property Rules
- All property acquired during marriage is community property
- Separate property: before marriage, gifts, inheritance
- Full step-up in basis at first spouse's death
- Each spouse owns 50%

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **Has state estate tax** (~$2.193M-$3M exemption)
- **No state inheritance tax**
- **No state income tax**

## Medicaid Planning (Apple Health)
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $125,000
- Must be primary residence
- Limited compared to some states

## Unique Features
- **Highest estate tax rates** (20% top rate)
- Community property provides basis step-up
- No state income tax offsets estate tax burden
- QFOBI deduction for family businesses
- Credit shelter trusts essential for married couples
- High-value real estate in Seattle area pushes estates over threshold

## Planning Considerations
- **Aggressive planning warranted** due to high rates
- Credit shelter trusts critical
- Lifetime gifting to reduce estate
- ILIT for life insurance
- QFOBI deduction for business owners
- Community property provides automatic step-up
- Consider domicile change for very large estates
`;

const us_estate_planning_analyzer_references_west_virginia_md = `# West Virginia

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- Common law property state
- Transfer on Death Deed available

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $35,000
- Must be head of household

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Unique Features
- No state death taxes
- Holographic wills recognized
- Moderate homestead exemption
- Lower cost of living
`;

const us_estate_planning_analyzer_references_wisconsin_md = `# Wisconsin

## Key Differences from Other States
- **Community property state** (Marital Property Act)
- No state estate tax
- No state inheritance tax
- Only midwestern community property state
- Transfer on Death Deed available

## Community Property Rules (Marital Property)

### Wisconsin Marital Property Act (1986)
- Called "marital property" rather than community property
- Based on Uniform Marital Property Act
- All property acquired during marriage is marital property

### Classification
- Marital property: acquired during marriage
- Individual property: before marriage, gifts, inheritance
- Full step-up in basis at first spouse's death
- Each spouse owns 50%

### Estate Planning Implications
- Community property benefits for step-up in basis
- Each spouse can dispose of their 50% by will
- Marital property agreement can modify rules

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Not recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**

## Medicaid Planning (Wisconsin Medicaid/BadgerCare)
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $75,000
- Must be primary residence

## Transfer on Death Deed
- Available for real property
- Avoids probate

## Unique Features
- **Only midwestern community property state**
- Called "marital property" but functions as community property
- Full step-up in basis benefits
- No state death taxes
- Marital property agreements can customize rules

## Planning Considerations
- Community/marital property provides automatic step-up
- Couples moving from common law states should understand change
- Marital property agreements for customization
- No state death tax planning needed
`;

const us_estate_planning_analyzer_references_wyoming_md = `# Wyoming

## Key Differences from Other States
- No state estate tax
- No state inheritance tax
- **No state income tax**
- Common law property state
- Strong asset protection trust laws
- Dynasty trusts permitted
- Very favorable trust jurisdiction

## Will Requirements
- Testator must be 18+
- Signed by testator and **2 witnesses**

### Holographic Wills
- **Recognized**

## Estate and Inheritance Tax
- **No state estate tax**
- **No state inheritance tax**
- **No state income tax**

## Asset Protection Trusts
- Self-settled spendthrift trusts allowed
- Creditor protection available
- Wyoming Qualified Spendthrift Trust

## Dynasty Trusts
- 1,000-year rule against perpetuities
- Essentially allows perpetual trusts
- Favorable for multi-generational wealth

## Medicaid Planning
### Look-Back Period
- **60 months**

### Asset Limits
- Individual: $2,000
- Married: CSRA up to federal maximum

## Homestead Protection
- Up to $40,000
- Limited protection

## Unique Features
- **No state income tax**
- **No state death taxes**
- Favorable trust laws
- Asset protection trusts available
- Near-perpetual dynasty trusts (1,000 years)
- Low population, ranching/agricultural economy

## Planning Considerations
- Consider Wyoming trust situs for:
  - Dynasty trusts
  - Asset protection trusts
  - No state income tax on trust income
- Tax-friendly domicile
- Agricultural estate planning important
`;

export const skills: Skill[] = [
  {
    name: "estate-document-analyzer",
    files: [
      { path: "SKILL.md", content: estate_document_analyzer_SKILL_md },
      { path: "references/document-types.md", content: estate_document_analyzer_references_document_types_md },
      { path: "references/legal-glossary.md", content: estate_document_analyzer_references_legal_glossary_md },
      { path: "references/summary-template.md", content: estate_document_analyzer_references_summary_template_md },
      { path: "scripts/ocr_processor.py", content: estate_document_analyzer_scripts_ocr_processor_py },
    ],
  },
  {
    name: "estate-goals-profiler",
    files: [
      { path: "SKILL.md", content: estate_goals_profiler_SKILL_md },
      { path: "references/goals-template.md", content: estate_goals_profiler_references_goals_template_md },
      { path: "references/topic-questions.md", content: estate_goals_profiler_references_topic_questions_md },
    ],
  },
  {
    name: "financial-profile-classifier",
    files: [
      { path: "SKILL.md", content: financial_profile_classifier_SKILL_md },
      { path: "references/thresholds.md", content: financial_profile_classifier_references_thresholds_md },
    ],
  },
  {
    name: "us-estate-planning-analyzer",
    files: [
      { path: "SKILL.md", content: us_estate_planning_analyzer_SKILL_md },
      { path: "references/alabama.md", content: us_estate_planning_analyzer_references_alabama_md },
      { path: "references/alaska.md", content: us_estate_planning_analyzer_references_alaska_md },
      { path: "references/arizona.md", content: us_estate_planning_analyzer_references_arizona_md },
      { path: "references/arkansas.md", content: us_estate_planning_analyzer_references_arkansas_md },
      { path: "references/california.md", content: us_estate_planning_analyzer_references_california_md },
      { path: "references/colorado.md", content: us_estate_planning_analyzer_references_colorado_md },
      { path: "references/connecticut.md", content: us_estate_planning_analyzer_references_connecticut_md },
      { path: "references/delaware.md", content: us_estate_planning_analyzer_references_delaware_md },
      { path: "references/florida.md", content: us_estate_planning_analyzer_references_florida_md },
      { path: "references/georgia.md", content: us_estate_planning_analyzer_references_georgia_md },
      { path: "references/hawaii.md", content: us_estate_planning_analyzer_references_hawaii_md },
      { path: "references/idaho.md", content: us_estate_planning_analyzer_references_idaho_md },
      { path: "references/illinois.md", content: us_estate_planning_analyzer_references_illinois_md },
      { path: "references/indiana.md", content: us_estate_planning_analyzer_references_indiana_md },
      { path: "references/iowa.md", content: us_estate_planning_analyzer_references_iowa_md },
      { path: "references/kansas.md", content: us_estate_planning_analyzer_references_kansas_md },
      { path: "references/kentucky.md", content: us_estate_planning_analyzer_references_kentucky_md },
      { path: "references/louisiana.md", content: us_estate_planning_analyzer_references_louisiana_md },
      { path: "references/maine.md", content: us_estate_planning_analyzer_references_maine_md },
      { path: "references/maryland.md", content: us_estate_planning_analyzer_references_maryland_md },
      { path: "references/massachusetts.md", content: us_estate_planning_analyzer_references_massachusetts_md },
      { path: "references/michigan.md", content: us_estate_planning_analyzer_references_michigan_md },
      { path: "references/minnesota.md", content: us_estate_planning_analyzer_references_minnesota_md },
      { path: "references/mississippi.md", content: us_estate_planning_analyzer_references_mississippi_md },
      { path: "references/missouri.md", content: us_estate_planning_analyzer_references_missouri_md },
      { path: "references/montana.md", content: us_estate_planning_analyzer_references_montana_md },
      { path: "references/nebraska.md", content: us_estate_planning_analyzer_references_nebraska_md },
      { path: "references/nevada.md", content: us_estate_planning_analyzer_references_nevada_md },
      { path: "references/new-hampshire.md", content: us_estate_planning_analyzer_references_new_hampshire_md },
      { path: "references/new-jersey.md", content: us_estate_planning_analyzer_references_new_jersey_md },
      { path: "references/new-mexico.md", content: us_estate_planning_analyzer_references_new_mexico_md },
      { path: "references/new-york.md", content: us_estate_planning_analyzer_references_new_york_md },
      { path: "references/north-carolina.md", content: us_estate_planning_analyzer_references_north_carolina_md },
      { path: "references/north-dakota.md", content: us_estate_planning_analyzer_references_north_dakota_md },
      { path: "references/ohio.md", content: us_estate_planning_analyzer_references_ohio_md },
      { path: "references/oklahoma.md", content: us_estate_planning_analyzer_references_oklahoma_md },
      { path: "references/oregon.md", content: us_estate_planning_analyzer_references_oregon_md },
      { path: "references/pennsylvania.md", content: us_estate_planning_analyzer_references_pennsylvania_md },
      { path: "references/rhode-island.md", content: us_estate_planning_analyzer_references_rhode_island_md },
      { path: "references/south-carolina.md", content: us_estate_planning_analyzer_references_south_carolina_md },
      { path: "references/south-dakota.md", content: us_estate_planning_analyzer_references_south_dakota_md },
      { path: "references/tennessee.md", content: us_estate_planning_analyzer_references_tennessee_md },
      { path: "references/texas.md", content: us_estate_planning_analyzer_references_texas_md },
      { path: "references/utah.md", content: us_estate_planning_analyzer_references_utah_md },
      { path: "references/vermont.md", content: us_estate_planning_analyzer_references_vermont_md },
      { path: "references/virginia.md", content: us_estate_planning_analyzer_references_virginia_md },
      { path: "references/washington-dc.md", content: us_estate_planning_analyzer_references_washington_dc_md },
      { path: "references/washington.md", content: us_estate_planning_analyzer_references_washington_md },
      { path: "references/west-virginia.md", content: us_estate_planning_analyzer_references_west_virginia_md },
      { path: "references/wisconsin.md", content: us_estate_planning_analyzer_references_wisconsin_md },
      { path: "references/wyoming.md", content: us_estate_planning_analyzer_references_wyoming_md },
    ],
  },
];

/**
 * Get all skill files formatted for writing to sandbox filesystem
 */
export function getSkillFilesForSandbox(baseDir: string = "/home/user/.claude/skills"): Array<{ path: string; content: string }> {
  const files: Array<{ path: string; content: string }> = [];
  
  for (const skill of skills) {
    for (const file of skill.files) {
      files.push({
        path: `${baseDir}/${skill.name}/${file.path}`,
        content: file.content,
      });
    }
  }
  
  return files;
}

/**
 * Get skill names
 */
export function getSkillNames(): string[] {
  return skills.map(s => s.name);
}
