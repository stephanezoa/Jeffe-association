import type { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbClient = process.env.DB_CLIENT || 'sqlite3';

const dbPath = process.env.DB_FILENAME || path.join(__dirname, 'data/vestige.dev.sqlite');
const dbDir = path.dirname(dbPath);
if (!require('fs').existsSync(dbDir)) {
  require('fs').mkdirSync(dbDir, { recursive: true });
}

const config: { [key: string]: Knex.Config } = {
  development: dbClient === 'pg' ? {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'vestige_dev',
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, 'src/seeds'),
      extension: 'ts',
    },
  } : {
    client: 'sqlite3',
    connection: {
      filename: dbPath,
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn: any, cb: any) => {
        conn.run('PRAGMA foreign_keys = ON;', cb);
      },
    },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, 'src/seeds'),
      extension: 'ts',
    },
  },

  production: {
    client: process.env.DB_CLIENT || 'pg',
    connection: process.env.DATABASE_URL ? process.env.DATABASE_URL : {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
    pool: { min: 2, max: 20 },
    migrations: {
      directory: path.join(__dirname, 'dist/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'dist/seeds'),
    },
  },
};

export default config;
