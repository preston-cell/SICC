# EstateAI: Feasibility Spike

## Overview

This document outlines the feasibility validation approach for the core EstateAI gap analysis capabilities. The spike focuses on proving technical viability before full MVP development.

**Target Segment Reminder:** High-net-worth individuals with $2M–$50M in assets who have existing estate plans that need review.

**Architecture:** Next.js + Convex + E2B with Claude Code CLI

---

## Spike 1: Claude Code Estate Planning Analysis

### Objective

Validate that Claude Code can accurately analyze estate planning situations and generate appropriate gap analysis reports and draft documents within E2B sandboxes.

### Test Prompts

```typescript
const TEST_PROMPTS = [
  // Gap Analysis Request
  `Analyze this estate planning situation for a Massachusetts resident:
  - Age 55, married with 2 adult children
  - Net worth $8.2M
  - Has a 2016 revocable trust
  - Brother (named successor trustee) passed away in 2022
  - Acquired vacation property in 2019
  - Has cryptocurrency holdings
  - No healthcare proxy on file

  Identify gaps, risks, and generate a prioritized report.`,

  // Document Generation Request
  `Generate a draft Healthcare Power of Attorney for a Massachusetts resident:
  - Principal: Robert Chen, age 52
  - Agent: Susan Chen (spouse)
  - Successor Agent: Jennifer Chen (adult daughter)
  - Include HIPAA authorization

  Use Massachusetts statutory form requirements.`,

  // Gap Detection Test
  `Review this estate plan summary and identify conflicts:
  - Will leaves 50% to spouse, 50% to children
  - IRA beneficiary designation: 100% to ex-spouse (divorced 2020)
  - Joint bank account with adult son
  - Trust names deceased brother as successor trustee

  List all conflicts and their priority.`,
];
```

### Test Implementation (Convex Action)

```typescript
// convex/spikeTests.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Sandbox } from "@e2b/code-interpreter";

export const runSpikeTest = action({
  args: {
    testPrompt: v.string(),
    testName: v.string(),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    try {
      // Create E2B sandbox
      const sandbox = await Sandbox.create({
        apiKey: process.env.E2B_API_KEY,
      });

      // Install Claude Code
      await sandbox.process.startAndWait(
        "npm install -g @anthropic-ai/claude-code"
      );

      // Run estate planning analysis
      const result = await sandbox.process.startAndWait(
        `ANTHROPIC_API_KEY=${process.env.ANTHROPIC_API_KEY} claude-code "${args.testPrompt}"`,
        { timeout: 300000 }
      );

      // Collect generated files
      const files = await sandbox.filesystem.list("/home/user");
      const generatedFiles = [];

      for (const file of files) {
        if (file.isFile) {
          const content = await sandbox.filesystem.read(file.path);
          generatedFiles.push({
            name: file.name,
            size: file.size,
            content: content.substring(0, 500), // Preview
          });
        }
      }

      await sandbox.close();

      const endTime = Date.now();

      return {
        testName: args.testName,
        success: true,
        executionTime: endTime - startTime,
        output: result.stdout,
        filesGenerated: generatedFiles.length,
        files: generatedFiles,
      };
    } catch (error) {
      return {
        testName: args.testName,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  },
});
```

### Success Criteria

- [ ] Claude Code successfully runs in E2B sandbox
- [ ] Gap analysis prompts produce structured, prioritized reports
- [ ] Document generation produces properly formatted drafts
- [ ] Execution time <5 minutes per request
- [ ] Generated files are retrievable from sandbox

### Deliverable

- Working Convex action for running Claude Code in E2B
- Test results for each prompt type
- Performance benchmarks
- Recommendations for prompt engineering

---

## Spike 2: Gap Detection Accuracy

### Objective

Validate that Claude Code accurately identifies gaps and issues in described estate planning scenarios.

### Test Scenarios

| Scenario | Expected Gaps | Severity |
|----------|---------------|----------|
| Deceased Executor | Executor unavailable | Critical |
| Unfunded Trust | Assets not titled to trust | Critical |
| Missing Digital Assets | No crypto/digital provisions | High |
| Outdated Beneficiary | Ex-spouse still named | High |
| Missing Contingent | No backup beneficiary | Medium |
| Will-Trust Mismatch | Names don't align | High |
| Missing Healthcare Proxy | No incapacity planning | High |

### Test Prompt Structure

```typescript
const gapDetectionTest = `
You are an estate planning analyst. Given the following estate plan description, identify ALL gaps, risks, and issues.

Estate Plan Summary:
- State: Massachusetts
- Net Worth: $8.2M
- Family: Married, 2 adult children
- Current Documents:
  * Revocable Living Trust (2016)
    - Trustees: Robert Chen, Susan Chen
    - Successor Trustee: David Chen (brother, deceased 2022)
    - Beneficiaries: Children equally
  * Pour-over Will (2016)
    - Executor: Susan Chen
    - Alternate Executor: David Chen (deceased)
  * Durable POA (2016)
    - Agent: Susan Chen
    - Successor Agent: David Chen (deceased)
- Missing Documents:
  * No Healthcare Proxy
  * No HIPAA Authorization
- Asset Issues:
  * Vacation property (2019) not in trust
  * Cryptocurrency holdings not addressed

For each gap found, provide:
1. Gap type (critical/high/medium/advisory)
2. What's wrong
3. Why it matters
4. Recommended action

Format as a structured JSON response.
`;
```

### Expected Output Validation

```typescript
interface ExpectedGap {
  type: "critical" | "high" | "medium" | "advisory";
  code: string;
  description: string;
}

const EXPECTED_GAPS: ExpectedGap[] = [
  { type: "critical", code: "deceased_successor_trustee", description: "Successor trustee is deceased" },
  { type: "critical", code: "deceased_alternate_executor", description: "Alternate executor is deceased" },
  { type: "critical", code: "deceased_successor_poa_agent", description: "Successor POA agent is deceased" },
  { type: "high", code: "missing_healthcare_proxy", description: "No healthcare decision authority" },
  { type: "high", code: "missing_hipaa", description: "No HIPAA authorization" },
  { type: "high", code: "unfunded_trust_asset", description: "Vacation property not in trust" },
  { type: "high", code: "missing_digital_assets", description: "No cryptocurrency provisions" },
];

function validateGapDetection(aiOutput: string, expected: ExpectedGap[]): {
  found: number;
  missed: number;
  falsePositives: number;
  accuracy: number;
} {
  // Parse AI output and compare to expected gaps
  // Return accuracy metrics
}
```

### Success Criteria

- [ ] >85% true positive rate (finds expected gaps)
- [ ] <10% false positive rate (identifies gaps that aren't there)
- [ ] Correct severity classification >90%
- [ ] Clear, actionable recommendations

### Deliverable

- Test suite with validation logic
- Accuracy metrics across test scenarios
- Gap taxonomy refinement recommendations

---

## Spike 3: State Rules Integration

### Objective

Validate the approach for integrating state-specific legal requirements into Claude Code prompts.

### Test States

1. **Massachusetts** (MVP state) — Uniform Probate Code adopted, strong legal infrastructure
2. **New York** — Different formalities, EPTL requirements
3. **California** — Complex trust laws, community property
4. **Florida** — Stricter rules, retiree concentration

### State Rules Prompt Template

```typescript
const MASSACHUSETTS_RULES_CONTEXT = `
## Massachusetts Estate Planning Rules

### Will Execution Requirements (MGL c. 190B)
- Testator must be 18+ years old
- Must be signed by testator or by another at testator's direction
- Requires 2 witnesses who sign in presence of testator
- Holographic (handwritten) wills are NOT valid in MA
- Self-proving affidavit recommended but not required

### Trust Requirements
- Revocable trusts require written instrument
- Trust must have ascertainable beneficiary
- Trustee must have duties to perform

### Power of Attorney (MGL c. 190B)
- Must be signed by principal
- Requires notarization for durable POA
- Statutory form available

### Healthcare Proxy (MGL c. 201D)
- Separate document from living will
- Requires 2 witnesses
- Witnesses cannot be agent or alternate

### Key Massachusetts Considerations
- No state estate tax on estates under $2M
- Elective share: surviving spouse can claim statutory share
- Community property not recognized (separate property state)
`;

const stateAwarePrompt = (userSituation: string, state: string) => `
${state === "MA" ? MASSACHUSETTS_RULES_CONTEXT : getStateRules(state)}

Given these state-specific rules, analyze the following estate planning situation:

${userSituation}

Ensure all recommendations comply with ${state} law.
`;
```

### Success Criteria

- [ ] Claude Code correctly applies state-specific rules
- [ ] Identifies state-specific compliance issues
- [ ] Generates state-compliant document drafts
- [ ] No incorrect legal information in output

### Deliverable

- State rules context templates for MA, NY, CA, FL
- Validation tests for state-specific outputs
- Prompt engineering recommendations

---

## Spike 4: Document Generation Quality

### Objective

Validate that Claude Code can generate professional-quality draft legal documents.

### Test Documents

1. **Last Will and Testament** (Massachusetts statutory form)
2. **Healthcare Power of Attorney** (Massachusetts statutory form)
3. **HIPAA Authorization**
4. **Gap Analysis Report** (formatted markdown)

### Generation Prompt Example

```typescript
const documentGenerationPrompt = `
Generate a draft Massachusetts Healthcare Power of Attorney document.

Principal Information:
- Name: Robert Chen
- Address: 123 Main Street, Boston, MA 02101
- Date of Birth: January 15, 1972

Agent Information:
- Primary Agent: Susan Chen (spouse)
  - Address: 123 Main Street, Boston, MA 02101
  - Phone: (617) 555-1234
- Successor Agent: Jennifer Chen (daughter)
  - Address: 456 Oak Avenue, Cambridge, MA 02139
  - Phone: (617) 555-5678

Requirements:
1. Use Massachusetts statutory form language where applicable (MGL c. 201D)
2. Include HIPAA authorization section
3. Include provision for end-of-life decisions
4. Add signature blocks for principal and 2 witnesses
5. Include notary acknowledgment section

Output as a properly formatted document that could be printed and executed.
Add clear "DRAFT - FOR REVIEW ONLY" watermark language.
`;
```

### Quality Metrics

| Metric | Target |
|--------|--------|
| Legal accuracy | >95% |
| Proper formatting | 100% |
| Complete sections | 100% |
| Draft disclaimer present | 100% |
| State compliance | 100% |

### Success Criteria

- [ ] Documents include all required sections
- [ ] Proper legal language used
- [ ] Clear "DRAFT" disclaimers present
- [ ] Formatting suitable for attorney review
- [ ] State-specific requirements addressed

### Deliverable

- Sample generated documents
- Quality assessment checklist
- Template improvement recommendations

---

## Spike 5: Real-Time Updates & UX

### Objective

Validate that Convex real-time subscriptions provide good UX during long-running analyses.

### Test Implementation

```typescript
// Frontend component
function AnalysisStatus({ runId }: { runId: Id<"agentRuns"> }) {
  const run = useQuery(api.queries.getRun, { runId });
  const files = useQuery(api.queries.getFilesForRun, { runId });

  if (!run) return <LoadingSpinner />;

  return (
    <div>
      <StatusBadge status={run.status} />

      {run.status === "running" && (
        <ProgressIndicator
          message="Analyzing estate planning situation..."
        />
      )}

      {run.status === "completed" && (
        <>
          <OutputDisplay output={run.output} />
          <FileList files={files} />
        </>
      )}

      {run.status === "failed" && (
        <ErrorDisplay error={run.error} />
      )}
    </div>
  );
}
```

### Success Criteria

- [ ] Status updates appear within 1 second of change
- [ ] No polling required (true real-time)
- [ ] Graceful handling of long-running operations
- [ ] Clear feedback during processing
- [ ] Error states displayed appropriately

### Deliverable

- Working real-time status component
- UX recommendations
- Performance measurements

---

## Test Data

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

---

## Next Steps After Spikes

1. Evaluate spike results against success criteria
2. Refine prompts based on findings
3. Build production Convex actions
4. Implement full gap analysis workflow
5. Create document template library
6. Begin MVP development

---

## Environment Setup for Spikes

```bash
# Clone repository
git clone https://github.com/preston-cell/SICC.git
cd SICC

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your keys:
# - ANTHROPIC_API_KEY
# - E2B_API_KEY
# - NEXT_PUBLIC_CONVEX_URL

# Start Convex dev server
npx convex dev

# In another terminal, start Next.js
npm run dev

# Run spike tests via the UI or Convex dashboard
```

---

## Spike Timeline

| Spike | Focus | Duration |
|-------|-------|----------|
| Spike 1 | Claude Code in E2B | 2-3 days |
| Spike 2 | Gap Detection Accuracy | 2-3 days |
| Spike 3 | State Rules Integration | 2-3 days |
| Spike 4 | Document Generation | 2-3 days |
| Spike 5 | Real-Time UX | 1-2 days |

**Total:** ~2 weeks for all spikes

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| E2B sandbox timeout | Medium | High | Increase timeout, optimize prompts |
| Claude Code accuracy | Low | High | Prompt engineering, validation |
| Convex performance | Low | Medium | Use indexes, optimize queries |
| State rules complexity | Medium | Medium | Start with MA only, expand later |
| Document quality | Medium | High | Attorney review workflow |
