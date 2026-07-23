import React, { useState } from 'react';
import axios from 'axios';
import { cn } from '../../lib/cn';
import { CONTACT_FORM_LABELS, CONTACT_MESSAGES, CONTACT_PAGE } from '../../data/contact';

interface FormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;
type Status = 'idle' | 'sending' | 'success' | 'error';

const EMPTY: FormValues = { name: '', email: '', phone: '', subject: '', message: '' };

const FIELD_CLASS =
  'w-full rounded-md bg-[#F5F8FD] px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint ' +
  'ring-1 ring-inset ring-black/[0.04] transition focus:outline-none focus:ring-2 focus:ring-accent-blue/50';

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const { errors: messages } = CONTACT_MESSAGES;

  if (values.name.trim().length < 2) errors.name = messages.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = messages.email;
  if (values.phone.trim() && !/^[+\d][\d\s().-]{5,19}$/.test(values.phone.trim())) errors.phone = messages.phone;
  if (values.subject.trim().length < 3) errors.subject = messages.subject;
  if (values.message.trim().length < 10) errors.message = messages.message;

  return errors;
}

export const ContactForm: React.FC = () => {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');

  const update = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle');
      setFeedback('');
      return;
    }

    setStatus('sending');
    setFeedback('');

    try {
      await axios.post(CONTACT_PAGE.endpoint, {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setStatus('success');
      setFeedback(CONTACT_MESSAGES.success);
      setValues(EMPTY);
    } catch (err: any) {
      setStatus('error');
      setFeedback(err.response?.data?.error?.message || CONTACT_MESSAGES.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label={CONTACT_FORM_LABELS.name.label} error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={CONTACT_FORM_LABELS.name.placeholder}
            value={values.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={FIELD_CLASS}
          />
        </Field>

        <Field id="contact-email" label={CONTACT_FORM_LABELS.email.label} error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={CONTACT_FORM_LABELS.email.placeholder}
            value={values.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      <div className="sm:w-1/2 sm:pr-2">
        <Field id="contact-phone" label={CONTACT_FORM_LABELS.phone.label} error={errors.phone}>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={CONTACT_FORM_LABELS.phone.placeholder}
            value={values.phone}
            onChange={update('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      <Field id="contact-subject" label={CONTACT_FORM_LABELS.subject.label} error={errors.subject}>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder={CONTACT_FORM_LABELS.subject.placeholder}
          value={values.subject}
          onChange={update('subject')}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          className={FIELD_CLASS}
        />
      </Field>

      <Field id="contact-message" label={CONTACT_FORM_LABELS.message.label} error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder={CONTACT_FORM_LABELS.message.placeholder}
          value={values.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={cn(FIELD_CLASS, 'resize-y')}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? CONTACT_FORM_LABELS.submitting : CONTACT_FORM_LABELS.submit}
        </button>

        {feedback && (
          <p
            role="status"
            className={cn('text-sm', status === 'success' ? 'text-brand-600' : 'text-red-600')}
          >
            {feedback}
          </p>
        )}
      </div>
    </form>
  );
};

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-ink">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
        {error}
      </p>
    )}
  </div>
);
