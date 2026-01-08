# EstateAI: Technical Architecture

## System Overview

EstateAI is built on a modern serverless architecture using **Next.js** for the frontend, **Convex** for the backend (real-time database + serverless functions), and **E2B** for isolated AI execution. Claude Code runs inside E2B sandboxes to analyze estate planning documents and generate draft legal documents.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Next.js 16 (App Router)                          │    │
│  │                                                                      │    │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │    │
│  │  │  Estate Input    │  │  Analysis View   │  │  Documents       │   │    │
│  │  │  • Situation     │  │  • Gap report    │  │  • Preview       │   │    │
│  │  │  • Goals         │  │  • Suggestions   │  │  • Download      │   │    │
│  │  │  • Assets        │  │  • Risk scores   │  │  • History       │   │    │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘   │    │
│  │           │                     │                     │              │    │
│  │           │    useAction(api.runAgent.runAgent)       │              │    │
│  │           │    useQuery(api.queries.getRun)           │              │    │
│  │           │    useQuery(api.queries.getFilesForRun)   │              │    │
│  │           └─────────────────────┼─────────────────────┘              │    │
│  │                                 │                                    │    │
│  └─────────────────────────────────┼────────────────────────────────────┘    │
│                                    │                                         │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CONVEX BACKEND                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        Convex Functions                               │   │
│  │                                                                       │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐          │   │
│  │  │   Actions      │  │   Mutations    │  │   Queries      │          │   │
│  │  │                │  │                │  │                │          │   │
│  │  │  runAgent.ts   │  │  createRun     │  │  getRun        │          │   │
│  │  │  • Start E2B   │  │  updateRun     │  │  listRuns      │          │   │
│  │  │  • Run Claude  │  │  saveFile      │  │  getFilesForRun│          │   │
│  │  │  • Save output │  │                │  │                │          │   │
│  │  └────────┬───────┘  └────────────────┘  └────────────────┘          │   │
│  │           │                                                           │   │
│  └───────────┼───────────────────────────────────────────────────────────┘   │
│              │                                                               │
│  ┌───────────┼───────────────────────────────────────────────────────────┐   │
│  │           │           Convex Database                                 │   │
│  │           │                                                           │   │
│  │  ┌────────┴───────────────────┐  ┌──────────────────────────────┐    │   │
│  │  │       agentRuns            │  │       generatedFiles          │    │   │
│  │  │                            │  │                               │    │   │
│  │  │  • prompt: string          │  │  • runId: Id<agentRuns>      │    │   │
│  │  │  • status: enum            │  │  • path: string               │    │   │
│  │  │  • output: string?         │  │  • content: string            │    │   │
│  │  │  • error: string?          │  │  • isBinary: boolean          │    │   │
│  │  │  • createdAt: number       │  │  • size: number               │    │   │
│  │  │  • completedAt: number?    │  │                               │    │   │
│  │  └────────────────────────────┘  └──────────────────────────────┘    │   │
│  │                                                                       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           E2B SANDBOX                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Isolated Execution Environment                     │   │
│  │                                                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │                  Claude Code CLI                                │  │   │
│  │  │                  (@anthropic-ai/claude-code)                    │  │   │
│  │  │                                                                 │  │   │
│  │  │  Analyzes estate planning situations and generates:             │  │   │
│  │  │  • Gap analysis reports (markdown)                              │  │   │
│  │  │  • Draft legal documents (docx, md, txt)                        │  │   │
│  │  │  • Checklists and recommendations                               │  │   │
│  │  │  • Risk assessments                                             │  │   │
│  │  │                                                                 │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                       │   │
│  │  Security: Isolated filesystem, network restrictions, time limits     │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4 | User interface, real-time updates |
| **Backend** | Convex | Real-time database, serverless functions, subscriptions |
| **Sandboxing** | E2B SDK | Isolated code execution for Claude Code |
| **AI** | Claude Code CLI (@anthropic-ai/claude-code) | Document analysis and generation |
| **Styling** | Tailwind CSS 4 | Responsive, accessible design |

---

## Core Components

### 1. Frontend (Next.js App Router)

**Location:** `app/`

```
app/
├── components/
│   └── FilePreviewModal.tsx    # Document preview modal
├── ConvexClientProvider.tsx    # Convex React client wrapper
├── layout.tsx                  # Root layout with metadata
├── page.tsx                    # Main UI component
└── globals.css                 # Tailwind CSS styles
```

**Key Features:**
- Real-time status updates via Convex subscriptions
- Document upload and preview
- Download individual files or all at once
- Session history browsing

**React Hooks Used:**
```typescript
// Start analysis
const runAgent = useAction(api.runAgent.runAgent);

// Subscribe to run status (real-time)
const run = useQuery(api.queries.getRun, { runId });

// Subscribe to generated files (real-time)
const files = useQuery(api.queries.getFilesForRun, { runId });

// List all runs
const runs = useQuery(api.queries.listRuns);
```

### 2. Convex Backend

**Location:** `convex/`

```
convex/
├── schema.ts         # Database schema definition
├── mutations.ts      # Internal mutations (createRun, updateRun, saveFile)
├── queries.ts        # Queries (getRun, listRuns, getFilesForRun)
└── runAgent.ts       # Main action: orchestrates E2B + Claude Code
```

#### Database Schema (`schema.ts`)

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  agentRuns: defineTable({
    prompt: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }),

  generatedFiles: defineTable({
    runId: v.id("agentRuns"),
    path: v.string(),
    content: v.string(),  // base64 for binary, plain text otherwise
    isBinary: v.boolean(),
    size: v.number(),
  }).index("by_run", ["runId"]),
});
```

#### Main Action (`runAgent.ts`)

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Sandbox } from "@e2b/code-interpreter";

export const runAgent = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Create run record
    const runId = await ctx.runMutation(internal.mutations.createRun, {
      prompt: args.prompt,
    });

    // 2. Update status to running
    await ctx.runMutation(internal.mutations.updateRun, {
      runId,
      status: "running",
    });

    try {
      // 3. Create E2B sandbox
      const sandbox = await Sandbox.create({
        apiKey: process.env.E2B_API_KEY,
      });

      // 4. Install Claude Code in sandbox
      await sandbox.process.startAndWait("npm install -g @anthropic-ai/claude-code");

      // 5. Run Claude Code with the estate planning prompt
      const result = await sandbox.process.startAndWait(
        `ANTHROPIC_API_KEY=${process.env.ANTHROPIC_API_KEY} claude-code "${args.prompt}"`,
        { timeout: 300000 }
      );

      // 6. Collect generated files
      const files = await sandbox.filesystem.list("/home/user");
      for (const file of files) {
        const content = await sandbox.filesystem.read(file.path);
        await ctx.runMutation(internal.mutations.saveFile, {
          runId,
          path: file.name,
          content: content,
          isBinary: isBinaryFile(file.name),
          size: file.size,
        });
      }

      // 7. Update status to completed
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "completed",
        output: result.stdout,
        completedAt: Date.now(),
      });

      await sandbox.close();
    } catch (error) {
      // Handle errors
      await ctx.runMutation(internal.mutations.updateRun, {
        runId,
        status: "failed",
        error: error.message,
      });
    }

    return runId;
  },
});
```

### 3. E2B Sandbox

**Purpose:** Provides an isolated environment for running Claude Code safely.

**Security Features:**
- Isolated filesystem (no access to host)
- Network restrictions
- Time limits (configurable timeout)
- Resource limits (CPU, memory)

**Claude Code Integration:**
- Claude Code CLI is installed in the sandbox
- ANTHROPIC_API_KEY is passed securely
- Generated files are collected and stored in Convex

---

## Data Flow

### Flow 1: Starting an Analysis

```
User                    Next.js              Convex                E2B
  │                        │                   │                    │
  │  Enter situation/      │                   │                    │
  │  request               │                   │                    │
  │───────────────────────>│                   │                    │
  │                        │  useAction(       │                    │
  │                        │   runAgent)       │                    │
  │                        │──────────────────>│                    │
  │                        │                   │  createRun()       │
  │                        │                   │  (pending)         │
  │                        │                   │                    │
  │                        │                   │  updateRun()       │
  │                        │                   │  (running)         │
  │                        │                   │                    │
  │                        │                   │  Sandbox.create()  │
  │                        │                   │───────────────────>│
  │                        │                   │                    │
  │                        │                   │  Install Claude    │
  │                        │                   │  Code CLI          │
  │                        │                   │                    │
  │                        │                   │  Execute prompt    │
  │                        │                   │                    │
```

### Flow 2: Real-Time Status Updates

```
Next.js                 Convex
  │                        │
  │  useQuery(getRun)      │
  │───────────────────────>│
  │                        │
  │  Real-time subscription│
  │<───────────────────────│
  │                        │
  │  Status: pending       │
  │<───────────────────────│
  │                        │
  │  Status: running       │
  │<───────────────────────│
  │                        │
  │  Status: completed     │
  │  + output              │
  │<───────────────────────│
  │                        │
```

### Flow 3: Retrieving Generated Files

```
Next.js                 Convex              Storage
  │                        │                   │
  │  useQuery(             │                   │
  │   getFilesForRun)      │                   │
  │───────────────────────>│                   │
  │                        │  Query            │
  │                        │  generatedFiles   │
  │                        │  by runId         │
  │                        │                   │
  │  File list + content   │                   │
  │<───────────────────────│                   │
  │                        │                   │
  │  Preview / Download    │                   │
  │                        │                   │
```

---

## Estate Planning Domain Logic

While the infrastructure uses Convex + E2B, the estate planning domain logic runs inside Claude Code. The AI is prompted with context about:

### Document Types Supported

```
├── Core Incapacity Documents
│   ├── Durable Power of Attorney (financial)
│   ├── Limited/Special Power of Attorney
│   ├── Springing Power of Attorney
│   ├── Healthcare Power of Attorney
│   ├── Advance Healthcare Directive/Living Will
│   ├── HIPAA Authorization
│   ├── Mental Health Treatment Declaration
│   ├── Anatomical Gift/Organ Donation Authorization
│   ├── POLST/MOLST
│   └── Supported Decision-Making Agreement
├── Core Death & Transfer Documents
│   ├── Last Will and Testament
│   ├── Pour-Over Will
│   ├── Codicil
│   ├── Revocable Living Trust
│   ├── Trust Restatement / Amendment
│   ├── Irrevocable Trust
│   ├── Letter of Instruction
│   └── Memorandum of Personal Property
├── Trust Sub-Types
│   ├── Asset Protection/Tax (Grantor, IDGT, SLAT, QPRT, Dynasty, DAPT)
│   ├── Benefit-Specific (SNT, Spendthrift, Education, Minor's, Incentive)
│   └── Charitable (CRT, CLT, Private Foundation, DAF Agreement)
├── Business Documents
│   ├── Buy-Sell Agreement
│   ├── Operating Agreement (LLC)
│   └── Succession Documents
├── Family & Relationship Documents
│   ├── Prenuptial/Postnuptial Agreements
│   ├── Guardianship Nomination
│   └── UTMA/UGMA Documents
└── Digital Assets
    ├── Digital Asset Authorization (RUFADAA-compliant)
    ├── Cryptocurrency Custody Instructions
    └── Online Account Access Memorandum
```

### Gap Detection Categories

The AI identifies gaps across four severity levels:

| Severity | Weight | Examples |
|----------|--------|----------|
| **Critical** | 100 | Deceased fiduciary, improper execution, unfunded trust |
| **High** | 75 | Outdated beneficiary, missing incapacity planning |
| **Medium** | 50 | Missing contingent beneficiary, asset changes |
| **Advisory** | 25 | Tax optimization, family governance |

### Wealth-Based Recommendations

Claude Code uses wealth tier logic to recommend appropriate documents:

| Net Worth | Core Recommendations |
|-----------|---------------------|
| $0–$25K | Healthcare POA, Living Will, HIPAA |
| $25K–$100K | + Simple Will, Durable POA |
| $100K–$250K | + Revocable Trust, Pour-over Will |
| $250K–$1M | + Funded trust, digital assets |
| $1M–$5M | + Irrevocable trusts, SLAT |
| $5M–$25M | + GRATs, IDGTs, ILIT |
| $25M–$50M | + Dynasty trusts, family governance |

### Non-Asset Override Conditions

Certain situations require specific documents regardless of asset level:

| Condition | Required Documents |
|-----------|-------------------|
| Minor children | Guardianship nomination, Minor's trusts |
| Business owner | Buy-sell agreement, Succession planning |
| Disabled beneficiary | Special Needs Trust |
| Blended family | Trusts (not just wills), QTIP provisions |
| High liability profession | Asset protection trusts |

---

## Security Architecture

### Transport Security
- All connections use HTTPS/TLS
- Convex provides built-in transport encryption
- E2B connections are encrypted

### Application Security
- Convex handles authentication (can integrate Clerk/NextAuth)
- API keys stored as environment variables
- No API keys exposed to client

### Data Security
- Documents stored in Convex (encrypted at rest)
- Sensitive content never logged
- E2B sandboxes are isolated and ephemeral

### Sandbox Security
- E2B sandboxes are fully isolated
- No network access to internal services
- Time limits prevent runaway processes
- Sandboxes are destroyed after use

---

## Environment Variables

```env
# Required
ANTHROPIC_API_KEY=sk-ant-...          # For Claude Code
E2B_API_KEY=e2b_...                    # For E2B sandboxes
NEXT_PUBLIC_CONVEX_URL=https://...    # Convex deployment

# Optional
CONVEX_DEPLOY_KEY=...                  # For CI/CD deployments
```

---

## Deployment Architecture

### Development
```
Local Machine
├── Next.js dev server (localhost:3000)
├── Convex dev backend (npx convex dev)
└── E2B sandboxes (cloud)
```

### Production
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │     Convex      │     │      E2B        │
│   (Frontend)    │────>│   (Backend)     │────>│   (Sandboxes)   │
│                 │     │                 │     │                 │
│  Next.js SSR    │     │  Functions      │     │  Claude Code    │
│  Static assets  │     │  Database       │     │  Isolated exec  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Scalability

### Current Architecture Supports
- Automatic scaling via Convex and E2B
- No server management required
- Real-time updates to any number of clients
- Concurrent sandbox executions

### Limits
- E2B sandbox timeout: configurable (default 5 min)
- Convex storage: pay-as-you-go
- Claude Code: subject to Anthropic rate limits

---

## Future Architecture Considerations

### Planned Enhancements
1. **User Authentication**: Integrate Clerk or NextAuth for user accounts
2. **File Storage**: Use Convex file storage for uploaded documents
3. **Background Jobs**: Convex scheduled functions for periodic tasks
4. **Caching**: Cache frequently used prompts/templates
5. **Analytics**: PostHog or similar for usage analytics

### Potential Additions
- PDF generation service for formatted reports
- Document template storage
- State rules database (Massachusetts first)
- Attorney referral system integration

---

## Next Steps

- [ ] Implement user authentication (Clerk/NextAuth)
- [ ] Add file upload for existing estate documents
- [ ] Build estate planning intake wizard
- [ ] Add Massachusetts-specific rules prompts
- [ ] Create document template library
- [ ] Implement PDF report generation
