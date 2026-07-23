import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Play } from 'lucide-react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/ui/Section';
import { VideoFrame } from '../components/ui/VideoFrame';
import { GuideSection } from '../components/landing/GuideSection';
import { cn } from '../lib/cn';
import { DEMO_VESTIGE_VIDEOS, VESTIGE_PAGE, type VestigeVideo } from '../data/vestige';

export default function VestigePage() {
  const [videos, setVideos] = useState<VestigeVideo[]>(DEMO_VESTIGE_VIDEOS);
  const [activeId, setActiveId] = useState(DEMO_VESTIGE_VIDEOS[0].id);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(VESTIGE_PAGE.endpoint)
      .then((res) => {
        const items = res.data?.data?.items;
        if (cancelled || !Array.isArray(items) || items.length === 0) return;

        const mapped: VestigeVideo[] = items.map((item: any, index: number) => ({
          id: item.id ?? `item-${index}`,
          title: item.title,
          description: item.description ?? '',
          poster: item.thumbnail_url || DEMO_VESTIGE_VIDEOS[index % DEMO_VESTIGE_VIDEOS.length].poster,
          posterAlt: item.title,
          src: item.video_url ?? '',
        }));

        setVideos(mapped);
        setActiveId(mapped[0].id);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const active = videos.find((video) => video.id === activeId) ?? videos[0];

  return (
    <SiteLayout>
      <PageHeader title={VESTIGE_PAGE.title} intro={VESTIGE_PAGE.intro} decoration="waves" />

      <Section className="bg-white pb-16 pt-6 sm:pb-24 sm:pt-10">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <h2 className="font-display text-heading font-bold text-ink">{VESTIGE_PAGE.descriptionTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">{VESTIGE_PAGE.description}</p>
        </div>

        <h2 className="mb-6 font-display text-lg font-semibold text-ink">{VESTIGE_PAGE.modulesTitle}</h2>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
          <div>
            <VideoFrame
              poster={active.poster}
              posterAlt={active.posterAlt}
              src={active.src}
              title={active.title}
              className="aspect-video w-full shadow-card"
            />

            <h2 className="mt-6 font-display text-2xl font-bold text-ink">{active.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{active.description}</p>
          </div>

          <ul
            className="no-scrollbar flex max-h-[26rem] flex-col gap-2 overflow-y-auto lg:max-h-[30rem]"
            aria-label={VESTIGE_PAGE.playlistLabel}
          >
            {videos.map((video) => {
              const isActive = video.id === active.id;
              return (
                <li key={video.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(video.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'flex w-full gap-3 rounded-lg p-2 text-left transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
                      isActive ? 'bg-accent-blueSoft' : 'hover:bg-surface-muted',
                    )}
                  >
                    <span className="relative shrink-0">
                      <img
                        src={video.poster}
                        alt=""
                        loading="lazy"
                        className="h-14 w-24 rounded-md object-cover ring-1 ring-black/5"
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm ring-1 ring-white/50">
                          <Play className="ml-px h-2.5 w-2.5 fill-white text-white" />
                        </span>
                      </span>
                    </span>

                    <span className="min-w-0">
                      <span className="block font-display text-sm font-semibold text-ink">{video.title}</span>
                      <span className="mt-0.5 line-clamp-3 block text-xs leading-relaxed text-ink-muted">
                        {video.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <GuideSection />
    </SiteLayout>
  );
}
