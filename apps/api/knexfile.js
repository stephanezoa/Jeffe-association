"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbClient = process.env.DB_CLIENT || 'sqlite3';
const dbPath = process.env.DB_FILENAME || path_1.default.join(__dirname, 'data/vestige.dev.sqlite');
const dbDir = path_1.default.dirname(dbPath);
if (!require('fs').existsSync(dbDir)) {
    require('fs').mkdirSync(dbDir, { recursive: true });
}
const config = {
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
            directory: path_1.default.join(__dirname, 'src/migrations'),
            extension: 'ts',
        },
        seeds: {
            directory: path_1.default.join(__dirname, 'src/seeds'),
            extension: 'ts',
        },
    } : {
        client: 'sqlite3',
        connection: {
            filename: dbPath,
        },
        useNullAsDefault: true,
        pool: {
            afterCreate: (conn, cb) => {
                conn.run('PRAGMA foreign_keys = ON;', cb);
            },
        },
        migrations: {
            directory: path_1.default.join(__dirname, 'src/migrations'),
            extension: 'ts',
        },
        seeds: {
            directory: path_1.default.join(__dirname, 'src/seeds'),
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
            directory: path_1.default.join(__dirname, 'dist/migrations'),
        },
        seeds: {
            directory: path_1.default.join(__dirname, 'dist/seeds'),
        },
    },
};
exports.default = config;
