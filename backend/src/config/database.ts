import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

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

