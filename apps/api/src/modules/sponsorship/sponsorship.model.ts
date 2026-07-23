import { BaseModel } from '../../core/database/base.model';

export class MemberModel extends BaseModel {
  static get tableName() {
    return 'members';
  }

  matricule!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone?: string;
  passwordHash!: string;
  status!: 'pending' | 'active' | 'suspended';
  sponsorId?: string | null;
  treePath!: string;
  treeDepth!: number;
  activatedAt?: string;

  static get relationMappings() {
    return {
      sponsor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: MemberModel,
        join: {
          from: 'members.sponsor_id',
          to: 'members.id',
        },
      },
      downline: {
        relation: BaseModel.HasManyRelation,
        modelClass: MemberModel,
        join: {
          from: 'members.id',
          to: 'members.sponsor_id',
        },
      },
    };
  }
}

export class InvitationModel extends BaseModel {
  static get tableName() {
    return 'invitations';
  }

  sponsorId!: string;
  targetEmail?: string;
  targetPhone?: string;
  tokenHash!: string;
  status!: 'sent' | 'used' | 'expired' | 'revoked';
  expiresAt!: string;
  usedByMemberId?: string;

  static get relationMappings() {
    return {
      sponsor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: MemberModel,
        join: {
          from: 'invitations.sponsor_id',
          to: 'members.id',
        },
      },
    };
  }
}
