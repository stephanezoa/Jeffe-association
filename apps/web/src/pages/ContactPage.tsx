import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/ui/Section';
import { ContactForm } from '../components/contact/ContactForm';
import { GuideSection } from '../components/landing/GuideSection';
import { CONTACT_DETAILS, CONTACT_PAGE } from '../data/contact';

export default function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader title={CONTACT_PAGE.title} intro={CONTACT_PAGE.intro} decoration="aurora" />

      <Section className="bg-white pb-16 pt-10 sm:pb-24 sm:pt-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <h2 className="max-w-xs font-display text-base font-semibold text-ink">{CONTACT_PAGE.detailsTitle}</h2>

            <dl className="mt-8 space-y-6">
              <ContactDetail icon={<Phone className="h-4 w-4" />} label={CONTACT_DETAILS.phone.label}>
                <a
                  href={`tel:${CONTACT_DETAILS.phone.value.replace(/\s/g, '')}`}
                  className="font-semibold text-ink transition-colors hover:text-brand-600"
                >
                  {CONTACT_DETAILS.phone.value}
                </a>
              </ContactDetail>

              <ContactDetail icon={<Mail className="h-4 w-4" />} label={CONTACT_DETAILS.email.label}>
                <a
                  href={`mailto:${CONTACT_DETAILS.email.value}`}
                  className="font-semibold text-ink transition-colors hover:text-brand-600"
                >
                  {CONTACT_DETAILS.email.value}
                </a>
              </ContactDetail>
            </dl>
          </div>

          <div>
            <h2 className="font-display text-base font-semibold text-ink">{CONTACT_PAGE.formTitle}</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <GuideSection />
    </SiteLayout>
  );
}

interface ContactDetailProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <span
      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink"
      aria-hidden="true"
    >
      {icon}
    </span>
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-0.5 text-sm">{children}</dd>
    </div>
  </div>
);
