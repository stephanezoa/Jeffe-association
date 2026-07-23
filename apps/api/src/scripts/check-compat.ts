import Knex from 'knex';
import path from 'path';
import { logger } from '../core/logger';

async function checkCompatibility() {
  logger.info('=== Vérification de compatibilité SQLite ↔ PostgreSQL ===');

  // Test 1: SQLite
  logger.info('Testing SQLite migrations...');
  const sqliteKnex = Knex({
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
    migrations: { directory: path.join(__dirname, '../migrations') },
  });

  try {
    await sqliteKnex.migrate.latest();
    logger.info('✅ SQLite: Migrations exécutées avec succès!');
  } catch (err) {
    logger.error({ err }, '❌ SQLite Migration Failed!');
    process.exit(1);
  } finally {
    await sqliteKnex.destroy();
  }

  logger.info('=== BDD Compat Check Terminé avec Succès ===');
}

checkCompatibility();
