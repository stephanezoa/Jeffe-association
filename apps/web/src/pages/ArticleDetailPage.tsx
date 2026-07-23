import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Section } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { GuideSection } from '../components/landing/GuideSection';
import { articlesApi } from '../lib/api';
import { formatDateFr } from '../lib/date';
import { ARTICLE_DETAIL_COPY, articleImage, findArticle } from '../data/actualites';

interface DisplayArticle {
  title: string;
  date: string;
  image: string;
  imageAlt: string;
  /** Paragraphes de contenu (HTML retiré). */
  paragraphs: string[];
}

/** Découpe le contenu (texte ou HTML de paragraphes) en blocs lisibles. */
function toParagraphs(content: string | string[]): string[] {
  if (Array.isArray(content)) return content;
  const stripped = content.replace(/<\/p>/gi, '\n').replace(/<[^>]*>/g, '');
  return stripped.split('\n').map((p) => p.trim()).filter(Boolean);
}

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<DisplayArticle | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    articlesApi
      .getBySlug(slug ?? '')
      .then((data) => {
        if (cancelled) return;
        const visual = articleImage(data.slug, 0, data.coverImageUrl);
        setArticle({
          title: data.title,
          date: data.publishedAt || data.createdAt,
          image: visual.image,
          imageAlt: visual.imageAlt || data.title,
          paragraphs: toParagraphs(data.content),
        });
      })
      .catch(() => {
        // Repli sur les données statiques (API indisponible ou article non publié).
        const local = findArticle(slug);
        if (cancelled) return;
        setArticle(
          local
            ? {
                title: local.title,
                date: local.date,
                image: local.image,
                imageAlt: local.imageAlt,
                paragraphs: toParagraphs(local.content),
              }
            : null,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (article === undefined) {
    return (
      <SiteLayout>
        <Section className="py-24 text-center sm:py-32" innerClassName="max-w-md">
          <p className="text-sm text-ink-muted">Chargement…</p>
        </Section>
      </SiteLayout>
    );
  }

  if (article === null) {
    return (
      <SiteLayout>
        <Section className="py-24 text-center sm:py-32" innerClassName="max-w-md">
          <h1 className="font-display text-heading font-bold text-ink">{ARTICLE_DETAIL_COPY.notFound}</h1>
          <div className="mt-8 flex justify-center">
            <Button href="/actualites" variant="dark">
              {ARTICLE_DETAIL_COPY.back}
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Section className="bg-white pb-16 pt-12 sm:pb-24 sm:pt-16">
        <article className="mx-auto max-w-2xl">
          <header className="text-center">
            <p className="text-xs text-ink-faint">
              {ARTICLE_DETAIL_COPY.published} · <time dateTime={article.date}>{formatDateFr(article.date)}</time>
            </p>
            <h1 className="mt-3 font-display text-heading font-bold text-ink">{article.title}</h1>
          </header>

          <img
            src={article.image}
            alt={article.imageAlt}
            className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-card ring-1 ring-black/5"
          />

          <div className="mt-8 space-y-5">
            {article.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button href="/actualites" variant="dark">
              {ARTICLE_DETAIL_COPY.back}
            </Button>
          </div>
        </article>
      </Section>

      <GuideSection />
    </SiteLayout>
  );
}
