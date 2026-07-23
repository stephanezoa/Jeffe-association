import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { knex } from '../../core/database/knex';
import { env } from '../../core/config/env';
import { AppError } from '../../core/errors/app-error';
import { SponsorshipService } from '../sponsorship/sponsorship.service';
import { AuditService } from '../../core/audit/audit.service';

export class AuthService {
  private sponsorshipService = new SponsorshipService();

  public async registerWithInvitation(input: {
    token: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }, actorIp: string) {
    // 1. Validate invitation token (Must be valid, not expired, not used)
    const { invitation, sponsor } = await this.sponsorshipService.validateInvitationToken(input.token);

    const existingUser = await knex('members').where({ email: input.email }).first();
    if (existingUser) {
      throw AppError.conflict('Cet email est déjà utilisé.');
    }

    const memberId = uuidv4();
    const matricule = `VEST-${Math.floor(100000 + Math.random() * 900000)}`;
    const passwordHash = await bcrypt.hash(input.password, 10);
    const now = new Date().toISOString();

    const sponsorTreePath = sponsor ? sponsor.treePath : '/';
    const treePath = `${sponsorTreePath}${memberId}/`;
    const treeDepth = sponsor ? sponsor.treeDepth + 1 : 0;

    // 2. Perform in single transaction
    await knex.transaction(async (trx) => {
      await trx('members').insert({
        id: memberId,
        matricule,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone || null,
        password_hash: passwordHash,
        status: 'active',
        sponsor_id: sponsor ? sponsor.id : null,
        tree_path: treePath,
        tree_depth: treeDepth,
        activated_at: now,
        created_at: now,
        updated_at: now,
      });

      // Default role = member
      const memberRole = await trx('roles').where({ name: 'member' }).first();
      if (memberRole) {
        await trx('member_roles').insert({
          member_id: memberId,
          role_id: memberRole.id,
        });
      }

      // Mark invitation as used
      await trx('invitations').where({ id: invitation.id }).update({
        status: 'used',
        used_by_member_id: memberId,
        updated_at: now,
      });
    });

    await AuditService.record({
      actorId: memberId,
      actorIp,
      action: 'auth.registered_via_sponsorship',
      entityType: 'member',
      entityId: memberId,
      after: { email: input.email, sponsorId: sponsor?.id },
    });

    return this.generateTokens(memberId, input.email, matricule, input.firstName, input.lastName, ['member'], []);
  }

  public async login(email: string, password: string, actorIp: string) {
    const member = await knex('members').where({ email }).whereNull('deleted_at').first();
    if (!member) {
      throw AppError.unauthorized('Identifiants invalides', 'AUTH_INVALID_CREDENTIALS');
    }

    if (member.status === 'suspended') {
      throw AppError.forbidden('Votre compte est suspendu. Veuillez contacter l\'administration.', 'ACCOUNT_SUSPENDED');
    }

    const valid = await bcrypt.compare(password, member.password_hash);
    if (!valid) {
      throw AppError.unauthorized('Identifiants invalides', 'AUTH_INVALID_CREDENTIALS');
    }

    // Load roles & permissions
    const rolesRes = await knex('member_roles')
      .join('roles', 'member_roles.role_id', 'roles.id')
      .where({ member_id: member.id })
      .select('roles.name');
    const roles = rolesRes.map((r) => r.name);

    const isSuperAdmin = roles.includes('super_admin');
    let permissions: string[] = [];

    if (!isSuperAdmin) {
      const permsRes = await knex('role_permissions')
        .join('member_roles', 'role_permissions.role_id', 'member_roles.role_id')
        .join('permissions', 'role_permissions.permission_id', 'permissions.id')
        .where('member_roles.member_id', member.id)
        .select('permissions.key');
      permissions = Array.from(new Set(permsRes.map((p) => p.key)));
    }

    await AuditService.record({
      actorId: member.id,
      actorIp,
      action: 'auth.login_success',
      entityType: 'member',
      entityId: member.id,
    });

    return this.generateTokens(member.id, member.email, member.matricule, member.first_name, member.last_name, roles, permissions);
  }

  public async changePassword(memberId: string, currentPassword: string, newPassword: string) {
    const member = await knex('members').where({ id: memberId }).whereNull('deleted_at').first();
    if (!member) throw AppError.notFound('Membre introuvable');

    const valid = await bcrypt.compare(currentPassword, member.password_hash);
    if (!valid) {
      throw AppError.badRequest('Le mot de passe actuel est incorrect.', 'AUTH_WRONG_PASSWORD');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await knex('members').where({ id: memberId }).update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    });

    await AuditService.record({
      actorId: memberId,
      action: 'auth.password_changed',
      entityType: 'member',
      entityId: memberId,
    });

    return { message: 'Mot de passe mis à jour avec succès.' };
  }

  private generateTokens(id: string, email: string, matricule: string, firstName: string, lastName: string, roles: string[], permissions: string[]) {
    const payload = { id, email, matricule, firstName, lastName, roles, permissions };
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { user: payload, accessToken, refreshToken };
  }
}
