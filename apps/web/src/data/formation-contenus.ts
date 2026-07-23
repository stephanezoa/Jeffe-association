import { FORMATIONS_CATALOGUE, type Formation } from './formations';

/**
 * Contenu des pages de détail des formations (maquette Figma « Communication
 * Professionnelle »). Le chapô et la vidéo sont publics ; les sections sont
 * réservées aux membres connectés.
 */

export interface FormationSection {
  heading: string;
  body: string;
}

export interface FormationContent {
  intro: string;
  sections: FormationSection[];
}

export const FORMATION_DETAIL_COPY = {
  membersOnly: 'Réservé aux membres',
  membersOnlyHint: 'Connectez-vous avec votre compte membre pour lire l’intégralité de cette formation.',
  signIn: 'Se connecter',
  notFound: 'Cette formation n’existe pas ou n’est plus disponible.',
  backToList: 'Retour aux formations',
};

/** Contenu d'introduction repris de la maquette (page détail de formation). */
const SECTIONS_PAR_DEFAUT: FormationSection[] = [
  {
    heading: 'Introduction',
    body:
      'Bienvenue dans cette formation enrichissante ! Nous sommes vraiment heureux de vous accompagner tout au long de ce parcours d’apprentissage. Durant les prochaines sessions, nous approfondirons ensemble des concepts essentiels et des compétences pratiques qui vous permettront de progresser efficacement vers vos objectifs personnels et professionnels.',
  },
  {
    heading: '',
    body:
      'Cette formation a été pensée pour être à la fois interactive et captivante. Vous aurez de nombreuses occasions de participer activement à des discussions stimulantes, de poser toutes vos questions, et de mettre en pratique immédiatement ce que vous découvrez. Préparez-vous à vivre une expérience d’apprentissage dynamique, motivante et pleine de découvertes.',
  },
];

const CONTENUS: Record<string, FormationContent> = {
  'communication-professionnelle': {
    intro:
      "La communication professionnelle est essentielle dans le monde du travail. Elle englobe les compétences nécessaires pour échanger efficacement des informations, que ce soit à l'oral ou à l'écrit. Une bonne communication favorise la collaboration, renforce les relations interpersonnelles et contribue à la réussite des projets. Dans cet article, nous explorerons les différentes facettes de la communication professionnelle et son impact sur l'environnement de travail.",
    sections: SECTIONS_PAR_DEFAUT,
  },
};

const INTROS_PAR_DEFAUT: Record<string, string> = {
  'gestion-de-projet':
    'Piloter un projet, c’est arbitrer en permanence entre le périmètre, le temps et les moyens disponibles. Cette formation vous donne les méthodes pour cadrer, planifier et suivre vos projets jusqu’à leur livraison.',
  'developpement-web':
    'Le développement web ouvre la porte à la création de vos propres outils et services. Cette formation parcourt les fondamentaux du métier, du navigateur jusqu’au serveur.',
  'marketing-digital':
    'Le marketing digital rassemble les leviers qui permettent de faire connaître une offre et de la faire grandir. Cette formation vous aide à choisir les bons canaux et à mesurer ce qui fonctionne.',
  'analyse-de-donnees':
    'Lire correctement ses données évite les décisions prises à l’intuition. Cette formation présente les réflexes d’analyse et les représentations qui rendent un chiffre parlant.',
  'design-ux-ui':
    'Un produit utile mais difficile à utiliser reste inutilisé. Cette formation aborde les principes d’ergonomie et de conception d’interface qui rendent un parcours évident.',
  'gestion-de-projet-avancee':
    'Au-delà des outils, la réussite d’un projet tient à l’équipe qui le porte. Cette formation traite de l’animation, de la délégation et de la gestion des tensions.',
  'communication-interne':
    'La communication interne fait circuler l’information et entretient la cohésion. Cette formation explore les dispositifs qui maintiennent une équipe alignée et informée.',
};

/** Contenu d'une formation, complété par la trame commune si besoin. */
export function getFormationContent(formation: Formation): FormationContent {
  const existing = CONTENUS[formation.id];
  if (existing) return existing;

  return {
    intro:
      INTROS_PAR_DEFAUT[formation.id] ??
      `Découvrez la formation « ${formation.title} », proposée aux membres d’Excelle Wellth.`,
    sections: SECTIONS_PAR_DEFAUT,
  };
}

export function findFormation(id: string | undefined): Formation | undefined {
  return FORMATIONS_CATALOGUE.find((formation) => formation.id === id);
}
