import React, { useEffect } from 'react';
import { cn } from '../../lib/cn';

interface ModalProps {
  title: string;
  subtitle?: string;
  /** `info` : bandeau bleu clair. `danger` : bandeau rouge (suppression). */
  tone?: 'info' | 'danger';
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const HEADERS = {
  info: 'bg-[#EAF3FD]',
  danger: 'bg-gradient-to-b from-[#C0392B] to-[#B02F22]',
};

export const Modal: React.FC<ModalProps> = ({ title, subtitle, tone = 'info', onClose, children, footer }) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-card"
      >
        <div className={cn('px-6 py-5', HEADERS[tone])}>
          <h2
            className={cn(
              'font-display text-lg font-bold',
              tone === 'danger' ? 'text-white' : 'text-accent-blueDark',
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p className={cn('mt-0.5 text-sm', tone === 'danger' ? 'text-white/85' : 'text-ink-muted')}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="px-6 py-5">{children}</div>

        <div className="flex flex-wrap justify-end gap-3 px-6 pb-6">{footer}</div>
      </div>
    </div>
  );
};
