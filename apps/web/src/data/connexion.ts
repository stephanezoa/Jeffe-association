/**
 * Page Connexion (maquette Figma « Excelle Wellth »).
 * S'appuie sur `POST /api/v1/auth/login`, qui renvoie `{ data: { user, accessToken } }`
 * et dépose le refresh token en cookie httpOnly.
 */

export const CONNEXION_PAGE = {
  title: 'Connexion',
  endpoint: '/api/v1/auth/login',
  /** Destination après authentification réussie. */
  redirectTo: '/dashboard',
  email: { label: 'Adresse mail', placeholder: 'ex. johndoe@gmail.com' },
  password: { label: 'Mot de passe', placeholder: '••••••••••' },
  remember: 'Rester connecté',
  submit: 'Se connecter',
  submitting: 'Connexion…',
  forgotten: { label: 'J’ai oublié mon mot de passe', href: '/mot-de-passe-oublie' },
  errors: {
    email: 'Merci d’indiquer une adresse mail valide.',
    password: 'Merci de saisir votre mot de passe.',
    failed: 'Connexion impossible. Vérifiez vos identifiants.',
  },
};
