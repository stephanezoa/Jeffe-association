import pino from 'pino';
import { AsyncLocalStorage } from 'async_hooks';
import { env } from '../config/env';

export const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  redact: {
    paths: ['password', 'token', 'authorization', 'qr_payload', 'payload.password', 'headers.authorization'],
    censor: '[REDACTED]',
  },
  mixin() {
    const store = asyncLocalStorage.getStore();
    return store ? { requestId: store.requestId } : {};
  },
});
