import React from 'react';
import { Section, SectionTitle } from '../ui/Section';
import { Badge } from '../ui/Badge';
import { GalleryCarousel } from './GalleryCarousel';
import { ENTREPRISE } from '../../data/landing';

export const EntrepriseSection: React.FC = () => (
  <Section className="bg-white py-16 sm:py-24">
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
      <img
        src={ENTREPRISE.image}
        alt={ENTREPRISE.imageAlt}
        loading="lazy"
        className="aspect-[5/4] w-full rounded-xl object-cover ring-1 ring-black/5"
      />

      <div>
        <Badge tone="sky">{ENTREPRISE.label}</Badge>
        <SectionTitle className="mt-4">{ENTREPRISE.title}</SectionTitle>
        <p className="mt-5 text-sm leading-relaxed text-ink-muted">{ENTREPRISE.body}</p>
      </div>
    </div>

    <div className="mt-12 sm:mt-16">
      <GalleryCarousel />
    </div>
  </Section>
);
