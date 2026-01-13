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
