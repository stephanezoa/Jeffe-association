import type { BadgeTone } from '../components/ui/Badge';
import type { Status } from '../components/ui/StatusBadge';

/**
 * Évènements de l'espace d'administration (maquette Figma « Evènements »).
 *
 * Aucun module `events` n'est monté dans apps/api/src/app.ts : la liste, le solde
 * et les tickets vendus sont des valeurs de démonstration. Seul le compteur
 * d'évènements a une source réelle (`totalEvents` de /admin/dashboard/stats).
 */

export interface EventTag {
  label: string;
  tone: BadgeTone;
}

export interface AdminEvent {
  id: string;
  title: string;
  excerpt: string;
  /** Date de tenue au format ISO (AAAA-MM-JJ). */
  date: string;
  location: string;
  image: string;
  imageAlt: string;
  tags: EventTag[];
  /** Nombre de billets déjà vendus. */
  ticketsSold: number;
  /** État de billetterie, affiché en pastille. */
  status: Extract<Status, 'full' | 'cancelled' | 'expired'> | null;
  /** Évènement créé par le membre connecté. */
  mine: boolean;
}

export type EventScope = 'upcoming' | 'mine' | 'archived';

export const EVENEMENTS_PAGE = {
  title: 'Evènements',
  subtitle: 'Gérez les évènements',
  create: 'Créer un évènement',
  withdraw: 'Effectuer un retrait',
  transactions: 'Historique des transactions',
  search: 'Rechercher par titre',
  filters: 'Filtres',
  empty: 'Aucun évènement dans cette sélection.',
  tabs: [
    { id: 'upcoming' as EventScope, label: 'A vénir' },
    { id: 'mine' as EventScope, label: 'Mes évènements' },
    { id: 'archived' as EventScope, label: 'Archives' },
  ],
};

/** Solde et billetterie : aucun module de paiement côté API. */
export const DEMO_EVENT_STATS = {
  total: 33,
  upcoming: 14,
  balance: 42500,
  currency: 'FCFA',
  ticketsSold: 83,
};

export const DEMO_EVENTS: AdminEvent[] = [
  {
    id: 'retraite-spirituelle',
    title: 'Retraite spirituelle',
    excerpt:
      'Une retraite spirituelle est une occasion unique de se reconnecter avec soi-même et de retrouver son équilibre intérieur.',
    date: '2026-08-29',
    location: 'Douala, Cameroun',
    image: '/images/evenement-retraite.svg',
    imageAlt: 'Affiche de la retraite spirituelle',
    tags: [
      { label: 'Masterclass', tone: 'sky' },
      { label: 'Gratuit', tone: 'amber' },
    ],
    ticketsSold: 30,
    status: null,
    mine: true,
  },
  {
    id: 'cuisine-saine',
    title: 'Cuisine saine',
    excerpt:
      'Apprenez à préparer des plats végétariens savoureux et équilibrés dans une ambiance conviviale et bienveillante.',
    date: '2026-09-15',
    location: 'Paris, France',
    image: '/images/evenement-cuisine.svg',
    imageAlt: 'Affiche de l’atelier de cuisine végétarienne',
    tags: [{ label: 'Atelier de cuisine végétarienne', tone: 'sky' }],
    ticketsSold: 4,
    status: null,
    mine: false,
  },
  {
    id: 'technologie-innovation',
    title: 'Technologie et innovation',
    excerpt:
      'Explorez les dernières avancées en intelligence artificielle et leur impact sur les métiers de demain.',
    date: '2026-10-10',
    location: 'Montréal, Canada',
    image: '/images/evenement-technologie.svg',
    imageAlt: 'Affiche de la rencontre technologie et innovation',
    tags: [
      { label: 'Masterclass', tone: 'sky' },
      { label: 'Gratuit', tone: 'amber' },
    ],
    ticketsSold: 24,
    status: null,
    mine: true,
  },
  {
    id: 'bien-etre-relaxation',
    title: 'Bien-être et relaxation',
    excerpt:
      'Offrez-vous un week-end de détente totale avec des séances de yoga au lever du soleil et des ateliers de respiration.',
    date: '2026-11-05',
    location: 'Lac Annecy, France',
    image: '/images/evenement-bienetre.svg',
    imageAlt: 'Affiche du week-end bien-être',
    tags: [{ label: 'Détente', tone: 'violet' }],
    ticketsSold: 13,
    status: null,
    mine: false,
  },
  {
    id: 'forum-annuel',
    title: 'Forum annuel des membres',
    excerpt:
      'La rencontre annuelle du réseau : bilans, témoignages de membres et ateliers de travail par pôle d’activité.',
    date: '2026-03-12',
    location: 'Yaoundé, Cameroun',
    image: '/images/evenement-forum.svg',
    imageAlt: 'Affiche du forum annuel',
    tags: [{ label: 'Rencontre', tone: 'violet' }],
    ticketsSold: 0,
    status: 'expired',
    mine: true,
  },
  {
    id: 'gala-excellence',
    title: 'Gala de l’excellence',
    excerpt:
      'Soirée de remise des distinctions aux membres qui se sont illustrés durant l’année écoulée.',
    date: '2026-01-24',
    location: 'Douala, Cameroun',
    image: '/images/evenement-gala.svg',
    imageAlt: 'Affiche du gala de l’excellence',
    tags: [
      { label: 'Cérémonie', tone: 'sky' },
      { label: 'Sur invitation', tone: 'amber' },
    ],
    ticketsSold: 83,
    status: 'full',
    mine: false,
  },
];
