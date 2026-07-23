import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

/**
 * Jeu de démonstration complet rattaché au super administrateur :
 *   - un réseau de parrainage (membres filleuls sur plusieurs générations) ;
 *   - articles, formations, évènements ;
 *   - billetterie (types de tickets, commandes, tickets vendus).
 *
 * À lancer seul pour ne pas réexécuter le seed admin :
 *   knex --knexfile knexfile.ts seed:run --specific=02_demo_content_seed.ts
 */
export async function seed(knex: Knex): Promise<void> {
  const admin = await knex('members').where({ email: 'admin@vestige.org' }).first();
  if (!admin) {
    // eslint-disable-next-line no-console
    console.warn('Seed démo ignoré : super administrateur introuvable (lancez d’abord le seed principal).');
    return;
  }

  const now = new Date().toISOString();
  const slugify = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  // --- Nettoyage (ordre imposé par les clés étrangères) -----------------------
  await knex('ticket_scans').del();
  await knex('tickets').del();
  await knex('orders').del();
  await knex('ticket_types').del();
  await knex('articles').del();
  await knex('courses').del();
  await knex('events').del();
  await knex('member_roles').whereNot({ member_id: admin.id }).del();
  await knex('members').where('tree_depth', '>', 0).del();

  const memberRole = await knex('roles').where({ name: 'member' }).first();
  const passwordHash = await bcrypt.hash('MembrePassword123!', 10);
  let matriculeCounter = 100;

  // --- Réseau de parrainage ---------------------------------------------------
  interface SeedMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    treePath: string;
    treeDepth: number;
    sponsorId: string;
    createdAt: string;
  }

  const seeded: SeedMember[] = [];

  /** Crée un membre filleul et renvoie sa fiche (pour parrainer à son tour). */
  const addMember = (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    sponsor: { id: string; treePath: string; treeDepth: number },
    createdAt: string,
  ): SeedMember => {
    const id = uuidv4();
    const member: SeedMember = {
      id,
      firstName,
      lastName,
      email,
      phone,
      treePath: `${sponsor.treePath}${id}/`,
      treeDepth: sponsor.treeDepth + 1,
      sponsorId: sponsor.id,
      createdAt,
    };
    seeded.push(member);
    return member;
  };

  const adminNode = { id: admin.id, treePath: admin.tree_path, treeDepth: admin.tree_depth };

  // Génération 1 (parrainés directs)
  const yves = addMember('Yves', 'Malong', 'malongyves@gmail.com', '233 890 098', adminNode, '2026-08-13T16:11:00Z');
  const samantha = addMember('Samantha', 'Williams', 'sm.williams@yahoo.com', '688 998 321', adminNode, '2026-08-14T15:32:00Z');
  const john = addMember('John', 'Doe', 'johndoe@gmail.com', '675 890 089', adminNode, '2026-08-22T09:22:00Z');
  addMember('Aïcha', 'Bello', 'aicha.bello@gmail.com', '699 120 340', adminNode, '2026-08-18T10:05:00Z');
  addMember('Marc', 'Ndong', 'marc.ndong@gmail.com', '677 450 210', adminNode, '2026-08-20T14:20:00Z');
  addMember('Fatou', 'Sow', 'fatou.sow@gmail.com', '690 771 902', adminNode, '2026-08-25T08:40:00Z');

  // Génération 2 (filleuls de filleuls)
  addMember('Vanessa', 'Nourra', 'nourravanessa@gmail.com', '696 227 364', samantha, '2026-08-22T11:16:00Z');
  addMember('Steve', 'Assomo', 'steve.assomo@gmail.com', '681 340 559', john, '2026-08-27T13:10:00Z');
  addMember('Raissa', 'Garba', 'raissa.garba@gmail.com', '694 908 133', john, '2026-08-29T09:47:00Z');
  addMember('Kevin', 'Tchoumi', 'kevin.tchoumi@gmail.com', '678 220 471', yves, '2026-09-01T17:25:00Z');
  addMember('Linda', 'Eyenga', 'linda.eyenga@gmail.com', '699 553 018', yves, '2026-09-03T12:00:00Z');

  await knex('members').insert(
    seeded.map((m) => ({
      id: m.id,
      matricule: `VEST-${String(++matriculeCounter).padStart(6, '0')}`,
      first_name: m.firstName,
      last_name: m.lastName,
      email: m.email,
      phone: m.phone,
      password_hash: passwordHash,
      status: 'active',
      sponsor_id: m.sponsorId,
      tree_path: m.treePath,
      tree_depth: m.treeDepth,
      activated_at: m.createdAt,
      created_at: m.createdAt,
      updated_at: now,
    })),
  );

  if (memberRole) {
    await knex('member_roles').insert(seeded.map((m) => ({ member_id: m.id, role_id: memberRole.id })));
  }

  // --- Articles ---------------------------------------------------------------
  const story = [
    "La semaine dernière, un événement mémorable a captivé l'intérêt de nombreux passionnés dans notre région. Ce rassemblement a permis d'échanger des idées novatrices et des expériences enrichissantes.",
    "Cet événement a engendré des discussions passionnantes qui continuent d'animer notre communauté. Les retours des participants témoignent d'une expérience marquée par des rencontres inoubliables.",
  ];

  const articles = [
    ["L'Art de la Communication Professionnelle", '2026-06-23', 'published'],
    ['Techniques Avancées de Négociation', '2026-07-15', 'published'],
    ['Gestion du Stress en Milieu de Travail', '2026-08-02', 'published'],
    ['Leadership et Motivation des Équipes', '2026-09-19', 'published'],
    ['Stratégies de Marketing Digital', '2026-10-10', 'published'],
    ['Innovation et Créativité au Bureau', '2026-11-05', 'draft'],
  ] as const;

  await knex('articles').insert(
    articles.map(([title, date, status]) => ({
      id: uuidv4(),
      author_id: admin.id,
      title,
      slug: slugify(title),
      summary: story[0].slice(0, 140),
      content: `<p>${story.join('</p><p>')}</p>`,
      cover_image_url: null,
      status,
      published_at: status === 'published' ? `${date}T09:00:00.000Z` : null,
      created_at: `${date}T09:00:00.000Z`,
      updated_at: now,
    })),
  );

  // --- Formations -------------------------------------------------------------
  const courses = [
    ['Communication Professionnelle', '03h', ['Communication', 'Relations']],
    ['Gestion de Projet', '04h30', ['Management', 'Organisation']],
    ['Développement Web', '05h', ['Informatique', 'Technologie']],
    ['Marketing Digital', '03h45', ['Commerce', 'Stratégie']],
    ['Analyse de Données', '02h30', ['Informatique', 'Statistiques']],
    ['Design UX/UI', '04h00', ['Création', 'Ergonomie']],
    ['Communication Interne', '02h50', ['Ressources Humaines', 'Relations']],
  ] as const;

  await knex('courses').insert(
    courses.map(([title, duration, tags]) => ({
      id: uuidv4(),
      author_id: admin.id,
      title,
      slug: slugify(title),
      description: 'Formation proposée aux membres d’Excelle Wellth.',
      duration,
      tags: JSON.stringify(tags),
      thumbnail_url: null,
      intro_video_url: '',
      content: '<p>Bienvenue dans cette formation enrichissante !</p>',
      level: 'all',
      status: 'published',
      created_at: now,
      updated_at: now,
    })),
  );

  // --- Évènements + billetterie ----------------------------------------------
  const events = [
    ['Retraite spirituelle', 'Masterclass', 'free', 0, 'Douala, Cameroun', '2026-08-29', 30],
    ['Cuisine saine', 'Atelier', 'paid', 500000, 'Paris, France', '2026-09-15', 4],
    ['Technologie et innovation', 'Masterclass', 'free', 0, 'Montréal, Canada', '2026-10-10', 24],
    ['Bien-être et relaxation', 'Détente', 'paid', 300000, 'Lac Annecy, France', '2026-11-05', 13],
    ['Gala de l’excellence', 'Cérémonie', 'paid', 1000000, 'Douala, Cameroun', '2026-01-24', 83],
  ] as const;

  const memberPool = [admin.id, ...seeded.map((m) => m.id)];
  let ticketTotal = 0;

  for (const [title, category, eventType, priceCents, location, date, sold] of events) {
    const eventId = uuidv4();
    await knex('events').insert({
      id: eventId,
      organizer_id: admin.id,
      title,
      slug: slugify(title),
      description: 'Un évènement organisé par la communauté Excelle Wellth.',
      location,
      start_date: date,
      end_date: date,
      capacity: 0,
      visibility: 'public',
      status: 'published',
      category,
      event_type: eventType,
      price_cents: priceCents,
      cover_image_url: null,
      content: '',
      created_at: now,
      updated_at: now,
    });

    const ticketTypeId = uuidv4();
    await knex('ticket_types').insert({
      id: ticketTypeId,
      event_id: eventId,
      name: 'Standard',
      price_cents: priceCents,
      currency: 'XAF',
      quota: 0,
      created_at: now,
      updated_at: now,
    });

    // Une commande par acheteur, un ticket par commande, jusqu'à `sold`.
    for (let i = 0; i < sold; i += 1) {
      const buyerId = memberPool[i % memberPool.length];
      const orderId = uuidv4();
      await knex('orders').insert({
        id: orderId,
        member_id: buyerId,
        event_id: eventId,
        total_amount_cents: priceCents,
        currency: 'XAF',
        status: 'paid',
        created_at: now,
        updated_at: now,
      });
      await knex('tickets').insert({
        id: uuidv4(),
        order_id: orderId,
        ticket_type_id: ticketTypeId,
        member_id: buyerId,
        qr_code_signature: uuidv4(),
        status: 'valid',
        created_at: now,
        updated_at: now,
      });
      ticketTotal += 1;
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `Seed démo : ${seeded.length} membres, ${articles.length} articles, ${courses.length} formations, ${events.length} évènements, ${ticketTotal} tickets.`,
  );
}
