# EstateAI: Demo Setup Instructions

## Prerequisites

### For Presenters

1. **Environment Setup**
   - Local development environment configured (see below)
   - OR access to deployed staging environment

2. **Sample Documents** (To Be Created)
   - Location: `/data/sample-data/`
   - Suggested files:
     - `chen-family-trust-2016.pdf` (Revocable Living Trust)
     - `chen-robert-pour-over-will.pdf`
     - `chen-robert-poa.pdf`
     - `chen-susan-pour-over-will.pdf` (optional)
   - Note: Healthcare proxy intentionally omitted to demonstrate gap detection

3. **Pre-configured Demo State**
   - Create an estate plan through the intake wizard before demo
   - Run analysis to have results ready for quick walkthrough

### Technical Requirements

- Modern browser (Chrome recommended)
- Stable internet connection (for live demo)
- Screen resolution: 1920x1080 minimum
- Screen sharing capability
- Backup: offline PDF report and screenshots (if available)

---

## Demo Personas

### Primary Persona: Robert Chen

Use this persona for investor/partner demos:

| Attribute | Value |
|-----------|-------|
| Name | Robert Chen |
| Age | 52 |
| State | Massachusetts |
| Net Worth | $8.2 million |
| Occupation | VP of Engineering, Tech Company |
| Family | Married (Susan), 2 children (ages 19, 16) |
| Estate Plan | Created 2016 by attorney |

**Key Story Points:**
- Brother (named successor trustee) died in 2022
- Acquired vacation property in 2019 (not in trust)
- Has cryptocurrency holdings (not addressed in trust)
- No healthcare directive on file

### Alternative Persona: Sandra Martinez

Use for demos emphasizing blended family complexity:

| Attribute | Value |
|-----------|-------|
| Name | Sandra Martinez |
| Age | 58 |
| State | Massachusetts |
| Net Worth | $12 million |
| Occupation | Business Owner (sold company) |
| Family | Remarried, 2 children from first marriage, 1 stepchild |
| Estate Plan | Created 2014, pre-remarriage |

**Key Story Points:**
- Estate plan doesn't reflect current marriage
- Children from first marriage vs. current spouse interests
- Business sale proceeds not properly structured
- POA names ex-husband as agent

---

## Environment Setup

### Local Development

```bash
# Clone repository
git clone https://github.com/preston-cell/SICC.git
cd SICC/mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys:
# - DATABASE_URL (PostgreSQL connection string)
# - ANTHROPIC_API_KEY (for Claude API)
# - E2B_API_KEY (for sandbox execution)

# Run database migrations
npx prisma migrate dev

# Start Next.js development server
npm run dev

# Access at http://localhost:3000
```

### PostgreSQL / Prisma Setup

1. Install PostgreSQL locally or use an AWS RDS instance
2. Create a database: `createdb estate_planning`
3. Set `DATABASE_URL` in your `.env` file:
   - Local: `postgresql://postgres:password@localhost:5432/estate_planning`
   - AWS RDS: `postgresql://user:password@your-instance.region.rds.amazonaws.com:5432/estate_planning?sslmode=require`
4. Run migrations: `npx prisma migrate dev`
5. (Optional) Open Prisma Studio: `npx prisma studio`

### E2B Setup

1. Create an E2B account at [e2b.dev](https://e2b.dev)
2. Generate an API key from the dashboard
3. Add `E2B_API_KEY` to your `.env`

### Production Environment

**Configuration:**
- Frontend: Vercel deployment (Next.js 16)
- Backend: Next.js API Routes + PostgreSQL via Prisma 7 ORM
- Sandboxing: E2B (isolated code execution)
- AI: Claude API (Anthropic SDK)

---

## Pre-Demo Checklist

### 1 Hour Before

- [ ] Verify demo environment is accessible
- [ ] Login or create a session
- [ ] Confirm sample documents are uploaded (if using)
- [ ] Run test analysis to verify pipeline working
- [ ] Check pre-completed analysis is showing correctly
- [ ] Test screen sharing

### 15 Minutes Before

- [ ] Clear browser cache and cookies
- [ ] Close unnecessary browser tabs
- [ ] Disable notifications (system and browser)
- [ ] Open demo script for reference
- [ ] Have backup screenshots ready
- [ ] Test audio/video if presenting remotely

### Immediately Before

- [ ] Final environment check
- [ ] Navigate to starting point (landing page or dashboard)
- [ ] Deep breath — you've got this!

---

## Demo Account Setup

### Creating Demo Session

1. Navigate to the landing page (`/`)
2. Click "Start Planning" to create a new estate plan
3. Complete the guided intake wizard using persona data
4. Upload sample documents (if available)
5. Run gap analysis
6. Verify report generated correctly

### Resetting Demo State

Between demos, you can reset by:

1. Clear localStorage in browser (removes sessionId)
2. Create a fresh estate plan
3. OR use Prisma Studio to delete test data:
   ```bash
   npx prisma studio
   ```

---

## Sample Documents Details

### Chen Family Trust (2016)

**Suggested Content:**
- Grantors: Robert Chen, Susan Chen
- Initial Trustees: Robert Chen, Susan Chen
- Successor Trustee: David Chen (brother — mark as deceased for demo)
- Beneficiaries: Children in equal shares
- NO digital asset provisions
- Assets listed: Primary residence, investment accounts (2016 values)

**Seeded Gaps:**
- Deceased successor trustee
- Missing digital asset clause
- Outdated asset schedule

### Pour-Over Will

**Suggested Content:**
- Testator: Robert Chen
- Executor: Susan Chen
- Alternate: David Chen (same deceased brother)
- Pours over to Chen Family Trust

**Seeded Gaps:**
- Deceased alternate executor (same as trustee issue)

### Durable Power of Attorney

**Suggested Content:**
- Principal: Robert Chen
- Agent: Susan Chen
- Successor Agent: David Chen

**Seeded Gaps:**
- Deceased successor agent

### Missing Document

**Intentionally NOT uploaded:**
- Healthcare Proxy / Advance Directive

This allows demo to show the "missing document" gap detection.

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't access app | Verify `npm run dev` is running, check localhost:3000 |
| Upload fails | Check file size (<20MB), ensure PDF format |
| Analysis stuck | Refresh page, check API keys in .env |
| Report not loading | Try different browser, check console for errors |
| Slow performance | Check internet connection, E2B sandbox may need warmup |

### Database Issues

```bash
# Reset database (deletes all data)
npx prisma migrate reset

# View database contents
npx prisma studio
```

---

## Demo Flow Suggestions

### Quick Demo (5 minutes)
1. Show landing page and value proposition
2. Skip to pre-completed analysis results
3. Walk through gap report highlights
4. Show document generation preview

### Standard Demo (15 minutes)
1. Show landing page
2. Quick walkthrough of guided intake (skip most steps)
3. Show analysis running (or use pre-completed)
4. Deep dive on gap analysis results
5. Show beneficiary tracking
6. Show document generation

### Full Demo (30 minutes)
1. Complete guided intake with persona
2. Upload sample documents
3. Run comprehensive analysis
4. Review all sections of gap report
5. Show visualization features
6. Demonstrate document generation
7. Show reminder system

---

## Post-Demo Cleanup

1. Clear browser data
2. Note any issues encountered
3. Document audience questions for FAQ
4. Update demo script if needed
5. Reset demo data for next presentation

---

## Notes

- This document will be updated as the MVP develops
- Check for updates before each demo
- Report any issues or suggestions to the team
- Demo accounts should never contain real customer data
