import type { SponsoredMember } from './dashboard';

/**
 * Section Parrainage de l'espace membre (maquettes Figma « Parrainage »,
 * « Ajouter un membre », fiche profil et confirmation de suppression).
 *
 * Couverture API :
 *   - branche          → GET  /api/v1/sponsorship/tree        (réel)
 *   - ajout d'un membre→ POST /api/v1/sponsorship/invitations  (réel, { targetEmail, targetPhone })
 *   - suppression      → aucun endpoint exposé                 (action non branchée)
 * Le profil détaillé (ajouté par, dernière connexion) n'est pas non plus servi
 * par l'arbre : ces champs viennent des valeurs de démonstration.
 */

export interface MemberProfile {
  fullName: string;
  email: string;
  phone: string | null;
  addedBy: string;
  addedAt: string;
  lastLogin: string | null;
}

export interface SponsorshipNode {
  id: string;
  name: string;
  children: SponsorshipNode[];
}

export const PARRAINAGE_PAGE = {
  title: 'Parrainage',
  subtitle: 'Ajoutez de nouveaux membres et suivez votre branche',
  add: 'Ajouter un membre',
  views: [
    { id: 'table' as const, label: 'Tableau' },
    { id: 'diagram' as const, label: 'Diagramme' },
  ],
  rootLabel: 'Vous',
  actions: { view: 'Voir', delete: 'Supprimer' },
  profile: {
    subtitle: 'Profil membre',
    fields: {
      fullName: 'Noms et prénoms',
      email: 'Adresse mail',
      phone: 'Téléphone',
      addedBy: 'Ajouté par',
      addedAt: 'Ajouté le',
      lastLogin: 'Dernière connexion',
    },
    close: 'Fermer',
  },
  remove: {
    subtitle: 'Supprimer un membre',
    confirm: 'Oui, supprimer',
    cancel: 'Annuler',
    /** Message affiché tant que l'API n'expose pas la suppression. */
    unavailable: 'La suppression n’est pas encore disponible côté serveur.',
  },
};

export const AJOUT_MEMBRE_PAGE = {
  title: 'Ajouter un membre',
  subtitle: 'Complétez le formulaire pour ajouter un nouveau membre',
  endpoint: '/api/v1/sponsorship/invitations',
  fields: {
    lastName: { label: 'Noms', placeholder: 'Ex. Atangana' },
    firstName: { label: 'Prénoms', placeholder: 'Ex. Jean-Michel' },
    email: { label: 'Adresse mail', placeholder: 'Ex. johndoe@gmail.com' },
    phone: { label: 'Numéro de Téléphone', placeholder: 'Ex. 699 999 999' },
  },
  submit: 'Enregistrer',
  submitting: 'Enregistrement…',
  success: 'Invitation créée. Le lien de parrainage a été généré.',
  error: 'L’ajout du membre a échoué. Réessayez dans quelques instants.',
  errors: {
    lastName: 'Merci d’indiquer le nom.',
    firstName: 'Merci d’indiquer le prénom.',
    email: 'Merci d’indiquer une adresse mail valide.',
    phone: 'Ce numéro de téléphone ne semble pas valide.',
  },
};

/** Profils détaillés de démonstration, indexés par identifiant de filleul. */
export const DEMO_PROFILES: Record<string, MemberProfile> = {
  'demo-1': {
    fullName: 'Vanessa Nourra Ndongo',
    email: 'v.nourrandongo@gmail.com',
    phone: '698 899 018',
    addedBy: 'Jonathan Okala',
    addedAt: '2026-08-12T09:16:00',
    lastLogin: '2026-09-03T19:23:00',
  },
};

export const DEMO_SPONSORSHIP_TREE: SponsorshipNode = {
  id: 'root',
  name: PARRAINAGE_PAGE.rootLabel,
  children: [
    { id: 'yves', name: 'Yves Malong', children: [] },
    {
      id: 'samantha',
      name: 'Samantha WILLIAMS',
      children: [{ id: 'vanessa', name: 'Vanessa Nourra', children: [] }],
    },
    {
      id: 'john',
      name: 'John DOE',
      children: [
        { id: 'steve', name: 'Steve Assomo', children: [] },
        { id: 'raissa', name: 'Raissa Garba', children: [] },
      ],
    },
  ],
};

/** Profil affiché dans la fiche : détaillé si connu, sinon reconstruit depuis la ligne. */
export function getMemberProfile(member: SponsoredMember): MemberProfile {
  return (
    DEMO_PROFILES[member.id] ?? {
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      addedBy: '—',
      addedAt: member.addedAt,
      lastLogin: null,
    }
  );
}
