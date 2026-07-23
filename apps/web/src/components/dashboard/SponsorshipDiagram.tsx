import React from 'react';
import type { SponsorshipNode } from '../../data/parrainage';

interface SponsorshipDiagramProps {
  root: SponsorshipNode;
}

/** Organigramme de la branche : connecteurs en CSS, aucun rendu graphique externe. */
export const SponsorshipDiagram: React.FC<SponsorshipDiagramProps> = ({ root }) => (
  <div className="overflow-x-auto pb-4">
    <ul className="flex w-max min-w-full justify-center">
      <TreeNode node={root} isRoot />
    </ul>
  </div>
);

const TreeNode: React.FC<{ node: SponsorshipNode; isRoot?: boolean }> = ({ node, isRoot = false }) => (
  <li className="relative flex flex-col items-center px-3">
    {/* Segment montant vers le parent */}
    {!isRoot && <span className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-black/15" aria-hidden="true" />}

    <div className={isRoot ? '' : 'pt-6'}>
      <Avatar name={node.name} />
      <p className="mt-2 rounded-md bg-surface-muted px-3 py-1.5 text-center text-sm text-ink">{node.name}</p>
    </div>

    {node.children.length > 0 && (
      <>
        <span className="h-6 w-px bg-black/15" aria-hidden="true" />
        <ul className="relative flex">
          {/* Barre horizontale reliant la fratrie */}
          {node.children.length > 1 && (
            <span
              className="absolute left-0 right-0 top-0 mx-auto h-px bg-black/15"
              style={{ left: '12%', right: '12%' }}
              aria-hidden="true"
            />
          )}
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      </>
    )}
  </li>
);

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <span
      className="mx-auto flex h-24 w-24 items-center justify-center rounded-md bg-gradient-to-br from-[#DCE6F2] to-[#B9C8DA] font-display text-2xl font-semibold text-ink-muted ring-1 ring-black/5"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
};
