/**
 * Section « Mon Compte » (maquettes Figma « Mon Compte », « Modifier mes
 * informations », « Modifier mon mot de passe »).
 *
 * Lecture : GET /api/v1/auth/me (réel). Aucun endpoint n'expose la mise à jour
 * du profil ni le changement de mot de passe : ces formulaires valident côté
 * client puis affichent un message indiquant l'absence de service serveur.
 */

export interface AccountProfile {
  lastName: string;
  firstName: string;
  email: string;
  phone: string | null;
  addedBy: string;
  createdAt: string;
  lastLogin: string | null;
}

export const COMPTE_PAGE = {
  title: 'Mon Compte',
  subtitle: 'Consultez votre profil',
  editAction: 'Modifier mes informations',
  changePassword: 'Modifier mon mot de passe',
  fields: {
    lastName: 'Noms',
    firstName: 'Prénoms',
    email: 'Adresse mail',
    phone: 'Numéro de Téléphone',
    addedBy: 'Ajouté par',
    createdAt: 'Créé le',
    lastLogin: 'Dernière connexion',
  },
};

export const COMPTE_EDIT = {
  title: 'Mon Compte',
  subtitle: 'Modifier mes informations personnelles',
  fields: {
    lastName: { label: 'Noms', placeholder: 'Ex. Okala' },
    firstName: { label: 'Prénoms', placeholder: 'Ex. Jonathan' },
    email: { label: 'Adresse mail', placeholder: 'Ex. j.okala@gmail.com' },
    phone: { label: 'Numéro de Téléphone', placeholder: 'Ex. 699 999 999' },
  },
  submit: 'Enregistrer',
  cancel: 'Annuler',
  success: 'Vos informations ont été mises à jour.',
  unavailable: 'La mise à jour du profil n’est pas encore disponible côté serveur.',
  errors: {
    lastName: 'Merci d’indiquer votre nom.',
    firstName: 'Merci d’indiquer votre prénom.',
    email: 'Merci d’indiquer une adresse mail valide.',
    phone: 'Ce numéro de téléphone ne semble pas valide.',
  },
};

export const PASSWORD_MODAL = {
  title: 'Modifier mon mot de passe',
  subtitle: 'Mettre à jour son mot de passe',
  fields: {
    current: { label: 'Ancien mot de passe' },
    next: { label: 'Nouveau mot de passe' },
    confirm: { label: 'Confirmer le mot de passe' },
  },
  submit: 'Enregistrer',
  cancel: 'Annuler',
  unavailable: 'Le changement de mot de passe n’est pas encore disponible côté serveur.',
  errors: {
    current: 'Saisissez votre mot de passe actuel.',
    next: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
    confirm: 'Les deux mots de passe ne correspondent pas.',
  },
};

/** Profil de démonstration, utilisé tant que /auth/me n'a pas répondu. */
export const DEMO_ACCOUNT: AccountProfile = {
  lastName: 'Okala',
  firstName: 'Jonathan',
  email: 'j.okala@gmail.com',
  phone: '698 899 018',
  addedBy: 'Vincent Mado',
  createdAt: '2026-08-21T00:00:00',
  lastLogin: '2026-09-03T19:23:00',
};
