---
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

```markdown
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
```

## Classification Thresholds

These thresholds can be customized in `references/thresholds.md`.

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
