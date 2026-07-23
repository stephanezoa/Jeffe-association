import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDateFr } from '../../lib/date';
import type { AdminEvent } from '../../data/evenements';

interface EventCardProps {
  event: AdminEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <article className="flex flex-col overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-card">
    <Link to={`/dashboard/evenements/${event.id}/modifier`} className="block">
      <div className="relative">
        <img
          src={event.image}
          alt={event.imageAlt}
          loading="lazy"
          className="aspect-[16/10] w-full rounded-lg object-cover"
        />
        {event.status && (
          <div className="absolute right-2 top-2">
            <StatusBadge status={event.status} />
          </div>
        )}
      </div>
    </Link>

    <ul className="mt-4 flex flex-wrap gap-2">
      {event.tags.map((tag) => (
        <li key={tag.label}>
          <Badge tone={tag.tone}>{tag.label}</Badge>
        </li>
      ))}
    </ul>

    <h3 className="mt-3 font-display text-base font-semibold text-ink">
      <Link to={`/dashboard/evenements/${event.id}/modifier`} className="transition-colors hover:text-accent-blue">
        {event.title}
      </Link>
    </h3>
    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">{event.excerpt}</p>

    <dl className="mt-4 space-y-2 text-sm text-ink">
      <div className="flex items-center gap-2">
        <dt className="sr-only">Date</dt>
        <CalendarDays className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
        <dd>
          <time dateTime={event.date}>{formatDateFr(event.date)}</time>
        </dd>
      </div>
      <div className="flex items-center gap-2">
        <dt className="sr-only">Lieu</dt>
        <MapPin className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
        <dd>{event.location}</dd>
      </div>
      <div className="flex items-center gap-2">
        <dt className="sr-only">Billets vendus</dt>
        <Ticket className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
        <dd>
          {event.ticketsSold.toString().padStart(2, '0')} Tickets vendus
        </dd>
      </div>
    </dl>
  </article>
);
