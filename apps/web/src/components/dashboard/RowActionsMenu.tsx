import React, { useEffect, useRef, useState } from 'react';
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { PARRAINAGE_PAGE } from '../../data/parrainage';

interface RowActionsMenuProps {
  label: string;
  onView: () => void;
  onDelete: () => void;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({ label, onView, onDelete }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const run = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={`Actions pour ${label}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-lg bg-white py-1 shadow-card ring-1 ring-black/5">
          <button
            type="button"
            onClick={run(onView)}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-accent-blueSoft"
          >
            <Eye className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            {PARRAINAGE_PAGE.actions.view}
          </button>
          <button
            type="button"
            onClick={run(onDelete)}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-surface-muted"
          >
            <Trash2 className="h-4 w-4 text-red-600" aria-hidden="true" />
            {PARRAINAGE_PAGE.actions.delete}
          </button>
        </div>
      )}
    </div>
  );
};
