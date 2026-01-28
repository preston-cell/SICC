# Estate Planning Assistant

An AI-powered estate planning platform that helps users create legally-compliant documents, analyze their estate plans, and receive personalized recommendations.

## Features

- **Guided Intake Wizard** - Conversational step-by-step questionnaire covering personal info, family, assets, existing documents, and goals
- **Comprehensive Form** - Traditional form-based intake for detailed input
- **AI Gap Analysis** - Multi-phase analysis identifying missing documents, inconsistencies, and state-specific recommendations
- **Document Generation** - Creates 7 types of legal documents (wills, trusts, POAs, healthcare directives)
- **Document Upload & Analysis** - Upload existing documents for AI extraction and cross-referencing
- **Beneficiary Tracking** - Tracks retirement accounts, life insurance, and TOD/POD designations
- **Estate Visualization** - Visual family tree and asset distribution charts
- **Reminder System** - Automated notifications for document reviews and life events
- **50-State Compliance** - State-specific legal requirements for all US states

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 (CSS-based config, no tailwind.config.js) |
| Database | PostgreSQL via Prisma 7 ORM |
| Data Fetching | SWR (React hooks) |
| Auth | Clerk (optional, supports anonymous sessions) |
| AI | Claude API (Anthropic) |
| Sandbox | E2B for secure AI code execution |
| Hosting | Vercel |

## Quick Start

```bash
# Clone and install
git clone https://github.com/preston-cell/SICC.git
cd SICC/mvp
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, ANTHROPIC_API_KEY, E2B_API_KEY

# Setup database
npx prisma migrate deploy

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Prerequisites

- **Node.js 20+** - Required for Next.js 16
- **npm 9+**
- **PostgreSQL 15+** - Local or AWS RDS
- **Anthropic API key** - For AI features
- **E2B API key** - For AI gap analysis sandbox

## Environment Variables

Create a `.env` file in the `mvp/` directory:

```bash
# Database (required)
DATABASE_URL="postgresql://postgres:password@localhost:5432/estate_planning"

# AI Services (required)
ANTHROPIC_API_KEY="sk-ant-..."
E2B_API_KEY="e2b_..."

# Authentication (optional - app works without for anonymous users)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

### For AWS RDS

```bash
DATABASE_URL="postgresql://user:password@your-instance.region.rds.amazonaws.com:5432/estate_planning?sslmode=require"
```

## Documentation

- **[README.md](./mvp/README.md)** - Full documentation
- **[SETUP_GUIDE.md](./mvp/SETUP_GUIDE.md)** - Step-by-step setup instructions

## Project Structure

```
SICC/
├── mvp/                    # Main application
│   ├── app/               # Next.js app router
│   │   ├── api/           # REST API routes
│   │   ├── analysis/      # Gap analysis UI
│   │   ├── documents/     # Document management
│   │   ├── intake/        # Intake wizard
│   │   └── hooks/         # SWR data fetching
│   ├── lib/               # Utilities & templates
│   ├── prisma/            # Database schema & migrations
│   └── prisma.config.ts   # Prisma 7 configuration
└── slides/                # Presentation materials
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run setup` | Generate Prisma client + run migrations |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create and apply migrations |

## Troubleshooting

### "Can't resolve 'tailwindcss'" or CSS errors

Tailwind CSS v4 requires dependencies to be installed:
```bash
cd mvp
rm -rf node_modules .next
npm install
npm run dev
```

### Database connection errors

1. Verify `DATABASE_URL` in `.env` file
2. Ensure PostgreSQL is running
3. For AWS RDS: check security group allows your IP

### Prisma migration errors

For Prisma 7, migrations require `prisma.config.ts` (already included):
```bash
npx prisma migrate dev
```

See [SETUP_GUIDE.md](./mvp/SETUP_GUIDE.md) for detailed troubleshooting.

## License

Proprietary - Link Studio

## Acknowledgments

Built during an internship at Link Studio.
