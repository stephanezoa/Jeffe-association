import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Remet la page en haut lors d'un changement de route (sauf navigation vers une ancre). */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};
