/**
 * Page Contact (maquette Figma « Excelle Wellth »).
 *
 * `endpoint` n'existe pas encore côté API : aucun module `contact` n'est monté
 * dans apps/api/src/app.ts. Tant qu'il n'est pas créé, l'envoi du formulaire
 * renverra une erreur réseau et le message d'échec sera affiché à l'utilisateur.
 */

export const CONTACT_PAGE = {
  title: 'Nous contacter',
  intro:
    "Engagez-vous avec notre équipe dynamique et découvrez comment nous pouvons vous accompagner dans la réalisation de vos objectifs. N'hésitez pas à nous rejoindre et à faire partie de notre communauté grandissante.",
  detailsTitle: 'Vous souhaitez entrer en contact avec nous ?',
  formTitle: 'Laissez nous un message',
  endpoint: '/api/v1/contact',
};

export const CONTACT_DETAILS = {
  phone: { label: 'Numéro de téléphone', value: '+237 677 90 08 99' },
  email: { label: 'Adresse mail', value: 'contact@excellewellth.com' },
};

export const CONTACT_FORM_LABELS = {
  name: { label: 'Nom', placeholder: 'ex. John Doe' },
  email: { label: 'Adresse mail', placeholder: 'ex. johndoe@gmail.com' },
  phone: { label: 'Numéro de Téléphone (Optionnel)', placeholder: 'ex. 689 009 981' },
  subject: { label: 'Sujet', placeholder: 'Sujet de votre message' },
  message: { label: 'Description', placeholder: 'Décrivez votre demande' },
  submit: 'Envoyer',
  submitting: 'Envoi en cours…',
};

export const CONTACT_MESSAGES = {
  success: 'Merci, votre message a bien été envoyé. Notre équipe vous répondra rapidement.',
  error: "Votre message n'a pas pu être envoyé. Réessayez dans quelques instants.",
  errors: {
    name: 'Merci d’indiquer votre nom.',
    email: 'Merci d’indiquer une adresse mail valide.',
    phone: 'Ce numéro de téléphone ne semble pas valide.',
    subject: 'Merci de préciser le sujet de votre message.',
    message: 'Merci de détailler votre demande (10 caractères minimum).',
  },
};
