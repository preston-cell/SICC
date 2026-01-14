/**
 * State-Specific Analysis Modules
 *
 * Contains specialized prompts and reference data for state-specific
 * estate planning analysis. Currently supports Massachusetts.
 */

// Massachusetts-specific analysis prompt
export const MA_COMPLIANCE_REFERENCE = `
## Massachusetts Estate Planning Compliance

### Will Requirements (MGL c. 190B, § 2-502)
- Testator must be 18+ years old and of sound mind
- Will must be in writing and signed by testator
- Must be signed by at least 2 witnesses
- Self-proving affidavit recommended (MGL c. 190B, § 2-504)

### Execution Defects to Flag
- Missing witness signatures
- Only one witness
- No attestation clause
- Undated document
- Alterations without re-execution

### Power of Attorney (MGL Chapter 190B, Article V)
- Must be signed by principal
- Must be witnessed by 2 disinterested witnesses
- Must be notarized
- MUST include durability language to survive incapacity

### Healthcare Proxy (MGL Chapter 201D)
- Must be in writing, signed by principal
- Must be witnessed by 2 adult witnesses
- Witnesses cannot be: healthcare agent, healthcare provider/employee
- HIPAA authorization is critical

### Homestead Declaration (MGL Chapter 188)
- Automatic: $125,000 protection (no filing required)
- Declared: Up to $500,000 protection (must record at Registry of Deeds)
- Flag if high-value home and no declared homestead

### Elective Share (MGL c. 190B, § 2-201)
- Surviving spouse may elect to take elective share instead of will bequest
- Cannot completely disinherit spouse without waiver
- Flag if will attempts to disinherit spouse without waiver evidence

### Pretermitted Heirs (MGL c. 190B, § 2-302)
- Child born/adopted after will entitled to intestate share unless will shows intent to exclude
- Flag wills predating birth of children
`;

export const MA_TAX_REFERENCE = `
## Massachusetts Estate Tax Analysis

### Key Facts
- Threshold: $2,000,000 (one of lowest in nation)
- CLIFF EFFECT: Once estate exceeds $2M, ENTIRE estate is taxed (not just excess)
- Rates: Graduated from 0.8% to 16%
- NO PORTABILITY: Unlike federal, unused exemption cannot transfer to surviving spouse

### Cliff Effect Impact
- Estate of $1,999,999 = $0 MA tax
- Estate of $2,000,001 = ~$99,600 MA tax
- Creates significant planning opportunities

### Strategy Recommendations by Estate Size

**Under $2M**: Focus on probate avoidance, simple planning

**$2M - $3M (Near Threshold)**:
- Credit Shelter Trust (preserves first spouse's exemption)
- Lifetime gifting program
- Charitable giving to reduce below $2M

**$3M - $6M**:
- Irrevocable Life Insurance Trust (ILIT)
- Qualified Personal Residence Trust (QPRT)
- Annual gift exclusion maximization

**$6M+**:
- All above strategies plus
- Grantor Retained Annuity Trusts (GRATs)
- Dynasty trusts
- Family Limited Partnerships

### Credit Shelter Trust Analysis
For married couples with combined estate over $2M:
- On first death, assets up to $2M pass to trust (not outright to spouse)
- Surviving spouse can receive income and limited principal
- Assets NOT included in surviving spouse's estate
- Can save $200,000+ in MA estate tax

### ILIT Analysis
If significant life insurance owned individually:
- $2M policy owned by decedent = $2M added to estate
- Same policy in ILIT = $0 added to estate
- At 16% rate = up to $320,000 savings
`;

export const MA_MEDICAID_REFERENCE = `
## MassHealth/Medicaid Planning Analysis

### Why This Matters
- Nursing home costs in MA: $12,000-$15,000+/month
- Medicare does NOT cover long-term custodial care
- Without planning, assets depleted before Medicaid coverage

### Eligibility Requirements
- Asset Limit (individual): $2,000 in countable assets
- Asset Limit (married, one in facility): ~$154,000 CSRA for community spouse

### Countable Assets (Must Spend Down)
- Bank accounts, investments, retirement accounts
- Cash value life insurance over $1,500
- Real estate (other than primary residence)
- Vehicles beyond one
- Trusts with accessible assets

### Exempt Assets (Not Counted)
- Primary residence (with equity limit ~$1,071,000)
- One vehicle
- Personal belongings
- Prepaid funeral/burial (irrevocable)
- Term life insurance

### 5-Year Look-Back Period
- MassHealth reviews ALL transfers for 5 years before application
- Transfers for less than fair market value trigger penalty period
- Penalty = value transferred ÷ average monthly cost (~$13,000)

**Example**: $130,000 transferred 3 years ago = 10-month penalty period

### Irrevocable Trust Requirements for Asset Protection
Trust MUST be:
- Irrevocable (cannot revoke/amend)
- 5+ years old at MassHealth application
- Grantor cannot access principal
- Grantor cannot change beneficiaries

Trust MUST NOT:
- Allow grantor to access principal
- Require distributions for "health, maintenance, support"
- Give grantor control over principal

### Flag These Issues
- Revocable trust being relied on for asset protection (NO protection)
- Irrevocable trust with principal access (COUNTABLE)
- Recent transfers within 5 years
- No spousal protection planning for married couples
`;

export const FINANCIAL_PROFILE_CLASSIFIER = `
## Financial Profile Classification

Classify the estate to determine planning complexity and appropriate strategies:

### Asset Ranges
- Under $250K: Minimal planning needs
- $250K-$1M: Standard estate planning
- $1M-$5M: Comprehensive planning recommended
- $5M+: Complex planning required

### Estate Complexity Determination

**Low Complexity**:
- Assets under $1M
- Primarily home + retirement accounts
- No business ownership
- Simple family structure

**Moderate Complexity**:
- Assets $1M-$5M
- Multiple asset types
- May include rental property or small business
- Some illiquid holdings

**High Complexity**:
- Assets $5M+
- Business ownership or significant illiquid assets
- Highly concentrated holdings
- Blended family, multiple marriages
- Complex investment structures

### Classification Impact on Recommendations
- Low: Focus on basic documents, beneficiary designations
- Moderate: Add tax planning, trust considerations
- High: Comprehensive analysis including advanced strategies
`;

// Function to get state-specific analysis content
export function getStateSpecificContent(state: string): {
  complianceReference: string;
  taxReference: string;
  medicaidReference: string;
  isSupported: boolean;
} {
  const normalizedState = state.toLowerCase().trim();

  // Massachusetts variations
  if (normalizedState === 'massachusetts' ||
      normalizedState === 'ma' ||
      normalizedState === 'mass') {
    return {
      complianceReference: MA_COMPLIANCE_REFERENCE,
      taxReference: MA_TAX_REFERENCE,
      medicaidReference: MA_MEDICAID_REFERENCE,
      isSupported: true,
    };
  }

  // Default - no state-specific content
  return {
    complianceReference: '',
    taxReference: '',
    medicaidReference: '',
    isSupported: false,
  };
}

// Get financial profile classification prompt
export function getFinancialProfilePrompt(): string {
  return FINANCIAL_PROFILE_CLASSIFIER;
}
