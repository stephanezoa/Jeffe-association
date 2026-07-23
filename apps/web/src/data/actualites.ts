import type { Status } from '../components/ui/StatusBadge';

/**
 * Actualités / Articles (maquettes Figma « Actualités », détail d'article et
 * section admin « Articles »). `date` est au format ISO ; l'affichage est
 * localisé par `formatDateFr`. Les visuels pointent vers /public/images.
 *
 * Côté API, la table `articles` existe (title, slug, summary, content,
 * cover_image_url, status, published_at) mais aucun module Express ne l'expose
 * encore : ces entrées servent donc de contenu par défaut.
 */

export interface Article {
  id: string;
  /** Identifiant d'URL lisible, réutilisé côté API comme `slug`. */
  slug: string;
  title: string;
  /** Date de publication au format ISO (AAAA-MM-JJ). */
  date: string;
  image: string;
  imageAlt: string;
  /** Chapô affiché dans les listes. */
  summary: string;
  /** Corps de l'article (paragraphes). */
  content: string[];
  status: Extract<Status, 'published' | 'draft'>;
  author: string;
}

export const ACTUALITES_PAGE = {
  title: 'Actualités',
  intro:
    "Découvrez les dernières nouvelles de Vestige, un espace où vos rêves prennent vie. Rejoignez notre programme pour bénéficier d'un soutien inégalé et d'une communauté inspirante qui vous propulsera vers vos ambitions.",
  emptyState: 'Aucune actualité publiée pour le moment.',
  readMore: 'Voir l’article',
};

export const ARTICLE_DETAIL_COPY = {
  published: 'Publié',
  back: 'Retour aux actualités',
  notFound: 'Cet article n’existe pas ou n’est plus disponible.',
};

const EVENT_STORY = [
  "La semaine dernière, un événement mémorable a captivé l'intérêt de nombreux passionnés dans notre région. Ce rassemblement a non seulement rassemblé des personnes partageant les mêmes idées, mais a également permis d'échanger des idées novatrices et des expériences enrichissantes. Les participants ont eu l'occasion de se connecter, de partager leurs passions et de découvrir de nouvelles perspectives sur des sujets qui leur tiennent à cœur.",
  "Cet événement a engendré des discussions passionnantes qui continuent d'animer notre communauté. Les retours des participants témoignent d'une expérience enrichissante, marquée par des échanges fructueux et des rencontres inoubliables. L'impact de cet événement se fait déjà sentir, et il est certain qu'il laissera une empreinte durable, inspirant d'autres initiatives à venir.",
  "De plus, cet événement a permis de mettre en lumière des talents locaux, offrant une plateforme aux artistes et entrepreneurs de notre région. Les performances et présentations ont été accueillies avec enthousiasme, suscitant un véritable engouement parmi les participants. Chacun a pu apprécier la créativité et l'innovation qui émanent de notre communauté.",
  "Enfin, les organisateurs ont déjà commencé à planifier la prochaine édition, avec l'ambition de rendre cet événement encore plus inclusif et diversifié. Ils envisagent d'intégrer des ateliers interactifs et des conférences animées par des experts pour enrichir l'expérience des participants. L'enthousiasme est palpable, et tout le monde attend avec impatience ce qui s'annonce comme un rendez-vous incontournable.",
];

const SUMMARY =
  "La semaine dernière, un événement mémorable a captivé l'intérêt de nombreux passionnés dans notre région, permettant d'échanger des idées novatrices et des expériences enrichissantes.";

export const ARTICLES: Article[] = [
  {
    id: 'art-communication-professionnelle',
    slug: 'art-communication-professionnelle',
    title: "L'Art de la Communication Professionnelle",
    date: '2026-06-23',
    image: '/images/actualite-communication.svg',
    imageAlt: 'Membre au travail dans son bureau',
    summary: SUMMARY,
    content: EVENT_STORY,
    status: 'published',
    author: 'Jonathan Okala',
  },
  {
    id: 'techniques-negociation',
    slug: 'techniques-avancees-de-negociation',
    title: 'Techniques Avancées de Négociation',
    date: '2026-07-15',
    image: '/images/actualite-negociation.svg',
    imageAlt: 'Portrait expressif sur fond orange',
    summary: SUMMARY,
    content: EVENT_STORY,
    status: 'published',
    author: 'Jonathan Okala',
  },
  {
    id: 'gestion-du-stress',
    slug: 'gestion-du-stress-en-milieu-de-travail',
    title: 'Gestion du Stress en Milieu de Travail',
    date: '2026-08-02',
    image: '/images/actualite-stress.svg',
    imageAlt: 'Globe numérique connecté au-dessus de graphiques',
    summary: SUMMARY,
    content: EVENT_STORY,
    status: 'published',
    author: 'Jonathan Okala',
  },
  {
    id: 'leadership-motivation',
    slug: 'leadership-et-motivation-des-equipes',
    title: 'Leadership et Motivation des Équipes',
    date: '2026-09-19',
    image: '/images/actualite-leadership.svg',
    imageAlt: 'Collaborateur devant plusieurs écrans de suivi',
    summary: SUMMARY,
    content: EVENT_STORY,
    status: 'published',
    author: 'Jonathan Okala',
  },
  {
    id: 'strategies-marketing-digital',
    slug: 'strategies-de-marketing-digital',
    title: 'Stratégies de Marketing Digital',
    date: '2026-10-10',
    image: '/images/actualite-marketing.svg',
    imageAlt: 'Illustration des outils numériques et de l’intelligence artificielle',
    summary: SUMMARY,
    content: EVENT_STORY,
    status: 'published',
    author: 'Jonathan Okala',
  },
  {
    id: 'innovation-creativite',
    slug: 'innovation-et-creativite-au-bureau',
    title: 'Innovation et Créativité au Bureau',
    date: '2026-11-05',
    image: '/images/actualite-innovation.svg',
    imageAlt: 'Bibliothèque circulaire évoquant la connaissance',
    summary: SUMMARY,
    content: EVENT_STORY,
    status: 'draft',
    author: 'Jonathan Okala',
  },
];

/** Articles visibles sur le site public (statut publié). */
export const PUBLISHED_ARTICLES = ARTICLES.filter((article) => article.status === 'published');

export function findArticle(slug: string | undefined): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug || article.id === slug);
}

/** Visuels curatés indexés par slug, réutilisés pour habiller les articles de l'API. */
const IMAGE_BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, { image: a.image, imageAlt: a.imageAlt }]));

const FALLBACK_IMAGES = ARTICLES.map((a) => a.image);

/** Visuel d'un article : curaté si le slug est connu, sinon rotation déterministe. */
export function articleImage(slug: string, index = 0, coverImageUrl?: string | null) {
  if (coverImageUrl) return { image: coverImageUrl, imageAlt: '' };
  return IMAGE_BY_SLUG.get(slug) ?? { image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length], imageAlt: '' };
}
