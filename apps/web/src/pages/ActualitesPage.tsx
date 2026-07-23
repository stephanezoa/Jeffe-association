import React, { useEffect, useState } from 'react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/ui/Section';
import { ArticleCard, type CardArticle } from '../components/actualites/ArticleCard';
import { GuideSection } from '../components/landing/GuideSection';
import { articlesApi } from '../lib/api';
import { ACTUALITES_PAGE, PUBLISHED_ARTICLES, articleImage } from '../data/actualites';

// Repli si l'API ne répond pas : les articles publiés statiques.
const FALLBACK: CardArticle[] = PUBLISHED_ARTICLES.map((a) => ({
  slug: a.slug,
  title: a.title,
  date: a.date,
  image: a.image,
  imageAlt: a.imageAlt,
}));

export default function ActualitesPage() {
  const [articles, setArticles] = useState<CardArticle[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    articlesApi
      .listPublished()
      .then((list) => {
        if (cancelled || list.length === 0) return;
        setArticles(
          list.map((article, index) => {
            const visual = articleImage(article.slug, index, article.coverImageUrl);
            return {
              slug: article.slug,
              title: article.title,
              date: article.publishedAt || article.createdAt,
              image: visual.image,
              imageAlt: visual.imageAlt || article.title,
            };
          }),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteLayout>
      <PageHeader title={ACTUALITES_PAGE.title} intro={ACTUALITES_PAGE.intro} decoration="waves" />

      <Section className="bg-white pb-16 pt-8 sm:pb-24 sm:pt-14">
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-sm text-ink-muted">{ACTUALITES_PAGE.emptyState}</p>
        )}
      </Section>

      <GuideSection />
    </SiteLayout>
  );
}
