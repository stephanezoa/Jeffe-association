import React, { useRef } from 'react';
import { cn } from '../../lib/cn';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
}

const BLOCKS = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'] as const;

/**
 * Éditeur de contenu léger basé sur `contentEditable`.
 * La barre reprend la maquette : bloc (P, H1→H6) et couleur du texte.
 * `document.execCommand` reste le moyen le plus simple sans dépendance ; il est
 * déprécié mais fonctionne dans tous les navigateurs cibles.
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Contenu de l’article',
  id = 'rich-editor',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (command: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>

      <div className="overflow-hidden rounded-md ring-1 ring-inset ring-black/[0.08] focus-within:ring-2 focus-within:ring-accent-blue/50">
        <div className="flex flex-wrap items-center gap-1 border-b border-black/[0.06] bg-[#F5F8FD] px-2 py-1.5">
          {BLOCKS.map((block) => (
            <button
              key={block}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => exec('formatBlock', block)}
              className="rounded px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-white hover:text-ink"
            >
              {block}
            </button>
          ))}

          <label className="ml-1 flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs font-medium text-ink-muted hover:bg-white hover:text-ink">
            Couleur
            <input
              type="color"
              onMouseDown={(event) => event.preventDefault()}
              onChange={(event) => exec('foreColor', event.target.value)}
              className="h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
              aria-label="Couleur du texte"
            />
          </label>
        </div>

        <div
          id={id}
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          contentEditable
          suppressContentEditableWarning
          onInput={(event) => onChange((event.target as HTMLDivElement).innerHTML)}
          data-placeholder={placeholder}
          className={cn(
            'min-h-[180px] px-3 py-2.5 text-sm leading-relaxed text-ink focus:outline-none',
            // Placeholder tant que l'éditeur est vide.
            'empty:before:text-ink-faint empty:before:content-[attr(data-placeholder)]',
            '[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold',
          )}
          // Contenu initial uniquement : contentEditable ne doit pas être piloté à chaque frappe.
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  );
};
