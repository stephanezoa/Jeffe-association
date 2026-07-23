import React from 'react';
import { cn } from '../../lib/cn';

export type Status =
  | 'published'
  | 'draft'
  | 'done'
  | 'full'
  | 'cancelled'
  | 'expired';

const STATUS: Record<Status, { label: string; className: string }> = {
  published: { label: 'Publié', className: 'bg-brand-50 text-brand-700 ring-brand-100' },
  draft: { label: 'Brouillon', className: 'bg-amber-50 text-amber-700 ring-amber-200/70' },
  done: { label: 'Terminé', className: 'bg-surface-muted text-ink-muted ring-black/10' },
  full: { label: 'Complet', className: 'bg-accent-blueSoft text-accent-blue ring-accent-blue/15' },
  cancelled: { label: 'Annulé', className: 'bg-red-50 text-red-700 ring-red-200/70' },
  expired: { label: 'Expiré', className: 'bg-surface-muted text-ink-faint ring-black/10' },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { label, className: tone } = STATUS[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium leading-none ring-1 ring-inset',
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
};
