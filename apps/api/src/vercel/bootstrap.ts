// Préparation de la base AVANT l'initialisation de knex.
// En serverless, seul /tmp est inscriptible : on y copie la base seedée
// embarquée avec la fonction (voir `includeFiles` dans vercel.json).
import fs from 'fs';
import path from 'path';

const RUNTIME_DB = '/tmp/vestige.sqlite';

const SEED_CANDIDATES = [
  path.join(process.cwd(), 'apps/api/data/seed.sqlite'),
  path.join(process.cwd(), 'data/seed.sqlite'),
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
