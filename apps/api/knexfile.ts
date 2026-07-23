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

  // Production : SQLite par défaut (base seedée copiée dans /tmp au démarrage sur
  // Vercel). Bascule automatique vers Postgres si POSTGRES_URL/DATABASE_URL est
  // présent, sans changer le code.
  production: (() => {
    const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    const usePg = process.env.DB_CLIENT === 'pg' || Boolean(url);

    if (usePg) {
      return {
        client: 'pg' as const,
        connection: url
          ? { connectionString: url, ssl: { rejectUnauthorized: false } }
          : {
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT) || 5432,
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
            },
        pool: { min: 0, max: 5 },
        migrations: { directory: path.join(__dirname, 'src/migrations'), extension: 'ts' },
        seeds: { directory: path.join(__dirname, 'src/seeds'), extension: 'ts' },
      };
    }

    return {
      client: 'sqlite3' as const,
      connection: { filename: process.env.DB_FILENAME || '/tmp/vestige.sqlite' },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn: any, cb: any) => conn.run('PRAGMA foreign_keys = ON;', cb),
      },
      migrations: { directory: path.join(__dirname, 'src/migrations'), extension: 'ts' },
      seeds: { directory: path.join(__dirname, 'src/seeds'), extension: 'ts' },
    };
  })(),
};

export default config;
