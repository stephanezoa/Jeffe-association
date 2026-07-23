import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  const isSqlite = (knex.client.config.client as string) === 'sqlite3';

  // On désactive temporairement les FK : la purge des membres se heurterait
  // sinon au contenu seedé (articles/évènements/tickets) qui les référence.
  if (isSqlite) await knex.raw('PRAGMA foreign_keys = OFF');

  // Clear existing
  await knex('member_roles').del();
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('roles').del();
  await knex('members').del();

  if (isSqlite) await knex.raw('PRAGMA foreign_keys = ON');

  const now = new Date().toISOString();

  // Roles
  const superAdminRoleId = uuidv4();
  const adminRoleId = uuidv4();
  const memberRoleId = uuidv4();

  await knex('roles').insert([
    { id: superAdminRoleId, name: 'super_admin', description: 'Accès complet non restreint', created_at: now, updated_at: now },
    { id: adminRoleId, name: 'admin', description: 'Gestionnaire administrateur', created_at: now, updated_at: now },
    { id: memberRoleId, name: 'member', description: 'Membre actif de la communauté', created_at: now, updated_at: now },
  ]);

  // Permissions
  const permissionsList = [
    'members.manage',
    'sponsorship.invite',
    'articles.create',
    'articles.approve',
    'events.create',
    'events.approve',
    'courses.create',
    'courses.approve',
    'cms.edit',
    'newsletter.manage',
    'admin.dashboard',
  ];

  const permissionRows = permissionsList.map((key) => ({
    id: uuidv4(),
    key,
    description: `Permission pour ${key}`,
    created_at: now,
    updated_at: now,
  }));

  await knex('permissions').insert(permissionRows);

  // Link permissions to super_admin
  const rolePermissionRows = permissionRows.map((p) => ({
    role_id: superAdminRoleId,
    permission_id: p.id,
  }));

  await knex('role_permissions').insert(rolePermissionRows);

  // Super Admin Member
  const superAdminId = uuidv4();
  const passwordHash = await bcrypt.hash('SuperAdminPassword123!', 10);

  await knex('members').insert({
    id: superAdminId,
    matricule: 'VEST-000001',
    first_name: 'Super',
    last_name: 'Admin',
    email: 'admin@vestige.org',
    phone: '+237600000000',
    password_hash: passwordHash,
    status: 'active',
    sponsor_id: null,
    tree_path: `/${superAdminId}/`,
    tree_depth: 0,
    activated_at: now,
    created_at: now,
    updated_at: now,
  });

  await knex('member_roles').insert({
    member_id: superAdminId,
    role_id: superAdminRoleId,
  });
}
