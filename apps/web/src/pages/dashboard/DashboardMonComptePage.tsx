import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { PasswordModal } from '../../components/dashboard/PasswordModal';
import { accountApi } from '../../lib/api';
import { formatDateFr, formatDateTimeFr } from '../../lib/date';
import { COMPTE_PAGE, DEMO_ACCOUNT, type AccountProfile } from '../../data/compte';

export default function DashboardMonComptePage() {
  const [profile, setProfile] = useState<AccountProfile>(DEMO_ACCOUNT);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    accountApi
      .me()
      .then((user) => {
        if (cancelled) return;
        // « Ajouté par » n'est pas exposé par l'API ; « dernière connexion » est
        // approximée par la date d'activation du compte.
        setProfile((current) => ({
          ...current,
          lastName: user.lastName ?? current.lastName,
          firstName: user.firstName ?? current.firstName,
          email: user.email ?? current.email,
          phone: user.phone ?? current.phone,
          createdAt: user.createdAt ?? current.createdAt,
          lastLogin: user.activatedAt ?? current.lastLogin,
        }));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const rows: { label: string; value: string }[] = [
    { label: COMPTE_PAGE.fields.lastName, value: profile.lastName },
    { label: COMPTE_PAGE.fields.firstName, value: profile.firstName },
    { label: COMPTE_PAGE.fields.email, value: profile.email },
    { label: COMPTE_PAGE.fields.phone, value: profile.phone ?? '—' },
    { label: COMPTE_PAGE.fields.addedBy, value: profile.addedBy },
    { label: COMPTE_PAGE.fields.createdAt, value: formatDateFr(profile.createdAt) },
    {
      label: COMPTE_PAGE.fields.lastLogin,
      value: profile.lastLogin ? formatDateTimeFr(profile.lastLogin) : '—',
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={COMPTE_PAGE.title}
        subtitle={COMPTE_PAGE.subtitle}
        action={{ label: COMPTE_PAGE.editAction, to: '/dashboard/mon-compte/modifier' }}
      />

      <section className="max-w-2xl rounded-2xl bg-white p-6 ring-1 ring-black/[0.08]">
        <dl className="divide-y divide-black/[0.06]">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-4 py-3.5">
              <dt className="text-sm text-ink-faint">{row.label}</dt>
              <dd className="text-sm font-medium text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setPasswordOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            {COMPTE_PAGE.changePassword}
          </button>
          <Link
            to="/dashboard/mon-compte/modifier"
            className="inline-flex items-center rounded-md bg-accent-blueDark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2"
          >
            {COMPTE_PAGE.editAction}
          </Link>
        </div>
      </section>

      {passwordOpen && <PasswordModal onClose={() => setPasswordOpen(false)} />}
    </div>
  );
}
