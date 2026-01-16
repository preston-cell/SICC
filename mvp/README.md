# SICC MVP

AI-powered code generation agent built with Next.js, PostgreSQL, and Claude.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| Database | PostgreSQL 15+ |
| ORM | Prisma 7 |
| AI | Anthropic Claude API |
| Code Execution | E2B Sandbox |
| Data Fetching | SWR |
| Validation | Zod |
| Styling | Tailwind CSS 4 |

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **PostgreSQL** 15 or higher
- **npm** or **yarn**

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd mvp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL database

Create a local database for development:

```bash
# Using psql
psql -U postgres
CREATE DATABASE sicc_dev;
\q

# Or using createdb command
createdb -U postgres sicc_dev
```

### 4. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sicc_dev"
ANTHROPIC_API_KEY="sk-ant-..."
E2B_API_KEY="e2b_..."
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

This will create all the database tables defined in `prisma/schema.prisma`.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma generate` | Regenerate Prisma client |

## Project Structure

```
mvp/
├── app/
│   ├── api/
│   │   ├── agent/          # AI agent endpoint
│   │   └── runs/           # Agent runs CRUD
│   ├── components/         # React components
│   ├── page.tsx            # Main page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── lib/
│   └── db.ts               # Prisma client (auto-detects local vs RDS)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── prisma.config.ts    # Prisma configuration
├── middleware.ts           # CORS & security headers
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/runs` | List recent agent runs |
| POST | `/api/runs` | Create a new run |
| GET | `/api/runs/[id]` | Get a single run |
| PATCH | `/api/runs/[id]` | Update a run |
| GET | `/api/runs/[id]/files` | Get files for a run |
| POST | `/api/agent` | Execute the AI agent |

## Getting API Keys

### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key

### E2B API Key
1. Go to [e2b.dev](https://e2b.dev)
2. Sign up or log in
3. Navigate to Dashboard
4. Copy your API key

## Database Management

### View/edit data with Prisma Studio

```bash
npx prisma studio
```

### Reset database (development only)

```bash
npx prisma migrate reset
```

### Create a new migration

```bash
npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### "Cannot connect to database"

- Ensure PostgreSQL is running
- Verify your `DATABASE_URL` in `.env`
- Check that the database exists: `psql -U postgres -l`

### "ANTHROPIC_API_KEY is not set"

- Ensure you've copied `.env.example` to `.env`
- Verify your API key is correct

### "Module not found" errors

```bash
rm -rf node_modules .next
npm install
```

## Security Notes

- Never commit `.env` files to version control
- All `.env*` files are gitignored by default
- API routes include input validation with Zod
- CORS is configured in `middleware.ts`

---

## Production Setup

### Infrastructure Overview

```
┌─────────────┐                    ┌─────────────┐
│   Vercel    │ ──── Direct ────►  │  AWS RDS    │
│  (Frontend  │    Connection      │ (PostgreSQL)│
│   + API)    │    (with SSL)      └─────────────┘
└─────────────┘
```

### How Database Connections Work

The app automatically handles different environments via `lib/db.ts`:

```typescript
// Auto-detects RDS URLs and enables SSL
const isRds = databaseUrl.includes('rds.amazonaws.com')

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isRds ? { rejectUnauthorized: false } : undefined
})
```

- **Local development**: No SSL, connects to localhost
- **Production (RDS)**: SSL enabled automatically when URL contains `rds.amazonaws.com`

### 1. AWS RDS Setup

1. Create PostgreSQL 15+ instance in AWS RDS
2. Note your endpoint: `your-db.xxxxx.region.rds.amazonaws.com`
3. Create database: `CREATE DATABASE sicc_production;`
4. Configure security group to allow:
   - Your IP (for admin access)
   - Vercel IP ranges (see below)

### 2. Deploy Schema to RDS

```bash
# Set the direct RDS URL temporarily
export DATABASE_URL="postgresql://postgres:PASSWORD@your-db.xxxxx.rds.amazonaws.com:5432/sicc_production"

# Deploy migrations
npx prisma migrate deploy
```

### 3. Vercel Deployment

1. Import project from GitHub
2. Set **Root Directory** to `mvp`
3. Add environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://user:pass@your-db.rds.amazonaws.com:5432/sicc_production` |
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `E2B_API_KEY` | `e2b_...` |

4. Deploy

### 4. Configure Security Group

Add Vercel's IP ranges to your RDS security group:
- See: https://vercel.com/docs/security/deployment-protection

### 5. Verify Deployment

1. Visit your Vercel URL
2. Enter a test prompt
3. Verify agent runs and generates files
4. Check RDS for new records:
   ```sql
   SELECT * FROM "AgentRun" ORDER BY "createdAt" DESC LIMIT 5;
   ```

---

## Environment Variables Reference

| Variable | Local Dev | Production (Vercel) |
|----------|-----------|---------------------|
| `DATABASE_URL` | `postgresql://...@localhost:5432/sicc_dev` | `postgresql://...@xxx.rds.amazonaws.com:5432/sicc_production` |
| `ANTHROPIC_API_KEY` | Your key | Same key (or production key) |
| `E2B_API_KEY` | Your key | Same key (or production key) |

---

## Connection Pooling (Future Scaling)

The current setup uses direct RDS connections, which works well for moderate traffic. If you hit connection limits (~100 for db.t3.micro), consider:

| Option | Cost | Complexity |
|--------|------|------------|
| **RDS Proxy** | ~$20-50/month | Low (AWS managed) |
| **PgBouncer on EC2** | ~$5/month | Medium (self-hosted) |
| **Prisma Accelerate** | $0.12/query after free tier | Low (managed service) |

---

## License

ISC
