import React from 'react';

type Decoration = 'glow' | 'waves' | 'aurora' | 'warm';

interface PageHeaderProps {
  title: string;
  intro?: string;
  /**
   * `glow` : halo bleuté simple. `waves` : rubans pâles traversant la bande.
   * `aurora` : lavis vert d'eau et ambré. `warm` : lavis ambré sur toute la largeur.
   */
  decoration?: Decoration;
}

/** Lavis de fond : couleurs des trois taches (gauche, droite, centre). */
const WASHES: Record<'aurora' | 'warm', { left: string; right: string; center: string }> = {
  aurora: { left: '#B8E4DB', right: '#F6E3BE', center: '#E9F3FA' },
  warm: { left: '#F5DEC0', right: '#F8E7D2', center: '#FBF1E4' },
};

/** En-tête des pages intérieures : décor discret, titre centré et chapô. */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, intro, decoration = 'glow' }) => (
  <section className="relative isolate overflow-hidden bg-white pb-12 pt-14 sm:pb-16 sm:pt-20">
    {(decoration === 'glow' || decoration === 'waves') && (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_120%_at_18%_-10%,#E7F0FF_0%,rgba(255,255,255,0)_58%)]"
      />
    )}

    {decoration === 'waves' && <HeaderWaves />}
    {(decoration === 'aurora' || decoration === 'warm') && <HeaderWash tone={decoration} />}

    <div className="container-page relative text-center">
      <h1 className="font-display text-display font-bold text-ink">{title}</h1>
      {intro && (
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-[15px]">{intro}</p>
      )}
    </div>
  </section>
);

/** Les couleurs venant d'une table, les dégradés passent par `style` (hors portée du JIT Tailwind). */
const HeaderWash: React.FC<{ tone: 'aurora' | 'warm' }> = ({ tone }) => {
  const { left, right, center } = WASHES[tone];
  const fade = (color: string, position: string) =>
    `radial-gradient(58% 115% at ${position}, ${color} 0%, rgba(255,255,255,0) 62%)`;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundImage: fade(left, '-4% 16%') }} />
      <div className="absolute inset-0" style={{ backgroundImage: fade(right, '104% 16%') }} />
      <div className="absolute inset-0" style={{ backgroundImage: fade(center, '50% -20%') }} />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
};

const HeaderWaves: React.FC = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 1440 340"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ew-header-wave" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#BBD3F2" />
        <stop offset="50%" stopColor="#D9E7F8" />
        <stop offset="100%" stopColor="#EAF1FB" />
      </linearGradient>
      <filter id="ew-header-blur" x="-20%" y="-120%" width="140%" height="340%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
    </defs>

    <g fill="none" stroke="url(#ew-header-wave)" filter="url(#ew-header-blur)" strokeLinecap="round">
      <path d="M-120 104 C 210 8, 430 176, 700 118 S 1180 22, 1560 96" strokeWidth="46" opacity="0.7" />
      <path d="M-120 168 C 240 74, 470 226, 760 168 S 1220 84, 1560 152" strokeWidth="26" opacity="0.55" />
      <path d="M-120 46 C 180 -20, 360 92, 620 44" strokeWidth="18" opacity="0.45" />
    </g>
  </svg>
);
