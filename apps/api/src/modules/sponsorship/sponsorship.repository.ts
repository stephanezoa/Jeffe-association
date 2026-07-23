import { knex } from '../../core/database/knex';
import { MemberModel, InvitationModel } from './sponsorship.model';

export class SponsorshipRepository {
  public async createInvitation(data: Partial<InvitationModel>): Promise<InvitationModel> {
    return InvitationModel.query().insert(data);
  }

  public async findInvitationByTokenHash(tokenHash: string): Promise<InvitationModel | undefined> {
    return InvitationModel.query().findOne({ token_hash: tokenHash });
  }

  public async markInvitationUsed(id: string, memberId: string, trx?: any): Promise<void> {
    await InvitationModel.query(trx).patchAndFetchById(id, {
      status: 'used',
      usedByMemberId: memberId,
      updatedAt: new Date().toISOString(),
    });
  }

  public async findMemberById(id: string): Promise<MemberModel | undefined> {
    return MemberModel.query().findById(id);
  }

  public async getTreeForMember(rootPath: string, maxDepth: number): Promise<MemberModel[]> {
    // Multi-tenant check: filter by tree_path LIKE rootPath%
    return MemberModel.query()
      .where('tree_path', 'like', `${rootPath}%`)
      .andWhere('tree_depth', '<=', maxDepth)
      .select('id', 'first_name', 'last_name', 'email', 'phone', 'status', 'sponsor_id', 'tree_path', 'tree_depth', 'created_at');
  }

  public async getDownlinePaginated(rootPath: string, page: number, limit: number, filters?: { status?: string; search?: string }) {
    let query = MemberModel.query()
      .where('tree_path', 'like', `${rootPath}%`)
      .andWhereNot('tree_path', rootPath);

    if (filters?.status) {
      query = query.andWhere('status', filters.status);
    }

    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      query = query.andWhere((q) => {
        q.whereRaw('lower(first_name) like ?', [term])
          .orWhereRaw('lower(last_name) like ?', [term])
          .orWhereRaw('lower(email) like ?', [term]);
      });
    }

    return query.page(page - 1, limit);
  }

  public async getNetworkStats(memberId: string, rootPath: string) {
    // Recursive CTE for downline calculation (Universal ANSI SQL compatible with SQLite & PG)
    const rawResult = await knex.raw(`
      WITH RECURSIVE downline AS (
        SELECT id, sponsor_id, tree_depth FROM members WHERE sponsor_id = ?
        UNION ALL
        SELECT m.id, m.sponsor_id, m.tree_depth FROM members m
        INNER JOIN downline d ON m.sponsor_id = d.id
      )
      SELECT COUNT(*) as total, tree_depth FROM downline GROUP BY tree_depth ORDER BY tree_depth ASC
    `, [memberId]);

    const rows = rawResult.rows || rawResult;
    return rows;
  }
}
