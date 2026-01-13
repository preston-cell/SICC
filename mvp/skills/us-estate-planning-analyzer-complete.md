# US Estate Planning Analyzer - Complete Skill Package

This file contains the complete skill with all reference files.

---

# SKILL FILE

## SKILL.md

---
name: us-estate-planning-analyzer
description: Comprehensive analysis of estate planning documents (wills, trusts, powers of attorney, healthcare proxies, beneficiary designations) for all 50 US states. Analyzes legal compliance, tax optimization (estate and inheritance taxes), Medicaid planning, and document coordination. Supports multi-state analysis for users with assets in multiple states, domicile optimization recommendations, and document validity analysis when users have relocated. Handles community property analysis for 9 states, inheritance tax calculations for 5 states, and state-specific Medicaid planning. Analyzes non-traditional assets (crypto, collectibles, firearms, digital assets). Provides charitable giving strategy recommendations based on donation size. Use when analyzing estate documents for any US state, comparing document versions, identifying compliance issues, optimizing tax strategies, or generating reports. Integrates with companion skills for structured financial data and goal inputs.
---

# US Estate Planning Analyzer (50 States)

Analyze estate planning documents for legal compliance, tax efficiency, Medicaid planning, and goal alignment across all 50 US states. Generate unified reports with estimated dollar impacts, prioritized action items with timeframes, and domicile optimization recommendations.

## Workflow Overview

1. **Identify user type** → Individual, attorney, or paralegal
2. **State identification** → Primary state + states with assets
3. **Marital status** → If divorced/separated indicated, gather details
4. **Non-traditional assets** → Proactively ask about crypto, collectibles, firearms, etc.
5. **Charitable intent** → Ask about charitable giving goals
6. **Web search for current rates** → Verify tax thresholds, Medicaid limits
7. **Document intake** → Receive documents + financial data + goals
8. **Validate documents** → Check readability; request clearer copies if needed
9. **Analyze documents** → Run compliance, tax, Medicaid, multi-state, and charitable analysis
10. **Generate reports** → Deliver unified report with prioritized actions, timeframes, and links
11. **Compare versions** → If revised documents provided, compare old vs. new

## Step 1: User Type Identification

Ask upfront:
> "Are you an individual reviewing your own estate plan, or an attorney/paralegal analyzing client documents?"

Adjust output:
- **Individual**: Explanatory language, avoid jargon, include "questions to ask your attorney"
- **Attorney/Paralegal**: Technical language, statute citations, case law references

## Step 2: State Identification

Ask:
> "Which state is your primary residence (domicile)? Do you own property or have significant assets in other states?"

For multi-state situations: analyze under all relevant states' laws, optimize for tax savings, provide domicile comparison.

## Step 3: Marital Status & Divorce Handling

If documents or user indicate divorce/separation, ask:
> "Have you been married before?"

If yes, ask for divorce date only when relevant to planning. Infer tax filing status from divorce date:
- Divorced in current tax year → Filed jointly previous year, separately this year
- Legally separated → Different treatment than divorced; note state-specific rules

**Key divorce-related analysis:**
- Community vs. separate property characterization (especially if moved between CP/common law states)
- Beneficiary designation cleanup (flag ex-spouses still named)
- QDRO requirements for retirement accounts
- Life insurance ownership/beneficiary changes
- Alimony/support obligations affecting estate

## Step 4: Non-Traditional Assets

Proactively ask:
> "Do you have any of these assets: cryptocurrency, collectibles (art, wine, cars, memorabilia), safe deposit boxes, firearms, precious metals, digital assets (domains, online accounts with value, NFTs), or intellectual property (royalties, patents, copyrights)?"

For each asset type identified:
- **Cryptocurrency**: Include in estate valuation; note access concerns (private keys, seed phrases); distinguish exchange-held vs. self-custody
- **Collectibles**: Accept user's stated valuation; include in estate calculations
- **Safe deposit boxes**: Flag state-specific access rules (see state reference files)
- **Firearms**: Provide ATF transfer guidance AND flag for attorney review due to legal complexity
- **Digital assets**: Note discovery/access planning needs; recommend digital asset inventory
- **Intellectual property**: Include ongoing royalty streams in valuation
- **Precious metals**: Include in estate valuation; note storage location

### Firearms Transfer Guidance
- Federal law prohibits transfer to prohibited persons
- NFA items (suppressors, short-barrel rifles) require ATF Form 5 for estate transfers
- Interstate transfers may require licensed dealer
- Some states require registration/notification upon transfer
- **Always flag for attorney review** given criminal liability risks

## Step 5: Charitable Intent

Ask:
> "Do you plan to leave anything to charity? If so, approximately how much and do you have specific organizations in mind?"

Based on response, recommend appropriate vehicles:

| Donation Amount | Recommended Vehicles |
|-----------------|---------------------|
| Under $25K | Simple bequest in will |
| $25K–$100K | Retirement account beneficiary designation (most tax-efficient), donor-advised fund |
| $100K–$500K | Donor-advised fund, charitable remainder trust, charitable gift annuity |
| $500K+ | Private foundation, charitable lead trust, donor-advised fund |

**Present 2-3 options with trade-offs; let user choose.** If user prefers simple bequest regardless of amount, respect choice without comment.

Analyze both:
- Estate tax charitable deduction
- Lifetime income tax benefits if giving starts during life

For states with charitable incentives, see state reference files.

## Step 6: Web Search for Current Rates

**CRITICAL**: Before analysis, search to verify current rates for relevant state(s):
- State estate/inheritance tax thresholds and rates
- Federal estate tax exemption (~$13.99M for 2025)
- Medicaid asset limits and penalty divisors
- Community Spouse Resource Allowance (CSRA)
- Recent law changes

**For financial institutions not in `references/financial-institutions.md`**: Search web for login URL and include in action items.

## Step 7: Document Intake

Accept: PDF, Word (.docx), scanned images. Request clearer copy if illegible.

Supported document types:
- Wills (including pour-over wills)
- Revocable and irrevocable trusts
- Powers of attorney (financial, healthcare)
- Healthcare proxies / advance directives
- Beneficiary designations (retirement accounts, life insurance)
- Deed transfers and property documents
- Charitable trust documents (CRTs, CLTs, private foundation docs)

**Input from companion skills**: Expect structured JSON with asset values and goals from `financial-profile-classifier` and `estate-goals-profiler`.

**Note**: Companion skills should be updated to collect: marital history details, non-traditional asset inventory, charitable intent/preferences.

## Step 8: Document Analysis

### 8.1 Multi-Document Coordination
- Check for inconsistencies between will and trust provisions
- Verify assets properly titled to fund trusts
- Confirm beneficiary designations align with estate plan intent
- Flag conflicting instructions across documents

### 8.2 DIY vs. Attorney-Drafted Detection
Identify DIY documents (generic templates, missing customization, lack of attorney attestation). Apply more rigorous execution review for DIY documents.

### 8.3 Moved States Detection
If documents drafted in different state than current domicile:
- Check validity under both states' execution requirements
- Flag if re-execution recommended
- For POA/healthcare proxy: Recommend re-executing in new state

### 8.4 Age-Dependent Trust Provisions
When trust provisions depend on beneficiary ages (e.g., "distribute at age 25"):
> "What is [beneficiary name]'s date of birth?"

Calculate trigger dates and include in action timeline.

## Step 9: State-Specific Analysis

Load appropriate state reference file(s) from `references/[state].md`.

### 9.1 Compliance Analysis
Check state-specific requirements for will execution, trust validity, POA requirements, healthcare directives.

### 9.2 Tax Analysis

**Estate Tax States (12 + DC)**: Connecticut, Hawaii, Illinois, Maine, Maryland, Massachusetts, Minnesota, New York, Oregon, Rhode Island, Vermont, Washington, DC

**Inheritance Tax States (5)**: Kentucky, Maryland, Nebraska, New Jersey, Pennsylvania

**No State Estate/Inheritance Tax (33 states)**: Focus on federal planning and asset protection.

### 9.3 Tax Optimization Strategies

Present options by aggressiveness level:
- **Conservative**: Credit shelter trusts, portability elections, annual gift exclusion
- **Moderate**: ILITs, QPRTs, charitable remainder trusts
- **Advanced**: GRATs, dynasty trusts, family limited partnerships, charitable lead trusts

Calculate dollar impact for each recommendation.

### 9.4 Community Property Analysis

**Community Property States**: Arizona, California, Idaho, Louisiana, Nevada, New Mexico, Texas, Washington, Wisconsin

**Opt-in States**: Alaska, Florida, Kentucky, South Dakota, Tennessee

Analyze property characterization, step-up basis advantages, and issues if moved between CP/common law states.

### 9.5 Medicaid Planning

For each relevant state:
- Look-back period (60 months; CA has 30 months)
- Asset limits and countable vs. exempt assets
- Irrevocable trust requirements
- Penalty divisor
- CSRA
- Recent transfers that could trigger penalties

### 9.6 Safe Deposit Box Analysis

Flag based on state-specific rules in reference files:
- Post-death access procedures
- Joint ownership implications
- Inventory requirements
- Items that should NOT be in safe deposit box (original will in some states)

### 9.7 Charitable Giving Analysis

If charitable intent identified:
- Analyze existing charitable provisions in documents
- Calculate estate tax savings from charitable deductions
- Compare efficiency of different vehicles
- For applicable states, calculate state charitable tax incentives

## Step 10: Domicile Optimization

If user has multi-state connections or indicates flexibility:

**Comparison factors**: Estate tax, inheritance tax, income tax, asset protection, homestead exemptions, Medicaid advantages, trust-friendly laws, charitable incentives.

Provide ranked comparison with potential savings calculations.

## Step 11: Report Generation

### Action Item Priority & Timeframes

| Priority | Timeframe | When to Use |
|----------|-----------|-------------|
| **Critical** | Within 30 days | Document invalidity, missing essential documents, imminent deadlines |
| **Important** | Within 90 days | Compliance issues, tax optimization opportunities, beneficiary updates |
| **Recommended** | Within 6-12 months | Enhancements, reviews, non-urgent optimizations |

### Report Structure

```
═══════════════════════════════════════════════════
[STATE NAME] ANALYSIS
═══════════════════════════════════════════════════

Key Differences: [What makes this state unique]

COMPLIANCE ISSUES
─────────────────
[Document] - [Issue] - [Priority: Critical/Important/Recommended]
• Timeframe: [Within 30 days / Within 90 days / Within 6-12 months]
• [Details]
• [For attorneys: Statute citation]

TAX OPTIMIZATION OPPORTUNITIES
──────────────────────────────
Current Exposure: $X
Recommended Strategies:
• [Strategy 1]: Savings $X | Priority: [X] | Timeframe: [X]
• [Strategy 2]: Savings $X | Priority: [X] | Timeframe: [X]

CHARITABLE GIVING ANALYSIS
──────────────────────────
[If applicable - recommended vehicles, tax savings, state incentives]

MEDICAID PLANNING
─────────────────
[State-specific analysis]

NON-TRADITIONAL ASSETS
──────────────────────
[Crypto, collectibles, firearms, etc. - specific considerations]

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

CRITICAL (Complete Within 30 Days)
──────────────────────────────────
1. [Action] 
   └─ Link: [URL or phone number from references/financial-institutions.md]
2. [Action]
   └─ Link: [URL or phone number]

IMPORTANT (Complete Within 90 Days)
───────────────────────────────────
3. [Action]
   └─ Link: [URL or phone number]

RECOMMENDED (Complete Within 6-12 months)
─────────────────────────────────────────
4. [Action]
   └─ Link: [URL or phone number]

QUESTIONS TO ASK YOUR ATTORNEY
──────────────────────────────
[For individuals only]
```

### Providing Links

For each action item requiring user action with a financial institution:
1. Check `references/financial-institutions.md` for URL/phone
2. If not found, search web for institution's login page
3. Include direct link or phone number with action item

## Step 12: Version Comparison

When user provides revised documents:
1. Compare old and new versions
2. Confirm which issues addressed
3. List remaining unresolved issues
4. Identify any new issues introduced
5. Update dollar impact calculations
6. Update action item list and timeframes

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

### States with Charitable Tax Incentives
Arizona, Colorado, Georgia, Indiana, Iowa, Maryland, Michigan, Missouri, Montana, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, South Carolina, Virginia

See individual state reference files for specific programs.

## References

- `references/financial-institutions.md` - Login URLs and phone numbers for major institutions
- `references/[state-name].md` - State-specific requirements, including safe deposit box rules and charitable incentives

---

# REFERENCE FILES

## references/financial-institutions.md

# Financial Institutions Reference

Login URLs and phone numbers for beneficiary updates and account management. For institutions not listed, search the web for their login page.

## Table of Contents
- [Major Banks](#major-banks)
- [Brokerages & Investment Firms](#brokerages--investment-firms)
- [Retirement Plan Administrators](#retirement-plan-administrators)
- [Insurance Companies - Life](#insurance-companies---life)
- [Insurance Companies - Annuities](#insurance-companies---annuities)
- [Mutual Fund Companies](#mutual-fund-companies)

---

## Major Banks

| Institution | Login URL | Phone | Notes |
|-------------|-----------|-------|-------|
| Bank of America | https://www.bankofamerica.com/login | 800-432-1000 | Beneficiary changes: visit branch or call |
| Chase | https://www.chase.com/login | 800-935-9935 | Online beneficiary updates available |
| Wells Fargo | https://www.wellsfargo.com/login | 800-869-3557 | |
| Citibank | https://online.citi.com | 800-374-9700 | |
| U.S. Bank | https://www.usbank.com/login | 800-872-2657 | |
| PNC Bank | https://www.pnc.com/login | 888-762-2265 | |
| Truist | https://www.truist.com/login | 844-487-8478 | |
| Capital One | https://www.capitalone.com/sign-in | 877-383-4802 | |
| TD Bank | https://www.td.com/us/en/personal-banking/login | 888-751-9000 | |
| Fifth Third Bank | https://www.53.com/login | 800-972-3030 | |
| Regions Bank | https://www.regions.com/login | 800-734-4667 | |
| KeyBank | https://www.key.com/login | 800-539-2968 | |
| M&T Bank | https://www.mtb.com/login | 800-724-2440 | |
| Huntington Bank | https://www.huntington.com/login | 800-480-2265 | |
| HSBC | https://www.us.hsbc.com/login | 800-975-4722 | |

## Brokerages & Investment Firms

| Institution | Login URL | Phone | Notes |
|-------------|-----------|-------|-------|
| Fidelity Investments | https://www.fidelity.com/login | 800-343-3548 | Beneficiary updates online or by phone |
| Charles Schwab | https://www.schwab.com/login | 800-435-4000 | |
| Vanguard | https://investor.vanguard.com/login | 800-662-7447 | |
| E*TRADE | https://us.etrade.com/login | 800-387-2331 | Now part of Morgan Stanley |
| TD Ameritrade | https://www.tdameritrade.com/login | 800-669-3900 | Transitioning to Schwab |
| Merrill Lynch | https://www.ml.com/login | 800-637-7455 | Bank of America subsidiary |
| Morgan Stanley | https://www.morganstanley.com/login | 888-454-3965 | |
| Edward Jones | https://www.edwardjones.com/login | 314-515-2000 | Contact local advisor |
| Raymond James | https://www.raymondjames.com/login | 800-248-8863 | |
| Ameriprise Financial | https://www.ameriprise.com/login | 800-862-7919 | |
| LPL Financial | https://www.lpl.com/login | 800-558-7567 | |
| Interactive Brokers | https://www.interactivebrokers.com/sso/Login | 877-442-2757 | |
| Robinhood | https://robinhood.com/login | In-app support only | Limited phone support |
| Wealthfront | https://www.wealthfront.com/login | 844-995-8437 | |
| Betterment | https://www.betterment.com/login | 888-428-9482 | |

## Retirement Plan Administrators

| Institution | Login URL | Phone | Notes |
|-------------|-----------|-------|-------|
| Fidelity NetBenefits | https://nb.fidelity.com/login | 800-294-4015 | Employer 401(k) plans |
| Vanguard Retirement | https://retirementplans.vanguard.com | 800-523-1188 | |
| Empower Retirement | https://www.empower.com/login | 800-338-4015 | Formerly MassMutual/Great-West |
| Principal Financial | https://www.principal.com/login | 800-986-3343 | |
| TIAA | https://www.tiaa.org/login | 800-842-2252 | Education/nonprofit sector |
| Prudential Retirement | https://www.prudential.com/login | 877-778-2100 | |
| John Hancock | https://www.johnhancock.com/login | 800-395-1113 | |
| Transamerica | https://www.transamerica.com/login | 800-755-5801 | |
| ADP Retirement Services | https://www.adp.com/login | 800-695-7526 | |
| Paychex | https://www.paychex.com/login | 877-244-1771 | |
| T. Rowe Price | https://www.troweprice.com/login | 800-922-9945 | |
| Nationwide | https://www.nationwide.com/login | 877-669-6877 | |
| Lincoln Financial | https://www.lfg.com/login | 800-454-6265 | |
| Ascensus | https://www.ascensus.com | 800-345-6363 | Third-party administrator |
| Milliman | https://www.milliman.com | 206-624-7940 | Actuarial/TPA services |

## Insurance Companies - Life

| Institution | Login URL | Phone | Notes |
|-------------|-----------|-------|-------|
| Northwestern Mutual | https://www.northwesternmutual.com/login | 866-950-4644 | |
| New York Life | https://www.newyorklife.com/login | 800-695-8453 | |
| Mass Mutual | https://www.massmutual.com/login | 800-272-2216 | |
| Prudential Life | https://www.prudential.com/login | 800-778-2255 | |
| MetLife | https://www.metlife.com/login | 800-638-5433 | |
| State Farm | https://www.statefarm.com/login | 800-782-8332 | |
| Allstate | https://www.allstate.com/login | 800-255-7828 | |
| Nationwide Life | https://www.nationwide.com/login | 877-669-6877 | |
| Lincoln Financial | https://www.lfg.com/login | 800-454-6265 | |
| Transamerica Life | https://www.transamerica.com/login | 800-797-2643 | |
| Guardian Life | https://www.guardianlife.com/login | 888-482-7342 | |
| Pacific Life | https://www.pacificlife.com/login | 800-800-7681 | |
| Mutual of Omaha | https://www.mutualofomaha.com/login | 800-775-6000 | |
| Securian Financial | https://www.securian.com/login | 800-820-4205 | |
| Unum | https://www.unum.com/login | 800-421-0344 | |
| Aflac | https://www.aflac.com/login | 800-992-3522 | |
| Principal Life | https://www.principal.com/login | 800-986-3343 | |

## Insurance Companies - Annuities

| Institution | Login URL | Phone | Notes |
|-------------|-----------|-------|-------|
| TIAA | https://www.tiaa.org/login | 800-842-2252 | |
| Jackson National | https://www.jackson.com/login | 800-644-4565 | |
| Athene | https://www.athene.com/login | 888-266-8489 | |
| Allianz Life | https://www.allianzlife.com/login | 800-950-5872 | |
| American Equity | https://www.american-equity.com/login | 888-221-1234 | |
| Sammons Financial | https://www.sammonsfinancial.com | 800-798-5500 | |
| Global Atlantic | https://www.globalatlantic.com/login | 800-221-7066 | |
| Brighthouse Financial | https://www.brighthousefinancial.com/login | 888-243-1932 | |
| Equitable | https://www.equitable.com/login | 800-628-6673 | Formerly AXA |
| AIG Life & Retirement | https://www.aig.com/login | 800-858-4567 | |

## Mutual Fund Companies

| Institution | Login URL | Phone | Notes |
|-------------|-----------|-------|-------|
| Vanguard | https://investor.vanguard.com/login | 800-662-7447 | |
| Fidelity | https://www.fidelity.com/login | 800-343-3548 | |
| T. Rowe Price | https://www.troweprice.com/login | 800-225-5132 | |
| American Funds | https://www.capitalgroup.com/login | 800-421-4225 | Capital Group |
| BlackRock | https://www.blackrock.com/login | 800-441-7762 | iShares ETFs |
| PIMCO | https://www.pimco.com/login | 888-746-2602 | |
| Franklin Templeton | https://www.franklintempleton.com/login | 800-632-2301 | |
| Invesco | https://www.invesco.com/login | 800-959-4246 | |
| Janus Henderson | https://www.janushenderson.com/login | 800-525-3713 | |
| MFS Investment | https://www.mfs.com/login | 800-225-2606 | |
| Nuveen | https://www.nuveen.com/login | 800-257-8787 | TIAA subsidiary |
| Columbia Threadneedle | https://www.columbiathreadneedle.com/login | 800-345-6611 | |
| Hartford Funds | https://www.hartfordfunds.com/login | 888-843-7824 | |
| DFA (Dimensional) | https://www.dimensional.com/login | 512-306-7400 | Advisor access only |
| USAA | https://www.usaa.com/login | 800-531-8722 | Military members |

---

## Instructions for Beneficiary Updates

### General Process
1. Log in to account online
2. Navigate to "Profile," "Settings," or "Beneficiaries" section
3. Update primary and contingent beneficiaries
4. Provide beneficiary SSN and date of birth
5. Print/save confirmation for records

### If Online Update Not Available
Call the phone number listed and request a beneficiary change form. Most institutions will:
- Mail a paper form
- Email a fillable PDF
- Process change verbally with identity verification

### Required Information for Changes
- Account holder's full legal name and SSN
- Account number
- Beneficiary's full legal name, SSN, date of birth
- Beneficiary's relationship to account holder
- Percentage allocation (must total 100%)
- Contingent beneficiary information (recommended)

### Special Situations
- **Trusts as beneficiaries**: Need trust name, date, and trustee name
- **Charities as beneficiaries**: Need organization's full legal name and EIN
- **Minor beneficiaries**: Consider custodial designation (UTMA/UGMA) or trust
- **QDRO required**: For retirement accounts in divorce, court order needed before beneficiary change

---

*Note: URLs and phone numbers current as of skill creation. Verify before use. For institutions not listed, search the web for "[Institution Name] account login" to find current URL.*

---

## references/alabama.md

# Alabama

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may permit limited examination with death certificate to locate will
- Probate judge in county of residence handles estate administration

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate court involvement
- Common approach for married couples

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents with estate planning attorney
- Inform personal representative of box location
- Consider naming executor as authorized signer for convenience

---

## references/alaska.md

# Alaska

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from superior court required
- Bank may permit examination with death certificate to locate will
- Alaska Uniform Probate Code governs administration

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement
- Important for residents with assets in remote locations

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents with estate planning attorney
- Inform personal representative of box location
- Consider accessibility issues for remote Alaska residents

---

## references/arizona.md

# Arizona

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: court order or letters testamentary required
- Bank may allow inventory-only access with death certificate (no removal)
- Executor/administrator access with letters testamentary

### Joint Ownership
- Surviving joint renter has full access rights
- Joint renter can remove contents without restriction
- No automatic freeze on death of one renter
- Consider: joint rental may expose contents to co-renter's creditors

### Best Practices
- Original will should NOT be stored in safe deposit box (may delay access)
- Keep copy of box inventory with estate planning documents
- Inform executor of box location and access method
- Consider naming executor as joint renter for estate planning purposes

## State Charitable Incentives

### Arizona Charitable Tax Credit
- Credit for donations to Qualifying Charitable Organizations (QCOs)
- Single: up to $470 credit (2025)
- Married filing jointly: up to $938 credit (2025)
- Dollar-for-dollar credit, not just deduction

### Qualifying Foster Care Charitable Organizations (QFCOs)
- Separate credit for donations to QFCOs
- Single: up to $587 credit (2025)
- Married filing jointly: up to $1,173 credit (2025)
- Can claim both QCO and QFCO credits

### School Tax Credits
- Public school extracurricular credit: up to $400 single / $800 joint
- Private school tuition organization credit: up to $1,459 single / $2,435 joint

### Estate Planning Implications
- Lifetime giving during Arizona residency maximizes state tax benefits
- Credits are non-refundable but reduce Arizona income tax dollar-for-dollar
- Coordinate with federal charitable deduction planning

---

## references/arkansas.md

# Arkansas

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may allow examination with death certificate to search for will
- Circuit court handles probate in Arkansas

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents with estate plan
- Inform executor of box location

---

## references/california.md

# California

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from superior court required
- California Probate Code allows limited access with death certificate to search for will and burial instructions
- Court-appointed administrator needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without probate
- Community property considerations apply to box contents

### Inventory Requirements
- Contents may need to be inventoried for estate tax purposes
- Community property vs. separate property characterization important

### Best Practices
- Original will should not be stored in safe deposit box
- Community property assets should be properly characterized
- Document box contents for estate administration
- Inform successor trustee/executor of box location

---

## references/colorado.md

# Colorado

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary or court order required
- Bank may permit examination of contents with death certificate to locate will
- Executor access with proper documentation

### Joint Ownership
- Surviving joint renter retains full access
- Contents not automatically frozen at one owner's death
- Joint renter can remove contents without court involvement
- Consider liability exposure when adding joint renters

### Best Practices
- Do not store original will in safe deposit box
- Document box contents and share with executor
- Consider naming fiduciary as authorized accessor

## State Charitable Incentives

### Child Care Contribution Credit
- Credit for contributions to qualifying child care facilities
- Up to 50% of contribution, max $100,000 credit
- Transferable and refundable for certain contributions

### Enterprise Zone Contribution Credit
- 25% credit for cash contributions to enterprise zone administrators
- Supports economic development in designated areas
- Can be carried forward up to 5 years

### Colorado Charitable Gaming
- Certain charitable gaming proceeds support nonprofits
- Limited direct tax benefit but supports charitable sector

### Estate Planning Implications
- Enterprise zone credits can significantly enhance charitable giving efficiency
- Coordinate lifetime giving with Colorado residency for maximum benefit
- Child care contributions may benefit family foundations focused on education

---

## references/connecticut.md

# Connecticut

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Connecticut allows examination with death certificate to locate will
- Probate court in town of residence handles administration

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Estate Tax Considerations
- Connecticut has estate tax - document valuable contents
- Contents valued for estate tax purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Inform fiduciary of box location
- Consider estate tax implications of valuable items

---

## references/delaware.md

# Delaware

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from Register of Wills required
- Bank may permit limited examination with death certificate
- Register of Wills handles probate administration

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents with estate planning documents
- Inform executor of box location
- Delaware corporate documents often stored - ensure accessibility

---

## references/florida.md

# Florida

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from circuit court required
- Florida law allows limited access with death certificate to inventory contents
- Court-appointed personal representative needed for removal

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without probate involvement
- Popular approach for retirees

### Inventory Requirement
- Florida may require inventory in presence of bank officer
- Contents documented before removal by estate representative

### Best Practices
- Original will should NOT be stored in safe deposit box
- Florida strongly recommends depositing original will with clerk of court
- Document box contents for homestead and estate purposes
- Inform personal representative of box location

---

## references/georgia.md

# Georgia

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary or administration required
- Bank may permit examination (not removal) with death certificate to locate will
- Inventory may be required upon opening with court representative

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze on death of one renter
- Contents accessible without court involvement
- Consider creditor exposure when adding joint renters

### Best Practices
- Avoid storing original will in safe deposit box
- Keep inventory list with estate planning attorney
- Inform executor of box location
- Consider adding executor as authorized signer

## State Charitable Incentives

### Rural Hospital Tax Credit
- Credit for contributions to qualifying rural hospitals
- 70% of donation as tax credit (highly valuable)
- Individual: up to $5,000 credit
- Married filing jointly: up to $10,000 credit
- C-Corps: up to 75% of state income tax liability
- Very popular - credits often sell out quickly

### Qualified Education Expense Credit
- Credit for contributions to Student Scholarship Organizations (SSOs)
- Individual: up to $2,500 credit
- Married filing jointly: up to $5,000 credit
- Supports private school scholarships

### Georgia HEART Hospital Program
- Supports rural hospital organizations
- Highly efficient - 70% credit rate
- Pre-approval required

### Estate Planning Implications
- Rural hospital credit offers exceptional tax efficiency
- Credits must be applied for in advance - limited availability
- Coordinate lifetime giving for maximum Georgia tax benefit
- Consider establishing pattern of giving during residency

---

## references/hawaii.md

# Hawaii

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from circuit court required
- Hawaii allows limited access with death certificate to search for will
- Personal representative appointment needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate

### Estate Tax Considerations
- Hawaii has estate tax - document valuable contents
- Contents valued for estate tax purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Inform personal representative of box location
- Consider inter-island accessibility issues

---

## references/idaho.md

# Idaho

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary required
- Bank may permit examination with death certificate to locate will
- Magistrate division of district court handles probate

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement
- Community property considerations may apply

### Community Property Note
- Idaho is community property state
- Box contents may be characterized as community or separate property

### Best Practices
- Original will should not be stored in safe deposit box
- Document community vs. separate property in box
- Inform personal representative of box location

---

## references/illinois.md

# Illinois

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from circuit court required
- Illinois allows limited access with death certificate to search for will
- Court-appointed representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Estate Tax Considerations
- Illinois has estate tax ($4M threshold) - document valuable contents
- Contents valued for estate tax purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Inform executor of box location
- Consider estate tax implications for valuable items

---

## references/indiana.md

# Indiana

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary required
- Bank may allow examination with death certificate to locate will/burial instructions
- Full access requires court-issued letters

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents not part of probate if joint renter survives
- Consider implications for estate planning and creditor claims

### Best Practices
- Original will should not be stored in safe deposit box
- Maintain inventory with estate planning documents
- Inform personal representative of box existence and location

## State Charitable Incentives

### Neighborhood Assistance Credit (NAC)
- 50% credit for donations to approved neighborhood organizations
- Maximum credit varies by project type
- Supports community development in designated areas
- Credit must be pre-approved

### Indiana Earned Income Tax Credit
- Refundable credit for low-income taxpayers
- Not direct charitable incentive but supports giving capacity

### College Choice 529 Education Savings Credit
- 20% credit on contributions to Indiana 529 plans
- Maximum $1,500 credit per year
- While not charitable, supports education giving

### Estate Planning Implications
- NAC provides significant credit for qualified donations
- Pre-approval requirement means advance planning necessary
- Coordinate lifetime charitable giving with Indiana residency
- No state estate tax means federal planning is primary focus

---

## references/iowa.md

# Iowa

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: court-issued letters required
- Bank may allow limited examination with death certificate
- Executor/administrator needs letters testamentary for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze at death
- Can remove contents without court involvement
- Important for farm/agricultural documents

### Best Practices
- Do not store original will in safe deposit box
- Agricultural operators: keep key documents accessible to successors
- Maintain inventory with estate planning attorney
- Consider joint rental for business continuity

## State Charitable Incentives

### Endow Iowa Tax Credit
- 25% state tax credit for gifts to qualified community foundations
- Applies to gifts to permanent endowment funds
- Individual: maximum $300 credit ($1,200 gift)
- Married filing jointly: maximum $600 credit ($2,400 gift)
- Additional federal charitable deduction available
- Credits are first-come, first-served (apply early in tax year)

### School Tuition Organization Tax Credit
- 75% credit for contributions to school tuition organizations
- Supports private school scholarships
- Limited total credits available statewide
- Pre-approval required

### Estate Planning Implications
- Endow Iowa credit makes community foundation giving very efficient
- 25% state credit + federal deduction = significant tax benefit
- Limited credits available - coordinate timing of large gifts
- Consider establishing giving pattern during Iowa residency
- Community foundation gifts create permanent local legacy

---

## references/kansas.md

# Kansas

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Bank may permit examination with death certificate to locate will
- Personal representative appointment needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents with estate planning documents
- Inform executor of box location
- Agricultural documents should be kept accessible

---

## references/kentucky.md

# Kentucky

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Bank may permit examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement

### Inheritance Tax Note
- Kentucky has inheritance tax - document contents for tax reporting
- Class A beneficiaries (spouse, children, parents) exempt
- Other beneficiaries subject to tax on inherited contents

### Best Practices
- Original will should not be stored in safe deposit box
- Document valuable contents for inheritance tax purposes
- Inform executor of box location
- Consider inheritance tax implications for non-exempt beneficiaries

---

## references/louisiana.md

# Louisiana

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: court order from district court required
- Louisiana's civil law system has unique procedures
- Succession representative appointment needed

### Joint Ownership
- Surviving joint renter has access rights
- No automatic freeze upon death
- Community property rules may affect contents ownership

### Community Property Note
- Louisiana is community property state
- Box contents characterized as community or separate property
- Forced heirship rules may apply to contents

### Best Practices
- Original will should not be stored in safe deposit box
- Community property characterization important
- Forced heirship considerations for valuable items
- Inform succession representative of box location

---

## references/maine.md

# Maine

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may permit examination with death certificate to locate will
- Personal representative appointment needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Estate Tax Considerations
- Maine has estate tax ($7M threshold) - document valuable contents
- Contents valued for estate tax purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Inform personal representative of box location

---

## references/maryland.md

# Maryland

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary required from Orphans' Court
- Bank may permit limited access with death certificate to locate will only
- Register of Wills may authorize examination
- Full access requires letters of administration

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze at death
- Contents accessible without Orphans' Court involvement
- May simplify access but consider estate tax implications

### Inventory Requirements
- Orphans' Court may require inventory of contents
- Important for inheritance tax reporting on non-exempt beneficiaries

### Best Practices
- Do not store original will in safe deposit box
- Document contents for estate and inheritance tax reporting
- Inform personal representative of box location
- Consider naming PR as joint renter

## State Charitable Incentives

### Endow Maryland Tax Credit
- 25% state tax credit for donations to qualified permanent endowments
- Maximum credit: $50,000 individual / $100,000 joint
- Applies to gifts to community foundations meeting requirements
- Very valuable for high-net-worth charitable planning

### Heritage Structure Rehabilitation Tax Credit
- Credit for rehabilitation of historic structures
- Can apply to charitable donations of preservation easements
- Coordinates with federal historic preservation incentives

### Estate Planning Implications
- Endow Maryland credit exceptionally valuable (25% credit rate)
- With BOTH estate and inheritance tax, charitable giving very tax-efficient
- Charitable bequests reduce estate tax base AND avoid inheritance tax
- Charitable remainder trusts can provide income while reducing both taxes
- Consider frontloading charitable gifts during Maryland residency
- Life insurance to charity avoids both estate and inheritance tax

---

## references/massachusetts.md

# Massachusetts

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Massachusetts allows limited access with death certificate to search for will
- Personal representative appointment needed for removal

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate

### Estate Tax Considerations
- Massachusetts has $2M estate tax threshold with cliff effect
- Contents valued for estate tax - critical given low threshold
- Document all valuable items

### Best Practices
- Original will should not be stored in safe deposit box
- Carefully document contents for estate tax purposes
- Low $2M threshold makes valuation critical
- Inform personal representative of box location

---

## references/michigan.md

# Michigan

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access rights
- Without joint renter: letters of authority from probate court required
- Bank may allow limited examination with death certificate to locate will
- Personal representative access with court appointment

### Joint Ownership
- Surviving joint renter has full access
- No automatic freeze upon death of co-renter
- Contents immediately accessible
- Consider implications for Medicaid planning with Lady Bird Deeds

### Best Practices
- Avoid storing original will in safe deposit box
- Keep copy of Lady Bird Deed in accessible location
- Document box contents
- Inform personal representative of box location

## State Charitable Incentives

### Community Foundation Tax Credit (Historic)
- Michigan previously offered charitable contribution credits
- Most charitable credits have been phased out or modified
- Current focus on federal charitable deduction

### Homeless Shelter/Food Bank Credit
- Credit for donations to qualified homeless shelters and food banks
- Limited credit amount available
- Check current availability and limits

### College Savings Plan Deduction
- Deduction (not credit) for 529 plan contributions
- While not charitable, supports educational giving

### Estate Planning Implications
- No major state charitable credits currently active
- Focus on federal charitable planning strategies
- Lady Bird Deed can coordinate with charitable remainder planning
- Consider charitable lead trusts for Michigan real estate
- No state death tax makes federal planning primary focus

---

## references/minnesota.md

# Minnesota

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Minnesota allows examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Estate Tax Considerations
- Minnesota has estate tax ($3M threshold) - document valuable contents
- Contents valued for estate tax purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Inform personal representative of box location

---

## references/mississippi.md

# Mississippi

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from chancery court required
- Bank may permit examination with death certificate to locate will
- Personal representative appointment needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents with estate planning documents
- Inform executor of box location

---

## references/missouri.md

# Missouri

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may permit limited examination with death certificate
- Probate court can authorize access to search for will

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze on death
- Contents accessible without probate involvement
- Coordinates well with beneficiary deed planning

### Best Practices
- Avoid storing original will in safe deposit box
- Keep beneficiary deed copies accessible
- Document box contents with estate plan
- Inform personal representative of box location

## State Charitable Incentives

### Neighborhood Preservation Act Credit
- Credit for donations to qualified neighborhood organizations
- 50% credit on contributions up to $100,000
- Supports community development in targeted areas
- Credit must be pre-approved

### Youth Opportunities and Violence Prevention Credit
- 50% credit for contributions to qualified programs
- Maximum credit varies by program
- Supports at-risk youth programs

### Maternity Home Tax Credit
- 50% credit for donations to maternity homes
- Supports crisis pregnancy services

### Domestic Violence Shelter Credit
- 50% credit for donations to approved shelters

### Estate Planning Implications
- Multiple 50% credit programs offer significant tax efficiency
- Pre-approval required for most credits - plan ahead
- Coordinate lifetime giving with Missouri residency
- No state death taxes means federal planning primary focus
- Community development credits support local giving objectives

---

## references/montana.md

# Montana

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary required
- Bank may permit examination with death certificate to locate will
- District court appoints personal representative

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze on death
- Contents accessible without court involvement
- Important for agricultural operations with time-sensitive documents

### Best Practices
- Avoid storing original will in safe deposit box
- Keep ranch/farm documents accessible to heirs
- Document box contents
- Inform personal representative of location

## State Charitable Incentives

### Qualified Endowment Tax Credit
- 40% credit for contributions to qualified Montana endowments
- Maximum credit: $10,000 individual / $20,000 joint
- One of the highest charitable credit rates in the nation
- Applies to permanent endowments at Montana nonprofits

### Infrastructure Tax Credit
- Credit for contributions to infrastructure projects
- Supports rural community development

### College Savings Plan Deduction
- Deduction for contributions to Montana 529 plans
- Up to $3,000 per beneficiary per year

### Estate Planning Implications
- 40% endowment credit is exceptionally valuable
- Among highest state charitable credit rates available
- Coordinate large charitable gifts with Montana residency
- Can combine state credit with federal deduction
- Consider establishing Montana endowment fund during lifetime
- Strong homestead + no death taxes = favorable estate planning environment

---

## references/nebraska.md

# Nebraska

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from county court required
- Bank may permit examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement

### Inheritance Tax Note
- Nebraska has inheritance tax - document contents for tax reporting
- Spouse exempt; other rates vary by relationship
- Contents subject to inheritance tax based on recipient

### Best Practices
- Original will should not be stored in safe deposit box
- Document valuable contents for inheritance tax purposes
- Inform personal representative of box location
- Consider inheritance tax implications for non-spouse beneficiaries

---

## references/nevada.md

# Nevada

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Nevada allows examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without probate
- Community property rules may apply to contents

### Community Property Note
- Nevada is community property state
- Box contents characterized as community or separate property

### Best Practices
- Original will should not be stored in safe deposit box
- Document community vs. separate property in box
- Inform personal representative of box location
- Nevada privacy laws affect disclosure requirements

---

## references/new-hampshire.md

# New Hampshire

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may permit examination with death certificate to locate will
- Administrator/executor needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Best Practices
- Original will should not be stored in safe deposit box
- No state estate or inheritance tax simplifies contents planning
- Document box contents with estate plan
- Inform executor of box location

---

## references/new-jersey.md

# New Jersey

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from surrogate's court required
- New Jersey allows examination with death certificate to locate will
- Executor/administrator needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without surrogate court involvement

### Inheritance Tax Note
- New Jersey has inheritance tax - document contents for tax reporting
- Class A (spouse, children, parents, grandparents) exempt
- Other beneficiaries subject to tax up to 16%

### Best Practices
- Original will should not be stored in safe deposit box
- Document valuable contents for inheritance tax purposes
- Inform executor of box location
- Consider inheritance tax for non-Class A beneficiaries

---

## references/new-mexico.md

# New Mexico

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Bank may permit examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement
- Community property rules may apply to contents

### Community Property Note
- New Mexico is community property state
- Box contents characterized as community or separate property

### Best Practices
- Original will should not be stored in safe deposit box
- Document community vs. separate property in box
- Inform personal representative of box location

---

## references/new-york.md

# New York

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from surrogate's court required
- New York allows limited access with death certificate to search for will
- Executor/administrator needed for full access and removal

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without surrogate court involvement

### Estate Tax Considerations
- New York has estate tax with 105% cliff effect at $7.16M threshold
- Contents valued for estate tax - critical near threshold
- Document all valuable items carefully

### Special New York Rules
- EPTL governs safe deposit box access procedures
- Surrogate's court in county of residence handles administration

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents carefully for estate tax (cliff effect makes this critical)
- Inform executor of box location
- Consider estate tax implications for valuable items

---

## references/north-carolina.md

# North Carolina

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from clerk of superior court required
- Bank may allow examination with death certificate to search for will
- NC General Statutes govern access procedures

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without estate administration
- Consider for retirees relocating to NC

### Best Practices
- Original will should not be stored in safe deposit box
- Many NC clerks recommend keeping original will with attorney
- Document box contents with estate planning documents
- Inform executor of box location

## State Charitable Incentives

### Mill Rehabilitation Tax Credit
- Credit for rehabilitation of historic textile mill properties
- Can apply to charitable donations of preservation easements
- Up to 40% credit for qualified expenditures
- Coordinates with federal historic preservation credits

### Conservation Tax Credit (Modified)
- NC previously had generous conservation credits (repealed 2013)
- Current: limited credit for donated conservation easements
- 25% credit, capped at $250,000 over 5 years

### Education Savings Plan Deduction
- Deduction for NC 529 plan contributions
- Up to $2,500 per beneficiary ($5,000 for joint filers)

### Estate Planning Implications
- Conservation easement credits valuable for land-rich estates
- Coordinate easement donations with estate planning
- No state death taxes simplifies planning
- Popular retirement destination - consider charitable planning before relocation
- Federal charitable strategies remain primary focus

---

## references/north-dakota.md

# North Dakota

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary required
- Bank may permit examination with death certificate to locate will
- Court appointment of personal representative required for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze on death
- Contents accessible without court involvement
- Important for farm/ranch succession planning

### Best Practices
- Avoid storing original will in safe deposit box
- Keep agricultural documents accessible to successors
- Document box contents
- Consider joint rental for business continuity

## State Charitable Incentives

### Endowment Tax Credit
- 40% credit for contributions to qualified North Dakota endowments
- Maximum credit: $10,000 individual / $20,000 married filing jointly
- One of highest charitable credit rates in the nation
- Applies to permanent endowment funds

### Planned Gift Tax Credit
- Additional 40% credit for planned gifts (life income gifts, bequests)
- Same maximum limits as endowment credit
- Can be claimed in addition to endowment credit in some cases

### Agricultural Research Contribution Credit
- Credit for donations supporting agricultural research
- Supports ND agricultural economy

### Estate Planning Implications
- 40% credit rate is among the highest nationally
- Planned gift credit specifically rewards estate planning gifts
- Excellent state for establishing endowments during lifetime
- No state death taxes + high charitable credits = very favorable environment
- Consider split-interest gifts (CRTs, CLTs) for maximum credit benefit
- Agricultural families can support land-grant university research

---

## references/ohio.md

# Ohio

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Ohio law allows limited access with death certificate to search for will
- Probate court in county of residence handles administration

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate court involvement
- Common approach for married couples

### Best Practices
- Original will should not be stored in safe deposit box
- Ohio probate courts recommend filing original will with court
- Document box contents with estate plan
- Inform executor of box location

## State Charitable Incentives

### Ohio Scholarship Donation Credit
- Credit for donations to scholarship granting organizations
- Supports private school scholarships
- Limited credits available statewide

### Historic Preservation Tax Credit
- Credit for rehabilitation of historic buildings
- Can apply to donated preservation easements
- Up to 25% of qualified expenditures

### Small Business Investment Credit
- Credit for investments in small businesses
- Supports Ohio economic development

### Motion Picture Tax Credit
- Credit for film production contributions
- Limited application for most estate planning

### Estate Planning Implications
- Limited state charitable credits currently available
- Focus on federal charitable planning strategies
- Transfer on Death Deeds can coordinate with charitable planning
- No state death taxes means federal planning is primary focus
- Historic preservation credits valuable for owners of qualifying properties

---

## references/oklahoma.md

# Oklahoma

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Bank may permit examination with death certificate to locate will
- Personal representative appointment needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement
- Important for oil/gas royalty documents and mineral deeds

### Best Practices
- Avoid storing original will in safe deposit box
- Keep mineral rights documents accessible to heirs
- Document box contents with estate planning documents
- Inform executor of box location and contents

## State Charitable Incentives

### Equal Opportunity Education Scholarship Credit
- 50% credit for contributions to scholarship granting organizations
- Individual: up to $1,000 credit ($2,000 contribution)
- Joint: up to $2,000 credit ($4,000 contribution)
- Corporations: 75% credit, up to $100,000
- Supports private school scholarships

### Volunteer Firefighter Tax Credit
- Credit for donations to volunteer fire departments
- Limited but valuable for rural communities

### Agricultural Donation Credit
- Credit for donations of agricultural products to food banks
- Supports Oklahoma agricultural producers

### Estate Planning Implications
- 50% education scholarship credit provides solid tax benefit
- Unlimited homestead + no death taxes = excellent asset protection
- Mineral rights require special estate planning attention
- Consider charitable land trusts for agricultural properties
- Oil/gas working interests may benefit from charitable planning
- Federal planning remains primary focus for death tax planning

---

## references/oregon.md

# Oregon

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from circuit court required
- Oregon allows limited access with death certificate to search for will
- Personal representative appointment needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement
- Common approach for married couples

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents for estate tax purposes (low $1M threshold)
- Inform personal representative of box location
- Consider joint rental for estate planning convenience

## State Charitable Incentives

### Oregon Cultural Trust Tax Credit
- 100% credit for contributions to the Oregon Cultural Trust
- Requires matching contribution to an Oregon cultural nonprofit first
- Individual: up to $500 credit
- Joint: up to $1,000 credit
- Very efficient - full credit, not deduction

### Oregon Charitable Checkoff Program
- Designate contributions through state tax return
- Supports various Oregon nonprofits
- Convenient giving mechanism

### Working Family Household and Dependent Care Credit
- Supports low-income working families
- Not direct charitable incentive

### Estate Planning Implications
- Cultural Trust credit offers 100% efficiency - highly valuable
- With low $1M estate tax threshold, charitable giving reduces exposure
- Charitable bequests directly reduce taxable estate below threshold
- Consider charitable remainder trusts to reduce estate below $1M
- Charitable lead trusts can pass assets to heirs with reduced tax
- Lifetime charitable giving before Oregon residency may preserve credits
- ILIT for life insurance removes from estate (critical at $1M threshold)

---

## references/pennsylvania.md

# Pennsylvania

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from Register of Wills required
- Pennsylvania allows examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without Register of Wills involvement

### Inheritance Tax Note
- Pennsylvania has inheritance tax - document contents for tax reporting
- Spouse exempt (0%), children/parents 4.5%, siblings 12%, others 15%
- 5% discount if inheritance tax paid within 3 months

### Best Practices
- Original will should not be stored in safe deposit box
- Document valuable contents for inheritance tax purposes
- Inform executor of box location
- Consider early payment discount for inheritance tax

---

## references/rhode-island.md

# Rhode Island

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may permit examination with death certificate to locate will
- Executor/administrator needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Estate Tax Considerations
- Rhode Island has estate tax ($1.8M threshold, indexed)
- Contents valued for estate tax purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Inform executor of box location

---

## references/south-carolina.md

# South Carolina

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may permit examination with death certificate to locate will
- Personal representative appointment needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement
- Popular with retirees relocating to SC

### Best Practices
- Original will should not be stored in safe deposit box
- Remember SC requires **3 witnesses** for valid will (check documents)
- Document box contents with estate planning attorney
- Inform personal representative of box location

## State Charitable Incentives

### Exceptional SC Tax Credit
- Credit for donations to organizations serving people with disabilities
- Up to 100% credit on donations (very efficient)
- Individual: up to $300 credit
- Married filing jointly: up to $600 credit
- Full credit, not just deduction

### Industry Partnership Fund Tax Credit
- Credit for contributions to workforce development
- Supports education and training programs

### Conservation Contribution Credit
- Credit for donated conservation easements
- 25% of fair market value
- Supports land preservation

### Estate Planning Implications
- Exceptional SC credit offers 100% efficiency up to limits
- No state death taxes means federal planning is primary focus
- Popular retirement destination - plan charitable giving before relocation
- Conservation credits valuable for large land holdings
- Coordinate SC credits with federal charitable deduction
- Lower Medicaid CSRA requires additional planning for married couples

---

## references/south-dakota.md

# South Dakota

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from circuit court required
- Bank may permit examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement

### Trust-Friendly State
- South Dakota is major trust jurisdiction
- Trust documents and records often stored in safe deposit boxes
- Consider accessibility for out-of-state trustees

### Best Practices
- Original will should not be stored in safe deposit box
- Trust administration documents should be accessible to trustees
- Document box contents with estate plan
- Inform personal representative of box location

---

## references/tennessee.md

# Tennessee

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Tennessee allows examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Best Practices
- Original will should not be stored in safe deposit box
- No state estate or inheritance tax simplifies planning
- Document box contents with estate plan
- Inform executor of box location

---

## references/texas.md

# Texas

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Texas Estates Code allows examination with death certificate to search for will
- Independent executor (common in Texas) has streamlined access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without probate involvement
- Community property rules apply to contents

### Community Property Note
- Texas is community property state
- Box contents characterized as community or separate property
- Important for estate planning purposes

### Independent Administration
- Texas commonly uses independent administration
- Simplifies access for independent executor
- Less court supervision required

### Best Practices
- Original will should not be stored in safe deposit box
- Document community vs. separate property in box
- Independent administration recommended for easier access
- Inform executor of box location

---

## references/utah.md

# Utah

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Bank may permit examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement

### Best Practices
- Original will should not be stored in safe deposit box
- No state estate or inheritance tax simplifies planning
- Document box contents with estate plan
- Inform personal representative of box location

---

## references/vermont.md

# Vermont

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from probate court required
- Bank may permit examination with death certificate to locate will
- Executor needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without probate involvement

### Estate Tax Considerations
- Vermont has estate tax ($5M threshold, 16% flat rate)
- Contents valued for estate tax purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Inform executor of box location

---

## references/virginia.md

# Virginia

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from circuit court required
- Bank may permit limited examination with death certificate
- Commissioner of accounts oversees estate administration

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement
- Common for DC-area residents with Virginia accounts

### Tri-State Considerations (DC/MD/VA)
- If assets in multiple jurisdictions, coordinate access
- Virginia administration may be needed for VA safe deposit contents
- Consider domicile implications for multi-state residents

### Best Practices
- Original will should not be stored in safe deposit box
- Document box contents with estate planning documents
- Inform executor/administrator of box location
- For multi-state residents, consider consolidating accounts

## State Charitable Incentives

### Neighborhood Assistance Program (NAP) Tax Credit
- 65% credit for donations to approved organizations serving low-income communities
- Individual and business credits available
- Very high credit rate - one of highest in nation
- Pre-approval and allocation required

### Land Preservation Tax Credit
- Credit for donated conservation easements
- 40% of fair market value of easement
- Can be carried forward or transferred/sold
- Very valuable for large land holdings

### Education Improvement Scholarships Tax Credit
- 65% credit for donations to scholarship foundations
- Supports private school scholarships
- Individual and business credits

### Historic Rehabilitation Tax Credit
- Up to 25% credit for rehabilitation of historic structures
- Can apply to preservation easement donations

### Estate Planning Implications
- NAP 65% credit is among highest in nation for qualified donations
- Land preservation credit extremely valuable for landowners
- Credits can be transferred/sold - adds liquidity
- DC/MD/VA tri-state planning important (MD has estate + inheritance tax)
- Consider Virginia domicile for death tax planning vs. MD/DC
- Coordinate charitable giving across jurisdictions
- Very limited homestead means other asset protection needed

---

## references/washington-dc.md

# Washington DC (District of Columbia)

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from Superior Court Probate Division required
- DC allows examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement

### Estate Tax Considerations
- DC has estate tax ($4.87M threshold, indexed, up to 16%)
- Contents valued for estate tax purposes

### Multi-Jurisdiction Note
- Many DC residents have accounts in MD and VA
- Coordinate access across DC/MD/VA jurisdictions
- Consider where safe deposit box is located for access purposes

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Consider tri-state (DC/MD/VA) implications
- Inform personal representative of box location

---

## references/washington.md

# Washington

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from superior court required
- Washington allows examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement
- Community property rules apply to contents

### Community Property Note
- Washington is community property state
- Box contents characterized as community or separate property
- Important for estate and estate tax planning

### Estate Tax Considerations
- Washington has estate tax ($2.193M threshold, up to 20% rate)
- Contents valued for estate tax - document carefully

### Best Practices
- Original will should not be stored in safe deposit box
- Document contents for estate tax reporting
- Document community vs. separate property in box
- Inform personal representative of box location

---

## references/west-virginia.md

# West Virginia

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from county commission required
- Bank may permit examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement

### Best Practices
- Original will should not be stored in safe deposit box
- No state estate or inheritance tax simplifies planning
- Document box contents with estate plan
- Inform executor of box location

---

## references/wisconsin.md

# Wisconsin

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from circuit court required
- Wisconsin allows examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter retains full access
- No automatic freeze upon death
- Contents accessible without court involvement
- Marital property rules may apply to contents

### Marital Property Note
- Wisconsin is marital property (community property) state
- Box contents characterized as marital or individual property
- Similar to community property in other states

### Best Practices
- Original will should not be stored in safe deposit box
- Document marital vs. individual property in box
- Inform personal representative of box location

---

## references/wyoming.md

# Wyoming

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

## Safe Deposit Box Rules

### Access After Death
- Joint renter has immediate access
- Without joint renter: letters testamentary from district court required
- Bank may permit examination with death certificate to locate will
- Personal representative needed for full access

### Joint Ownership
- Surviving joint renter has full access rights
- No automatic freeze upon death
- Contents accessible without court involvement

### Best Practices
- Original will should not be stored in safe deposit box
- No state estate or inheritance tax simplifies planning
- Document box contents with estate plan
- Inform personal representative of box location
- Wyoming privacy laws favor confidentiality

---

