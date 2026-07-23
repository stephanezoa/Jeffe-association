// Entrée de la fonction serverless Vercel, bundlée par esbuild vers api/index.js.
// `bootstrap` est importé en premier : il positionne DB_FILENAME/DB_CLIENT
// avant que l'app (donc knex) ne s'initialise.
import './bootstrap';
import { app } from '../app';

export default app;
