import React, { useState } from 'react';
import { Modal } from './Modal';
import { FIELD_CLASS } from '../ui/FormField';
import { accountApi } from '../../lib/api';
import { PASSWORD_MODAL } from '../../data/compte';

interface PasswordModalProps {
  onClose: () => void;
}

interface Errors {
  current?: string;
  next?: string;
  confirm?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ onClose }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const nextErrors: Errors = {};
    const messages = PASSWORD_MODAL.errors;
    if (!current) nextErrors.current = messages.current;
    if (next.length < 8) nextErrors.next = messages.next;
    if (confirm !== next) nextErrors.confirm = messages.confirm;
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice(null);
      return;
    }

    setSaving(true);
    setNotice(null);
    try {
      const result = await accountApi.changePassword(current, next);
      setNotice({ tone: 'success', message: result.message });
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err: any) {
      setNotice({ tone: 'error', message: err.response?.data?.error?.message || PASSWORD_MODAL.unavailable });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={PASSWORD_MODAL.title}
      subtitle={PASSWORD_MODAL.subtitle}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-md bg-accent-blueDark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#16306F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blueDark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : PASSWORD_MODAL.submit}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-white px-4 py-2 text-sm text-ink ring-1 ring-inset ring-black/[0.12] transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            {PASSWORD_MODAL.cancel}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <PasswordField
          id="pwd-current"
          label={PASSWORD_MODAL.fields.current.label}
          value={current}
          onChange={(value) => {
            setCurrent(value);
            setErrors((c) => ({ ...c, current: undefined }));
          }}
          autoComplete="current-password"
          error={errors.current}
        />
        <PasswordField
          id="pwd-next"
          label={PASSWORD_MODAL.fields.next.label}
          value={next}
          onChange={(value) => {
            setNext(value);
            setErrors((c) => ({ ...c, next: undefined }));
          }}
          autoComplete="new-password"
          error={errors.next}
        />
        <PasswordField
          id="pwd-confirm"
          label={PASSWORD_MODAL.fields.confirm.label}
          value={confirm}
          onChange={(value) => {
            setConfirm(value);
            setErrors((c) => ({ ...c, confirm: undefined }));
          }}
          autoComplete="new-password"
          error={errors.confirm}
        />
        {notice && (
          <p role="status" className={notice.tone === 'success' ? 'text-sm text-brand-600' : 'text-sm text-red-600'}>
            {notice.message}
          </p>
        )}
      </div>
    </Modal>
  );
};

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ id, label, value, onChange, autoComplete, error }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
      {label}
    </label>
    <input
      id={id}
      type="password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      placeholder="••••••••••"
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
