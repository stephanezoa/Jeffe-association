import React from 'react';

interface DashboardSectionPageProps {
  title: string;
  description: string;
}

/** Rubrique de l'espace d'administration dont la maquette n'a pas encore été livrée. */
export default function DashboardSectionPage({ title, description }: DashboardSectionPageProps) {
  return (
    <div className="rounded-2xl bg-white p-8 ring-1 ring-black/[0.08]">
      <h1 className="font-display text-3xl font-bold text-accent-blueDark">{title}</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">{description}</p>
    </div>
  );
}
