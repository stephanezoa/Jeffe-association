/**
 * Catalogue des formations (maquette Figma « Excelle Wellth » — page Formations).
 * Source unique : la landing en reprend les premières entrées en avant.
 * Les visuels pointent vers /public/images ; remplacer les fichiers par les
 * exports Figma définitifs sans toucher aux composants.
 */

export interface Formation {
  id: string;
  title: string;
  duration: string;
  /** Étiquettes affichées sur la carte. */
  tags: string[];
  /** Catégories utilisées par les filtres de la page Formations. */
  categories: FormationCategory[];
  image: string;
  imageAlt: string;
}

export const FORMATION_CATEGORIES = [
  'Communication',
  'Technologie',
  'Informatique',
  'Management',
  'Développement personnel',
] as const;

export type FormationCategory = (typeof FORMATION_CATEGORIES)[number];

export const FORMATIONS_PAGE = {
  title: 'Formations',
  intro:
    "Explorez l'univers de Vestige, un lieu où vos aspirations se concrétisent. Participez à notre programme pour profiter d'un accompagnement exceptionnel et d'une communauté motivante qui vous aidera à atteindre vos objectifs.",
  filtersLabel: 'Filtrer par catégorie',
  emptyState: 'Aucune formation ne correspond à cette sélection.',
  resetLabel: 'Réinitialiser les filtres',
};

export const FORMATIONS_CATALOGUE: Formation[] = [
  {
    id: 'communication-professionnelle',
    title: 'Communication Professionnelle',
    duration: '03h',
    tags: ['Communication', 'Relations'],
    categories: ['Communication', 'Développement personnel'],
    image: '/images/formation-communication.svg',
    imageAlt: 'Deux membres en échange professionnel',
  },
  {
    id: 'gestion-de-projet',
    title: 'Gestion de Projet',
    duration: '04h30',
    tags: ['Management', 'Organisation'],
    categories: ['Management'],
    image: '/images/formation-gestion-projet.svg',
    imageAlt: 'Membre pilotant un projet depuis son poste de travail',
  },
  {
    id: 'developpement-web',
    title: 'Développement Web',
    duration: '05h',
    tags: ['Informatique', 'Technologie'],
    categories: ['Informatique', 'Technologie'],
    image: '/images/formation-dev-web.svg',
    imageAlt: 'Développeuse devant plusieurs écrans de code',
  },
  {
    id: 'marketing-digital',
    title: 'Marketing Digital',
    duration: '03h45',
    tags: ['Commerce', 'Stratégie'],
    categories: ['Communication', 'Technologie'],
    image: '/images/formation-marketing.svg',
    imageAlt: 'Traînées lumineuses évoquant la vitesse du digital',
  },
  {
    id: 'analyse-de-donnees',
    title: 'Analyse de Données',
    duration: '02h30',
    tags: ['Informatique', 'Statistiques'],
    categories: ['Informatique', 'Technologie'],
    image: '/images/formation-analyse-donnees.svg',
    imageAlt: 'Salle de supervision avec tableaux de bord',
  },
  {
    id: 'design-ux-ui',
    title: 'Design UX/UI',
    duration: '04h00',
    tags: ['Création', 'Ergonomie'],
    categories: ['Informatique', 'Technologie'],
    image: '/images/formation-design-ux.svg',
    imageAlt: 'Intérieur chaleureux illustrant le soin apporté au design',
  },
  {
    id: 'gestion-de-projet-avancee',
    title: 'Gestion de Projet',
    duration: '03h15',
    tags: ['Management', 'Organisation'],
    categories: ['Management', 'Développement personnel'],
    image: '/images/formation-gestion-equipe.svg',
    imageAlt: 'Deux collaboratrices en point de pilotage',
  },
  {
    id: 'communication-interne',
    title: 'Communication Interne',
    duration: '02h50',
    tags: ['Ressources Humaines', 'Relations'],
    categories: ['Communication', 'Management', 'Développement personnel'],
    image: '/images/formation-communication-interne.svg',
    imageAlt: 'Espace commun favorisant les échanges entre équipes',
  },
];

/** Sélection mise en avant sur la landing page. */
export const FEATURED_FORMATIONS: Formation[] = FORMATIONS_CATALOGUE.slice(0, 4);
