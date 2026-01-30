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

## Project Structure

```
mvp/
├── app/                    # Next.js 16 app router
│   ├── api/               # 30 REST API routes
│   │   ├── estate-plans/  # Estate plan CRUD + nested resources
│   │   ├── gap-analysis/  # AI analysis (quick + orchestration)
│   │   ├── document-generation/ # AI document generation
│   │   ├── upload/        # File upload handling
│   │   ├── reminders/     # Reminder management
│   │   └── users/         # User management
│   ├── analysis/          # Gap analysis UI
│   │   └── [estatePlanId]/ # Analysis results, visualization, reminders
│   │       └── prepare/   # Preparation phase (contacts, docs, questions)
│   ├── documents/         # Document upload & generation
│   ├── intake/            # Intake wizard
│   │   ├── guided/        # 8-step conversational flow
│   │   ├── personal/      # Comprehensive form sections
│   │   ├── family/, assets/, goals/, existing/
│   │   └── upload/        # Document upload during intake
│   ├── hooks/             # SWR data fetching hooks
│   └── components/        # Page-specific components
├── components/            # Shared React components
├── lib/                   # Utilities
│   ├── auth-helper.ts     # Authentication & ownership verification
│   ├── db.ts              # Prisma client configuration
│   ├── documentTemplates/ # Legal document templates (50-state)
│   ├── gap-analysis/      # Multi-phase orchestration & prompts
│   └── intake/            # Guided flow configuration
├── prisma/
│   ├── schema.prisma      # Database schema (19 models)
│   └── migrations/        # Database migrations
├── prisma.config.ts       # Prisma 7 migration configuration
└── middleware.ts          # Security headers, rate limiting
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run setup` | Generate Prisma client + run migrations |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma generate` | Regenerate Prisma client |

## API Routes

All API routes include authentication (Clerk or session-based) and ownership verification. 30 endpoints total.

### Core Estate Plan Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/estate-plans` | GET, POST | List & create estate plans |
| `/api/estate-plans/[id]` | GET, PATCH, DELETE | Get, update & delete estate plan |

### Intake Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/estate-plans/[id]/intake` | GET | Get all intake data |
| `/api/estate-plans/[id]/intake/[section]` | GET, PUT | Section-specific intake |
| `/api/estate-plans/[id]/intake/progress` | GET | Get completion status |
| `/api/estate-plans/[id]/guided-intake` | GET, POST, PUT | Guided flow progress |

### Analysis Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/estate-plans/[id]/gap-analysis` | GET, POST | Gap analysis results |
| `/api/estate-plans/[id]/gap-analysis-runs` | GET, POST, PUT | Multi-phase run tracking |
| `/api/gap-analysis` | POST | Quick analysis mode |
| `/api/gap-analysis/orchestrate` | POST | Comprehensive 3-phase analysis |

### Document Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/estate-plans/[id]/documents` | GET, POST | Generated documents |
| `/api/estate-plans/[id]/uploaded-documents` | GET, POST, DELETE, PATCH | Uploaded documents |
| `/api/estate-plans/[id]/uploaded-documents/analyze` | POST | AI document analysis |
| `/api/estate-plans/[id]/uploaded-documents/summary` | GET | Document summary |
| `/api/estate-plans/[id]/extracted-data` | GET, POST | AI-extracted intake data |
| `/api/document-generation` | POST | AI document generation |
| `/api/upload` | POST | File upload handling |

### Preparation Phase Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/estate-plans/[id]/family-contacts` | GET, POST, PUT, DELETE | Contact management |
| `/api/estate-plans/[id]/attorney-questions` | GET, POST, PUT, DELETE | Questions tracker |
| `/api/estate-plans/[id]/document-checklist` | GET, POST, PUT, DELETE | Document gathering |

### Other Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/estate-plans/[id]/beneficiaries` | GET, POST, PUT | Beneficiary designations |
| `/api/estate-plans/[id]/reminders` | GET, POST | Reminder management |
| `/api/estate-plans/[id]/life-events` | GET, POST, PATCH | Life event tracking |
| `/api/reminders/[id]` | PATCH, DELETE | Individual reminder ops |
| `/api/users` | GET, POST, PATCH | User management |

## Troubleshooting

### "Can't resolve 'tailwindcss'" or CSS errors

Tailwind CSS v4 requires dependencies to be installed:
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Port 3000 already in use

```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
pkill -f node
```

### 401 Unauthorized errors

- The app uses `sessionId` for anonymous authentication
- Stored in localStorage as `estatePlanSessionId`
- Clear localStorage and refresh if issues persist

### Database connection errors

1. Verify `DATABASE_URL` in `.env` file
2. Ensure PostgreSQL is running
3. For AWS RDS: check security group allows your IP

### Prisma migration errors

For Prisma 7, migrations require `prisma.config.ts` (already included):
```bash
npx prisma migrate dev
```

### Build errors on Windows (EPERM)

```bash
rm -rf .next
npm run build
```

## Security Features

- **Authentication**: Clerk integration with anonymous session fallback
- **Ownership Verification**: All resources verified against user/session
- **Rate Limiting**: 100 requests/minute per IP
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **SSL/TLS**: Required for production database connections
- **Input Validation**: Zod schema validation on all endpoints
- **File Validation**: Magic bytes check for uploads

## Deployment

### Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

```bash
npx vercel --prod
```

### Production Checklist

- [ ] Set `DATABASE_URL` with SSL enabled
- [ ] Configure `ANTHROPIC_API_KEY` and `E2B_API_KEY`
- [ ] Run `npx prisma migrate deploy`
- [ ] (Optional) Configure Clerk for authentication

## License

Proprietary - Link Studio

## Acknowledgments

Built during an internship at Link Studio.
