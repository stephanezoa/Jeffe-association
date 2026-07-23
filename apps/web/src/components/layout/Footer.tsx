import React from 'react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';
import { SmartLink } from '../ui/SmartLink';
import { FOOTER } from '../../data/landing';

export const Footer: React.FC = () => (
  <footer id="contact" className="bg-ink text-white">
    <div className="container-page grid gap-14 py-16 md:py-20 lg:grid-cols-[1.15fr_0.85fr_0.7fr] lg:gap-12">
      <div>
        <h2 className="max-w-xs font-display text-3xl font-bold leading-tight sm:text-4xl">{FOOTER.title}</h2>
        <p className="mt-4 max-w-sm text-sm text-white/55">{FOOTER.subtitle}</p>
        <div className="mt-7">
          <Button href={FOOTER.cta.href} variant="light">
            {FOOTER.cta.label}
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        <div>
          <h3 className="text-sm font-semibold text-white">{FOOTER.about.title}</h3>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">{FOOTER.about.body}</p>
        </div>

        <nav aria-label="Liens rapides">
          <h3 className="text-sm font-semibold text-white">{FOOTER.quickLinks.title}</h3>
          <ul className="mt-4 space-y-3">
            {FOOTER.quickLinks.links.map((link) => (
              <li key={link.href}>
                <SmartLink href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">{FOOTER.contact.title}</h3>
        <dl className="mt-4 space-y-5 text-sm">
          <div>
            <dt className="text-white/55">{FOOTER.contact.location.label}</dt>
            <dd className="mt-1 text-white/80">{FOOTER.contact.location.value}</dd>
          </div>
          <div>
            <dt className="text-white/55">{FOOTER.contact.email.label}</dt>
            <dd className="mt-1">
              <a
                href={`mailto:${FOOTER.contact.email.value}`}
                className="text-white/80 transition-colors hover:text-brand-300"
              >
                {FOOTER.contact.email.value}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <Logo inverted />
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Excelle Wellth. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
);
