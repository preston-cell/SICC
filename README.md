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
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (AWS RDS) via Prisma ORM |
| Data Fetching | SWR (React hooks) |
| Auth | Clerk (optional, supports anonymous sessions) |
| AI | Claude API (Anthropic) |
| Sandbox | E2B for secure code execution |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (local or AWS RDS)
- Anthropic API key
- E2B API key (for AI document generation)

### Installation

```bash
# Clone the repository
git clone https://github.com/preston-cell/SICC.git
cd SICC/mvp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)

# Run database migrations
npx prisma migrate deploy

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Database (required)
DATABASE_URL="postgresql://user:password@localhost:5432/estate_planning"

# AI Services (required)
ANTHROPIC_API_KEY="sk-ant-..."
E2B_API_KEY="e2b_..."

# Authentication (optional - app works without for anonymous users)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

**For AWS RDS:**
```bash
DATABASE_URL="postgresql://user:password@your-instance.region.rds.amazonaws.com:5432/estate_planning?sslmode=require"
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or deploy via CLI
npx vercel --prod
```

### Database Setup (AWS RDS)

1. Create a PostgreSQL RDS instance
2. Configure security groups to allow Vercel IP ranges
3. Run migrations: `npx prisma migrate deploy`

### Production Checklist

- [ ] Set `DATABASE_URL` with SSL enabled
- [ ] Configure `ANTHROPIC_API_KEY` and `E2B_API_KEY`
- [ ] (Optional) Configure Clerk for authentication
- [ ] Verify database migrations are applied

## Project Structure

```
mvp/
├── app/                    # Next.js app router
│   ├── api/               # REST API routes (27 endpoints)
│   │   ├── estate-plans/  # Estate plan CRUD + nested resources
│   │   ├── gap-analysis/  # AI analysis orchestration
│   │   ├── upload/        # File upload handling
│   │   └── users/         # User management
│   ├── analysis/          # Gap analysis UI
│   ├── documents/         # Document upload & generation
│   ├── intake/            # Intake wizard (guided + comprehensive)
│   ├── hooks/             # SWR data fetching hooks (usePrismaQueries.ts)
│   └── components/        # Page-specific components
├── components/            # Shared React components
├── lib/                   # Utilities
│   ├── auth-helper.ts     # Authentication & ownership verification
│   ├── db.ts              # Prisma client configuration
│   ├── gap-analysis/      # AI analysis orchestrator
│   ├── documentTemplates/ # Legal document templates
│   └── intake/            # Guided intake flow configuration
├── prisma/
│   ├── schema.prisma      # Database schema (19 models)
│   └── migrations/        # Database migrations
├── skills/                # AI skill definitions
└── middleware.ts          # Security headers, rate limiting
```

## API Routes

All API routes include authentication (Clerk or session-based) and ownership verification.

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/estate-plans` | GET, POST | List & create estate plans |
| `/api/estate-plans/[id]` | GET, PATCH, DELETE | Get, update & delete estate plan |
| `/api/estate-plans/[id]/intake` | GET | Get all intake data |
| `/api/estate-plans/[id]/intake/[section]` | GET, PUT | Section-specific intake |
| `/api/estate-plans/[id]/guided-intake` | GET, POST, PUT | Guided flow progress |
| `/api/estate-plans/[id]/gap-analysis` | GET, POST | Gap analysis results |
| `/api/estate-plans/[id]/gap-analysis-runs` | GET, POST, PUT | Analysis run orchestration |
| `/api/estate-plans/[id]/documents` | GET, POST | Generated documents |
| `/api/estate-plans/[id]/uploaded-documents` | GET, POST, DELETE, PATCH | Uploaded documents |
| `/api/estate-plans/[id]/beneficiaries` | GET, POST, PUT | Beneficiary designations |
| `/api/estate-plans/[id]/reminders` | GET, POST | Reminder management |
| `/api/estate-plans/[id]/life-events` | GET, POST, PATCH | Life event tracking |
| `/api/estate-plans/[id]/family-contacts` | GET, POST, PUT, DELETE | Family & advisor contacts |
| `/api/estate-plans/[id]/attorney-questions` | GET, POST, PUT, DELETE | Attorney questions |
| `/api/estate-plans/[id]/document-checklist` | GET, POST, PUT, DELETE | Document checklist |
| `/api/gap-analysis/orchestrate` | POST | Multi-phase AI analysis |
| `/api/document-generation` | POST | AI document generation |
| `/api/upload` | POST | File upload (PDF) |
| `/api/users` | GET, POST, PATCH | User management |
| `/api/reminders/[id]` | PATCH, DELETE | Individual reminder actions |

## Security Features

- **Authentication**: Clerk integration with anonymous session fallback
- **Ownership Verification**: All resources verified against user/session
- **Rate Limiting**: 100 requests/minute per IP
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **SSL/TLS**: Required for database connections
- **Input Validation**: Zod schema validation on all endpoints
- **File Validation**: Magic bytes check for uploads

## Database Schema

19 Prisma models covering:
- Users & authentication
- Estate plans & intake data
- Document storage & generation
- Gap analysis runs & results
- Reminders & life events
- Beneficiary designations
- Family contacts & attorney questions

Run `npx prisma studio` to explore the database visually.

## Development

```bash
# Run development server
npm run dev

# Run Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Find and kill zombie Node processes (Windows)
tasklist | findstr node
taskkill /F /PID <pid>

# Or kill all Node processes
taskkill /F /IM node.exe
```

**401 Unauthorized errors:**
- The app uses sessionId for anonymous authentication
- SessionId is stored in localStorage as `estatePlanSessionId`
- All API calls automatically include sessionId via the `authFetch` helper

**Blank screen on intake pages:**
- Check browser console (F12) for JavaScript errors
- Verify API endpoints return 200 (not 404)
- Clear `.next` folder and restart: `rm -rf .next && npm run dev`

**Database connection errors:**
- Verify `DATABASE_URL` in `.env` file
- For AWS RDS, ensure `?sslmode=require` is appended
- Check security group allows your IP

**Build errors (EPERM on Windows):**
```bash
# Clear build cache
rm -rf .next
npm run build
```

## License

Proprietary - Link Studio

## Acknowledgments

Built during an internship at Link Studio.
