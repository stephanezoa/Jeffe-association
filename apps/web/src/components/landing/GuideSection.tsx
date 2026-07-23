import React from 'react';
import { Section, SectionLabel, SectionTitle } from '../ui/Section';
import { Button } from '../ui/Button';
import { GUIDE } from '../../data/landing';

export const GuideSection: React.FC = () => (
  <Section className="bg-surface-muted py-16 sm:py-24">
    <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
      <div>
        <SectionLabel>{GUIDE.label}</SectionLabel>
        <SectionTitle className="mt-3 max-w-md">{GUIDE.title}</SectionTitle>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-muted">{GUIDE.body}</p>
        <div className="mt-8">
          <Button href={GUIDE.cta.href} variant="dark">
            {GUIDE.cta.label}
          </Button>
        </div>
      </div>

      <img
        src={GUIDE.image}
        alt={GUIDE.imageAlt}
        loading="lazy"
        className="aspect-[4/3] w-full rounded-xl object-cover shadow-card ring-1 ring-black/5"
      />
    </div>
  </Section>
);
