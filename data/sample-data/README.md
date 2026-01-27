# Sample Data: Chen Family

This directory contains sample/demo data for the EstateAI platform, based on the **Robert Chen** persona used in investor and partner demonstrations.

## Persona Overview

| Attribute       | Value                              |
|-----------------|------------------------------------|
| Name            | Robert Chen                        |
| Age             | 52                                 |
| State           | Massachusetts                      |
| Net Worth       | ~$8.2 million                      |
| Occupation      | VP of Engineering, Tech Company    |
| Family          | Married (Susan), 2 children (19, 16) |
| Estate Plan     | Created 2016 by attorney           |

## Files

| File | Description |
|------|-------------|
| `chen-family-profile.json` | Complete intake data matching the guided flow (personal, family, assets, existing documents, goals) |
| `chen-family-trust-2016.md` | Revocable Living Trust (text representation of 28-page PDF) |
| `chen-robert-pour-over-will.md` | Robert Chen's Pour-Over Will (text representation of 6-page PDF) |
| `chen-robert-poa.md` | Robert Chen's Durable Power of Attorney (text representation of 5-page PDF) |
| `chen-susan-pour-over-will.md` | Susan Chen's Pour-Over Will (text representation of 6-page PDF) |
| `chen-family-gap-analysis.json` | Expected gap analysis results with seeded gaps and risk score |
| `chen-family-contacts.json` | Key people in the estate plan with roles |
| `chen-beneficiary-designations.json` | Beneficiary designations on retirement and insurance accounts |

## Seeded Gaps (for demo)

These gaps are intentionally present to demonstrate EstateAI's detection capabilities:

1. **Critical:** Successor trustee (David Chen, brother) deceased in 2022
2. **High:** No digital asset provisions in trust (pre-dates crypto holdings)
3. **High:** No healthcare proxy / advance directive on file
4. **Medium:** Outdated asset schedule (vacation property acquired 2019 not in trust)
5. **Medium:** Deceased alternate executor in pour-over will (same brother)
6. **Medium:** Deceased successor agent in durable POA (same brother)
7. **Advisory:** Trust created 8+ years ago, general review recommended
8. **Advisory:** No HIPAA authorization on file

## Usage

- **Demo presentations:** Upload the `.md` document files as sample estate planning documents
- **Development/testing:** Use `chen-family-profile.json` to seed intake data via the guided flow
- **Gap analysis testing:** Compare AI output against `chen-family-gap-analysis.json` expected results
- **Note:** Healthcare proxy is intentionally omitted to demonstrate missing document detection

## Important

This is entirely fictional demo data. No real persons, addresses, or account numbers are represented.
