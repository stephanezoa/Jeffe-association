import React from 'react';
import { cn } from '../../lib/cn';

interface LogoProps {
  className?: string;
  /** Inverse le lettrage pour les fonds sombres. */
  inverted?: boolean;
}

/**
 * Marque Excelle Wellth : monogramme « ew » barré d'un swoosh vert + lettrage empilé.
 * À remplacer par le SVG officiel exporté depuis Figma le cas échéant.
 */
export const Logo: React.FC<LogoProps> = ({ className, inverted = false }) => (
  <span className={cn('inline-flex items-center gap-2', className)}>
    <svg viewBox="0 0 44 32" className="h-8 w-11 shrink-0" role="img" aria-label="Excelle Wellth">
      <path
        d="M2 22C8 6 18 2 26 8c6 4.5 4 12-2 12-4.5 0-6-4-3.5-7"
        fill="none"
        stroke="#2FA84F"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <text
        x="6"
        y="29"
        fontFamily="'Plus Jakarta Sans', Inter, sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="-0.5"
        fill={inverted ? '#FFFFFF' : '#141414'}
      >
        ew
      </text>
    </svg>
    <span className="flex flex-col font-display text-[13px] font-semibold leading-[1.05]">
      <span className={inverted ? 'text-white' : 'text-ink'}>excelle</span>
      <span className="text-brand-500">wellth</span>
    </span>
  </span>
);
