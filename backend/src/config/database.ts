import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from '../utils/logger';

const createPrismaClient = () => {
  const baseClient = new PrismaClient({
    log: ['error', 'warn'],
  });

  return baseClient.$extends({
    query: {
      $allOperations({ model, operation, args, query }) {
        const MAX_RETRIES = 3;
        const RECONNECTABLE = ['P1017', 'P1001', 'P2024'];

        async function execute(attempt: number): Promise<any> {
          try {
            return await query(args);
          } catch (err: any) {
            if (attempt < MAX_RETRIES && err?.code && RECONNECTABLE.includes(err.code)) {
              logger.warn(
                `[DB Auto-Retry] ${err.code} on ${model || 'raw'}.${operation}. Retrying in ${(attempt + 1) * 800}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`
              );
              await new Promise((r) => setTimeout(r, (attempt + 1) * 800));
              return execute(attempt + 1);
            }
            throw err;
          }
        }

        return execute(0);
      },
    },
  });
};

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

export const prisma = global.prisma || createPrismaClient();

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Wrap any Prisma call with automatic reconnect on P1017/P1001/P2024
export async function withReconnect<T>(fn: () => Promise<T>): Promise<T> {
  const RECONNECTABLE = ['P1017', 'P1001', 'P2024'];
  const MAX_RETRIES = 3;
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (err?.code && RECONNECTABLE.includes(err.code)) {
        logger.warn(`[DB] Connection lost (${err.code}). Reconnecting... attempt ${attempt}/${MAX_RETRIES}`);
        try { await prisma.$disconnect(); } catch (_) {}
        await new Promise((r) => setTimeout(r, attempt * 1000));
        try { await prisma.$connect(); } catch (_) {}
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL database connected successfully via Prisma.');
  } catch (error) {
    logger.error('Database connection failed:', error);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}

