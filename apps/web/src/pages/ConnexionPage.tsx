import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Section } from '../components/ui/Section';
import { SmartLink } from '../components/ui/SmartLink';
import { saveSession } from '../lib/auth';
import { cn } from '../lib/cn';
import { CONNEXION_PAGE } from '../data/connexion';

type Errors = { email?: string; password?: string };

const FIELD_CLASS =
  'w-full rounded-md bg-[#F5F8FD] px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint ' +
  'ring-1 ring-inset ring-black/[0.04] transition focus:outline-none focus:ring-2 focus:ring-accent-blue/50';

export default function ConnexionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) nextErrors.email = CONNEXION_PAGE.errors.email;
    if (!password) nextErrors.password = CONNEXION_PAGE.errors.password;

    setErrors(nextErrors);
    setFailure('');
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    try {
      const res = await axios.post(CONNEXION_PAGE.endpoint, { email: email.trim(), password });
      saveSession(res.data.data.accessToken, remember);
      navigate(CONNEXION_PAGE.redirectTo);
    } catch (err: any) {
      setFailure(err.response?.data?.error?.message || CONNEXION_PAGE.errors.failed);
      setSending(false);
    }
  };

  return (
    <SiteLayout>
      <Section className="bg-white py-20 sm:py-28">
        <h1 className="text-center font-display text-display font-bold text-ink">{CONNEXION_PAGE.title}</h1>

        <form onSubmit={handleSubmit} noValidate className="mx-auto mt-12 w-full max-w-sm space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-ink">
              {CONNEXION_PAGE.email.label}
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={CONNEXION_PAGE.email.placeholder}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: undefined }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              className={FIELD_CLASS}
            />
            {errors.email && (
              <p id="login-email-error" className="mt-1.5 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-ink">
              {CONNEXION_PAGE.password.label}
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={revealed ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder={CONNEXION_PAGE.password.placeholder}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((current) => ({ ...current, password: undefined }));
                }}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                className={cn(FIELD_CLASS, 'pr-11')}
              />
              <button
                type="button"
                onClick={() => setRevealed((current) => !current)}
                aria-label={revealed ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50"
              >
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" className="mt-1.5 text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-ink-faint/50 text-accent-blue focus:ring-accent-blue/50"
            />
            {CONNEXION_PAGE.remember}
          </label>

          {failure && (
            <p role="alert" className="text-sm text-red-600">
              {failure}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-md bg-accent-blueDark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? CONNEXION_PAGE.submitting : CONNEXION_PAGE.submit}
          </button>

          <p className="text-right">
            <SmartLink
              href={CONNEXION_PAGE.forgotten.href}
              className="text-sm text-accent-blue underline-offset-4 hover:underline"
            >
              {CONNEXION_PAGE.forgotten.label}
            </SmartLink>
          </p>
        </form>
      </Section>
    </SiteLayout>
  );
}
