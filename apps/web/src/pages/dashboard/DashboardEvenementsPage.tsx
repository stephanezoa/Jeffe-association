import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, Search, SlidersHorizontal, Ticket } from 'lucide-react';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { StatTile } from '../../components/dashboard/StatTile';
import { EventCard } from '../../components/dashboard/EventCard';
import { cn } from '../../lib/cn';
import { eventsApi, type ApiEvent } from '../../lib/api';
import { DEMO_EVENT_STATS, EVENEMENTS_PAGE, type AdminEvent, type EventScope } from '../../data/evenements';

const CURRENCY = new Intl.NumberFormat('fr-FR');

/** Adapte un évènement de l'API à la carte (qui attend le type AdminEvent). */
function toCardEvent(event: ApiEvent): AdminEvent {
  return {
    id: event.id,
    title: event.title,
    excerpt: event.description,
    date: event.date?.slice(0, 10) ?? '',
    location: event.location,
    image: event.coverImageUrl || '/images/evenement-retraite.svg',
    imageAlt: event.title,
    tags: [
      ...(event.category ? [{ label: event.category, tone: 'sky' as const }] : []),
      { label: event.eventType === 'free' ? 'Gratuit' : 'Payant', tone: 'amber' as const },
    ],
    ticketsSold: event.ticketsSold,
    status: event.displayStatus,
    mine: true,
  };
}

export default function DashboardEvenementsPage() {
  const [scope, setScope] = useState<EventScope>('upcoming');
  const [search, setSearch] = useState('');
  const [rawEvents, setRawEvents] = useState<ApiEvent[]>([]);

  useEffect(() => {
    eventsApi.listMine().then(setRawEvents).catch(() => setRawEvents([]));
  }, []);

  const events = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const term = search.trim().toLowerCase();

    return rawEvents
      .map(toCardEvent)
      .filter((event) => {
        const isPast = new Date(event.date).setHours(0, 0, 0, 0) < today;
        const matchesScope = scope === 'archived' ? isPast : !isPast; // « Mes évènements » = tous les miens
        const matchesTerm = !term || event.title.toLowerCase().includes(term);
        return (scope === 'mine' ? true : matchesScope) && matchesTerm;
      });
  }, [scope, search, rawEvents]);

  const ticketsSoldTotal = rawEvents.reduce((sum, event) => sum + event.ticketsSold, 0);

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={EVENEMENTS_PAGE.title}
        subtitle={EVENEMENTS_PAGE.subtitle}
        action={{ label: EVENEMENTS_PAGE.create, to: '/dashboard/evenements/creer' }}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          {EVENEMENTS_PAGE.withdraw}
        </button>
        <button
          type="button"
          className="rounded-md bg-white px-4 py-2.5 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          {EVENEMENTS_PAGE.transactions}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:max-w-3xl">
        <StatTile
          label="Evènements"
          value={rawEvents.length}
          hint={`A venir : ${DEMO_EVENT_STATS.upcoming}`}
          icon={CalendarCheck}
          tone="blue"
        />
        <StatTile
          label="Solde"
          value={`${CURRENCY.format(DEMO_EVENT_STATS.balance)} ${DEMO_EVENT_STATS.currency}`}
          hint={`Tickets vendus : ${ticketsSoldTotal}`}
          icon={Ticket}
          tone="green"
        />
      </div>

      <div
        className="inline-flex flex-wrap gap-1 rounded-lg bg-white p-1 ring-1 ring-inset ring-black/[0.08]"
        role="tablist"
        aria-label="Filtrer les évènements"
      >
        {EVENEMENTS_PAGE.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={scope === tab.id}
            onClick={() => setScope(tab.id)}
            className={cn(
              'rounded-md px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
              scope === tab.id ? 'bg-accent-blueDark font-medium text-white' : 'text-ink hover:bg-surface-muted',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={EVENEMENTS_PAGE.search}
            aria-label={EVENEMENTS_PAGE.search}
            className="w-full rounded-lg bg-white py-2.5 pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-black/[0.08] transition placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm text-ink ring-1 ring-inset ring-black/[0.08] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {EVENEMENTS_PAGE.filters}
        </button>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-ink-muted">{EVENEMENTS_PAGE.empty}</p>
      )}
    </div>
  );
}
