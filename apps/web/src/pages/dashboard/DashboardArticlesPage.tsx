import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { StatTile } from '../../components/dashboard/StatTile';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RowActionsMenu } from '../../components/dashboard/RowActionsMenu';
import { Modal } from '../../components/dashboard/Modal';
import { formatDateFr } from '../../lib/date';
import { articlesApi, type ApiArticle } from '../../lib/api';
import { DASHBOARD_ICONS } from '../../data/dashboard';
import { ARTICLES_PAGE } from '../../data/admin-forms';

export default function DashboardArticlesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [articlesData, setArticlesData] = useState<ApiArticle[]>([]);
  const [pendingRemoval, setPendingRemoval] = useState<ApiArticle | null>(null);
  const [removalError, setRemovalError] = useState('');

  const reload = () => articlesApi.listMine().then(setArticlesData).catch(() => setArticlesData([]));

  useEffect(() => {
    reload();
  }, []);

  const articles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? articlesData.filter((article) => article.title.toLowerCase().includes(term)) : articlesData;
  }, [search, articlesData]);

  const publishedCount = articlesData.filter((article) => article.status === 'published').length;
  const draftCount = articlesData.length - publishedCount;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={ARTICLES_PAGE.title}
        subtitle={ARTICLES_PAGE.subtitle}
        action={{ label: ARTICLES_PAGE.create, to: '/dashboard/articles/creer' }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
        <StatTile label="Articles" value={articlesData.length} hint={`Brouillon : ${draftCount}`} icon={DASHBOARD_ICONS.articles} tone="pink" />
        <StatTile label="Articles publiés" value={publishedCount} icon={DASHBOARD_ICONS.articles} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={ARTICLES_PAGE.search}
            aria-label={ARTICLES_PAGE.search}
            className="w-full rounded-lg bg-white py-2.5 pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-black/[0.08] transition placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm text-ink ring-1 ring-inset ring-black/[0.08] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {ARTICLES_PAGE.filters}
        </button>
      </div>

      {articles.length > 0 ? (
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => (
            <article key={article.id} className="flex flex-col">
              <div className="relative overflow-hidden rounded-xl bg-surface-muted ring-1 ring-black/5">
                <img
                  src={article.coverImageUrl || '/images/actualite-communication.svg'}
                  alt={article.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="absolute left-2 top-2">
                  <StatusBadge status={article.status} />
                </div>
              </div>

              <div className="mt-3 flex items-start justify-between gap-2">
                <h3 className="font-display text-[15px] font-semibold leading-snug text-ink">{article.title}</h3>
                <RowActionsMenu
                  label={article.title}
                  onView={() => navigate(`/dashboard/articles/${article.id}/modifier`)}
                  onDelete={() => {
                    setRemovalError('');
                    setPendingRemoval(article);
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-ink-faint">{formatDateFr(article.publishedAt || article.createdAt)}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-ink-muted">{ARTICLES_PAGE.empty}</p>
      )}

      {pendingRemoval && (
        <Modal
          tone="danger"
          title={`Supprimer ${pendingRemoval.title}`}
          subtitle={ARTICLES_PAGE.removeConfirm.subtitle}
          onClose={() => setPendingRemoval(null)}
          footer={
            <>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await articlesApi.remove(pendingRemoval.id);
                    setPendingRemoval(null);
                    reload();
                  } catch (err: any) {
                    setRemovalError(err.response?.data?.error?.message || ARTICLES_PAGE.removeConfirm.unavailable);
                  }
                }}
                className="rounded-md bg-[#D42B2B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B92424] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D42B2B] focus-visible:ring-offset-2"
              >
                {ARTICLES_PAGE.removeConfirm.confirm}
              </button>
              <button
                type="button"
                onClick={() => setPendingRemoval(null)}
                className="rounded-md bg-white px-4 py-2 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                {ARTICLES_PAGE.removeConfirm.cancel}
              </button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-ink">
            Vous êtes sur le point de <strong className="font-semibold">supprimer</strong> « {pendingRemoval.title} ».
            Êtes-vous sûr de vouloir continuer ?
          </p>
          {removalError && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {removalError}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
