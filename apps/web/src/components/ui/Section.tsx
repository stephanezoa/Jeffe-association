import React from 'react';
import { cn } from '../../lib/cn';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  /** Classes de fond appliquées à la bande pleine largeur. */
  className?: string;
  innerClassName?: string;
}

/** Bande pleine largeur + conteneur centré à la largeur de la maquette. */
export const Section: React.FC<SectionProps> = ({ id, children, className, innerClassName }) => (
  <section id={id} className={cn('w-full', className)}>
    <div className={cn('container-page', innerClassName)}>{children}</div>
  </section>
);

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, className }) => (
  <p className={cn('section-label', className)}>{children}</p>
);

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className, as: Tag = 'h2' }) => (
  <Tag className={cn('font-display text-heading font-bold text-ink', className)}>{children}</Tag>
);
