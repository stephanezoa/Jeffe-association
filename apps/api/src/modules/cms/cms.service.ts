import { knex } from '../../core/database/knex';
import { v4 as uuidv4 } from 'uuid';
import { AuditService } from '../../core/audit/audit.service';

export class CmsService {
  public async getContentBlock(key: string, locale = 'fr') {
    const block = await knex('content_blocks').where({ key, locale }).first();
    return block ? block.content : null;
  }

  public async getAllBlocks() {
    return knex('content_blocks').select('*');
  }

  public async upsertContentBlock(key: string, content: string, updatedBy: string, locale = 'fr') {
    const existing = await knex('content_blocks').where({ key, locale }).first();
    const now = new Date().toISOString();

    if (existing) {
      const newVersion = existing.version + 1;
      await knex('content_blocks').where({ id: existing.id }).update({
        content,
        version: newVersion,
        updated_by: updatedBy,
        updated_at: now,
      });

      await AuditService.record({
        actorId: updatedBy,
        action: 'cms.block_updated',
        entityType: 'content_block',
        entityId: existing.id,
        before: { content: existing.content },
        after: { content },
      });

      return { key, content, version: newVersion };
    } else {
      const id = uuidv4();
      await knex('content_blocks').insert({
        id,
        key,
        locale,
        content,
        version: 1,
        updated_by: updatedBy,
        status: 'published',
        created_at: now,
        updated_at: now,
      });

      await AuditService.record({
        actorId: updatedBy,
        action: 'cms.block_created',
        entityType: 'content_block',
        entityId: id,
        after: { key, content },
      });

      return { key, content, version: 1 };
    }
  }

  public async getOpportunityPlaylist() {
    const playlist = await knex('video_playlists').first();
    if (!playlist) return { items: [] };

    const items = await knex('playlist_items')
      .where({ playlist_id: playlist.id })
      .orderBy('position', 'asc');

    return { playlist, items };
  }
}
