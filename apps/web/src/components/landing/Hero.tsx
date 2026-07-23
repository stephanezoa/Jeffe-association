import React from 'react';
import { Button } from '../ui/Button';
import { HeroWaves } from './HeroWaves';
import { HeroVideo } from './HeroVideo';
import { HERO } from '../../data/landing';

export const Hero: React.FC = () => (
  <section className="relative isolate overflow-hidden bg-white pb-16 pt-14 sm:pb-24 sm:pt-20">
    <HeroWaves />

    <div className="container-page relative">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="animate-fade-up font-display text-display font-bold text-ink">
          {HERO.titleBefore}
          <span className="text-accent-blue">{HERO.titleHighlight}</span>
          {HERO.titleAfter}
        </h1>

        <p className="mx-auto mt-5 max-w-md animate-fade-up text-sm leading-relaxed text-ink-muted [animation-delay:80ms] sm:text-base">
          {HERO.subtitle}
        </p>

        <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-3 [animation-delay:160ms]">
          <Button href={HERO.primaryCta.href} variant="outline" withIcon={false}>
            {HERO.primaryCta.label}
          </Button>
          <Button href={HERO.secondaryCta.href} variant="dark" withIcon={false}>
            {HERO.secondaryCta.label}
          </Button>
        </div>
      </div>

      <div className="mt-12 animate-fade-up [animation-delay:240ms] sm:mt-16">
        <HeroVideo />
      </div>
    </div>
  </section>
);
