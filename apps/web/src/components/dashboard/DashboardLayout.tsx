import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ChevronRight, PanelLeft } from 'lucide-react';
import { DashboardSidebar } from './DashboardSidebar';
import { DASHBOARD_NAV } from '../../data/dashboard';

/** Libellés des segments qui ne figurent pas dans la navigation latérale. */
const SEGMENT_LABELS: Record<string, string> = {
  ajouter: 'Ajouter',
  creer: 'Créer',
  modifier: 'Modifier',
  'mon-compte': 'Mon Compte',
};

/** Fil d'Ariane construit segment par segment : « Tableau de bord › Parrainage › Ajouter ». */
function useBreadcrumb(): string[] {
  const { pathname } = useLocation();
  const root = DASHBOARD_NAV[0].label;

  const segments = pathname.replace(/^\/dashboard\/?/, '').split('/').filter(Boolean);

  const labels = segments
    .map((segment, index) => {
      const href = `/dashboard/${segments.slice(0, index + 1).join('/')}`;
      const navLabel = DASHBOARD_NAV.find((item) => item.href === href)?.label;
      // Un segment inconnu (identifiant de ressource) est masqué du fil d'Ariane.
      return navLabel ?? SEGMENT_LABELS[segment] ?? null;
    })
    .filter((label): label is string => label !== null);

  return [root, ...labels];
}

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const breadcrumb = useBreadcrumb();

  return (
    <div className="flex min-h-screen bg-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <DashboardSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6">
        <div className="flex items-center gap-3 rounded-xl bg-[#EFF5FD] px-4 py-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((current) => !current)}
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? 'Masquer le menu' : 'Afficher le menu'}
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>

          <nav aria-label="Fil d’Ariane">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              {breadcrumb.map((label, index) => (
                <li key={label} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-ink-faint" aria-hidden="true" />}
                  <span className={index === breadcrumb.length - 1 ? 'text-ink' : 'text-ink-muted'}>
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <main className="mt-5 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
