import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { FIELD_CLASS } from '../ui/FormField';

interface TagInputProps {
  label: string;
  placeholder: string;
  addLabel: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ label, placeholder, addLabel, tags, onChange }) => {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft('');
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={FIELD_CLASS}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          {addLabel}
        </button>
      </div>

      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge>
                <span className="flex items-center gap-1.5">
                  {tag}
                  <button
                    type="button"
                    onClick={() => onChange(tags.filter((item) => item !== tag))}
                    aria-label={`Retirer ${tag}`}
                    className="text-brand-700/70 transition-colors hover:text-brand-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
