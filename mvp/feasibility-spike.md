# EstateAI: Feasibility Spike

## Overview

This document outlines the feasibility validation approach for the core EstateAI capabilities. The spike focuses on proving technical viability before full MVP development.

---

## Spike 1: Conversational Data Gathering

### Objective
Validate that Claude can conduct adaptive, natural conversations to gather estate planning information.

### Test Scenarios

#### Scenario 1: Simple Will - Single Person
- No spouse, no children
- Single property, bank accounts
- Expected: 5-8 turns of conversation

#### Scenario 2: Simple Will - Married with Children
- Married, 2 minor children
- House, retirement accounts, modest assets
- Expected: 10-15 turns of conversation

#### Scenario 3: Edge Case Handling
- Unclear answers
- Changed responses
- Complex family situations

### Success Criteria
- [ ] Natural, non-robotic conversation flow
- [ ] Adaptive follow-up questions
- [ ] Accurate extraction of structured data
- [ ] Handles ambiguity gracefully
- [ ] Completes in reasonable time (<10 minutes)

### Implementation Notes
```python
# Pseudo-code for conversation spike

SYSTEM_PROMPT = """
You are an estate planning assistant helping users create a will.
Your role is to gather information through natural conversation.

Gather the following information:
- Full legal name
- State of residence
- Marital status
- Children (names, ages, special needs)
- Executor nomination
- Alternate executor
- Guardian for minor children (if applicable)
- Asset overview
- Specific bequests
- Residuary beneficiary

Guidelines:
- Ask one question at a time
- Use plain language, explain legal terms
- Ask follow-up questions when answers are unclear
- Confirm critical information
- Be warm and reassuring

When you have gathered all necessary information, output a JSON
summary wrapped in <estate_data> tags.
"""

# Test with various user personas
# Measure: turns to completion, data accuracy, user experience
```

### Deliverable
- Jupyter notebook with conversation examples
- Analysis of extraction accuracy
- UX observations and recommendations

---

## Spike 2: Document Parsing & Analysis

### Objective
Validate that we can extract structured information from existing estate planning documents.

### Test Documents
1. Simple typed will (PDF)
2. Complex will with trusts (PDF)
3. Will from attorney (scanned PDF)
4. Trust document (DOCX)
5. Handwritten will (image) - stretch goal

### Data Points to Extract
- Document type
- Testator/Grantor name
- Date of execution
- State of execution
- Executor(s) named
- Guardian(s) named (if applicable)
- Beneficiaries and distributions
- Specific bequests
- Residuary clause
- Trust provisions (if any)
- Witnesses (names if available)

### Success Criteria
- [ ] >90% accuracy on typed PDFs
- [ ] >80% accuracy on scanned PDFs
- [ ] Correct document type identification
- [ ] Identifies missing or unclear elements
- [ ] Processing time <30 seconds

### Implementation Notes
```python
# Pseudo-code for parsing spike

import pymupdf
from anthropic import Anthropic

def extract_text(pdf_path):
    """Extract text from PDF"""
    doc = pymupdf.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

EXTRACTION_PROMPT = """
Analyze this estate planning document and extract key information.

Document text:
{document_text}

Extract and return as JSON:
{{
  "document_type": "will|trust|poa|healthcare_proxy|unknown",
  "testator_name": "...",
  "date_executed": "YYYY-MM-DD or null",
  "state": "XX or null",
  "executor": {{
    "primary": "...",
    "alternate": "..."
  }},
  "guardian": {{
    "primary": "...",
    "alternate": "..."
  }},
  "beneficiaries": [...],
  "specific_bequests": [...],
  "residuary_clause": "...",
  "trust_provisions": [...],
  "potential_issues": [...],
  "confidence_score": 0.0-1.0
}}
"""

# Test with sample documents
# Measure: accuracy, processing time, edge case handling
```

### Deliverable
- Jupyter notebook with parsing examples
- Accuracy metrics by document type
- Recommendations for production approach

---

## Spike 3: Document Generation

### Objective
Validate that we can generate legally appropriate documents from structured data.

### Test Cases
1. California Simple Will - Single person
2. California Simple Will - Married with minor children
3. California Simple Will - With specific bequests

### Validation Criteria
- [ ] Includes all required California statutory language
- [ ] Correct signature and witness blocks
- [ ] Appropriate execution instructions
- [ ] Professional formatting
- [ ] Self-proving affidavit option

### Implementation Notes
```python
# Pseudo-code for generation spike

from docx import Document
from jinja2 import Template

WILL_TEMPLATE = """
LAST WILL AND TESTAMENT OF {{ testator.name|upper }}

I, {{ testator.name }}, a resident of {{ testator.city }},
{{ testator.county }} County, California, being of sound mind,
declare this to be my Last Will and Testament. I revoke all
prior wills and codicils.

ARTICLE I - FAMILY
{% if testator.spouse %}
I am married to {{ testator.spouse.name }}.
{% endif %}
{% if testator.children %}
I have the following children: {{ testator.children|join(', ') }}.
{% endif %}

ARTICLE II - DEBTS AND EXPENSES
...

[Continue with full template structure]
"""

# Generate documents from test data
# Review with legal advisor
# Measure: completeness, correctness, formatting
```

### Deliverable
- Sample generated documents (PDF)
- Template structure documentation
- Legal review feedback

---

## Spike 4: Rules Engine Validation

### Objective
Validate the approach for state-specific legal requirement handling.

### Test States
1. California (MVP state)
2. Texas (different requirements)
3. Florida (notary requirements)

### Rules to Validate
- Witness requirements
- Notarization requirements
- Age requirements
- Holographic will rules
- Self-proving affidavit availability

### Implementation Notes
```python
# Pseudo-code for rules spike

CALIFORNIA_WILL_RULES = {
    "minimum_age": 18,
    "witnesses": {
        "required": True,
        "count": 2,
        "requirements": [
            "adult",
            "not_beneficiary_recommended",
            "sign_in_presence"
        ]
    },
    "notarization": {
        "required": False,
        "self_proving_available": True
    },
    "holographic_allowed": True
}

def validate_will_data(data, state):
    """Validate will data against state rules"""
    rules = get_rules(state, "will")
    issues = []

    # Check witness count
    if len(data.get("witnesses", [])) < rules["witnesses"]["count"]:
        issues.append({
            "type": "error",
            "field": "witnesses",
            "message": f"{state} requires {rules['witnesses']['count']} witnesses"
        })

    # Continue validation...

    return issues

# Test with various state/data combinations
```

### Deliverable
- Rules schema documentation
- Validation test results
- Recommendations for rules database design

---

## Spike Timeline

| Spike | Duration | Dependencies |
|-------|----------|--------------|
| Conversational Gathering | 3-4 days | Claude API access |
| Document Parsing | 3-4 days | Sample documents |
| Document Generation | 3-4 days | Template design, legal review |
| Rules Engine | 2-3 days | State research |

**Total: 2-3 weeks**

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LLM accuracy insufficient | Medium | High | Validation layer, human review |
| Document parsing fails on scans | Medium | Medium | Use OCR service, limit to typed |
| State rules complexity | High | Medium | Start with CA only, modular design |
| Legal template accuracy | Medium | High | Attorney review, conservative approach |

---

## Next Steps After Spikes

1. Evaluate spike results against success criteria
2. Identify necessary adjustments to architecture
3. Create detailed MVP specification
4. Begin MVP development

---

## Appendix: Sample Test Data

### Test User: Sarah Chen

```json
{
  "name": "Sarah Marie Chen",
  "state": "CA",
  "city": "San Francisco",
  "county": "San Francisco",
  "marital_status": "married",
  "spouse": {
    "name": "Michael David Chen"
  },
  "children": [
    {"name": "Emily Chen", "age": 8, "special_needs": false},
    {"name": "James Chen", "age": 5, "special_needs": false}
  ],
  "executor": {
    "primary": "Michael David Chen",
    "relationship": "spouse",
    "alternate": "Jennifer Chen",
    "alternate_relationship": "sister"
  },
  "guardian": {
    "primary": "Jennifer Chen",
    "relationship": "sister",
    "alternate": "Robert Chen",
    "alternate_relationship": "brother"
  },
  "assets": {
    "real_property": ["123 Main St, San Francisco, CA"],
    "accounts": ["Bank of America checking", "Fidelity 401k"],
    "other": ["2020 Toyota Camry", "Jewelry"]
  },
  "specific_bequests": [
    {
      "item": "Grandmother's diamond ring",
      "beneficiary": "Emily Chen"
    }
  ],
  "residuary": {
    "primary": "Michael David Chen",
    "contingent": "children in equal shares"
  }
}
```
