import React from 'react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Section, SectionTitle } from '../components/ui/Section';
import { Button } from '../components/ui/Button';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

/** Écran d'attente pour les pages de la maquette non encore réalisées. */
export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <SiteLayout>
      <Section className="py-24 sm:py-32" innerClassName="max-w-xl text-center">
        <SectionTitle as="h1">{title}</SectionTitle>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">{description}</p>
        <div className="mt-8 flex justify-center">
          <Button href="/" variant="dark">
            Retour à l’accueil
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
