import { knex } from '../../core/database/knex';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../core/errors/app-error';
import { AuditService } from '../../core/audit/audit.service';
import { uniqueSlug } from '../../core/utils/slug';
import type { CreateEventInput, UpdateEventInput } from './events.schema';

/** État de billetterie calculé (distinct du statut de cycle de vie). */
function displayStatus(row: any, ticketsSold: number): 'full' | 'expired' | null {
  if (row.end_date && row.end_date < new Date().toISOString()) return 'expired';
  if (row.capacity > 0 && ticketsSold >= row.capacity) return 'full';
  return null;
}

export class EventsService {
  private toDto(row: any, ticketsSold: number) {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      eventType: row.event_type,
      priceCents: row.price_cents,
      location: row.location,
      date: row.start_date,
      capacity: row.capacity,
      coverImageUrl: row.cover_image_url,
      description: row.description,
      content: row.content,
      status: row.status,
      ticketsSold,
      displayStatus: displayStatus(row, ticketsSold),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /** Nombre de billets non annulés par évènement (via orders). */
  private async ticketsSoldByEvent(eventIds: string[]): Promise<Record<string, number>> {
    if (eventIds.length === 0) return {};
    const rows = await knex('tickets')
      .join('orders', 'tickets.order_id', 'orders.id')
      .whereIn('orders.event_id', eventIds)
      .whereNot('tickets.status', 'cancelled')
      .groupBy('orders.event_id')
      .select('orders.event_id')
      .count({ count: 'tickets.id' });

    return Object.fromEntries(rows.map((r: any) => [r.event_id, Number(r.count)]));
  }

  private async decorate(rows: any[]) {
    const counts = await this.ticketsSoldByEvent(rows.map((r) => r.id));
    return rows.map((row) => this.toDto(row, counts[row.id] ?? 0));
  }

  public async listPublished() {
    const rows = await knex('events').whereNull('deleted_at').where('status', 'published').orderBy('start_date', 'asc');
    return this.decorate(rows);
  }

  public async listMine(organizerId: string) {
    const rows = await knex('events').where({ organizer_id: organizerId }).whereNull('deleted_at').orderBy('start_date', 'desc');
    return this.decorate(rows);
  }

  public async create(organizerId: string, input: CreateEventInput) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const slug = await uniqueSlug('events', input.title);

    await knex('events').insert({
      id,
      organizer_id: organizerId,
      title: input.title,
      slug,
      description: input.description ?? '',
      location: input.location,
      start_date: input.date,
      end_date: input.date,
      capacity: input.capacity ?? 0,
      visibility: 'public',
      status: input.status,
      category: input.category ?? '',
      event_type: input.eventType,
      price_cents: input.eventType === 'paid' ? input.priceCents ?? 0 : 0,
      cover_image_url: input.coverImageUrl ?? null,
      content: input.content ?? '',
      created_at: now,
      updated_at: now,
    });

    await AuditService.record({
      actorId: organizerId,
      action: 'event.created',
      entityType: 'event',
      entityId: id,
      after: { title: input.title, status: input.status },
    });

    return this.toDto(await this.requireOwned(id, organizerId), 0);
  }

  public async update(id: string, organizerId: string, input: UpdateEventInput) {
    await this.requireOwned(id, organizerId);
    const now = new Date().toISOString();

    const patch: Record<string, any> = { updated_at: now };
    if (input.title !== undefined) {
      patch.title = input.title;
      patch.slug = await uniqueSlug('events', input.title, id);
    }
    if (input.category !== undefined) patch.category = input.category;
    if (input.eventType !== undefined) patch.event_type = input.eventType;
    if (input.priceCents !== undefined) patch.price_cents = input.priceCents;
    if (input.location !== undefined) patch.location = input.location;
    if (input.date !== undefined) {
      patch.start_date = input.date;
      patch.end_date = input.date;
    }
    if (input.capacity !== undefined) patch.capacity = input.capacity;
    if (input.coverImageUrl !== undefined) patch.cover_image_url = input.coverImageUrl;
    if (input.description !== undefined) patch.description = input.description;
    if (input.content !== undefined) patch.content = input.content;
    if (input.status !== undefined) patch.status = input.status;

    await knex('events').where({ id }).update(patch);

    await AuditService.record({
      actorId: organizerId,
      action: 'event.updated',
      entityType: 'event',
      entityId: id,
      after: patch,
    });

    const counts = await this.ticketsSoldByEvent([id]);
    return this.toDto(await this.requireOwned(id, organizerId), counts[id] ?? 0);
  }

  public async remove(id: string, organizerId: string) {
    await this.requireOwned(id, organizerId);
    const now = new Date().toISOString();
    await knex('events').where({ id }).update({ deleted_at: now, updated_at: now });

    await AuditService.record({ actorId: organizerId, action: 'event.deleted', entityType: 'event', entityId: id });
    return { message: 'Évènement supprimé.' };
  }

  private async requireOwned(id: string, organizerId: string) {
    const event = await knex('events').where({ id }).whereNull('deleted_at').first();
    if (!event) throw AppError.notFound('Évènement introuvable');
    if (event.organizer_id !== organizerId) {
      throw AppError.forbidden('Vous ne pouvez modifier que vos propres évènements.');
    }
    return event;
  }
}
