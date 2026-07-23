import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { formatDateFr } from '../../lib/date';
import { ACTUALITES_PAGE } from '../../data/actualites';

/** Données minimales dont la carte a besoin (compatibles API et données statiques). */
export interface CardArticle {
  slug: string;
  title: string;
  date: string;
  image: string;
  imageAlt: string;
}

interface ArticleCardProps {
  article: CardArticle;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] transition-shadow duration-300 hover:shadow-card">
    <Link to={`/actualites/${article.slug}`} className="block">
      <img
        src={article.image}
        alt={article.imageAlt}
        loading="lazy"
        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </Link>

    <div className="flex flex-1 flex-col bg-[#F1F6FD] px-5 py-4">
      <time dateTime={article.date} className="text-xs text-ink-faint">
        {formatDateFr(article.date)}
      </time>
      <h2 className="mt-1.5 font-display text-[15px] font-semibold leading-snug text-ink">
        <Link to={`/actualites/${article.slug}`} className="transition-colors hover:text-accent-blue">
          {article.title}
        </Link>
      </h2>

      <Link
        to={`/actualites/${article.slug}`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-blue underline-offset-4 hover:underline"
      >
        {ACTUALITES_PAGE.readMore}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  </article>
);
