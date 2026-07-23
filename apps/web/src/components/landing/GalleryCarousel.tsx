import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY } from '../../data/landing';
import { cn } from '../../lib/cn';

export const GalleryCarousel: React.FC = () => {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncBounds = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= maxScroll - 4);
  }, []);

  useEffect(() => {
    syncBounds();
    window.addEventListener('resize', syncBounds);
    return () => window.removeEventListener('resize', syncBounds);
  }, [syncBounds]);

  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstItem = track.querySelector('li');
    const step = firstItem ? firstItem.clientWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <div id="galerie" className="scroll-mt-28">
      <ul
        ref={trackRef}
        onScroll={syncBounds}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1"
      >
        {GALLERY.map((image) => (
          <li key={image.id} className="w-44 shrink-0 snap-start sm:w-56 lg:w-64">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-28 w-full rounded-xl object-cover ring-1 ring-black/5 sm:h-32 lg:h-36"
            />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-center gap-3">
        <CarouselButton label="Image précédente" disabled={atStart} onClick={() => scrollByStep(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </CarouselButton>
        <CarouselButton label="Image suivante" disabled={atEnd} onClick={() => scrollByStep(1)}>
          <ChevronRight className="h-4 w-4" />
        </CarouselButton>
      </div>
    </div>
  );
};

interface CarouselButtonProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const CarouselButton: React.FC<CarouselButtonProps> = ({ label, disabled, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={cn(
      'flex h-9 w-9 items-center justify-center rounded-full text-ink transition-all',
      'hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
      disabled && 'cursor-not-allowed opacity-30 hover:bg-transparent',
    )}
  >
    {children}
  </button>
);
