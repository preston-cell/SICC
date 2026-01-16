/**
 * Prisma 7 Configuration
 *
 * NOTE: For migrations, use the --url flag directly:
 * npx prisma migrate dev --name <name> --url "$DATABASE_URL"
 *
 * The runtime connection is handled by lib/db.ts which uses
 * the @prisma/adapter-pg driver with SSL auto-detection.
 */

/** @type {import('prisma').PrismaConfig} */
module.exports = {
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
}
