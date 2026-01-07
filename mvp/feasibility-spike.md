# EstateAI: Feasibility Spike

## Overview

This document outlines the feasibility validation approach for the core EstateAI gap analysis capabilities. The spike focuses on proving technical viability before full MVP development.

**Target Segment Reminder:** High-net-worth individuals with $2M–$50M in assets who have existing estate plans that need review.

---

## Spike 1: Document Parsing & Element Extraction

### Objective

Validate that we can accurately extract structured information from attorney-drafted estate planning documents.

### Test Documents

1. **Revocable Living Trust** (attorney-drafted, 25 pages)
2. **Simple Will** (attorney-drafted, 8 pages)
3. **Pour-over Will** (attorney-drafted, 5 pages)
4. **Durable Power of Attorney** (attorney-drafted, 6 pages)
5. **Trust with Amendments** (multiple documents)
6. **Scanned Trust** (OCR challenge)

### Data Points to Extract

**From Trusts:**
- Trust name and type
- Grantor(s) name(s)
- Trustee(s) and successor trustees
- Beneficiaries and distribution provisions
- Assets referenced
- Special provisions (spendthrift, incapacity, etc.)
- Execution date and state

**From Wills:**
- Testator name
- Executor and alternate executor
- Guardian nominations (if applicable)
- Specific bequests
- Residuary clause
- Witness information
- Execution date and state

**From POAs:**
- Principal name
- Agent(s) and successor agents
- Powers granted
- Effective date provisions
- State of execution

### Success Criteria

- [ ] >90% accuracy on native PDFs for key elements
- [ ] >80% accuracy on scanned PDFs
- [ ] Correct document type identification 100%
- [ ] Extraction confidence scoring implemented
- [ ] Processing time <60 seconds per document

### Implementation Notes

```python
# Pseudo-code for parsing spike

import pymupdf
from anthropic import Anthropic

def extract_document_text(pdf_path):
    """Extract text from PDF with structure preservation"""
    doc = pymupdf.open(pdf_path)
    pages = []
    for page in doc:
        text = page.get_text("text")
        pages.append({
            "page_num": page.number + 1,
            "text": text
        })
    return pages

EXTRACTION_PROMPT = """
Analyze this estate planning document and extract key information.

Document text (by page):
{document_pages}

First, identify the document type:
- revocable_trust
- irrevocable_trust
- simple_will
- pour_over_will
- durable_poa
- healthcare_proxy
- other

Then extract structured data appropriate to the document type.

For a TRUST, return:
{{
  "document_type": "revocable_trust",
  "trust_name": "...",
  "grantor": {{
    "name": "...",
    "address": "..."
  }},
  "trustees": {{
    "initial": ["..."],
    "successors": ["..."]
  }},
  "beneficiaries": [
    {{
      "name": "...",
      "relationship": "...",
      "distribution": "..."
    }}
  ],
  "assets_referenced": ["..."],
  "special_provisions": ["..."],
  "execution": {{
    "date": "YYYY-MM-DD",
    "state": "XX",
    "notarized": true/false
  }},
  "confidence": 0.0-1.0,
  "extraction_notes": ["..."]
}}

For a WILL, return:
{{
  "document_type": "simple_will",
  "testator": {{
    "name": "...",
    "address": "..."
  }},
  "executor": {{
    "primary": "...",
    "alternate": "..."
  }},
  "guardian": {{
    "primary": "...",
    "alternate": "..."
  }},
  "specific_bequests": [...],
  "residuary_clause": "...",
  "witnesses": ["..."],
  "execution": {{
    "date": "YYYY-MM-DD",
    "state": "XX",
    "self_proving": true/false
  }},
  "confidence": 0.0-1.0,
  "extraction_notes": ["..."]
}}
"""

# Test with sample HNW estate documents
# Measure: accuracy, processing time, confidence calibration
```

### Deliverable

- Jupyter notebook with extraction examples
- Accuracy metrics by document type
- Confidence calibration analysis
- Recommendations for production approach

---

## Spike 2: Gap Detection Engine

### Objective

Validate that we can accurately identify gaps and issues in extracted estate plan data.

### Test Scenarios

1. **Deceased Executor** — Will names executor who has passed away
2. **Unfunded Trust** — Trust exists but no assets referenced
3. **Missing Digital Assets** — No provision for digital accounts
4. **Outdated Beneficiary** — Ex-spouse still named
5. **Missing Contingent** — No backup if primary beneficiary predeceases
6. **Will-Trust Mismatch** — Pour-over will doesn't match trust name
7. **Expired POA** — POA effective only if specific condition met

### Gap Categories to Detect

```python
GAP_TAXONOMY = {
    "critical": [
        {
            "code": "deceased_fiduciary",
            "name": "Deceased or Incapacitated Fiduciary",
            "detection": "Check if named executor/trustee is flagged as deceased",
            "test_input": "Executor: John Smith (deceased 2022)"
        },
        {
            "code": "improper_execution",
            "name": "Document Not Properly Executed",
            "detection": "Check witness count, notarization against state rules",
            "test_input": "Will with 1 witness in state requiring 2"
        },
        {
            "code": "unfunded_trust",
            "name": "Trust Not Funded",
            "detection": "Trust exists but no assets titled to trust",
            "test_input": "Trust document with no asset schedule"
        }
    ],
    "high": [
        {
            "code": "outdated_beneficiary",
            "name": "Outdated Beneficiary Designation",
            "detection": "Beneficiary context suggests change needed",
            "test_input": "Ex-spouse named as primary beneficiary"
        },
        {
            "code": "missing_incapacity",
            "name": "Missing Incapacity Planning",
            "detection": "No POA or healthcare proxy in document set",
            "test_input": "Will + Trust but no POA"
        },
        {
            "code": "missing_digital_assets",
            "name": "No Digital Asset Provisions",
            "detection": "No mention of digital assets, online accounts",
            "test_input": "Trust drafted pre-2015 with no digital provisions"
        }
    ],
    "medium": [
        {
            "code": "missing_contingent",
            "name": "Missing Contingent Beneficiary",
            "detection": "Primary beneficiary named, no alternate",
            "test_input": "All to spouse, no provision if spouse predeceases"
        },
        {
            "code": "document_coordination",
            "name": "Document Coordination Issue",
            "detection": "Will and trust provisions don't align",
            "test_input": "Pour-over will names wrong trust"
        }
    ]
}
```

### Success Criteria

- [ ] >85% true positive rate for critical gaps
- [ ] <10% false positive rate
- [ ] Correct severity classification >90%
- [ ] Risk score correlates with expert assessment
- [ ] Clear explanation generated for each gap

### Implementation Notes

```python
# Pseudo-code for gap detection spike

def detect_gaps(extracted_data, state_rules, user_context=None):
    """
    Run gap detection on extracted document data.

    Args:
        extracted_data: Structured data from extraction
        state_rules: State-specific legal requirements
        user_context: Optional user-provided context (e.g., life changes)

    Returns:
        List of Gap findings with severity and explanations
    """
    gaps = []

    # Check critical gaps
    gaps.extend(check_fiduciary_status(extracted_data))
    gaps.extend(check_execution_requirements(extracted_data, state_rules))
    gaps.extend(check_trust_funding(extracted_data))

    # Check high priority gaps
    gaps.extend(check_beneficiary_currency(extracted_data, user_context))
    gaps.extend(check_incapacity_planning(extracted_data))
    gaps.extend(check_digital_assets(extracted_data))

    # Check medium priority gaps
    gaps.extend(check_contingent_beneficiaries(extracted_data))
    gaps.extend(check_document_coordination(extracted_data))

    # Score and rank
    for gap in gaps:
        gap.risk_score = calculate_risk_score(gap)
        gap.explanation = generate_explanation(gap)

    return sorted(gaps, key=lambda g: g.risk_score, reverse=True)

GAP_DETECTION_PROMPT = """
Analyze this estate plan data for potential gaps and issues.

Extracted Data:
{extracted_data}

State: {state}
State Rules:
{state_rules}

User Context (if provided):
{user_context}

Identify any gaps, issues, or missing provisions. For each finding:
1. Classify severity: critical, high, medium, or advisory
2. Explain what was found
3. Explain why it matters
4. Suggest a remediation

Return as JSON array:
[
  {{
    "gap_type": "...",
    "severity": "critical|high|medium|advisory",
    "title": "Short title",
    "finding": "What we found",
    "impact": "Why it matters",
    "recommendation": "What to do",
    "confidence": 0.0-1.0
  }}
]
"""

# Test with scenarios
# Measure: precision, recall, severity accuracy
```

### Deliverable

- Gap detection test suite with known-answer tests
- Precision/recall metrics by gap type
- False positive analysis
- Recommendations for production calibration

---

## Spike 3: State Rules Engine

### Objective

Validate the approach for encoding and applying state-specific legal requirements.

### Test States

1. **Massachusetts** (MVP state) — Uniform Probate Code adopted, strong legal infrastructure
2. **New York** — Different formalities, EPTL requirements
3. **California** — Complex trust laws, community property
4. **Florida** — Stricter rules, retiree concentration

### Rules to Encode

**Will Execution Requirements:**
- Minimum age
- Witness count
- Witness qualifications
- Notarization requirements
- Self-proving affidavit availability
- Holographic will validity

**Trust Requirements:**
- Formalities
- Required provisions
- Funding requirements
- Amendment procedures

**POA Requirements:**
- Statutory form requirements
- Witness/notary requirements
- Specific powers language

### Success Criteria

- [ ] Rules correctly encoded for 4 test states
- [ ] Validation correctly flags non-compliant documents
- [ ] Rules versioning implemented
- [ ] Update process documented
- [ ] Query performance <100ms

### Implementation Notes

```python
# Pseudo-code for rules engine spike

from pydantic import BaseModel
from typing import List, Optional

class WitnessRequirement(BaseModel):
    count: int
    min_age: int
    cannot_be_beneficiary: bool
    must_sign_in_presence: bool

class ExecutionRequirements(BaseModel):
    witnesses: WitnessRequirement
    notarization_required: bool
    self_proving_available: bool

class StateWillRules(BaseModel):
    state: str
    min_testator_age: int
    execution: ExecutionRequirements
    holographic_valid: bool
    required_clauses: List[str]
    version: str
    effective_date: str

# Massachusetts rules (MVP state)
MA_WILL_RULES = StateWillRules(
    state="MA",
    min_testator_age=18,
    execution=ExecutionRequirements(
        witnesses=WitnessRequirement(
            count=2,
            min_age=18,
            cannot_be_beneficiary=False,  # Recommended but not required in MA
            must_sign_in_presence=True
        ),
        notarization_required=False,
        self_proving_available=True  # MGL c. 192
    ),
    holographic_valid=False,  # MA does NOT recognize holographic wills
    required_clauses=["revocation", "signature", "attestation"],
    version="2024.1",
    effective_date="2024-01-01"
)

def validate_will(extracted_data, state_rules):
    """Validate will against state requirements"""
    issues = []

    # Check witness count
    witness_count = len(extracted_data.get("witnesses", []))
    if witness_count < state_rules.execution.witnesses.count:
        issues.append({
            "type": "execution_error",
            "severity": "critical",
            "message": f"Will has {witness_count} witnesses; {state_rules.state} requires {state_rules.execution.witnesses.count}"
        })

    # Check for self-proving affidavit
    if state_rules.execution.self_proving_available:
        if not extracted_data.get("self_proving"):
            issues.append({
                "type": "missing_self_proving",
                "severity": "advisory",
                "message": "Self-proving affidavit recommended but not present"
            })

    return issues

# Test with documents from each state
# Verify correct rule application
```

### Deliverable

- Rules schema definition
- Rules for 4 test states
- Validation test suite
- Performance benchmarks
- Update procedure documentation

---

## Spike 4: Report Generation

### Objective

Validate that we can generate clear, professional, actionable gap analysis reports.

### Test Cases

1. **Clean Plan** — Few/no issues found
2. **Critical Issues** — Multiple critical gaps
3. **Mixed Severity** — Variety of gap types
4. **Complex Plan** — Trust + Will + POA + Healthcare

### Report Requirements

- Professional design suitable for HNW audience
- Executive summary with risk score
- Prioritized findings by severity
- Plain-English explanations
- Clear recommendations
- Attorney referral call-to-action

### Success Criteria

- [ ] Report renders correctly for all test cases
- [ ] PDF output is professional quality
- [ ] Plain-English explanations validated by non-lawyers
- [ ] Generation time <30 seconds
- [ ] Mobile-friendly web version

### Implementation Notes

```python
# Pseudo-code for report generation spike

from jinja2 import Template
from weasyprint import HTML

REPORT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Professional styling for HNW audience */
        body { font-family: 'Georgia', serif; }
        .header { border-bottom: 2px solid #1a365d; }
        .critical { border-left: 4px solid #e53e3e; }
        .high { border-left: 4px solid #dd6b20; }
        .medium { border-left: 4px solid #d69e2e; }
        .advisory { border-left: 4px solid #3182ce; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Estate Plan Analysis Report</h1>
        <p>Prepared for: {{ client_name }}</p>
        <p>Date: {{ analysis_date }}</p>
    </div>

    <div class="executive-summary">
        <h2>Executive Summary</h2>
        <div class="risk-score">
            Overall Risk Score: {{ risk_score }}/100
        </div>
        <div class="summary-counts">
            <p>Critical Issues: {{ critical_count }}</p>
            <p>High Priority: {{ high_count }}</p>
            <p>Medium Priority: {{ medium_count }}</p>
            <p>Advisory Items: {{ advisory_count }}</p>
        </div>
    </div>

    {% if critical_findings %}
    <div class="findings critical-section">
        <h2>Critical Issues</h2>
        {% for finding in critical_findings %}
        <div class="finding critical">
            <h3>{{ finding.title }}</h3>
            <p><strong>What we found:</strong> {{ finding.finding }}</p>
            <p><strong>Why it matters:</strong> {{ finding.impact }}</p>
            <p><strong>Recommended action:</strong> {{ finding.recommendation }}</p>
        </div>
        {% endfor %}
    </div>
    {% endif %}

    <!-- Continue for other severity levels -->

    <div class="next-steps">
        <h2>Recommended Next Steps</h2>
        <ol>
            {% for step in next_steps %}
            <li>{{ step }}</li>
            {% endfor %}
        </ol>
    </div>

    <div class="cta">
        <h2>Ready to Address These Issues?</h2>
        <p>Connect with a vetted estate planning attorney in your area.</p>
        <a href="{{ attorney_cta_url }}" class="button">Find an Attorney</a>
    </div>
</body>
</html>
"""

def generate_report(analysis_results, user_info):
    """Generate PDF report from analysis results"""
    template = Template(REPORT_TEMPLATE)

    # Group findings by severity
    critical = [f for f in analysis_results.findings if f.severity == "critical"]
    high = [f for f in analysis_results.findings if f.severity == "high"]
    medium = [f for f in analysis_results.findings if f.severity == "medium"]
    advisory = [f for f in analysis_results.findings if f.severity == "advisory"]

    html_content = template.render(
        client_name=user_info.name,
        analysis_date=analysis_results.date,
        risk_score=analysis_results.risk_score,
        critical_count=len(critical),
        high_count=len(high),
        medium_count=len(medium),
        advisory_count=len(advisory),
        critical_findings=critical,
        high_findings=high,
        medium_findings=medium,
        advisory_findings=advisory,
        next_steps=generate_next_steps(analysis_results),
        attorney_cta_url="/find-attorney"
    )

    # Generate PDF
    pdf = HTML(string=html_content).write_pdf()
    return pdf

# Test with various analysis results
# Get feedback from test users
```

### Deliverable

- Report template (HTML/CSS)
- PDF rendering pipeline
- Sample reports for each test case
- User feedback on clarity/usefulness
- Performance metrics

---

## Spike Timeline

| Spike | Duration | Dependencies |
|-------|----------|--------------|
| Document Parsing | 4–5 days | Sample HNW documents |
| Gap Detection | 4–5 days | Parsing spike complete |
| Rules Engine | 3–4 days | State law research |
| Report Generation | 3–4 days | Gap detection complete |

**Total: 3–4 weeks**

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Document parsing accuracy insufficient | Medium | High | OCR fallback; confidence scoring; human review for low confidence |
| Gap detection false positives | Medium | Medium | Conservative thresholds; user verification step |
| State rules complexity | High | Medium | Start with CA only; modular design |
| Report clarity for HNW audience | Medium | Medium | User testing; professional design review |
| Processing time too slow | Low | Medium | Async processing; progress indicators |

---

## Next Steps After Spikes

1. Evaluate spike results against success criteria
2. Identify necessary adjustments to architecture
3. Refine gap taxonomy based on findings
4. Create detailed MVP specification
5. Begin MVP development

---

## Appendix: Sample Test Data

### Test Case: Complex HNW Estate

```json
{
  "client": {
    "name": "Robert and Susan Chen",
    "state": "MA",
    "net_worth_range": "$5M-$10M"
  },
  "documents": [
    {
      "type": "revocable_trust",
      "name": "Chen Family Trust",
      "date": "2015-03-15",
      "pages": 32
    },
    {
      "type": "pour_over_will",
      "testator": "Robert Chen",
      "date": "2015-03-15",
      "pages": 6
    },
    {
      "type": "pour_over_will",
      "testator": "Susan Chen",
      "date": "2015-03-15",
      "pages": 6
    },
    {
      "type": "durable_poa",
      "principal": "Robert Chen",
      "date": "2015-03-15",
      "pages": 5
    }
  ],
  "known_gaps": [
    {
      "type": "missing_digital_assets",
      "severity": "high",
      "reason": "Trust pre-dates digital asset provisions"
    },
    {
      "type": "deceased_successor_trustee",
      "severity": "critical",
      "reason": "Named successor trustee (brother) died 2020"
    },
    {
      "type": "missing_healthcare_proxy",
      "severity": "high",
      "reason": "No healthcare directive in document set"
    },
    {
      "type": "outdated_asset_schedule",
      "severity": "medium",
      "reason": "Trust schedule doesn't include properties acquired since 2015"
    }
  ],
  "expected_risk_score": 72
}
```
