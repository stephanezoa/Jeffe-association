import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SmartLink } from './SmartLink';
import { cn } from '../../lib/cn';

type Variant = 'dark' | 'light' | 'brand' | 'outline';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, { root: string; icon: string }> = {
  dark: {
    root: 'bg-ink text-white hover:bg-ink-soft shadow-pill',
    icon: 'bg-white text-ink',
  },
  light: {
    root: 'bg-white text-ink hover:bg-surface-muted shadow-pill',
    icon: 'bg-ink text-white',
  },
  brand: {
    root: 'bg-brand-500 text-white hover:bg-brand-600 shadow-pill',
    icon: 'bg-white text-brand-600',
  },
  outline: {
    root: 'bg-white/70 text-ink ring-1 ring-inset ring-black/10 backdrop-blur hover:bg-white',
    icon: 'bg-ink text-white',
  },
};

/** Le gabarit change selon la présence de la pastille fléchée (padding droit réduit). */
const SIZES: Record<Size, { withIcon: string; plain: string }> = {
  sm: { withIcon: 'text-[13px] pl-4 pr-1 py-1', plain: 'text-[13px] px-4 py-2' },
  md: { withIcon: 'text-sm pl-5 pr-1.5 py-1.5', plain: 'text-sm px-5 py-2.5' },
};

interface BaseProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  /** Masque la pastille fléchée (bouton texte simple). */
  withIcon?: boolean;
  className?: string;
}

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & { href: string };

export const Button: React.FC<ButtonProps | AnchorProps> = ({
  children,
  variant = 'dark',
  size = 'md',
  withIcon = true,
  className,
  ...rest
}) => {
  const styles = VARIANTS[variant];
  const classes = cn(
    'pill-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    styles.root,
    withIcon ? SIZES[size].withIcon : SIZES[size].plain,
    className,
  );

  const content = (
    <>
      <span className="whitespace-nowrap">{children}</span>
      {withIcon && (
        <span className={cn('pill-btn__icon', styles.icon, size === 'sm' && 'h-6 w-6')} aria-hidden="true">
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
      )}
    </>
  );

  // SmartLink garde la navigation côté client pour les routes internes.
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorProps } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <SmartLink href={href} {...anchorProps} className={classes}>
        {content}
      </SmartLink>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {content}
    </button>
  );
};
