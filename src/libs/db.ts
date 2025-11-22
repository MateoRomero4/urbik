import { PrismaClient } from '@prisma/client';

type CustomNodeJsGlobal = typeof global & {
  prisma?: PrismaClient;
};

const globalForPrisma = global as CustomNodeJsGlobal;

const prisma: PrismaClient = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;