import React from 'react';
import { cn } from '../../lib/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
}

/** Interrupteur accessible (case à cocher stylée) pour les options oui/non. */
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, id }) => (
  <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
    <span className="relative inline-flex">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        className={cn(
          'h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-accent-blueDark' : 'bg-black/15',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-accent-blue peer-focus-visible:ring-offset-2',
        )}
      />
      <span
        className={cn(
          'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-5',
        )}
        aria-hidden="true"
      />
    </span>
    <span className="text-sm text-ink">{label}</span>
  </label>
);
