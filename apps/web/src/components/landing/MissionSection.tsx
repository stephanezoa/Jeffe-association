import React from 'react';
import { Section } from '../ui/Section';
import { MISSION } from '../../data/landing';

export const MissionSection: React.FC = () => (
  <Section id="opportunite" className="bg-white py-16 sm:py-24" innerClassName="text-center">
    <p className="mx-auto max-w-2xl font-display text-lg leading-relaxed text-ink-muted sm:text-xl">
      <strong className="font-bold text-ink">{MISSION.lead}</strong>
      {MISSION.body}
    </p>

    <div className="mt-10 flex justify-center">
      <img
        src={MISSION.image}
        alt={MISSION.imageAlt}
        loading="lazy"
        className="h-16 w-48 rounded-full object-cover ring-1 ring-black/5 sm:h-[72px] sm:w-56"
      />
    </div>
  </Section>
);
