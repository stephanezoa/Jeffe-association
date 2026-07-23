import { app } from './app';
import { env } from './core/config/env';
import { logger } from './core/logger';
import { knex } from './core/database/knex';

const server = app.listen(env.PORT, async () => {
  try {
    await knex.raw('SELECT 1');
    logger.info(`🚀 Serveur VESTIGE API démarré sur http://localhost:${env.PORT}${env.API_PREFIX}`);
    logger.info(`Statut BDD: Connexion réussie (${env.DB_CLIENT})`);
  } catch (err) {
    logger.error({ err }, 'Échec de connexion à la base de données lors du démarrage');
  }
});

process.on('SIGTERM', () => {
  logger.info('Signal SIGTERM reçu. Fermeture douce du serveur.');
  server.close(() => {
    knex.destroy();
    process.exit(0);
  });
});
