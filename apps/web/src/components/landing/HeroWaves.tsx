import React from 'react';

/**
 * Fond décoratif du hero : rubans pastel floutés (lilas → bleu → vert)
 * reproduisant l'aurore de la maquette. Purement visuel.
 */
export const HeroWaves: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <svg
      className="absolute inset-0 h-full w-full animate-drift"
      viewBox="0 0 1440 620"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="ew-wave-lilac" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B9A5F0" />
          <stop offset="45%" stopColor="#C7D6F7" />
          <stop offset="100%" stopColor="#D9F0E2" />
        </linearGradient>
        <linearGradient id="ew-wave-sky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8FB8F0" />
          <stop offset="60%" stopColor="#B9E4E0" />
          <stop offset="100%" stopColor="#C9EFB8" />
        </linearGradient>
        <linearGradient id="ew-wave-green" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DDF3D2" />
          <stop offset="55%" stopColor="#9FDD8A" />
          <stop offset="100%" stopColor="#5FC46B" />
        </linearGradient>
        <linearGradient id="ew-wave-mint" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EAF7E6" />
          <stop offset="100%" stopColor="#BFE9C4" />
        </linearGradient>

        <filter id="ew-blur-lg" x="-25%" y="-100%" width="150%" height="300%">
          <feGaussianBlur stdDeviation="46" />
        </filter>
        <filter id="ew-blur-md" x="-25%" y="-100%" width="150%" height="300%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <filter id="ew-blur-sm" x="-25%" y="-100%" width="150%" height="300%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <g fill="none" strokeLinecap="round">
        <path
          d="M-160 236 C 220 40, 470 400, 840 268 S 1300 96, 1620 226"
          stroke="url(#ew-wave-lilac)"
          strokeWidth="168"
          filter="url(#ew-blur-lg)"
          opacity="0.85"
        />
        <path
          d="M-160 352 C 250 168, 540 512, 940 372 S 1370 214, 1620 336"
          stroke="url(#ew-wave-sky)"
          strokeWidth="112"
          filter="url(#ew-blur-md)"
          opacity="0.8"
        />
        <path
          d="M560 486 C 880 424, 1090 214, 1620 138"
          stroke="url(#ew-wave-green)"
          strokeWidth="150"
          filter="url(#ew-blur-lg)"
          opacity="0.85"
        />
        <path
          d="M660 566 C 1010 500, 1220 322, 1620 268"
          stroke="url(#ew-wave-mint)"
          strokeWidth="86"
          filter="url(#ew-blur-md)"
          opacity="0.9"
        />
        <path
          d="M-120 268 C 230 96, 480 420, 830 300 S 1290 140, 1600 252"
          stroke="#FFFFFF"
          strokeWidth="26"
          filter="url(#ew-blur-sm)"
          opacity="0.55"
        />
        <path
          d="M-140 176 C 160 60, 330 292, 620 214"
          stroke="#CDBDF5"
          strokeWidth="64"
          filter="url(#ew-blur-md)"
          opacity="0.55"
        />
      </g>
    </svg>

    {/* Fondu vers le blanc en bas de section pour raccorder au reste de la page */}
    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
  </div>
);
