import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> }

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL!

  // Use Accelerate for prisma:// URLs (production via Prisma Accelerate)
  if (databaseUrl.startsWith('prisma://')) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    }).$extends(withAccelerate())
  }

  // For direct PostgreSQL connections, use pg Pool with SSL config
  const isRds = databaseUrl.includes('rds.amazonaws.com')

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: isRds ? { rejectUnauthorized: false } : undefined
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
