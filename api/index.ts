// Point d'entrée des fonctions serverless Vercel.
// Toutes les requêtes /api/* sont réécrites ici (voir vercel.json).
//
// Imports STATIQUES volontaires : esbuild inline ainsi toute l'application
// Express dans le bundle de la fonction. Un import() dynamique n'est pas tracé
// et provoquerait un ERR_MODULE_NOT_FOUND à l'exécution.
//
// `_db-bootstrap` est importé en premier : il positionne DB_FILENAME/DB_CLIENT
// avant que l'app (donc knex) ne s'initialise.
import './_db-bootstrap';
import { app } from '../apps/api/src/app';

export default app;
