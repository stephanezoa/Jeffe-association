import type { Knex } from 'knex';

/**
 * Compléments pour brancher les écrans d'administration du frontend :
 *  - colonnes `duration` et `tags` sur `courses` (le formulaire de formation les
 *    renseigne, le schéma initial ne les modélisait pas) ;
 *  - table `contact_messages` pour le formulaire de contact public.
 */
export async function up(knex: Knex): Promise<void> {
  const hasDuration = await knex.schema.hasColumn('courses', 'duration');
  const hasTags = await knex.schema.hasColumn('courses', 'tags');
  const hasContent = await knex.schema.hasColumn('courses', 'content');

  await knex.schema.alterTable('courses', (table) => {
    if (!hasDuration) table.string('duration', 50).notNullable().defaultTo('');
    if (!hasTags) table.text('tags').notNullable().defaultTo('[]'); // JSON: string[]
    if (!hasContent) table.text('content').notNullable().defaultTo(''); // contenu riche (HTML)
  });

  // Champs d'évènement attendus par le formulaire d'administration.
  const eventCols = {
    category: await knex.schema.hasColumn('events', 'category'),
    event_type: await knex.schema.hasColumn('events', 'event_type'),
    price_cents: await knex.schema.hasColumn('events', 'price_cents'),
    cover_image_url: await knex.schema.hasColumn('events', 'cover_image_url'),
    content: await knex.schema.hasColumn('events', 'content'),
  };

  await knex.schema.alterTable('events', (table) => {
    if (!eventCols.category) table.string('category', 100).notNullable().defaultTo('');
    if (!eventCols.event_type) table.string('event_type', 20).notNullable().defaultTo('free'); // free, paid
    if (!eventCols.price_cents) table.integer('price_cents').notNullable().defaultTo(0);
    if (!eventCols.cover_image_url) table.string('cover_image_url', 500);
    if (!eventCols.content) table.text('content').notNullable().defaultTo('');
  });

  const hasContact = await knex.schema.hasTable('contact_messages');
  if (!hasContact) {
    await knex.schema.createTable('contact_messages', (table) => {
      table.string('id', 36).primary();
      table.string('name', 150).notNullable();
      table.string('email', 255).notNullable();
      table.string('phone', 50);
      table.string('subject', 255).notNullable();
      table.text('message').notNullable();
      table.string('status', 20).notNullable().defaultTo('new'); // new, read, archived
      table.string('created_at', 50).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('contact_messages');
  await knex.schema.alterTable('events', (table) => {
    table.dropColumn('category');
    table.dropColumn('event_type');
    table.dropColumn('price_cents');
    table.dropColumn('cover_image_url');
    table.dropColumn('content');
  });
  await knex.schema.alterTable('courses', (table) => {
    table.dropColumn('duration');
    table.dropColumn('tags');
    table.dropColumn('content');
  });
}
