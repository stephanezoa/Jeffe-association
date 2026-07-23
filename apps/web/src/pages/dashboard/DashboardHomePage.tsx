import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatTile } from '../../components/dashboard/StatTile';
import { VisitsChart } from '../../components/dashboard/VisitsChart';
import { SponsoredMembersTable } from '../../components/dashboard/SponsoredMembersTable';
import {
  DASHBOARD_COPY,
  DASHBOARD_ICONS,
  DEMO_SPONSORED_MEMBERS,
  DEMO_STATS,
  DEMO_VISITS_LAST_7_DAYS,
  type SponsoredMember,
} from '../../data/dashboard';

interface AdminStats {
  totalMembers: number;
  totalCourses: number;
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [members, setMembers] = useState<SponsoredMember[] | null>(null);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [statsRes, treeRes] = await Promise.all([
          axios.get('/api/v1/admin/dashboard/stats'),
          axios.get('/api/v1/sponsorship/tree?depth=1'),
        ]);
        if (cancelled) return;

        setStats(statsRes.data.data);
        setMembers(
          (treeRes.data.data.members || [])
            // La racine de l'arbre est le membre connecté lui-même.
            .filter((node: any) => node.treeDepth > 0)
            .map((node: any) => ({
              id: node.id,
              fullName: `${node.firstName} ${node.lastName}`,
              email: node.email,
              phone: node.phone ?? null,
              addedAt: node.createdAt,
            })),
        );
      } catch {
        if (!cancelled) setDegraded(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sponsoredMembers = members ?? DEMO_SPONSORED_MEMBERS;

  return (
    <div className="space-y-5">
      {degraded && (
        <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          {DASHBOARD_COPY.demoNotice}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Membres"
          value={stats?.totalMembers ?? DEMO_STATS.members}
          hint={`Parrainés : ${members ? members.length : DEMO_STATS.sponsored}`}
          icon={DASHBOARD_ICONS.members}
          tone="blue"
        />
        <StatTile
          label="Formations"
          value={stats?.totalCourses ?? DEMO_STATS.courses}
          hint={`En cours : ${DEMO_STATS.coursesInProgress}`}
          icon={DASHBOARD_ICONS.courses}
          tone="green"
        />
        <StatTile
          label="Articles"
          value={DEMO_STATS.articles}
          hint={`Brouillon : ${DEMO_STATS.articlesDraft}`}
          icon={DASHBOARD_ICONS.articles}
          tone="pink"
        />
        <StatTile
          label="Visites"
          value={DEMO_STATS.visits}
          hint={`Aujourd’hui : ${DEMO_STATS.visitsToday}`}
          icon={DASHBOARD_ICONS.visits}
          tone="plain"
        />
      </div>

      <VisitsChart days={DEMO_VISITS_LAST_7_DAYS} />
      <SponsoredMembersTable members={sponsoredMembers} title={DASHBOARD_COPY.table.title} />
    </div>
  );
}
