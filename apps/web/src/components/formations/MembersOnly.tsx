import React from 'react';
import { Lock } from 'lucide-react';
import { SmartLink } from '../ui/SmartLink';
import { FORMATION_DETAIL_COPY } from '../../data/formation-contenus';

interface MembersOnlyProps {
  /** Contenu réel, rendu uniquement pour un membre connecté. */
  children: React.ReactNode;
  unlocked: boolean;
}

/**
 * Verrou de lecture. Tant que le membre n'est pas connecté, le contenu réel
 * n'est pas rendu du tout : seule une trame floutée décorative l'est, pour que
 * le texte ne soit pas récupérable dans le DOM.
 */
export const MembersOnly: React.FC<MembersOnlyProps> = ({ children, unlocked }) => {
  if (unlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="select-none blur-[3px]" aria-hidden="true">
        <div className="h-5 w-40 rounded bg-ink/15" />
        <div className="mt-5 space-y-2.5">
          {[100, 96, 92, 88, 70].map((width) => (
            <div key={width} className="h-3 rounded bg-ink/10" style={{ width: `${width}%` }} />
          ))}
        </div>
        <div className="mt-6 space-y-2.5">
          {[98, 94, 60].map((width) => (
            <div key={width} className="h-3 rounded bg-ink/10" style={{ width: `${width}%` }} />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-md bg-[#D42B2B] px-3 py-2 text-sm font-medium text-white shadow-pill">
          {FORMATION_DETAIL_COPY.membersOnly}
          <Lock className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="max-w-xs text-xs text-ink-muted">{FORMATION_DETAIL_COPY.membersOnlyHint}</p>
        <SmartLink
          href="/connexion"
          className="text-xs font-medium text-accent-blue underline-offset-4 hover:underline"
        >
          {FORMATION_DETAIL_COPY.signIn}
        </SmartLink>
      </div>
    </div>
  );
};
