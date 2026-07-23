import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SponsorshipRepository } from './sponsorship.repository';
import { AppError } from '../../core/errors/app-error';
import { eventBus } from '../../core/events/event-bus';
import { AuditService } from '../../core/audit/audit.service';
import { SPONSORSHIP_EVENTS } from './sponsorship.events';

export class SponsorshipService {
  private repo = new SponsorshipRepository();

  public async createInvitation(sponsorId: string, input: { targetEmail?: string; targetPhone?: string }, actorIp: string) {
    const sponsor = await this.repo.findMemberById(sponsorId);
    if (!sponsor || sponsor.status !== 'active') {
      throw AppError.forbidden('Un membre suspendu ou inactif ne peut pas générer d\'invitations.');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const invitation = await this.repo.createInvitation({
      sponsorId,
      targetEmail: input.targetEmail,
      targetPhone: input.targetPhone,
      tokenHash,
      status: 'sent',
      expiresAt,
    });

    await AuditService.record({
      actorId: sponsorId,
      actorIp,
      action: 'invitation.created',
      entityType: 'invitation',
      entityId: invitation.id,
      after: { targetEmail: input.targetEmail, expiresAt },
    });

    eventBus.emitEvent(SPONSORSHIP_EVENTS.INVITATION_CREATED, { invitationId: invitation.id, rawToken });

    return {
      invitationId: invitation.id,
      rawToken,
      expiresAt,
      inviteUrl: `/rejoindre?token=${rawToken}`,
    };
  }

  public async validateInvitationToken(rawToken: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const invitation = await this.repo.findInvitationByTokenHash(tokenHash);

    if (!invitation || invitation.status !== 'sent') {
      throw AppError.badRequest('Jeton d\'invitation invalide ou déjà utilisé.', 'SPONSORSHIP_INVITE_INVALID');
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      throw AppError.badRequest('Le jeton d\'invitation a expiré.', 'SPONSORSHIP_INVITE_EXPIRED');
    }

    const sponsor = await this.repo.findMemberById(invitation.sponsorId);
    return { invitation, sponsor };
  }

  public async getTree(memberId: string, rootId?: string, depth = 10) {
    // Les modèles Objection ne mappent pas snake_case → camelCase : on lit donc
    // les colonnes brutes (tree_path, tree_depth) et on normalise la sortie.
    const currentMember = (await this.repo.findMemberById(memberId)) as any;
    if (!currentMember) throw AppError.notFound('Membre introuvable');

    let targetRoot = currentMember;
    if (rootId && rootId !== memberId) {
      const requestedMember = (await this.repo.findMemberById(rootId)) as any;
      if (!requestedMember) throw AppError.notFound('Membre racine demandé introuvable');

      // Isolation stricte : la racine demandée doit appartenir à la descendance de l'appelant.
      if (!String(requestedMember.tree_path).startsWith(currentMember.tree_path)) {
        throw AppError.forbidden('Vous n\'avez pas accès à cet arbre généalogique.', 'SPONSORSHIP_TREE_ACCESS_DENIED');
      }
      targetRoot = requestedMember;
    }

    const maxDepth = targetRoot.tree_depth + depth;
    const rows = (await this.repo.getTreeForMember(targetRoot.tree_path, maxDepth)) as any[];

    const members = rows.map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone ?? null,
      status: row.status,
      sponsorId: row.sponsor_id,
      treePath: row.tree_path,
      treeDepth: row.tree_depth,
      createdAt: row.created_at,
    }));

    return { rootId: targetRoot.id, members };
  }

  public async getDownline(memberId: string, page: number, limit: number, filters?: { status?: string; search?: string }) {
    const currentMember = await this.repo.findMemberById(memberId);
    if (!currentMember) throw AppError.notFound('Membre introuvable');

    return this.repo.getDownlinePaginated(currentMember.treePath, page, limit, filters);
  }

  public async getStats(memberId: string) {
    const currentMember = await this.repo.findMemberById(memberId);
    if (!currentMember) throw AppError.notFound('Membre introuvable');

    return this.repo.getNetworkStats(memberId, currentMember.treePath);
  }
}
