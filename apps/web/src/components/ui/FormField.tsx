import React from 'react';
import { cn } from '../../lib/cn';

export const FIELD_CLASS =
  'w-full rounded-md bg-[#F5F8FD] px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint ' +
  'ring-1 ring-inset ring-black/[0.06] transition focus:outline-none focus:ring-2 focus:ring-accent-blue/50';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/** Enveloppe label + contrôle + message d'erreur, câblée pour l'accessibilité. */
export const Field: React.FC<FieldProps> = ({ id, label, error, className, children }) => (
  <div className={className}>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
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

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  wrapperClassName?: string;
}

/** Champ texte prêt à l'emploi (le cas le plus courant). */
export const TextField: React.FC<TextFieldProps> = ({ id, label, error, wrapperClassName, ...rest }) => (
  <Field id={id} label={label} error={error} className={wrapperClassName}>
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={FIELD_CLASS}
      {...rest}
    />
  </Field>
);

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  wrapperClassName?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  label,
  error,
  wrapperClassName,
  className,
  ...rest
}) => (
  <Field id={id} label={label} error={error} className={wrapperClassName}>
    <textarea
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(FIELD_CLASS, 'resize-y', className)}
      {...rest}
    />
  </Field>
);
