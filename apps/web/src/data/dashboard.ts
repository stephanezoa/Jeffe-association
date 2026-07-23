import {
  Calendar,
  Eye,
  FileText,
  GraduationCap,
  LayoutDashboard,
  UserCircle2,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * Espace d'administration (maquettes Figma « Tableau de bord » et « Formations »).
 *
 * Couverture API :
 *   - Membres / Formations  → GET /api/v1/admin/dashboard/stats (réel)
 *   - Membres parrainés     → GET /api/v1/sponsorship/tree      (réel, sans téléphone)
 *   - Articles              → aucun compteur exposé             (valeurs de démonstration)
 *   - Visites + graphique   → aucun module analytics            (valeurs de démonstration)
 * Les valeurs `DEMO_*` ci-dessous ne sont donc PAS des données réelles.
 */

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Formations', href: '/dashboard/formations', icon: GraduationCap },
  { label: 'Articles', href: '/dashboard/articles', icon: FileText },
  { label: 'Evènements', href: '/dashboard/evenements', icon: Calendar },
  { label: 'Parrainage', href: '/dashboard/parrainage', icon: Users },
  { label: 'Mon Compte', href: '/dashboard/mon-compte', icon: UserCircle2 },
];

export const DASHBOARD_ICONS = { members: Users, courses: GraduationCap, articles: FileText, visits: Eye };

export interface SponsoredMember {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  addedAt: string;
}

export interface VisitsDay {
  /** Libellé affiché sous le groupe de barres. */
  label: string;
  /** Une valeur par tranche horaire de la journée. */
  values: number[];
}

/** Compteurs sans source côté API — à remplacer dès que les modules existeront. */
export const DEMO_STATS = {
  members: 52,
  sponsored: 12,
  courses: 13,
  coursesInProgress: 0,
  coursesCreated: 0,
  articles: 9,
  articlesDraft: 2,
  visits: 1923,
  visitsToday: 33,
};

/** Série figée (aucun module analytics) : 7 jours × 9 tranches horaires. */
export const DEMO_VISITS_LAST_7_DAYS: VisitsDay[] = [
  { label: 'Sam', values: [46, 21, 33, 52, 68, 44, 39, 58, 15] },
  { label: 'Dim', values: [30, 31, 78, 63, 41, 24, 35, 47, 26] },
  { label: 'Lun', values: [49, 74, 26, 55, 43, 66, 61, 87, 90] },
  { label: 'Mar', values: [62, 34, 51, 38, 71, 82, 88, 54, 36] },
  { label: 'Mer', values: [22, 40, 35, 45, 70, 30, 76, 72, 60] },
  { label: 'Jeu', values: [56, 64, 84, 25, 43, 79, 48, 68, 33] },
  { label: 'Ven', values: [51, 27, 65, 66, 20, 58, 24, 69, 47] },
];

/** Lignes affichées tant que `/sponsorship/tree` n'a pas répondu. */
export const DEMO_SPONSORED_MEMBERS: SponsoredMember[] = [
  {
    id: 'demo-1',
    fullName: 'Vanessa Nourra',
    email: 'nourravanessa@gmail.com',
    phone: '696 227 364',
    addedAt: '2026-08-24T11:16:00',
  },
  {
    id: 'demo-2',
    fullName: 'John Doe',
    email: 'johndoe@gmail.com',
    phone: '675 890 089',
    addedAt: '2026-08-22T09:22:00',
  },
  {
    id: 'demo-3',
    fullName: 'Samantha Williams',
    email: 'sm.williams@yahoo.com',
    phone: '688 998 321',
    addedAt: '2026-08-14T15:32:00',
  },
  {
    id: 'demo-4',
    fullName: 'Yves Malong',
    email: 'malongyves@gmail.com',
    phone: '233 890 098',
    addedAt: '2026-08-13T16:11:00',
  },
];

export const DASHBOARD_COPY = {
  home: { title: 'Tableau de bord' },
  formations: {
    title: 'Formations',
    subtitle: 'Suivez et gérez les formations',
    create: 'Créer une formation',
    search: 'Rechercher par nom',
    filters: 'Filtres',
    empty: 'Aucune formation ne correspond à cette recherche.',
  },
  chart: { title: 'Visite sur les 7 derniers jours' },
  table: {
    title: 'Membres parrainés',
    columns: ['Noms & Prénoms', 'Adresse mail', 'Téléphone', 'Ajouté le', 'Actions'],
    empty: 'Aucun filleul pour le moment.',
  },
  demoNotice: 'Données de démonstration : l’API n’a pas répondu.',
  signOut: 'Se déconnecter',
};
