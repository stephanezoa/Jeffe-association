import { knex } from '../../core/database/knex';
import { AuditService } from '../../core/audit/audit.service';
import { AppError } from '../../core/errors/app-error';

export class AdminService {
  public async getDashboardStats() {
    const totalMembersRes = await knex('members').count('* as count').first();
    const activeMembersRes = await knex('members').where({ status: 'active' }).count('* as count').first();
    const suspendedMembersRes = await knex('members').where({ status: 'suspended' }).count('* as count').first();
    const pendingModerationRes = await knex('moderation_requests').where({ status: 'pending' }).count('* as count').first();
    const newsletterSubscribersRes = await knex('newsletter_subscriptions').where({ status: 'subscribed' }).count('* as count').first();
    const totalEventsRes = await knex('events').count('* as count').first();
    const totalCoursesRes = await knex('courses').count('* as count').first();

    return {
      totalMembers: Number(totalMembersRes?.count || 0),
      activeMembers: Number(activeMembersRes?.count || 0),
      suspendedMembers: Number(suspendedMembersRes?.count || 0),
      pendingModerations: Number(pendingModerationRes?.count || 0),
      newsletterSubscribers: Number(newsletterSubscribersRes?.count || 0),
      totalEvents: Number(totalEventsRes?.count || 0),
      totalCourses: Number(totalCoursesRes?.count || 0),
    };
  }

  public async getMembersList(page = 1, limit = 20, search?: string) {
    let query = knex('members').whereNull('deleted_at');
    if (search) {
      const term = `%${search.toLowerCase()}%`;
      query = query.where((q) => {
        q.whereRaw('lower(first_name) like ?', [term])
          .orWhereRaw('lower(last_name) like ?', [term])
          .orWhereRaw('lower(email) like ?', [term])
          .orWhereRaw('lower(matricule) like ?', [term]);
      });
    }

    const totalRes = await query.clone().count('* as count').first();
    const members = await query
      .select('id', 'matricule', 'first_name', 'last_name', 'email', 'phone', 'status', 'tree_depth', 'created_at')
      .orderBy('created_at', 'desc')
      .offset((page - 1) * limit)
      .limit(limit);

    return { members, total: Number(totalRes?.count || 0), page, limit };
  }

  public async updateMemberStatus(memberId: string, status: 'active' | 'suspended', actorId: string, reason?: string) {
    const member = await knex('members').where({ id: memberId }).first();
    if (!member) throw AppError.notFound('Membre introuvable');

    await knex('members').where({ id: memberId }).update({
      status,
      updated_at: new Date().toISOString(),
    });

    await AuditService.record({
      actorId,
      action: status === 'suspended' ? 'member.suspended' : 'member.activated',
      entityType: 'member',
      entityId: memberId,
      before: { status: member.status },
      after: { status, reason },
    });

    return { message: `Statut du membre mis à jour : ${status}` };
  }

  public async grantPermissionToAdmin(memberId: string, permissionKey: string, actorId: string) {
    const member = await knex('members').where({ id: memberId }).first();
    if (!member) throw AppError.notFound('Membre introuvable');

    const permission = await knex('permissions').where({ key: permissionKey }).first();
    if (!permission) throw AppError.notFound('Permission introuvable');

    const existing = await knex('member_permissions').where({ member_id: memberId, permission_id: permission.id }).first();
    if (!existing) {
      await knex('member_permissions').insert({
        member_id: memberId,
        permission_id: permission.id,
      });
    }

    await AuditService.record({
      actorId,
      action: 'rbac.permission_granted',
      entityType: 'member',
      entityId: memberId,
      after: { permissionKey },
    });

    return { message: `Permission ${permissionKey} accordée avec succès à ${member.first_name} ${member.last_name}` };
  }

  public async getModerationQueue() {
    return knex('moderation_requests')
      .join('members', 'moderation_requests.submitted_by', 'members.id')
      .select(
        'moderation_requests.*',
        'members.first_name as author_first_name',
        'members.last_name as author_last_name',
        'members.email as author_email'
      )
      .orderBy('moderation_requests.created_at', 'desc');
  }

  public async reviewModerationItem(id: string, status: 'approved' | 'rejected', actorId: string, comment?: string) {
    const req = await knex('moderation_requests').where({ id }).first();
    if (!req) throw AppError.notFound('Demande de modération introuvable');

    const now = new Date().toISOString();
    await knex('moderation_requests').where({ id }).update({
      status,
      reviewed_by: actorId,
      reviewed_at: now,
      comment: comment || null,
      updated_at: now,
    });

    await AuditService.record({
      actorId,
      action: `moderation.${status}`,
      entityType: req.entity_type,
      entityId: req.entity_id,
      after: { status, comment },
    });

    return { message: `Élément de modération marqué comme ${status}` };
  }

  public async getAuditLogs(page = 1, limit = 50) {
    const totalRes = await knex('audit_logs').count('* as count').first();
    const logs = await knex('audit_logs')
      .orderBy('created_at', 'desc')
      .offset((page - 1) * limit)
      .limit(limit);

    return { logs, total: Number(totalRes?.count || 0), page, limit };
  }
}
