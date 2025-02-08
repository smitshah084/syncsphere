import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient({
//   log: ['query'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Connection pooling is handled through the connection string
  // in DATABASE_URL instead of here
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

// Cleanup function
process.on('beforeExit', async () => {
  await db.$disconnect()
})
