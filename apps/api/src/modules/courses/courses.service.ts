import { knex } from '../../core/database/knex';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../core/errors/app-error';
import { AuditService } from '../../core/audit/audit.service';
import { uniqueSlug } from '../../core/utils/slug';
import type { CreateCourseInput, UpdateCourseInput } from './courses.schema';

function parseTags(raw: any): string[] {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toDto(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    duration: row.duration,
    tags: parseTags(row.tags),
    thumbnailUrl: row.thumbnail_url,
    introVideoUrl: row.intro_video_url,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class CoursesService {
  public async listPublished() {
    const rows = await knex('courses')
      .whereNull('deleted_at')
      .where('status', 'published')
      .orderBy('created_at', 'desc');
    return rows.map(toDto);
  }

  public async getPublishedBySlug(slug: string) {
    const row = await knex('courses').whereNull('deleted_at').where({ slug, status: 'published' }).first();
    if (!row) throw AppError.notFound('Formation introuvable');
    return toDto(row);
  }

  public async listMine(authorId: string) {
    const rows = await knex('courses').where({ author_id: authorId }).whereNull('deleted_at').orderBy('created_at', 'desc');
    return rows.map(toDto);
  }

  public async create(authorId: string, input: CreateCourseInput) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const slug = await uniqueSlug('courses', input.title);

    await knex('courses').insert({
      id,
      author_id: authorId,
      title: input.title,
      slug,
      description: input.description ?? '',
      duration: input.duration ?? '',
      tags: JSON.stringify(input.tags ?? []),
      thumbnail_url: input.thumbnailUrl ?? null,
      intro_video_url: input.introVideoUrl ?? '',
      content: input.content ?? '',
      level: 'all',
      status: input.status,
      created_at: now,
      updated_at: now,
    });

    await AuditService.record({
      actorId: authorId,
      action: 'course.created',
      entityType: 'course',
      entityId: id,
      after: { title: input.title, status: input.status },
    });

    return toDto(await this.requireOwned(id, authorId));
  }

  public async update(id: string, authorId: string, input: UpdateCourseInput) {
    await this.requireOwned(id, authorId);
    const now = new Date().toISOString();

    const patch: Record<string, any> = { updated_at: now };
    if (input.title !== undefined) {
      patch.title = input.title;
      patch.slug = await uniqueSlug('courses', input.title, id);
    }
    if (input.description !== undefined) patch.description = input.description;
    if (input.duration !== undefined) patch.duration = input.duration;
    if (input.tags !== undefined) patch.tags = JSON.stringify(input.tags);
    if (input.thumbnailUrl !== undefined) patch.thumbnail_url = input.thumbnailUrl;
    if (input.introVideoUrl !== undefined) patch.intro_video_url = input.introVideoUrl;
    if (input.content !== undefined) patch.content = input.content;
    if (input.status !== undefined) patch.status = input.status;

    await knex('courses').where({ id }).update(patch);

    await AuditService.record({
      actorId: authorId,
      action: 'course.updated',
      entityType: 'course',
      entityId: id,
      after: patch,
    });

    return toDto(await this.requireOwned(id, authorId));
  }

  public async remove(id: string, authorId: string) {
    await this.requireOwned(id, authorId);
    const now = new Date().toISOString();
    await knex('courses').where({ id }).update({ deleted_at: now, updated_at: now });

    await AuditService.record({ actorId: authorId, action: 'course.deleted', entityType: 'course', entityId: id });
    return { message: 'Formation supprimée.' };
  }

  private async requireOwned(id: string, authorId: string) {
    const course = await knex('courses').where({ id }).whereNull('deleted_at').first();
    if (!course) throw AppError.notFound('Formation introuvable');
    if (course.author_id !== authorId) {
      throw AppError.forbidden('Vous ne pouvez modifier que vos propres formations.');
    }
    return course;
  }
}
