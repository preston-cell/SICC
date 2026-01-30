# Estate Planning Assistant - Local Development Setup Guide

This guide will help you set up the Estate Planning Assistant on your local machine.

## Prerequisites Checklist

| Requirement | How to Check | Minimum Version |
|-------------|--------------|-----------------|
| Node.js | `node --version` | 20.0.0+ |
| npm | `npm --version` | 9.0.0+ |
| PostgreSQL | `psql --version` | 15.0+ |
| Git | `git --version` | Any |

---

## Step 1: Install Node.js

**Check if installed:**
```bash
node --version
```

### Windows
1. Go to https://nodejs.org
2. Download LTS version (20+)
3. Run installer, accept defaults
4. Restart your terminal

### Mac
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org
```

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Step 2: Install PostgreSQL

**Check if installed:**
```bash
psql --version
```

### Windows
1. Go to https://www.postgresql.org/download/windows/
2. Download the installer
3. Run installer:
   - Install all components
   - Set password for `postgres` user (**remember this!**)
   - Keep default port 5432
4. Add to PATH if needed:
   - Search "Environment Variables" in Windows
   - Edit PATH, add: `C:\Program Files\PostgreSQL\15\bin`
5. Restart your terminal

### Mac
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"
```

---

## Step 3: Clone and Install Dependencies

```bash
# Clone the repo (skip if already cloned)
git clone https://github.com/preston-cell/SICC.git
cd SICC/mvp

# Install dependencies (this also runs prisma generate via postinstall)
npm install
```

**Note:** This project uses Tailwind CSS v4 which is installed via npm. There is no `tailwind.config.js` file - configuration is done via CSS in `app/globals.css`.

---

## Step 4: Create Local Database

### Option A: Using psql
```bash
# Connect to PostgreSQL
psql -U postgres

# Enter your postgres password when prompted

# Create the database
CREATE DATABASE estate_planning;

# Verify it was created
\l

# Exit
\q
```

### Option B: Using createdb
```bash
createdb -U postgres estate_planning
```

### Mac Users - If "role postgres does not exist"
```bash
createuser -s postgres
createdb estate_planning
```

---

## Step 5: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Database - use your PostgreSQL password
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/estate_planning"

# Get from https://console.anthropic.com
ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Get from https://e2b.dev/dashboard
E2B_API_KEY="e2b_your-key-here"
```

### Getting API Keys

**Anthropic API Key:**
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy to your `.env` file

**E2B API Key:**
1. Go to https://e2b.dev
2. Sign up or log in
3. Go to Dashboard
4. Copy your API key to `.env` file

---

## Step 6: Run Database Migrations

```bash
npx prisma migrate dev
```

**Expected output:**
```
Applying migration `20260114054453_init`
...
Database is now in sync with the schema.
✔ Generated Prisma Client
```

**Note:** This project uses Prisma 7 which requires a `prisma.config.ts` file (already included in the repo).

---

## Step 7: Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.1.1 (Turbopack)
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
✓ Ready in 500ms
```

---

## Step 8: Test the Application

1. Open http://localhost:3000
2. Click "Start Planning" or navigate to the intake wizard
3. Complete a few steps of the guided intake
4. Navigate to the Analysis page to test AI features

### View Database (Optional)
```bash
npx prisma studio
```
Opens a browser GUI at http://localhost:5555 to view your data.

---

## Quick Reference Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run setup` | Generate Prisma client + run migrations |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create/apply migrations |
| `npx prisma migrate reset` | Reset database (deletes all data) |
| `npx prisma generate` | Regenerate Prisma client |

---

## Troubleshooting

### "Can't resolve 'tailwindcss'" or CSS Errors

This project uses Tailwind CSS v4. Ensure dependencies are installed:
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### PostgreSQL Connection Errors

**Error:** `ECONNREFUSED 127.0.0.1:5432`

PostgreSQL isn't running. Start it:
- **Windows:** Services → postgresql-x64-15 → Start
- **Mac:** `brew services start postgresql@15`
- **Linux:** `sudo systemctl start postgresql`

---

**Error:** `password authentication failed`

Wrong password in `.env`. Check your DATABASE_URL.

---

**Error:** `database "estate_planning" does not exist`

Create the database:
```bash
createdb -U postgres estate_planning
```

---

### Prisma Errors

**Error:** `datasource.url property required`

This happens with Prisma 7. Make sure `prisma.config.ts` exists in the project root (it should already be there).

---

**Error:** `relation "EstatePlan" does not exist`

Migrations haven't been run:
```bash
npx prisma migrate dev
```

---

### Application Errors

**Error:** `ANTHROPIC_API_KEY is not set`

Your `.env` file is missing or the key isn't set. Check:
1. `.env` file exists in `mvp/` folder
2. `ANTHROPIC_API_KEY` has a valid key

---

**Error:** `Module not found`

Dependencies not installed:
```bash
rm -rf node_modules
npm install
```

---

### Nuclear Reset

If everything is broken, start fresh:
```bash
rm -rf node_modules .next
npm install
npx prisma migrate reset
npm run dev
```

---

## Setup Checklist

```
□ Node.js 20+ installed
□ PostgreSQL 15+ installed and running
□ Repository cloned
□ In the mvp/ directory
□ npm install completed (no errors)
□ Database estate_planning created
□ .env file configured with:
  □ DATABASE_URL (with correct password)
  □ ANTHROPIC_API_KEY
  □ E2B_API_KEY
□ npx prisma migrate dev completed
□ npm run dev works
□ http://localhost:3000 loads
□ Can navigate through the intake wizard
```

---

## Project Structure

```
mvp/
├── app/
│   ├── api/                # REST API routes
│   │   ├── estate-plans/   # Estate plan CRUD
│   │   ├── gap-analysis/   # AI analysis
│   │   └── document-generation/ # Document generation
│   ├── analysis/           # Gap analysis page
│   ├── documents/          # Document management
│   ├── intake/             # Intake wizard (guided + comprehensive)
│   │   ├── guided/         # Step-by-step wizard
│   │   └── comprehensive/  # Full form
│   ├── hooks/              # SWR data fetching hooks
│   └── components/         # React components
├── lib/
│   ├── db.ts               # Prisma client
│   ├── auth-helper.ts      # Authentication
│   └── documentTemplates/  # Legal document templates
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── prisma.config.ts        # Prisma 7 config
├── postcss.config.mjs      # PostCSS config (Tailwind v4)
├── .env.example            # Environment template
└── README.md               # Full documentation
```

---

## Need Help?

1. Check the [README.md](./README.md) for more details
2. Check the Troubleshooting section above
3. Ask the team for help

Happy coding!
