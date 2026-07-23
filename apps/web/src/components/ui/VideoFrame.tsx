import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '../../lib/cn';

interface VideoFrameProps {
  poster: string;
  posterAlt: string;
  title: string;
  /** Vide tant que la vidéo n'est pas fournie : le badge de lecture reste décoratif. */
  src?: string;
  className?: string;
  badgeClassName?: string;
}

/** Cadre vidéo : affiche seule, puis lecteur natif au clic si une source existe. */
export const VideoFrame: React.FC<VideoFrameProps> = ({
  poster,
  posterAlt,
  title,
  src,
  className,
  badgeClassName,
}) => {
  const [playing, setPlaying] = useState(false);

  // Changer de vidéo dans une playlist doit repartir de l'affiche.
  useEffect(() => setPlaying(false), [src, poster]);

  const frame = cn('relative overflow-hidden rounded-2xl bg-ink ring-1 ring-black/5', className);

  if (playing && src) {
    return (
      <div className={frame}>
        <video className="h-full w-full object-cover" src={src} poster={poster} title={title} controls autoPlay />
      </div>
    );
  }

  const badge = (
    <span
      className={cn(
        'flex items-center justify-center rounded-full bg-white/25 backdrop-blur-sm ring-1 ring-white/40 transition-transform duration-200 group-hover:scale-105',
        badgeClassName ?? 'h-16 w-16',
      )}
    >
      <Play className="ml-0.5 h-1/3 w-1/3 fill-white text-white" />
    </span>
  );

  return (
    <div className={frame}>
      <img src={poster} alt={posterAlt} className="h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 flex items-center justify-center">
        {src ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label={`Lire : ${title}`}
          >
            {badge}
          </button>
        ) : (
          <span className="group" aria-hidden="true">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
