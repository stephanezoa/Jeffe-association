import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { SmartLink } from '../ui/SmartLink';
import { NAV_LINKS } from '../../data/landing';
import { cn } from '../../lib/cn';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  /** Seuls les liens de route peuvent être « actifs » (les ancres pointent vers la landing). */
  const isActive = (href: string) => !href.startsWith('#') && pathname === href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md transition-shadow duration-300',
        scrolled ? 'shadow-[0_1px_0_rgba(17,17,17,0.08)]' : 'shadow-none',
      )}
    >
      <nav className="container-page flex h-[72px] items-center justify-between gap-6" aria-label="Navigation principale">
        <SmartLink href="/" aria-label="Excelle Wellth — accueil" className="shrink-0">
          <Logo />
        </SmartLink>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <SmartLink
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'text-sm transition-colors',
                  isActive(link.href)
                    ? 'font-semibold text-accent-blue'
                    : 'font-medium text-ink/80 hover:text-brand-600',
                )}
              >
                {link.label}
              </SmartLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact" variant="brand" size="sm">
            Nous Contacter
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="menu-mobile"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div id="menu-mobile" className="border-t border-black/5 bg-white lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <SmartLink
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-surface-muted',
                    isActive(link.href) ? 'text-accent-blue' : 'text-ink',
                  )}
                >
                  {link.label}
                </SmartLink>
              </li>
            ))}
            <li className="pt-2">
              <Button href="/contact" variant="brand" onClick={() => setMobileOpen(false)}>
                Nous Contacter
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
