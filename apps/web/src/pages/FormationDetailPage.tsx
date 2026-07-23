import React from 'react';
import { useParams } from 'react-router-dom';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Section } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VideoFrame } from '../components/ui/VideoFrame';
import { MembersOnly } from '../components/formations/MembersOnly';
import { GuideSection } from '../components/landing/GuideSection';
import { getStoredToken } from '../lib/auth';
import { FORMATION_DETAIL_COPY, findFormation, getFormationContent } from '../data/formation-contenus';

export default function FormationDetailPage() {
  const { id } = useParams();
  const formation = findFormation(id);

  if (!formation) {
    return (
      <SiteLayout>
        <Section className="py-24 text-center sm:py-32" innerClassName="max-w-md">
          <h1 className="font-display text-heading font-bold text-ink">{FORMATION_DETAIL_COPY.notFound}</h1>
          <div className="mt-8 flex justify-center">
            <Button href="/formations" variant="dark">
              {FORMATION_DETAIL_COPY.backToList}
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  const content = getFormationContent(formation);
  const unlocked = Boolean(getStoredToken());

  return (
    <SiteLayout>
      <Section className="bg-white pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-heading font-bold text-ink">{formation.title}</h1>

          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {formation.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm leading-relaxed text-ink-muted">{content.intro}</p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <VideoFrame
            poster={formation.image}
            posterAlt={formation.imageAlt}
            title={formation.title}
            className="aspect-video w-full shadow-card"
          />
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <MembersOnly unlocked={unlocked}>
            <div className="space-y-8">
              {content.sections.map((section, index) => (
                <section key={section.heading || index}>
                  {section.heading && (
                    <h2 className="font-display text-lg font-semibold text-ink">{section.heading}</h2>
                  )}
                  <p className={section.heading ? 'mt-3 text-sm leading-relaxed text-ink-muted' : 'text-sm leading-relaxed text-ink-muted'}>
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </MembersOnly>
        </div>
      </Section>

      <GuideSection />
    </SiteLayout>
  );
}
