/**
 * Contenu de la landing page (maquette Figma « Excelle Wellth »).
 * Les visuels pointent vers /public/images : remplacer ces fichiers par les
 * exports Figma définitifs sans toucher aux composants.
 */

import { FEATURED_FORMATIONS } from './formations';

export interface NavLink {
  label: string;
  href: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "L'opportunité VESTIGE", href: '/vestige' },
  { label: 'Formations', href: '/formations' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Galerie', href: '/galerie' },
];

export const HERO = {
  titleBefore: 'Le réseau ',
  titleHighlight: 'exclusif',
  titleAfter: ' pour votre croissance',
  subtitle:
    'Rejoignez notre communauté dynamique et découvrez des opportunités illimitées pour développer votre potentiel.',
  primaryCta: { label: 'En savoir plus', href: '/vestige' },
  secondaryCta: { label: 'Nous Contacter', href: '/contact' },
  video: {
    poster: '/images/video-poster.svg',
    posterAlt: 'Vue de la Terre depuis l’espace, illustration de la vidéo de présentation',
    /** Renseigner l’URL du fichier vidéo pour activer la lecture. */
    src: '',
    title: 'Vidéo de présentation Excelle Wellth',
  },
};

export const MISSION = {
  lead: 'Dans un monde en constante évolution,',
  body:
    " il est essentiel de s'adapter et d'innover. Explorez les possibilités infinies qui s'offrent à vous et transformez vos idées en réalité. Rejoignez-nous pour un voyage vers l'excellence.",
  image: '/images/mission-city.svg',
  imageAlt: 'Skyline urbaine',
};

export const FORMATIONS_SECTION = {
  label: 'Formations',
  title: 'Nous accompagnons nos membres dans leur développement',
  cta: { label: 'Formations', href: '/formations' },
};

/** Les 4 formations mises en avant proviennent du catalogue complet. */
export const FORMATIONS = FEATURED_FORMATIONS;

export const ENTREPRISE = {
  label: "L'entreprise",
  title: 'Excelle Wellth',
  body:
    "Nous nous engageons pleinement à favoriser l'épanouissement de chacun de nos membres en leur fournissant des ressources variées et un soutien personnalisé qui correspondent à leurs aspirations uniques. Notre mission est de créer un environnement stimulant et enrichissant, propice à l'apprentissage continu et à la croissance personnelle, où chaque individu peut explorer ses passions et développer ses compétences.",
  image: '/images/entreprise-bureau.svg',
  imageAlt: 'Espace de travail des équipes Excelle Wellth',
};

export const GALLERY: GalleryImage[] = [
  { id: 'galerie-1', src: '/images/galerie-1.svg', alt: 'Façade en briques du siège' },
  { id: 'galerie-2', src: '/images/galerie-2.svg', alt: 'Patio intérieur des bureaux' },
  { id: 'galerie-3', src: '/images/galerie-3.svg', alt: 'Membre en session de travail' },
  { id: 'galerie-4', src: '/images/galerie-4.svg', alt: 'Salle de réunion lumineuse' },
  { id: 'galerie-5', src: '/images/galerie-5.svg', alt: 'Atelier collaboratif entre membres' },
];

export const GUIDE = {
  label: 'Guide',
  title: "Le Programme d'Excelle Wellth pour ses membres",
  body:
    "Découvrez le programme d'Excelle Wellth, conçu pour enrichir le parcours de chaque membre. Ce livre propose des stratégies et des outils pratiques pour favoriser votre développement personnel et professionnel. Plongez dans un univers d'apprentissage interactif et enrichissant, où chaque page vous guide vers l'atteinte de vos objectifs et l'exploration de vos passions.",
  cta: { label: 'En savoir plus', href: '/contact' },
  image: '/images/guide-programme.svg',
  imageAlt: 'Couverture du programme « Live the Adventure »',
};

export const FOOTER = {
  title: 'Vous souhaitez nous rejoindre ?',
  subtitle: 'Nous sommes ouverts à vous accueillir dans notre équipe',
  cta: { label: 'Nous contacter', href: '/contact' },
  about: {
    title: "L'Entreprise",
    body:
      "Excelle Wellth est une entreprise innovante dédiée à l'épanouissement professionnel de ses membres.",
  },
  quickLinks: {
    title: 'Liens rapides',
    links: [
      { label: 'Formations', href: '/formations' },
      { label: 'Actualités', href: '/actualites' },
      { label: 'Galerie', href: '/galerie' },
      { label: 'Se connecter', href: '/connexion' },
    ] as NavLink[],
  },
  contact: {
    title: 'Contact',
    location: { label: 'Localisation', value: 'Douala, Cameroun' },
    email: { label: 'Adresse mail', value: 'contact@excellewellth.com' },
  },
};
