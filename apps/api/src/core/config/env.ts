import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  DB_CLIENT: z.enum(['sqlite3', 'pg']).default('sqlite3'),
  DB_FILENAME: z.string().default('./data/vestige.dev.sqlite'),
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(16).default('super-secret-access-key-change-in-production-32chars'),
  JWT_REFRESH_SECRET: z.string().min(16).default('super-secret-refresh-key-change-in-production-32chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  LOG_LEVEL: z.string().default('info'),
  QR_HMAC_SECRET: z.string().default('vestige-qr-signing-secret-key-32chars'),
});

export const env = envSchema.parse(process.env);
