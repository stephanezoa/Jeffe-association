import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

/** Ancre pour les liens `#…`, `mailto:` et externes ; `Link` pour les routes internes. */
export const SmartLink: React.FC<SmartLinkProps> = ({ href, children, onClick, ...rest }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHash = href.startsWith('#');
  const isProtocol = href.startsWith('mailto:') || href.startsWith('tel:');
  const isExternal = /^https?:\/\//.test(href);

  if (isHash) {
    // Depuis une autre route, on revient d'abord sur la landing avant de viser l'ancre.
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || location.pathname === '/') return;
      event.preventDefault();
      navigate('/');
      window.setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    };

    return (
      <a href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }

  if (isProtocol || isExternal) {
    return (
      <a
        href={href}
        onClick={onClick}
        {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
};
