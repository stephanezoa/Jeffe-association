import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface Action {
  label: string;
  to: string;
}

interface DashboardPageHeaderProps {
  title: string;
  subtitle: string;
  /** Bouton d'action principal (à droite du titre), optionnel. */
  action?: Action;
}

/** En-tête réutilisé par toutes les pages de l'espace d'administration. */
export const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="font-display text-3xl font-bold text-accent-blueDark sm:text-4xl">{title}</h1>
      <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
    </div>

    {action && (
      <Link
        to={action.to}
        className="inline-flex items-center gap-2 rounded-md bg-accent-blueDark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2"
      >
        {action.label}
        <Plus className="h-4 w-4" aria-hidden="true" />
      </Link>
    )}
  </div>
);
