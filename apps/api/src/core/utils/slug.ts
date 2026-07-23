import { knex } from '../database/knex';

/** Transforme un titre en identifiant d'URL : « Mon Titre ! » → « mon-titre ». */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les accents (diacritiques combinants)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200) || 'element';
}

/**
 * Slug unique pour une table donnée : suffixe -2, -3… en cas de collision.
 * `ignoreId` permet de conserver le slug d'une ligne lors d'une mise à jour.
 */
export async function uniqueSlug(table: string, title: string, ignoreId?: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = knex(table).where({ slug: candidate });
    if (ignoreId) query.whereNot({ id: ignoreId });
    const existing = await query.first();
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}
