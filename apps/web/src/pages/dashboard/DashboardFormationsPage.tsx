import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { StatTile } from '../../components/dashboard/StatTile';
import { AdminFormationCard } from '../../components/dashboard/AdminFormationCard';
import { FormationFilters } from '../../components/formations/FormationFilters';
import { cn } from '../../lib/cn';
import { coursesApi, type ApiCourse } from '../../lib/api';
import { DASHBOARD_COPY, DASHBOARD_ICONS, DEMO_STATS } from '../../data/dashboard';
import type { Formation, FormationCategory } from '../../data/formations';

/** Adapte une formation de l'API à la carte (qui attend le type Formation). */
function toCardFormation(course: ApiCourse): Formation {
  return {
    id: course.id,
    title: course.title,
    duration: course.duration,
    tags: course.tags,
    categories: course.tags as FormationCategory[],
    image: course.thumbnailUrl || '/images/formation-communication.svg',
    imageAlt: course.title,
  };
}

export default function DashboardFormationsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FormationCategory[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [courses, setCourses] = useState<ApiCourse[]>([]);

  const reload = () => coursesApi.listMine().then(setCourses).catch(() => setCourses([]));

  useEffect(() => {
    reload();
  }, []);

  const formations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses
      .filter((course) => {
        const matchesTerm = !term || course.title.toLowerCase().includes(term);
        const matchesCategory = selected.length === 0 || course.tags.some((tag) => selected.includes(tag as FormationCategory));
        return matchesTerm && matchesCategory;
      })
      .map(toCardFormation);
  }, [search, selected, courses]);

  const toggleCategory = (category: FormationCategory) =>
    setSelected((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );

  const copy = DASHBOARD_COPY.formations;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        action={{ label: copy.create, to: '/dashboard/formations/creer' }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
        <StatTile
          label="Formations"
          value={courses.length}
          hint={`En cours : ${DEMO_STATS.coursesInProgress}`}
          icon={DASHBOARD_ICONS.members}
          tone="blue"
        />
        <StatTile
          label="Formations créées"
          value={courses.filter((course) => course.status === 'published').length}
          icon={DASHBOARD_ICONS.courses}
        />
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
            placeholder={copy.search}
            aria-label={copy.search}
            className="w-full rounded-lg bg-white py-2.5 pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-black/[0.08] transition placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          />
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((current) => !current)}
          aria-expanded={filtersOpen}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-ink ring-1 ring-inset transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
            filtersOpen ? 'bg-surface-muted ring-black/[0.12]' : 'bg-white ring-black/[0.08] hover:bg-surface-muted',
          )}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {copy.filters}
        </button>
      </div>

      {filtersOpen && (
        <FormationFilters selected={selected} onToggle={toggleCategory} onReset={() => setSelected([])} />
      )}

      {formations.length > 0 ? (
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
          {formations.map((formation) => (
            <AdminFormationCard
              key={formation.id}
              formation={formation}
              onDelete={async (target) => {
                await coursesApi.remove(target.id);
                reload();
              }}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-ink-muted">{copy.empty}</p>
      )}
    </div>
  );
}
