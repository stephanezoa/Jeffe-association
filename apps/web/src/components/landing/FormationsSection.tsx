import React from 'react';
import { Section, SectionLabel, SectionTitle } from '../ui/Section';
import { Button } from '../ui/Button';
import { FormationCard } from './FormationCard';
import { FORMATIONS, FORMATIONS_SECTION } from '../../data/landing';

export const FormationsSection: React.FC = () => (
  <Section
    id="formations"
    className="bg-[radial-gradient(130%_85%_at_50%_0%,#E4F6E6_0%,#F3FBF3_45%,#FFFFFF_82%)] py-16 sm:py-24"
  >
    <div className="mx-auto max-w-2xl text-center">
      <SectionLabel>{FORMATIONS_SECTION.label}</SectionLabel>
      <SectionTitle className="mt-3">{FORMATIONS_SECTION.title}</SectionTitle>
    </div>

    <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {FORMATIONS.map((formation) => (
        <FormationCard key={formation.id} formation={formation} />
      ))}
    </div>

    <div className="mt-12 flex justify-center">
      <Button href={FORMATIONS_SECTION.cta.href} variant="dark">
        {FORMATIONS_SECTION.cta.label}
      </Button>
    </div>
  </Section>
);
