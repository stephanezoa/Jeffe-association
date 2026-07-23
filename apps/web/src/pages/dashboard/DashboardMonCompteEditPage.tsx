import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardPageHeader } from '../../components/dashboard/DashboardPageHeader';
import { TextField } from '../../components/ui/FormField';
import { accountApi } from '../../lib/api';
import { COMPTE_EDIT, DEMO_ACCOUNT } from '../../data/compte';

interface FormValues {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
}

type Errors = Partial<Record<keyof FormValues, string>>;

export default function DashboardMonCompteEditPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    lastName: DEMO_ACCOUNT.lastName,
    firstName: DEMO_ACCOUNT.firstName,
    email: DEMO_ACCOUNT.email,
    phone: DEMO_ACCOUNT.phone ?? '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    accountApi
      .me()
      .then((user) => {
        if (cancelled) return;
        setValues((current) => ({
          ...current,
          lastName: user.lastName ?? current.lastName,
          firstName: user.firstName ?? current.firstName,
          email: user.email ?? current.email,
          phone: user.phone ?? current.phone,
        }));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const next: Errors = {};
    const messages = COMPTE_EDIT.errors;
    if (values.lastName.trim().length < 2) next.lastName = messages.lastName;
    if (values.firstName.trim().length < 2) next.firstName = messages.firstName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = messages.email;
    if (values.phone.trim() && !/^[+\d][\d\s().-]{5,19}$/.test(values.phone.trim())) next.phone = messages.phone;
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setNotice('');
      return;
    }

    setSaving(true);
    setNotice('');
    try {
      await accountApi.updateProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      });
      navigate('/dashboard/mon-compte');
    } catch (err: any) {
      setNotice(err.response?.data?.error?.message || COMPTE_EDIT.unavailable);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader title={COMPTE_EDIT.title} subtitle={COMPTE_EDIT.subtitle} />

      <form onSubmit={(event) => event.preventDefault()} noValidate className="max-w-3xl">
        <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2">
          <TextField
            id="compte-nom"
            label={COMPTE_EDIT.fields.lastName.label}
            placeholder={COMPTE_EDIT.fields.lastName.placeholder}
            value={values.lastName}
            onChange={update('lastName')}
            error={errors.lastName}
            autoComplete="family-name"
          />
          <TextField
            id="compte-prenom"
            label={COMPTE_EDIT.fields.firstName.label}
            placeholder={COMPTE_EDIT.fields.firstName.placeholder}
            value={values.firstName}
            onChange={update('firstName')}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <TextField
            id="compte-email"
            type="email"
            label={COMPTE_EDIT.fields.email.label}
            placeholder={COMPTE_EDIT.fields.email.placeholder}
            value={values.email}
            onChange={update('email')}
            error={errors.email}
            autoComplete="email"
          />
          <TextField
            id="compte-telephone"
            type="tel"
            label={COMPTE_EDIT.fields.phone.label}
            placeholder={COMPTE_EDIT.fields.phone.placeholder}
            value={values.phone}
            onChange={update('phone')}
            error={errors.phone}
            autoComplete="tel"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-md bg-accent-blueDark px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : COMPTE_EDIT.submit}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/mon-compte')}
            className="rounded-md bg-white px-5 py-2.5 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            {COMPTE_EDIT.cancel}
          </button>
          {notice && (
            <p role="status" className="text-sm text-amber-700">
              {notice}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
