import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { RowActionsMenu } from './RowActionsMenu';
import { formatDateTimeFr } from '../../lib/date';
import { DASHBOARD_COPY, type SponsoredMember } from '../../data/dashboard';

interface SponsoredMembersTableProps {
  members: SponsoredMember[];
  /** Titre encadrant le tableau ; omis quand il est déjà porté par la page. */
  title?: string;
  onView?: (member: SponsoredMember) => void;
  onDelete?: (member: SponsoredMember) => void;
}

export const SponsoredMembersTable: React.FC<SponsoredMembersTableProps> = ({
  members,
  title,
  onView,
  onDelete,
}) => {
  const interactive = Boolean(onView && onDelete);

  const table =
    members.length === 0 ? (
      <p className="mt-6 text-sm text-ink-muted">{DASHBOARD_COPY.table.empty}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#EFF5FD] text-left text-ink-faint">
              {DASHBOARD_COPY.table.columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-3 font-normal first:rounded-l-lg last:rounded-r-lg">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.id} className={index % 2 === 1 ? 'bg-surface-muted/70' : undefined}>
                <td className="px-4 py-4 text-ink first:rounded-l-lg">{member.fullName}</td>
                <td className="px-4 py-4 text-ink">{member.email}</td>
                <td className="px-4 py-4 text-ink">{member.phone ?? '—'}</td>
                <td className="px-4 py-4 text-ink">{formatDateTimeFr(member.addedAt)}</td>
                <td className="px-4 py-4 last:rounded-r-lg">
                  {interactive ? (
                    <RowActionsMenu
                      label={member.fullName}
                      onView={() => onView?.(member)}
                      onDelete={() => onDelete?.(member)}
                    />
                  ) : (
                    <button
                      type="button"
                      aria-label={`Actions pour ${member.fullName}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  if (!title) return table;

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.08] sm:p-6">
      <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
      <div className="mt-5">{table}</div>
    </section>
  );
};
