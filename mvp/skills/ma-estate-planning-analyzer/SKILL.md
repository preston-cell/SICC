---
name: ma-estate-planning-analyzer
description: Comprehensive analysis of Massachusetts estate planning documents (wills, trusts, powers of attorney, healthcare proxies, beneficiary designations) for legal compliance, tax optimization, and Medicaid/MassHealth planning. Use when analyzing uploaded estate documents for Massachusetts residents, comparing document versions, identifying compliance issues, optimizing tax strategies, or generating reports for individuals or legal professionals. Handles both attorney-drafted and DIY documents. Integrates with structured financial data and natural language goal inputs from other skills.
---

# Massachusetts Estate Planning Analyzer

Analyze Massachusetts estate planning documents for legal compliance, tax efficiency, Medicaid planning, and alignment with client goals. Generate actionable reports with estimated dollar impacts.

## Workflow Overview

1. **Identify user type** → Ask if individual, attorney, or paralegal
2. **Receive inputs** → Documents + structured financial data + goals from companion skill
3. **Validate documents** → Check readability; request clearer copies if needed
4. **Analyze documents** → Run compliance, tax, and Medicaid analysis
5. **Ask clarifying questions** → When encountering unclear areas during analysis
6. **Generate reports** → Deliver separate reports by topic with prioritized action items
7. **Compare versions** → If revised documents provided, compare old vs. new

## Step 1: User Type Identification

Ask upfront:
> "Before I begin, are you an individual reviewing your own estate plan, or are you an attorney/paralegal analyzing client documents? This helps me tailor my analysis and output format."

Store response and adjust output accordingly:
- **Individual**: Explanatory language, avoid legal jargon, include "questions to ask your attorney"
- **Attorney/Paralegal**: Technical language, include MGL citations, case law references, IRS code sections

## Step 2: Document Intake

Accept documents in any format: PDF, Word (.docx), scanned images. If a document is illegible or poor quality, stop and request a clearer copy before proceeding.

Supported document types:
- Wills (including pour-over wills)
- Revocable and irrevocable trusts
- Powers of attorney (financial, healthcare)
- Healthcare proxies
- Beneficiary designations (retirement accounts, life insurance)
- Deed transfers and property documents

**Input from companion skill**: Expect structured JSON with asset values and natural language description of goals/beneficiary intentions.

## Step 3: Document Analysis

### 3.1 Multi-Document Coordination

When multiple documents are uploaded, analyze how they work together:
- Check for inconsistencies between will and trust provisions
- Verify assets are properly titled to fund trusts
- Confirm beneficiary designations align with estate plan intent
- Flag conflicting instructions across documents

### 3.2 DIY vs. Attorney-Drafted Detection

Identify DIY documents by indicators:
- Generic templates, missing customization
- Lack of attorney attestation
- Common form-based language

**For DIY documents**: Apply more rigorous execution review (witness requirements, notarization, attestation clauses). Flag all potential defects.

### 3.3 Rewrite Recommendation

Flag when documents should be entirely rewritten rather than amended:
- Multiple critical compliance failures
- Significant law changes since execution
- Fundamental structural issues
- Documents predating major life changes not reflected

Still provide complete analysis even when recommending rewrite—show the person why updates are needed.

## Step 4: Compliance Analysis

See `references/ma-compliance.md` for detailed Massachusetts requirements.

Check for:
- **Execution defects**: Witness requirements (2 witnesses for wills), notarization, attestation clauses
- **Statutory compliance**: Elective share provisions, homestead declarations, pretermitted heir rules
- **Trust validity**: Proper funding, trustee succession, distribution standards
- **POA requirements**: Statutory form compliance, agent powers, durability language
- **Healthcare proxy**: HIPAA authorization, end-of-life directives

## Step 5: Tax Optimization Analysis

See `references/tax-strategies.md` for detailed strategies by asset level.

### 5.1 Gather Current Rates

Before calculating, verify current tax thresholds via web search:
- Massachusetts estate tax threshold (currently $2M with cliff effect)
- Federal estate tax exemption
- Gift tax annual exclusion
- Current tax rates

### 5.2 Asset-Based Strategy Selection

Present tax optimization options based on estate size. Allow user to choose aggressiveness level:

**Conservative** (standard strategies):
- Credit shelter trusts
- Portability elections
- Annual gift exclusion usage

**Moderate** (additional planning):
- Irrevocable life insurance trusts (ILITs)
- Qualified personal residence trusts (QPRTs)
- Charitable remainder trusts

**Advanced** (sophisticated planning):
- Grantor retained annuity trusts (GRATs)
- Dynasty trusts
- Family limited partnerships
- Charitable lead trusts

### 5.3 Dollar Impact Calculations

For each recommendation, calculate and show:
- Current tax exposure under existing plan
- Projected tax with recommended strategy
- Estimated savings
- **Provide total potential savings summary at end**

Example: "By implementing a credit shelter trust, your estate could save approximately $X in Massachusetts estate tax."

### 5.4 Massachusetts-Specific Considerations

Only mention when thresholds are exceeded:
- **$2M cliff effect**: Only discuss when estate exceeds $2M
- Explain that MA taxes entire estate once threshold is crossed, not just excess

## Step 6: Medicaid/MassHealth Planning

See `references/medicaid-planning.md` for detailed MassHealth rules.

Analyze:
- Whether existing irrevocable trusts properly exclude assets from Medicaid eligibility
- Trust structure for asset protection (income-only provisions, limited powers of appointment)
- **5-year look-back period**: Flag recent transfers that could trigger penalty periods
- Long-term care cost projections

## Step 7: Business Interest Analysis

For estates with business interests (sole proprietorships, LLCs, partnerships, S-corps, C-corps, family businesses, real estate holdings):

Analyze how estate documents handle:
- Business ownership transfer on death
- Succession planning provisions
- Buy-sell agreement coordination (if referenced)
- Valuation methods specified
- Key person provisions

Do not analyze operating agreements or buy-sell agreements directly—focus on how estate documents interact with business ownership.

## Step 8: Clarifying Questions

During analysis, when encountering unclear areas:
- Pause and ask specific clarifying questions
- Reference the specific document section causing confusion
- Explain why the information matters for accurate analysis

Examples:
> "In Section 4.2 of your trust, there's a reference to 'the family cottage.' Can you confirm the address and current ownership structure of this property?"

> "Your will mentions distributing 'personal effects' to your children equally. Do you have specific items of significant value that should be addressed separately?"

## Step 9: Report Generation

Generate **separate reports by topic** for easier comprehension:

### Report 1: Compliance Issues
- Categorize by document
- Indicate urgency (Critical / Important / Recommended)
- For attorneys: Include MGL citations

### Report 2: Tax Optimization Opportunities
- Current tax exposure analysis
- Strategy recommendations by aggressiveness level
- Dollar impact for each recommendation
- **Total potential savings summary**

### Report 3: Medicaid/MassHealth Planning
- Current asset protection status
- Look-back period concerns
- Recommendations for improved protection

### Report 4: Document Coordination Issues
- Inconsistencies between documents
- Titling problems
- Beneficiary designation conflicts

### Report 5: Action Summary
- Prioritized checklist of all issues
- Questions to ask your attorney (for individuals)
- Next steps with urgency indicators

## Step 10: Version Comparison

When user provides revised documents after making changes:

1. Compare old and new versions
2. Confirm which issues have been addressed
3. List remaining unresolved issues from original analysis
4. Identify any new issues introduced in revisions
5. Update dollar impact calculations

## Disclaimers

Include in every report:

> "This analysis is for informational and educational purposes only and does not constitute legal advice. Estate planning involves complex legal and tax considerations that vary based on individual circumstances. Please consult with a qualified Massachusetts estate planning attorney before making any changes to your legal documents."

## Non-Massachusetts Residents

If user is not a Massachusetts resident but owns Massachusetts real estate:
- Use discretion on whether to analyze
- If proceeding, focus analysis on how Massachusetts law applies to the MA property only
- Note that comprehensive estate planning requires analysis under their home state's laws

## References

- `references/ma-compliance.md` - Detailed Massachusetts statutory requirements
- `references/tax-strategies.md` - Tax optimization strategies by estate size and aggressiveness
- `references/medicaid-planning.md` - MassHealth eligibility and asset protection rules
