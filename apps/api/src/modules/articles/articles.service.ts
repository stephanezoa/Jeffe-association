import { knex } from '../../core/database/knex';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../core/errors/app-error';
import { AuditService } from '../../core/audit/audit.service';
import { uniqueSlug } from '../../core/utils/slug';
import type { CreateArticleInput, UpdateArticleInput } from './articles.schema';

/** Forme exposée au frontend (camelCase), indépendante des colonnes SQL. */
function toDto(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    author: row.author_name ?? undefined,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ArticlesService {
  /** Articles publiés, visibles publiquement. */
  public async listPublished() {
    const rows = await knex('articles')
      .leftJoin('members', 'articles.author_id', 'members.id')
      .whereNull('articles.deleted_at')
      .where('articles.status', 'published')
      .orderBy('articles.published_at', 'desc')
      .select('articles.*', knex.raw("members.first_name || ' ' || members.last_name as author_name"));
    return rows.map(toDto);
  }

  public async getPublishedBySlug(slug: string) {
    const row = await knex('articles')
      .leftJoin('members', 'articles.author_id', 'members.id')
      .whereNull('articles.deleted_at')
      .where('articles.status', 'published')
      .where('articles.slug', slug)
      .select('articles.*', knex.raw("members.first_name || ' ' || members.last_name as author_name"))
      .first();
    if (!row) throw AppError.notFound('Article introuvable');
    return toDto(row);
  }

  /** Tous les articles de l'auteur (brouillons compris) — pour le back-office. */
  public async listMine(authorId: string) {
    const rows = await knex('articles')
      .where({ author_id: authorId })
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');
    return rows.map(toDto);
  }

  public async create(authorId: string, input: CreateArticleInput) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const slug = await uniqueSlug('articles', input.title);

    await knex('articles').insert({
      id,
      author_id: authorId,
      title: input.title,
      slug,
      summary: input.summary ?? '',
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      status: input.status,
      published_at: input.status === 'published' ? now : null,
      created_at: now,
      updated_at: now,
    });

    await AuditService.record({
      actorId: authorId,
      action: 'article.created',
      entityType: 'article',
      entityId: id,
      after: { title: input.title, status: input.status },
    });

    return this.getOwned(id, authorId);
  }

  public async update(id: string, authorId: string, input: UpdateArticleInput) {
    const article = await this.requireOwned(id, authorId);
    const now = new Date().toISOString();

    const patch: Record<string, any> = { updated_at: now };
    if (input.title !== undefined) {
      patch.title = input.title;
      patch.slug = await uniqueSlug('articles', input.title, id);
    }
    if (input.summary !== undefined) patch.summary = input.summary;
    if (input.content !== undefined) patch.content = input.content;
    if (input.coverImageUrl !== undefined) patch.cover_image_url = input.coverImageUrl;
    if (input.status !== undefined) {
      patch.status = input.status;
      // Fixe la date de publication au premier passage à « publié ».
      if (input.status === 'published' && !article.published_at) patch.published_at = now;
    }

    await knex('articles').where({ id }).update(patch);

    await AuditService.record({
      actorId: authorId,
      action: 'article.updated',
      entityType: 'article',
      entityId: id,
      after: patch,
    });

    return this.getOwned(id, authorId);
  }

  public async remove(id: string, authorId: string) {
    await this.requireOwned(id, authorId);
    const now = new Date().toISOString();
    await knex('articles').where({ id }).update({ deleted_at: now, updated_at: now });

    await AuditService.record({
      actorId: authorId,
      action: 'article.deleted',
      entityType: 'article',
      entityId: id,
    });

    return { message: 'Article supprimé.' };
  }

  private async requireOwned(id: string, authorId: string) {
    const article = await knex('articles').where({ id }).whereNull('deleted_at').first();
    if (!article) throw AppError.notFound('Article introuvable');
    if (article.author_id !== authorId) {
      throw AppError.forbidden('Vous ne pouvez modifier que vos propres articles.');
    }
    return article;
  }

  private async getOwned(id: string, authorId: string) {
    const article = await this.requireOwned(id, authorId);
    return toDto(article);
  }
}
