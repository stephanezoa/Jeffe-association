import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { StatTile } from '../../components/dashboard/StatTile';
import { SponsoredMembersTable } from '../../components/dashboard/SponsoredMembersTable';
import { SponsorshipDiagram } from '../../components/dashboard/SponsorshipDiagram';
import { Modal } from '../../components/dashboard/Modal';
import { cn } from '../../lib/cn';
import { formatDateTimeFr } from '../../lib/date';
import { DASHBOARD_ICONS, DEMO_SPONSORED_MEMBERS, DEMO_STATS, type SponsoredMember } from '../../data/dashboard';
import {
  DEMO_SPONSORSHIP_TREE,
  PARRAINAGE_PAGE,
  getMemberProfile,
  type SponsorshipNode,
} from '../../data/parrainage';

type View = 'table' | 'diagram';

interface TreeApiNode {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  sponsorId: string | null;
  treeDepth: number;
}

/** Reconstruit l'arbre à partir de la liste plate renvoyée par l'API. */
function buildTree(nodes: TreeApiNode[]): SponsorshipNode | null {
  const root = nodes.find((node) => node.treeDepth === 0);
  if (!root) return null;

  const build = (id: string, name: string): SponsorshipNode => ({
    id,
    name,
    children: nodes
      .filter((node) => node.sponsorId === id)
      .map((node) => build(node.id, `${node.firstName} ${node.lastName}`)),
  });

  return { ...build(root.id, PARRAINAGE_PAGE.rootLabel) };
}

export default function DashboardParrainagePage() {
  const [view, setView] = useState<View>('table');
  const [members, setMembers] = useState<SponsoredMember[] | null>(null);
  const [tree, setTree] = useState<SponsorshipNode | null>(null);
  const [totalMembers, setTotalMembers] = useState<number | null>(null);
  const [viewed, setViewed] = useState<SponsoredMember | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<SponsoredMember | null>(null);
  const [removalError, setRemovalError] = useState('');

  useEffect(() => {
    let cancelled = false;

    axios
      .get('/api/v1/sponsorship/tree?depth=10')
      .then((res) => {
        if (cancelled) return;
        const nodes: TreeApiNode[] = res.data.data.members || [];

        setMembers(
          nodes
            .filter((node) => node.treeDepth > 0)
            .map((node) => ({
              id: node.id,
              fullName: `${node.firstName} ${node.lastName}`,
              email: node.email,
              phone: node.phone ?? null,
              addedAt: node.createdAt,
            })),
        );
        setTree(buildTree(nodes));
      })
      .catch(() => undefined);

    axios
      .get('/api/v1/admin/dashboard/stats')
      .then((res) => {
        if (!cancelled) setTotalMembers(res.data.data.totalMembers);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    const source = members ?? DEMO_SPONSORED_MEMBERS;
    return [...source].sort((a, b) => a.addedAt.localeCompare(b.addedAt));
  }, [members]);

  const profile = viewed ? getMemberProfile(viewed) : null;
  const removalProfile = pendingRemoval ? getMemberProfile(pendingRemoval) : null;

  const confirmRemoval = () => {
    // Aucun endpoint de suppression n'est exposé par l'API à ce jour.
    setRemovalError(PARRAINAGE_PAGE.remove.unavailable);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-accent-blueDark sm:text-4xl">
            {PARRAINAGE_PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{PARRAINAGE_PAGE.subtitle}</p>
        </div>

        <Link
          to="/dashboard/parrainage/ajouter"
          className="inline-flex items-center gap-2 rounded-md bg-accent-blueDark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2"
        >
          {PARRAINAGE_PAGE.add}
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="max-w-sm">
        <StatTile
          label="Membres"
          value={totalMembers ?? DEMO_STATS.members}
          hint={`Parrainés : ${members ? members.length : DEMO_STATS.sponsored}`}
          icon={DASHBOARD_ICONS.members}
          tone="blue"
        />
      </div>

      <div
        className="inline-flex gap-1 rounded-lg bg-white p-1 ring-1 ring-inset ring-black/[0.08]"
        role="tablist"
        aria-label="Mode d’affichage"
      >
        {PARRAINAGE_PAGE.views.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={view === item.id}
            onClick={() => setView(item.id)}
            className={cn(
              'rounded-md px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
              view === item.id ? 'bg-accent-blueDark font-medium text-white' : 'text-ink hover:bg-surface-muted',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === 'table' ? (
        <SponsoredMembersTable
          members={rows}
          onView={setViewed}
          onDelete={(member) => {
            setRemovalError('');
            setPendingRemoval(member);
          }}
        />
      ) : (
        <div className="pt-6">
          <SponsorshipDiagram root={tree ?? DEMO_SPONSORSHIP_TREE} />
        </div>
      )}

      {viewed && profile && (
        <Modal
          title={viewed.fullName}
          subtitle={PARRAINAGE_PAGE.profile.subtitle}
          onClose={() => setViewed(null)}
          footer={
            <button
              type="button"
              onClick={() => setViewed(null)}
              className="rounded-md bg-white px-4 py-2 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            >
              {PARRAINAGE_PAGE.profile.close}
            </button>
          }
        >
          <dl className="space-y-4 text-sm">
            <Field label={PARRAINAGE_PAGE.profile.fields.fullName} value={profile.fullName} />
            <Field label={PARRAINAGE_PAGE.profile.fields.email} value={profile.email} />
            <Field label={PARRAINAGE_PAGE.profile.fields.phone} value={profile.phone ?? '—'} />
            <Field label={PARRAINAGE_PAGE.profile.fields.addedBy} value={profile.addedBy} />
            <Field label={PARRAINAGE_PAGE.profile.fields.addedAt} value={formatDateTimeFr(profile.addedAt)} />
            <Field
              label={PARRAINAGE_PAGE.profile.fields.lastLogin}
              value={profile.lastLogin ? formatDateTimeFr(profile.lastLogin) : '—'}
            />
          </dl>
        </Modal>
      )}

      {pendingRemoval && removalProfile && (
        <Modal
          tone="danger"
          title={`Supprimer ${pendingRemoval.fullName.split(' ')[0]}`}
          subtitle={PARRAINAGE_PAGE.remove.subtitle}
          onClose={() => setPendingRemoval(null)}
          footer={
            <>
              <button
                type="button"
                onClick={confirmRemoval}
                className="rounded-md bg-[#D42B2B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B92424] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D42B2B] focus-visible:ring-offset-2"
              >
                {PARRAINAGE_PAGE.remove.confirm}
              </button>
              <button
                type="button"
                onClick={() => setPendingRemoval(null)}
                className="rounded-md bg-white px-4 py-2 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              >
                {PARRAINAGE_PAGE.remove.cancel}
              </button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-ink">
            Vous êtes sur le point de <strong className="font-semibold">supprimer</strong> {removalProfile.fullName}.
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

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="text-ink-faint">{label}</dt>
    <dd className="mt-0.5 font-medium text-ink">{value}</dd>
  </div>
);
