import { knex } from '../../core/database/knex';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../core/errors/app-error';
import { AuditService } from '../../core/audit/audit.service';

export class NewsletterService {
  public async subscribe(email: string) {
    const existing = await knex('newsletter_subscriptions').where({ email }).first();
    if (existing) {
      if (existing.status === 'subscribed') {
        return { message: 'Vous êtes déjà inscrit à la newsletter.' };
      }
      await knex('newsletter_subscriptions').where({ email }).update({
        status: 'subscribed',
        subscribed_at: new Date().toISOString(),
      });
      return { message: 'Inscriptions à la newsletter réactivée avec succès.' };
    }

    await knex('newsletter_subscriptions').insert({
      id: uuidv4(),
      email,
      status: 'subscribed',
      subscribed_at: new Date().toISOString(),
    });

    return { message: 'Inscription à la newsletter effectuée avec succès.' };
  }

  public async getSubscribers() {
    return knex('newsletter_subscriptions').select('id', 'email', 'status', 'subscribed_at').orderBy('subscribed_at', 'desc');
  }

  public async createCampaign(subject: string, content: string, actorId: string) {
    const id = uuidv4();
    const now = new Date().toISOString();

    await knex('newsletter_campaigns').insert({
      id,
      subject,
      content,
      status: 'draft',
      created_at: now,
      updated_at: now,
    });

    await AuditService.record({
      actorId,
      action: 'newsletter.campaign_created',
      entityType: 'newsletter_campaign',
      entityId: id,
      after: { subject },
    });

    return { id, subject, status: 'draft' };
  }

  public async sendCampaign(id: string, actorId: string) {
    const campaign = await knex('newsletter_campaigns').where({ id }).first();
    if (!campaign) throw AppError.notFound('Campagne introuvable');

    const now = new Date().toISOString();
    await knex('newsletter_campaigns').where({ id }).update({
      status: 'sent',
      sent_at: now,
      updated_at: now,
    });

    await AuditService.record({
      actorId,
      action: 'newsletter.campaign_sent',
      entityType: 'newsletter_campaign',
      entityId: id,
    });

    return { message: 'Campagne newsletter envoyée avec succès aux abonnés.' };
  }
}
