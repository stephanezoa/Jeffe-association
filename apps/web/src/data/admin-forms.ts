/**
 * Libellés des écrans de création/édition de l'espace d'administration
 * (maquettes Figma « Créer un article / une formation / un évènement »).
 *
 * Aucun module Express n'expose encore articles / courses / events, et il n'y a
 * pas d'endpoint d'upload : ces formulaires valident côté client puis affichent
 * un message indiquant que l'enregistrement serveur n'est pas encore disponible.
 */

export const NOT_WIRED_NOTICE =
  'Formulaire complet. L’enregistrement n’est pas encore disponible côté serveur (module API à créer).';

export const ARTICLE_FORM = {
  createTitle: 'Créer un article',
  editTitle: 'Modifier l’article',
  subtitle: 'Complétez le formulaire pour publier un article',
  headerAction: 'Créer un article',
  fields: {
    title: { label: 'Titre', placeholder: 'ex. Les clés du développement personnel' },
    summary: { label: 'Description', placeholder: 'Description sommaire de l’article' },
    cover: { label: 'Image de couverture' },
    content: { label: 'Contenu', placeholder: 'Contenu de l’article' },
  },
  publish: 'Publier l’article',
  draft: 'Enregistrer comme brouillon',
  errors: {
    title: 'Merci d’indiquer un titre.',
    summary: 'Merci d’ajouter une courte description.',
    content: 'Le contenu ne peut pas être vide.',
  },
};

export const FORMATION_FORM = {
  createTitle: 'Créer une formation',
  editTitle: 'Modifier la formation',
  subtitle: 'Complétez le formulaire pour créer une formation',
  headerAction: 'Créer une formation',
  fields: {
    title: { label: 'Nom de la formation', placeholder: 'ex. Communication professionnelle' },
    duration: { label: 'Durée', placeholder: 'ex. 03h30' },
    description: { label: 'Description', placeholder: 'Description de la formation' },
    cover: { label: 'Image de couverture' },
    tags: { label: 'Tags', placeholder: 'ex. Communication', add: 'Ajouter' },
    content: { label: 'Contenu', placeholder: 'Contenu de la formation' },
    status: { label: 'Statut' },
  },
  statusOptions: [
    { value: 'draft', label: 'Brouillon' },
    { value: 'published', label: 'Publié' },
    { value: 'done', label: 'Terminé' },
  ],
  submit: 'Créer la formation',
  errors: {
    title: 'Merci d’indiquer un nom.',
    duration: 'Merci d’indiquer une durée.',
    content: 'Le contenu ne peut pas être vide.',
  },
};

export const EVENT_FORM = {
  createTitle: 'Créer un évènement',
  editTitle: 'Modifier l’évènement',
  subtitle: 'Complétez le formulaire pour créer un évènement',
  headerAction: 'Créer un évènement',
  fields: {
    title: { label: 'Nom de l’évènement', placeholder: 'ex. Weekend des sources' },
    category: { label: 'Catégorie', placeholder: 'Sélectionner' },
    type: { label: 'Type d’évènement' },
    price: { label: 'Prix' },
    location: { label: 'Lieu', placeholder: 'ex. Douala, Cameroun' },
    date: { label: 'Date de l’évènement' },
    limitPlaces: { label: 'Limiter le nombre de places' },
    places: { label: 'Nombre de places' },
    cover: { label: 'Image de couverture' },
    description: { label: 'Description', placeholder: 'Description de l’évènement' },
    content: { label: 'Contenu', placeholder: 'Contenu de l’évènement' },
  },
  typeOptions: [
    { value: 'free', label: 'Gratuit' },
    { value: 'paid', label: 'Payant' },
  ],
  categoryOptions: [
    { value: 'masterclass', label: 'Masterclass' },
    { value: 'atelier', label: 'Atelier' },
    { value: 'detente', label: 'Détente' },
    { value: 'rencontre', label: 'Rencontre' },
  ],
  currency: 'FCFA',
  submit: 'Créer l’évènement',
  errors: {
    title: 'Merci d’indiquer un nom.',
    category: 'Merci de choisir une catégorie.',
    location: 'Merci d’indiquer un lieu.',
    date: 'Merci d’indiquer une date.',
    price: 'Merci d’indiquer un prix.',
    places: 'Merci d’indiquer un nombre de places.',
  },
};

export const ARTICLES_PAGE = {
  title: 'Articles',
  subtitle: 'Suivez et gérez les articles',
  create: 'Créer un article',
  search: 'Rechercher par nom',
  filters: 'Filtres',
  empty: 'Aucun article ne correspond à cette recherche.',
  actions: { edit: 'Modifier l’article', delete: 'Supprimer l’article' },
  removeConfirm: {
    subtitle: 'Supprimer un article',
    confirm: 'Oui, supprimer',
    cancel: 'Annuler',
    unavailable: 'La suppression n’est pas encore disponible côté serveur.',
  },
};
