# EstateAI: Demo Setup Instructions

## Prerequisites

*Note: Technical setup will be detailed once MVP development begins.*

### For Presenters

1. **Account Access**
   - Demo account credentials: [TBD]
   - Admin dashboard access: [TBD]

2. **Sample Documents**
   - Location: `/data/sample-data/`
   - Files needed:
     - `chen-family-trust-2016.pdf` (Revocable Living Trust)
     - `chen-robert-pour-over-will.pdf`
     - `chen-robert-poa.pdf`
     - `chen-susan-pour-over-will.pdf` (optional)
   - Note: Healthcare proxy intentionally omitted to demonstrate gap detection

3. **Pre-configured Demo State**
   - Analysis already completed for quick walkthrough
   - Known gaps seeded in sample documents

### Technical Requirements

- Modern browser (Chrome recommended)
- Stable internet connection (for live demo)
- Screen resolution: 1920x1080 minimum
- Screen sharing capability
- Backup: offline PDF report and screenshots

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

### Local Development (Future)

```bash
# Clone repository
git clone [repo-url]
cd estateai

# Backend setup
cd mvp/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
export ANTHROPIC_API_KEY="..."
export DATABASE_URL="..."
export S3_BUCKET="..."

# Run backend
uvicorn main:app --reload

# Frontend setup (new terminal)
cd mvp/frontend
npm install
npm run dev

# Access at http://localhost:3000
```

### Staging/Demo Environment

*Demo environment setup instructions will be added once infrastructure is provisioned.*

**Target Configuration:**
- Frontend: Vercel deployment
- Backend: Railway/Render
- Database: Supabase/RDS
- Storage: Cloudflare R2/S3

---

## Pre-Demo Checklist

### 1 Hour Before

- [ ] Verify demo environment is accessible
- [ ] Login to demo account
- [ ] Confirm sample documents are uploaded
- [ ] Run test analysis to verify pipeline working
- [ ] Check pre-completed analysis is showing correctly
- [ ] Test screen sharing

### 15 Minutes Before

- [ ] Clear browser cache and cookies
- [ ] Close unnecessary browser tabs
- [ ] Disable notifications (system and browser)
- [ ] Open demo script for reference
- [ ] Have backup PDF report ready
- [ ] Test audio/video if presenting remotely

### Immediately Before

- [ ] Final environment check
- [ ] Navigate to starting point (landing page or dashboard)
- [ ] Deep breath — you've got this!

---

## Demo Account Setup

### Creating Demo Account

1. Navigate to `/signup`
2. Use demo email: `demo+[date]@estateai.com`
3. Complete onboarding:
   - State: California
   - Net worth range: $5M–$10M
   - Has existing estate plan: Yes
4. Upload sample documents
5. Run analysis
6. Verify report generated correctly

### Resetting Demo Account

Between demos, reset to clean state:

1. Login to admin dashboard
2. Navigate to Demo Accounts
3. Select account to reset
4. Click "Reset to Default State"
5. Verify documents and analysis restored

---

## Sample Documents Details

### Chen Family Trust (2016)

**File:** `chen-family-trust-2016.pdf`
**Pages:** 28
**Key Elements:**
- Grantors: Robert Chen, Susan Chen
- Initial Trustees: Robert Chen, Susan Chen
- Successor Trustee: David Chen (brother — deceased)
- Beneficiaries: Children in equal shares
- NO digital asset provisions
- Assets listed: Primary residence, investment accounts (2016 values)

**Seeded Gaps:**
- Deceased successor trustee
- Missing digital asset clause
- Outdated asset schedule

### Pour-Over Will

**File:** `chen-robert-pour-over-will.pdf`
**Pages:** 6
**Key Elements:**
- Testator: Robert Chen
- Executor: Susan Chen
- Alternate: David Chen (same deceased brother)
- Pours over to Chen Family Trust
- 2 witnesses, self-proving affidavit

**Seeded Gaps:**
- Deceased alternate executor (same as trustee issue)

### Durable Power of Attorney

**File:** `chen-robert-poa.pdf`
**Pages:** 5
**Key Elements:**
- Principal: Robert Chen
- Agent: Susan Chen
- Successor Agent: David Chen
- Broad financial powers granted

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
| Can't login | Clear cookies, try incognito mode |
| Upload fails | Check file size (<20MB), try different format |
| Analysis stuck | Refresh page, check API status |
| Report not loading | Try different browser, check console for errors |
| Slow performance | Check internet connection, try backup materials |

### Emergency Contacts

- Technical support: [TBD]
- Product lead: [TBD]
- Backup presenter: [TBD]

---

## Backup Materials

Located in `/demo/backup/`:

- `demo-video-recording.mp4` — Full demo walkthrough
- `sample-report-chen.pdf` — Static PDF of gap report
- `demo-screenshots/` — Key screen captures
- `demo-slides.pdf` — Slides with embedded screenshots

### Using Backup Materials

If live demo fails:
1. Acknowledge technical difficulty professionally
2. Switch to backup video or slides
3. Talk through the same narrative
4. Offer to schedule follow-up live demo

---

## Post-Demo Cleanup

1. Logout of demo account
2. Clear browser data
3. Note any issues encountered
4. Document audience questions for FAQ
5. Update demo script if needed
6. Reset demo account for next presentation

---

## Notes

- This document will be updated as the MVP develops
- Check for updates before each demo
- Report any issues or suggestions to the team
- Demo accounts should never contain real customer data
