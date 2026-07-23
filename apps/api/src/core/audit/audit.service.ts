import { knex } from '../database/knex';
import { logger } from '../logger';
import { v4 as uuidv4 } from 'uuid';

export interface AuditRecordOptions {
  actorId?: string;
  actorIp?: string;
  action: string;
  entityType: string;
  entityId?: string;
  before?: any;
  after?: any;
  requestId?: string;
}

export class AuditService {
  public static async record(options: AuditRecordOptions): Promise<void> {
    try {
      const record = {
        id: uuidv4(),
        actor_id: options.actorId || 'system',
        actor_ip: options.actorIp || '127.0.0.1',
        action: options.action,
        entity_type: options.entityType,
        entity_id: options.entityId || null,
        before_state: options.before ? JSON.stringify(options.before) : null,
        after_state: options.after ? JSON.stringify(options.after) : null,
        request_id: options.requestId || null,
        created_at: new Date().toISOString(),
      };

      await knex('audit_logs').insert(record);
      logger.info({ action: options.action, entityType: options.entityType, entityId: options.entityId }, `Audit enregistré: ${options.action}`);
    } catch (err) {
      logger.error({ err, options }, `Échec de l'enregistrement du journal d'audit`);
    }
  }
}
