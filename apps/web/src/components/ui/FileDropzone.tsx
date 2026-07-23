import React, { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface FileDropzoneProps {
  label: string;
  /** Aperçu actuel (data URL) ou null. */
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  /** Taille maximale en octets (par défaut 1 Mo). */
  maxBytes?: number;
  hint?: string;
}

/**
 * Zone de dépôt d'image : lit le fichier côté client et renvoie un data URL.
 * Aucun envoi réseau ici — le stockage dépendra d'un futur endpoint d'upload.
 */
export const FileDropzone: React.FC<FileDropzoneProps> = ({
  label,
  value,
  onChange,
  maxBytes = 1_000_000,
  hint = 'Taille maximum : 1 mo',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Format non pris en charge : choisissez une image.');
      return;
    }
    if (file.size > maxBytes) {
      setError(`Fichier trop volumineux (max ${Math.round(maxBytes / 1_000_000)} mo).`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>

      {value ? (
        <div className="relative overflow-hidden rounded-xl ring-1 ring-black/[0.08]">
          <img src={value} alt="Aperçu de l’image de couverture" className="aspect-[16/9] w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Retirer l’image"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            handleFile(event.dataTransfer.files[0]);
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
            dragOver ? 'border-accent-blue bg-accent-blueSoft' : 'border-black/15 bg-[#F5F8FD] hover:bg-[#EEF3FB]',
          )}
        >
          <ImagePlus className="h-6 w-6 text-ink-faint" aria-hidden="true" />
          <span className="text-sm font-medium text-ink">Déposez vos fichiers ou parcourez</span>
          <span className="text-xs text-ink-faint">{hint}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};
