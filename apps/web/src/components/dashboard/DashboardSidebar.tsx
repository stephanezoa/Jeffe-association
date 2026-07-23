import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MoreVertical } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { cn } from '../../lib/cn';
import { clearSession } from '../../lib/auth';
import { DASHBOARD_COPY, DASHBOARD_NAV } from '../../data/dashboard';

interface DashboardSidebarProps {
  /** Ouverture du tiroir en mobile ; la barre est toujours visible en desktop. */
  open: boolean;
  onNavigate: () => void;
}

interface CurrentUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ open, onNavigate }) => (
  <aside
    className={cn(
      'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-black/[0.06] bg-white transition-transform duration-300 lg:static lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full',
    )}
  >
    <div className="px-6 py-6">
      <NavLink to="/" aria-label="Excelle Wellth — site public">
        <Logo />
      </NavLink>
    </div>

    <nav className="flex-1 space-y-1 px-4" aria-label="Navigation de l’espace d’administration">
      {DASHBOARD_NAV.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === '/dashboard'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-full py-2.5 pl-2.5 pr-4 text-sm transition-colors',
              isActive
                ? 'bg-accent-blueDark font-medium text-white'
                : 'text-ink hover:bg-surface-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  isActive ? 'bg-white text-accent-blueDark' : 'text-ink-muted',
                )}
                aria-hidden="true"
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    <UserCard />
  </aside>
);

const UserCard: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Le profil connecté est exposé par l'API ; en cas d'échec la carte reste neutre.
    let cancelled = false;
    axios
      .get('/api/v1/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.data.data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Mon compte';
  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'EW';

  const handleSignOut = () => {
    clearSession();
    navigate('/connexion');
  };

  return (
    <div ref={containerRef} className="relative border-t border-black/[0.06] px-4 py-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-ink-muted"
          aria-hidden="true"
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{fullName}</p>
          {user?.email && <p className="truncate text-xs text-ink-faint">{user.email}</p>}
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label="Options du compte"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute bottom-16 right-4 w-44 overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-black/5">
          <button
            type="button"
            onClick={handleSignOut}
            className="block w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-surface-muted"
          >
            {DASHBOARD_COPY.signOut}
          </button>
        </div>
      )}
    </div>
  );
};
