import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { RowActionsMenu } from './RowActionsMenu';
import { Badge } from '../ui/Badge';
import type { Formation } from '../../data/formations';

interface AdminFormationCardProps {
  formation: Formation;
  onDelete?: (formation: Formation) => void;
}

export const AdminFormationCard: React.FC<AdminFormationCardProps> = ({ formation, onDelete }) => {
  const navigate = useNavigate();
  const editUrl = `/dashboard/formations/${formation.id}/modifier`;

  return (
    <article className="group flex flex-col">
      <Link to={editUrl} className="overflow-hidden rounded-xl bg-surface-muted ring-1 ring-black/5">
        <img
          src={formation.image}
          alt={formation.imageAlt}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold leading-snug text-ink">
          <Link to={editUrl} className="transition-colors hover:text-accent-blue">
            {formation.title}
          </Link>
        </h3>
        <RowActionsMenu
          label={formation.title}
          onView={() => navigate(editUrl)}
          onDelete={() => onDelete?.(formation)}
        />
      </div>

      <p className="mt-0.5 text-sm text-ink-muted">{formation.duration}</p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {formation.tags.map((tag) => (
          <li key={tag}>
            <Badge>{tag}</Badge>
          </li>
        ))}
      </ul>
    </article>
  );
};
