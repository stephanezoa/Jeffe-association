import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Membres
  await knex.schema.createTable('members', (table) => {
    table.string('id', 36).primary();
    table.string('matricule', 50).notNullable().unique();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone', 50);
    table.string('password_hash', 255).notNullable();
    table.string('status', 20).notNullable().defaultTo('pending'); // pending, active, suspended
    table.string('sponsor_id', 36).references('id').inTable('members').onDelete('SET NULL');
    table.text('tree_path').notNullable(); // '/root/parent/id/'
    table.integer('tree_depth').notNullable().defaultTo(0);
    table.string('activated_at', 50);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
    table.string('deleted_at', 50);

    table.index(['tree_path']);
    table.index(['sponsor_id']);
  });

  // Invitations
  await knex.schema.createTable('invitations', (table) => {
    table.string('id', 36).primary();
    table.string('sponsor_id', 36).notNullable().references('id').inTable('members').onDelete('CASCADE');
    table.string('target_email', 255);
    table.string('target_phone', 50);
    table.string('token_hash', 255).notNullable().unique();
    table.string('status', 20).notNullable().defaultTo('sent'); // sent, used, expired, revoked
    table.string('expires_at', 50).notNullable();
    table.string('used_by_member_id', 36).references('id').inTable('members');
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  // RBAC
  await knex.schema.createTable('roles', (table) => {
    table.string('id', 36).primary();
    table.string('name', 50).notNullable().unique();
    table.string('description', 255);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('permissions', (table) => {
    table.string('id', 36).primary();
    table.string('key', 100).notNullable().unique(); // e.g. events.approve
    table.string('description', 255);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('role_permissions', (table) => {
    table.string('role_id', 36).notNullable().references('id').inTable('roles').onDelete('CASCADE');
    table.string('permission_id', 36).notNullable().references('id').inTable('permissions').onDelete('CASCADE');
    table.primary(['role_id', 'permission_id']);
  });

  await knex.schema.createTable('member_roles', (table) => {
    table.string('member_id', 36).notNullable().references('id').inTable('members').onDelete('CASCADE');
    table.string('role_id', 36).notNullable().references('id').inTable('roles').onDelete('CASCADE');
    table.primary(['member_id', 'role_id']);
  });

  await knex.schema.createTable('member_permissions', (table) => {
    table.string('member_id', 36).notNullable().references('id').inTable('members').onDelete('CASCADE');
    table.string('permission_id', 36).notNullable().references('id').inTable('permissions').onDelete('CASCADE');
    table.primary(['member_id', 'permission_id']);
  });

  // CMS
  await knex.schema.createTable('content_blocks', (table) => {
    table.string('id', 36).primary();
    table.string('key', 100).notNullable().unique();
    table.string('locale', 10).notNullable().defaultTo('fr');
    table.text('content').notNullable();
    table.integer('version').notNullable().defaultTo(1);
    table.string('updated_by', 36).references('id').inTable('members');
    table.string('status', 20).notNullable().defaultTo('published');
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('video_playlists', (table) => {
    table.string('id', 36).primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('playlist_items', (table) => {
    table.string('id', 36).primary();
    table.string('playlist_id', 36).notNullable().references('id').inTable('video_playlists').onDelete('CASCADE');
    table.string('provider', 50).notNullable(); // youtube, vimeo, self_hosted
    table.string('video_url', 500).notNullable();
    table.string('title', 255).notNullable();
    table.text('description');
    table.integer('duration_seconds').defaultTo(0);
    table.string('thumbnail_url', 500);
    table.integer('position').notNullable().defaultTo(0);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  // Articles
  await knex.schema.createTable('articles', (table) => {
    table.string('id', 36).primary();
    table.string('author_id', 36).notNullable().references('id').inTable('members');
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('summary');
    table.text('content').notNullable();
    table.string('cover_image_url', 500);
    table.string('status', 20).notNullable().defaultTo('draft'); // draft, pending, approved, rejected, published
    table.text('rejection_reason');
    table.string('reviewed_by', 36).references('id').inTable('members');
    table.string('published_at', 50);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
    table.string('deleted_at', 50);
  });

  // Événements & billetterie
  await knex.schema.createTable('events', (table) => {
    table.string('id', 36).primary();
    table.string('organizer_id', 36).notNullable().references('id').inTable('members');
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('description').notNullable();
    table.string('location', 255).notNullable();
    table.string('start_date', 50).notNullable();
    table.string('end_date', 50).notNullable();
    table.integer('capacity').notNullable().defaultTo(0);
    table.string('visibility', 20).notNullable().defaultTo('public'); // public, members_only
    table.string('status', 20).notNullable().defaultTo('draft'); // draft, pending, approved, rejected, published
    table.text('rejection_reason');
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
    table.string('deleted_at', 50);
  });

  await knex.schema.createTable('ticket_types', (table) => {
    table.string('id', 36).primary();
    table.string('event_id', 36).notNullable().references('id').inTable('events').onDelete('CASCADE');
    table.string('name', 100).notNullable();
    table.integer('price_cents').notNullable().defaultTo(0);
    table.string('currency', 10).notNullable().defaultTo('XAF');
    table.integer('quota').notNullable().defaultTo(0);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('orders', (table) => {
    table.string('id', 36).primary();
    table.string('member_id', 36).notNullable().references('id').inTable('members');
    table.string('event_id', 36).notNullable().references('id').inTable('events');
    table.integer('total_amount_cents').notNullable();
    table.string('currency', 10).notNullable().defaultTo('XAF');
    table.string('status', 20).notNullable().defaultTo('pending'); // pending, paid, failed, refunded, cancelled
    table.string('payment_provider', 50);
    table.string('external_reference', 255);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('tickets', (table) => {
    table.string('id', 36).primary();
    table.string('order_id', 36).notNullable().references('id').inTable('orders');
    table.string('ticket_type_id', 36).notNullable().references('id').inTable('ticket_types');
    table.string('member_id', 36).notNullable().references('id').inTable('members');
    table.text('qr_code_signature').notNullable().unique();
    table.string('status', 20).notNullable().defaultTo('valid'); // valid, used, cancelled
    table.string('used_at', 50);
    table.string('scanned_by', 36).references('id').inTable('members');
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('ticket_scans', (table) => {
    table.string('id', 36).primary();
    table.string('ticket_id', 36).notNullable().references('id').inTable('tickets');
    table.string('scanned_by', 36).notNullable().references('id').inTable('members');
    table.boolean('success').notNullable();
    table.string('reason', 255);
    table.string('scanned_at', 50).notNullable();
  });

  // Formations
  await knex.schema.createTable('courses', (table) => {
    table.string('id', 36).primary();
    table.string('author_id', 36).notNullable().references('id').inTable('members');
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('description').notNullable();
    table.string('intro_video_url', 500).notNullable(); // Publique !
    table.string('thumbnail_url', 500);
    table.string('level', 20).notNullable().defaultTo('all');
    table.string('status', 20).notNullable().defaultTo('draft');
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
    table.string('deleted_at', 50);
  });

  await knex.schema.createTable('course_modules', (table) => {
    table.string('id', 36).primary();
    table.string('course_id', 36).notNullable().references('id').inTable('courses').onDelete('CASCADE');
    table.integer('position').notNullable().defaultTo(0);
    table.string('title', 255).notNullable();
    table.string('video_url', 500); // Optionnel
    table.text('text_content'); // Optionnel
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('module_attachments', (table) => {
    table.string('id', 36).primary();
    table.string('module_id', 36).notNullable().references('id').inTable('course_modules').onDelete('CASCADE');
    table.string('label', 255).notNullable();
    table.string('file_url', 500).notNullable();
    table.integer('position').notNullable().defaultTo(0);
    table.string('created_at', 50).notNullable();
  });

  // Modération & Audit & Newsletter
  await knex.schema.createTable('moderation_requests', (table) => {
    table.string('id', 36).primary();
    table.string('entity_type', 50).notNullable(); // article, event, course
    table.string('entity_id', 36).notNullable();
    table.string('submitted_by', 36).notNullable().references('id').inTable('members');
    table.string('status', 20).notNullable().defaultTo('pending'); // pending, approved, rejected
    table.string('reviewed_by', 36).references('id').inTable('members');
    table.string('reviewed_at', 50);
    table.text('comment');
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });

  await knex.schema.createTable('audit_logs', (table) => {
    table.string('id', 36).primary();
    table.string('actor_id', 36).notNullable();
    table.string('actor_ip', 50).notNullable();
    table.string('action', 100).notNullable();
    table.string('entity_type', 100).notNullable();
    table.string('entity_id', 36);
    table.text('before_state');
    table.text('after_state');
    table.string('request_id', 36);
    table.string('created_at', 50).notNullable();
  });

  await knex.schema.createTable('newsletter_subscriptions', (table) => {
    table.string('id', 36).primary();
    table.string('email', 255).notNullable().unique();
    table.string('status', 20).notNullable().defaultTo('subscribed'); // subscribed, unsubscribed
    table.string('subscribed_at', 50).notNullable();
    table.string('unsubscribed_at', 50);
  });

  await knex.schema.createTable('newsletter_campaigns', (table) => {
    table.string('id', 36).primary();
    table.string('subject', 255).notNullable();
    table.text('content').notNullable();
    table.string('status', 20).notNullable().defaultTo('draft'); // draft, sent
    table.string('sent_at', 50);
    table.string('created_at', 50).notNullable();
    table.string('updated_at', 50).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('newsletter_campaigns');
  await knex.schema.dropTableIfExists('newsletter_subscriptions');
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('moderation_requests');
  await knex.schema.dropTableIfExists('module_attachments');
  await knex.schema.dropTableIfExists('course_modules');
  await knex.schema.dropTableIfExists('courses');
  await knex.schema.dropTableIfExists('ticket_scans');
  await knex.schema.dropTableIfExists('tickets');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('ticket_types');
  await knex.schema.dropTableIfExists('events');
  await knex.schema.dropTableIfExists('articles');
  await knex.schema.dropTableIfExists('playlist_items');
  await knex.schema.dropTableIfExists('video_playlists');
  await knex.schema.dropTableIfExists('content_blocks');
  await knex.schema.dropTableIfExists('member_permissions');
  await knex.schema.dropTableIfExists('member_roles');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.dropTableIfExists('invitations');
  await knex.schema.dropTableIfExists('members');
}
