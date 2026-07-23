import React from 'react';
import { cn } from '../../lib/cn';
import { FORMATION_CATEGORIES, FORMATIONS_PAGE, type FormationCategory } from '../../data/formations';

interface FormationFiltersProps {
  selected: FormationCategory[];
  onToggle: (category: FormationCategory) => void;
  onReset: () => void;
}

export const FormationFilters: React.FC<FormationFiltersProps> = ({ selected, onToggle, onReset }) => (
  <div className="flex flex-wrap items-center gap-2" role="group" aria-label={FORMATIONS_PAGE.filtersLabel}>
    {FORMATION_CATEGORIES.map((category) => {
      const isActive = selected.includes(category);
      return (
        <button
          key={category}
          type="button"
          aria-pressed={isActive}
          onClick={() => onToggle(category)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            isActive
              ? 'bg-ink text-white'
              : 'bg-[#EEF2F7] text-ink-muted hover:bg-[#E3E9F1] hover:text-ink',
          )}
        >
          {category}
        </button>
      );
    })}

    {selected.length > 0 && (
      <button
        type="button"
        onClick={onReset}
        className="ml-1 rounded-lg px-2 py-1.5 text-xs font-medium text-brand-600 underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {FORMATIONS_PAGE.resetLabel}
      </button>
    )}
  </div>
);
