# Estate Planning Assistant

An AI-powered estate planning platform that helps users create legally-compliant documents, analyze their estate plans, and receive personalized recommendations.

## Features

- **Guided Intake Wizard** - Step-by-step questionnaire covering personal info, family, assets, existing documents, and goals
- **AI Gap Analysis** - Identifies missing documents, inconsistencies, and provides state-specific recommendations
- **Document Generation** - Creates 7 types of legal documents (wills, trusts, POAs, healthcare directives)
- **Beneficiary Tracking** - Tracks retirement accounts, life insurance, and TOD/POD designations
- **Estate Visualization** - Visual family tree and asset distribution charts
- **Reminder System** - Automated notifications for document reviews and life events
- **50-State Compliance** - State-specific legal requirements for all US states

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 18, TypeScript |
| Styling | Tailwind CSS |
| Database | Convex (real-time) |
| AI | Claude API (Anthropic) |
| Sandbox | E2B for secure code execution |
| Hosting | Vercel + Convex Cloud |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Convex account
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd agent-mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Start Convex local backend
npx convex dev

# In another terminal, start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

### Deploy to Production

```bash
# Deploy Convex backend
npx convex deploy --yes

# Deploy to Vercel
npx vercel --prod --yes
```

### Take Site Offline

```bash
npx vercel rm agent-mvp --yes
```

### Redeploy

```bash
npx convex deploy --yes && npx vercel --prod --yes
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── analysis/          # Gap analysis & results
│   ├── documents/         # Document generation
│   ├── intake/            # Intake wizard steps
│   └── api/               # API routes
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── queries.ts         # Read operations
│   ├── mutations.ts       # Write operations
│   ├── gapAnalysis.ts     # AI analysis action
│   └── documentGeneration.ts  # Document generation
├── lib/
│   └── documentTemplates/ # Legal document templates
└── components/            # Shared React components
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for completed features and upcoming development phases.

**Next Up:** Phase 9 - Document Upload & AI Analysis
- Upload existing legal documents (PDFs)
- AI-powered document analysis
- Cross-reference with intake data
- Hypothetical scenario exploration

## License

Proprietary - Link Studio

## Acknowledgments

Built during an internship at Link Studio.
