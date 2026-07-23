import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { AJOUT_MEMBRE_PAGE, PARRAINAGE_PAGE } from '../../data/parrainage';

interface FormValues {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { lastName: '', firstName: '', email: '', phone: '' };

const FIELD_CLASS =
  'w-full rounded-md bg-[#F5F8FD] px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint ' +
  'ring-1 ring-inset ring-black/[0.06] transition focus:outline-none focus:ring-2 focus:ring-accent-blue/50';

export default function DashboardParrainageAjouterPage() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);

  const update = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const messages = AJOUT_MEMBRE_PAGE.errors;
    if (values.lastName.trim().length < 2) nextErrors.lastName = messages.lastName;
    if (values.firstName.trim().length < 2) nextErrors.firstName = messages.firstName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) nextErrors.email = messages.email;
    if (values.phone.trim() && !/^[+\d][\d\s().-]{5,19}$/.test(values.phone.trim())) nextErrors.phone = messages.phone;

    setErrors(nextErrors);
    setFeedback(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    try {
      // L'API crée une invitation : le filleul renseignera lui-même son identité
      // à l'inscription, seuls l'email et le téléphone sont transmis.
      await axios.post(AJOUT_MEMBRE_PAGE.endpoint, {
        targetEmail: values.email.trim(),
        targetPhone: values.phone.trim() || undefined,
      });
      setFeedback({ tone: 'success', message: AJOUT_MEMBRE_PAGE.success });
      setValues(EMPTY);
    } catch (err: any) {
      setFeedback({
        tone: 'error',
        message: err.response?.data?.error?.message || AJOUT_MEMBRE_PAGE.error,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-accent-blueDark sm:text-4xl">
            {AJOUT_MEMBRE_PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{AJOUT_MEMBRE_PAGE.subtitle}</p>
        </div>

        <Link
          to="/dashboard/parrainage/ajouter"
          className="inline-flex items-center gap-2 rounded-md bg-accent-blueDark px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2"
        >
          {PARRAINAGE_PAGE.add}
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-5xl">
        <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2">
          <Field
            id="membre-nom"
            label={AJOUT_MEMBRE_PAGE.fields.lastName.label}
            placeholder={AJOUT_MEMBRE_PAGE.fields.lastName.placeholder}
            value={values.lastName}
            onChange={update('lastName')}
            error={errors.lastName}
            autoComplete="family-name"
          />
          <Field
            id="membre-prenom"
            label={AJOUT_MEMBRE_PAGE.fields.firstName.label}
            placeholder={AJOUT_MEMBRE_PAGE.fields.firstName.placeholder}
            value={values.firstName}
            onChange={update('firstName')}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Field
            id="membre-email"
            type="email"
            label={AJOUT_MEMBRE_PAGE.fields.email.label}
            placeholder={AJOUT_MEMBRE_PAGE.fields.email.placeholder}
            value={values.email}
            onChange={update('email')}
            error={errors.email}
            autoComplete="email"
          />
          <Field
            id="membre-telephone"
            type="tel"
            label={AJOUT_MEMBRE_PAGE.fields.phone.label}
            placeholder={AJOUT_MEMBRE_PAGE.fields.phone.placeholder}
            value={values.phone}
            onChange={update('phone')}
            error={errors.phone}
            autoComplete="tel"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={sending}
            className="rounded-md bg-accent-blueDark px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? AJOUT_MEMBRE_PAGE.submitting : AJOUT_MEMBRE_PAGE.submit}
          </button>

          {feedback && (
            <p
              role="status"
              className={cn('text-sm', feedback.tone === 'success' ? 'text-brand-600' : 'text-red-600')}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}

const Field: React.FC<FieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
}) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={FIELD_CLASS}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
        {error}
      </p>
    )}
  </div>
);
