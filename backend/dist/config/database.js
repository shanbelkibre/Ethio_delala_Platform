"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.withReconnect = withReconnect;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
exports.prisma = global.prisma ||
    new client_1.PrismaClient({
        log: ['error', 'warn'],
    });
if (env_1.env.NODE_ENV !== 'production') {
    global.prisma = exports.prisma;
}
// Wrap any Prisma call with automatic reconnect on P1017/P1001
async function withReconnect(fn) {
    const RECONNECTABLE = ['P1017', 'P1001'];
    const MAX_RETRIES = 3;
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            if (err?.code && RECONNECTABLE.includes(err.code)) {
                logger_1.logger.warn(`[DB] Connection lost (${err.code}). Reconnecting... attempt ${attempt}/${MAX_RETRIES}`);
                try {
                    await exports.prisma.$disconnect();
                }
                catch (_) { }
                await new Promise((r) => setTimeout(r, attempt * 1000));
                try {
                    await exports.prisma.$connect();
                }
                catch (_) { }
            }
            else {
                throw err;
            }
        }
    }
    throw lastError;
}
async function connectDatabase() {
    try {
        await exports.prisma.$connect();
        logger_1.logger.info('PostgreSQL database connected successfully via Prisma.');
    }
    catch (error) {
        logger_1.logger.error('Database connection failed:', error);
    }
}
async function disconnectDatabase() {
    await exports.prisma.$disconnect();
}
