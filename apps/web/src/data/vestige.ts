/**
 * Page « L'opportunité VESTIGE » (maquette Figma).
 *
 * La playlist est servie par une route publique existante :
 * GET /api/v1/cms/opportunity-playlist → { data: { playlist, items[] } }
 * avec `title`, `description`, `video_url`, `thumbnail_url`, `position`.
 * Les entrées ci-dessous ne servent que de repli si l'API ne répond pas
 * (base non alimentée, API arrêtée).
 */

export interface VestigeVideo {
  id: string;
  title: string;
  description: string;
  poster: string;
  posterAlt: string;
  /** URL du fichier vidéo ; vide = affiche seule. */
  src: string;
}

export const VESTIGE_PAGE = {
  title: 'Vestige',
  intro:
    "Découvrez l'opportunité unique de Vestige, un espace où vos ambitions prennent vie. Rejoignez-nous pour bénéficier d'un soutien inégalé et d'une communauté inspirante qui vous aidera à réaliser vos rêves.",
  descriptionTitle: 'L’opportunité VESTIGE',
  description:
    "Les solutions Ayurvédiques proposées par la société VESTIGE sont conçues pour promouvoir un bien-être holistique. En intégrant des principes anciens de la médecine indienne, VESTIGE offre une gamme de produits naturels qui visent à équilibrer le corps et l'esprit. Ces solutions incluent des herbes, des huiles essentielles et des compléments alimentaires, tous formulés pour soutenir la santé de manière durable. Grâce à une approche personnalisée, VESTIGE s'efforce d'aider chaque individu à atteindre son plein potentiel en matière de santé et de vitalité.",
  modulesTitle: 'Les vidéos explicatives',
  playlistLabel: 'Modules vidéo de la présentation VESTIGE',
  endpoint: '/api/v1/cms/opportunity-playlist',
};

/**
 * Les six modules dans l'ordre de la présentation. Les titres sont ceux fournis
 * par Excelle Wellth ; les descriptions restent une amorce à valider, la maquette
 * répétant un même paragraphe de remplissage sous chaque module.
 */
export const DEMO_VESTIGE_VIDEOS: VestigeVideo[] = [
  {
    id: 'probleme',
    title: 'Le Problème : la crise de qualité maladive et alimentaire mondiale',
    description:
      'Premier module. État des lieux de la crise sanitaire et alimentaire mondiale : ce que nous consommons, ce que cela produit sur notre santé, et pourquoi le sujet nous concerne tous.',
    poster: '/images/vestige-probleme.svg',
    posterAlt: 'Vue de la Terre depuis l’espace',
    src: '',
  },
  {
    id: 'solutions-ayurvediques',
    title: 'Les solutions Ayurvédiques et la société VESTIGE',
    description: VESTIGE_PAGE.description,
    poster: '/images/vestige-solutions.svg',
    posterAlt: 'Illustration des solutions Ayurvédiques',
    src: '',
  },
  {
    id: 'produits-temoignages',
    title: 'Les produits qui sauvent des milliers de vies et témoignages',
    description:
      'Troisième module. Présentation de la gamme de produits et témoignages de membres dont le quotidien a changé depuis qu’ils les utilisent.',
    poster: '/images/vestige-produits.svg',
    posterAlt: 'Présentation des produits VESTIGE',
    src: '',
  },
  {
    id: 'opportunite-affaire',
    title: 'L’opportunité d’affaire pour tous !',
    description:
      'Quatrième module. Comment l’activité s’ouvre à chacun, quel que soit son parcours, et ce qu’il faut réellement pour se lancer.',
    poster: '/images/vestige-opportunite.svg',
    posterAlt: 'Chemin bordé d’arbres en automne',
    src: '',
  },
  {
    id: 'plan-de-compensation',
    title: 'Le plan de compensation détaillé',
    description:
      'Cinquième module. Le détail du plan de rémunération : les paliers, les commissions et la façon dont les revenus se construisent dans la durée.',
    poster: '/images/vestige-revenus.svg',
    posterAlt: 'Espace de travail lumineux',
    src: '',
  },
  {
    id: 'vie-avec-vestige',
    title: 'La vie avec Vestige et Excelle Wellth',
    description:
      'Sixième module. Le quotidien des membres du réseau : l’accompagnement, la communauté et ce que change l’appartenance à Excelle Wellth.',
    poster: '/images/vestige-revolution.svg',
    posterAlt: 'Membres du réseau réunis',
    src: '',
  },
];
