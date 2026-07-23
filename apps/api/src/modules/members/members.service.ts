import { knex } from '../../core/database/knex';
import { AppError } from '../../core/errors/app-error';
import { AuditService } from '../../core/audit/audit.service';

interface ProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

function toProfileDto(row: any) {
  return {
    id: row.id,
    matricule: row.matricule,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
    activatedAt: row.activated_at,
  };
}

export class MembersService {
  public async getProfile(memberId: string) {
    const member = await knex('members').where({ id: memberId }).whereNull('deleted_at').first();
    if (!member) throw AppError.notFound('Membre introuvable');
    return toProfileDto(member);
  }

  public async updateProfile(memberId: string, input: ProfileUpdate) {
    const member = await knex('members').where({ id: memberId }).whereNull('deleted_at').first();
    if (!member) throw AppError.notFound('Membre introuvable');

    // L'email doit rester unique.
    if (input.email && input.email !== member.email) {
      const taken = await knex('members').where({ email: input.email }).whereNot({ id: memberId }).first();
      if (taken) throw AppError.conflict('Cet email est déjà utilisé.');
    }

    const patch: Record<string, any> = { updated_at: new Date().toISOString() };
    if (input.firstName !== undefined) patch.first_name = input.firstName;
    if (input.lastName !== undefined) patch.last_name = input.lastName;
    if (input.email !== undefined) patch.email = input.email;
    if (input.phone !== undefined) patch.phone = input.phone || null;

    await knex('members').where({ id: memberId }).update(patch);

    await AuditService.record({
      actorId: memberId,
      action: 'member.profile_updated',
      entityType: 'member',
      entityId: memberId,
      after: patch,
    });

    return this.getProfile(memberId);
  }
}
