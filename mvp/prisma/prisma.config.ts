import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.resolve(__dirname, 'schema.prisma'),
  datasource: {
    sourceType: 'environment',
    envVarName: 'DATABASE_URL',
  },
})
