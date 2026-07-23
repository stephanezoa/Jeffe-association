import React from 'react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { GuideSection } from '../components/landing/GuideSection';
import { GALERIE_PAGE, GALERIE_PHOTOS } from '../data/galerie';

export default function GaleriePage() {
  return (
    <SiteLayout>
      <PageHeader title={GALERIE_PAGE.title} intro={GALERIE_PAGE.intro} decoration="warm" />

      <section className="bg-white pb-16 pt-4 sm:pb-24 sm:pt-8">
        {GALERIE_PHOTOS.length > 0 ? (
          <div
            /* Focusable pour permettre le défilement au clavier dans une zone qui déborde. */
            tabIndex={0}
            role="region"
            aria-label={GALERIE_PAGE.regionLabel}
            className="no-scrollbar overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {/* La bande démarre à la gouttière du contenu puis déborde à droite, comme la maquette. */}
            <ul className="flex w-max snap-x gap-3 pl-5 pr-5 sm:pl-8 sm:pr-8 lg:pl-[max(2rem,calc((100vw-1180px)/2+2rem))]">
              {GALERIE_PHOTOS.map((photo) => (
                <li key={photo.id} className="snap-start">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-44 w-auto max-w-none rounded-lg object-cover ring-1 ring-black/5 sm:h-52"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="container-page py-16 text-center text-sm text-ink-muted">{GALERIE_PAGE.emptyState}</p>
        )}
      </section>

      <GuideSection />
    </SiteLayout>
  );
}
