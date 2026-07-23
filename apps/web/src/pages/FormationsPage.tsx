import React, { useMemo, useState } from 'react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { FormationFilters } from '../components/formations/FormationFilters';
import { FormationCard } from '../components/landing/FormationCard';
import { GuideSection } from '../components/landing/GuideSection';
import { FORMATIONS_CATALOGUE, FORMATIONS_PAGE, type FormationCategory } from '../data/formations';

export default function FormationsPage() {
  const [selected, setSelected] = useState<FormationCategory[]>([]);

  const formations = useMemo(
    () =>
      selected.length === 0
        ? FORMATIONS_CATALOGUE
        : FORMATIONS_CATALOGUE.filter((formation) =>
            formation.categories.some((category) => selected.includes(category)),
          ),
    [selected],
  );

  const toggleCategory = (category: FormationCategory) =>
    setSelected((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );

  return (
    <SiteLayout>
      <PageHeader title={FORMATIONS_PAGE.title} intro={FORMATIONS_PAGE.intro} />

      <Section className="bg-white pb-16 pt-6 sm:pb-24 sm:pt-10">
        <FormationFilters selected={selected} onToggle={toggleCategory} onReset={() => setSelected([])} />

        <p className="sr-only" aria-live="polite">
          {formations.length} formation{formations.length > 1 ? 's' : ''} affichée
          {formations.length > 1 ? 's' : ''}
        </p>

        {formations.length > 0 ? (
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {formations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-5 text-center">
            <p className="text-sm text-ink-muted">{FORMATIONS_PAGE.emptyState}</p>
            <Button variant="dark" withIcon={false} onClick={() => setSelected([])}>
              {FORMATIONS_PAGE.resetLabel}
            </Button>
          </div>
        )}
      </Section>

      <GuideSection />
    </SiteLayout>
  );
}
