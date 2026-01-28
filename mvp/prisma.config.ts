import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Load environment variables
import { config } from 'dotenv'
config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
  earlyAccess: true,
  schema: path.resolve(__dirname, 'prisma/schema.prisma'),
  datasource: {
    // URL for migrations
    url: process.env.DATABASE_URL!
  },
  migrate: {
    async adapter() {
      const { Pool } = await import('pg')
      const { PrismaPg } = await import('@prisma/adapter-pg')

      const databaseUrl = process.env.DATABASE_URL
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set')
      }

      const isRds = databaseUrl.includes('rds.amazonaws.com')

      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: isRds ? { rejectUnauthorized: true } : undefined
      })

      return new PrismaPg(pool)
    }
  }
})
