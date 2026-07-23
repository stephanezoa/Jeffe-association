import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import type { Formation } from '../../data/formations';

interface FormationCardProps {
  formation: Formation;
}

export const FormationCard: React.FC<FormationCardProps> = ({ formation }) => (
  <article className="group flex flex-col">
    <Link
      to={`/formations/${formation.id}`}
      className="flex flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4"
    >
      <div className="overflow-hidden rounded-xl bg-surface-muted ring-1 ring-black/5">
        <img
          src={formation.image}
          alt={formation.imageAlt}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <h3 className="mt-4 font-display text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand-600">
        {formation.title}
      </h3>
      <p className="mt-1 text-xs text-ink-faint">{formation.duration}</p>
    </Link>

    <ul className="mt-3 flex flex-wrap gap-2">
      {formation.tags.map((tag) => (
        <li key={tag}>
          <Badge>{tag}</Badge>
        </li>
      ))}
    </ul>
  </article>
);
