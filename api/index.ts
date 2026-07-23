// Point d'entrée des fonctions serverless Vercel.
// Toutes les requêtes /api/* sont réécrites ici (voir vercel.json).
//
// SQLite en serverless : le système de fichiers du déploiement est en lecture
// seule et /tmp est le seul dossier inscriptible. On copie donc la base seedée
// livrée avec le code vers /tmp au premier démarrage, puis on pointe l'app
// dessus. Les écritures ne persistent pas au-delà de l'instance chaude.
import fs from 'node:fs';
import path from 'node:path';

const RUNTIME_DB = '/tmp/vestige.sqlite';

// Emplacements candidats de la base seedée embarquée (selon le cwd Vercel).
const SEED_CANDIDATES = [
  path.join(process.cwd(), 'apps/api/data/seed.sqlite'),
  path.join(__dirname, '../apps/api/data/seed.sqlite'),
];

try {
  if (!fs.existsSync(RUNTIME_DB)) {
    const seed = SEED_CANDIDATES.find((candidate) => fs.existsSync(candidate));
    if (seed) fs.copyFileSync(seed, RUNTIME_DB);
  }
} catch {
  // En cas d'échec de copie, knex créera une base vide (les migrations en build
  // ou un premier accès en écriture la construiront selon la config).
}

process.env.DB_CLIENT = process.env.DB_CLIENT || 'sqlite3';
process.env.DB_FILENAME = process.env.DB_FILENAME || RUNTIME_DB;

export default async function handler(req: unknown, res: unknown) {
  // Import différé : knex s'initialise avec DB_FILENAME déjà positionné.
  const { app } = await import('../apps/api/src/app');
  return (app as unknown as (req: unknown, res: unknown) => void)(req, res);
}
