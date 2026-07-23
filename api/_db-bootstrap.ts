// Préparation de la base AVANT l'initialisation de knex (import statique dans
// index.ts, évalué avant l'app). En serverless, seul /tmp est inscriptible : on
// y copie la base seedée embarquée avec la fonction.
import fs from 'node:fs';
import path from 'node:path';

const RUNTIME_DB = '/tmp/vestige.sqlite';

// seed.sqlite est livré via `includeFiles` (voir vercel.json) sous /var/task.
const SEED_CANDIDATES = [
  path.join(process.cwd(), 'apps/api/data/seed.sqlite'),
  path.join(process.cwd(), 'api/../apps/api/data/seed.sqlite'),
];

try {
  if (!fs.existsSync(RUNTIME_DB)) {
    const seed = SEED_CANDIDATES.find((candidate) => fs.existsSync(candidate));
    if (seed) fs.copyFileSync(seed, RUNTIME_DB);
  }
} catch {
  // Copie impossible : knex ouvrira/créera la base à l'emplacement configuré.
}

process.env.DB_CLIENT = process.env.DB_CLIENT || 'sqlite3';
process.env.DB_FILENAME = process.env.DB_FILENAME || RUNTIME_DB;
