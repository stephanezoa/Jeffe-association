import React from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'mint' | 'sky' | 'amber' | 'violet' | 'plain';

type Tone = BadgeTone;

const TONES: Record<Tone, string> = {
  mint: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100',
  sky: 'bg-accent-blueSoft text-accent-blue ring-1 ring-inset ring-accent-blue/15',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70',
  violet: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200/70',
  plain: 'bg-surface-muted text-ink-muted ring-1 ring-inset ring-black/5',
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'mint', className }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium leading-none',
      TONES[tone],
      className,
    )}
  >
    {children}
  </span>
);
