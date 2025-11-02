import { PrismaClient } from '@prisma/client';

// Criar instância global do Prisma Client para evitar múltiplas conexões
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: import.meta.env.DEV ? ['query', 'error', 'warn'] : ['error'],
  });

if (import.meta.env.DEV) globalForPrisma.prisma = prisma;

// Helper para verificar conexão
export const checkPrismaConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Prisma conectado ao banco de dados');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar Prisma:', error);
    return false;
  }
};
