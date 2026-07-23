import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../../../knexfile';
import { env } from '../config/env';
import { logger } from '../logger';

const environment = env.NODE_ENV === 'test' ? 'development' : env.NODE_ENV;
export const knex = Knex(knexConfig[environment] || knexConfig.development);

Model.knex(knex);

logger.info(`Base de données initialisée avec le dialecte: ${env.DB_CLIENT}`);
