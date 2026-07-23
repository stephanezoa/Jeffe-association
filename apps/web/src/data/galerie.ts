/**
 * Page Galerie (maquette Figma « Excelle Wellth »).
 * Les visuels sont affichés à hauteur constante : c'est le ratio de chaque
 * image qui donne son rythme à la bande. Remplacer les fichiers de
 * /public/images par les exports Figma définitifs.
 */

export interface GaleriePhoto {
  id: string;
  src: string;
  alt: string;
}

export const GALERIE_PAGE = {
  title: 'Galerie',
  intro:
    "Explorez notre galerie, un lieu où l'imagination et la créativité s'épanouissent. Participez à notre programme et connectez-vous avec une communauté dynamique qui vous soutiendra dans la réalisation de vos projets.",
  regionLabel: 'Galerie photo, défilement horizontal',
  emptyState: 'La galerie sera bientôt enrichie de nouveaux visuels.',
};

export const GALERIE_PHOTOS: GaleriePhoto[] = [
  { id: 'vitesse', src: '/images/galerie-vitesse.svg', alt: 'Traînées lumineuses évoquant l’élan du réseau' },
  { id: 'binome', src: '/images/galerie-binome.svg', alt: 'Deux membres posant en tenue professionnelle' },
  { id: 'echange', src: '/images/galerie-echange.svg', alt: 'Échange entre deux membres lors d’une rencontre' },
  { id: 'portrait', src: '/images/galerie-portrait.svg', alt: 'Portrait d’un membre de la communauté' },
  { id: 'atelier', src: '/images/galerie-atelier.svg', alt: 'Atelier de travail collaboratif' },
  { id: 'terrain', src: '/images/galerie-terrain.svg', alt: 'Membre en action sur le terrain' },
  { id: 'equipe', src: '/images/galerie-equipe.svg', alt: 'L’équipe réunie lors d’un événement' },
  { id: 'celebration', src: '/images/galerie-celebration.svg', alt: 'Moment de célébration entre membres' },
];
