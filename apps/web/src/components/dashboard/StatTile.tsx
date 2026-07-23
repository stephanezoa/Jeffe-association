import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type Tone = 'blue' | 'green' | 'pink' | 'plain';

const TONES: Record<Tone, { card: string; rule: string }> = {
  blue: { card: 'bg-[#EFF5FD] ring-[#D8E6F8]', rule: 'bg-[#CFE0F5]' },
  green: { card: 'bg-[#EDF8E7] ring-[#D3ECC7]', rule: 'bg-[#CBE8BD]' },
  pink: { card: 'bg-[#FBEFFA] ring-[#EFD8ED]', rule: 'bg-[#EBD2E9]' },
  plain: { card: 'bg-white ring-black/[0.08]', rule: 'bg-black/[0.07]' },
};

interface StatTileProps {
  label: string;
  value: number | string;
  /** Métrique secondaire affichée sous le trait (« Parrainés : 12 »). */
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}

export const StatTile: React.FC<StatTileProps> = ({ label, value, hint, icon: Icon, tone = 'plain' }) => {
  const styles = TONES[tone];

  return (
    <article className={cn('rounded-2xl p-5 ring-1', styles.card)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm text-ink">{label}</h3>
        <Icon className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.8} aria-hidden="true" />
      </div>

      <p className="mt-3 font-display text-4xl font-semibold tabular-nums text-ink">{value}</p>

      <div className={cn('mt-4 h-px', styles.rule)} />
      {hint && <p className="mt-3 text-sm text-ink-muted">{hint}</p>}
    </article>
  );
};
