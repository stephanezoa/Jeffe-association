import React from 'react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Hero } from '../components/landing/Hero';
import { MissionSection } from '../components/landing/MissionSection';
import { FormationsSection } from '../components/landing/FormationsSection';
import { EntrepriseSection } from '../components/landing/EntrepriseSection';
import { GuideSection } from '../components/landing/GuideSection';

export default function LandingPage() {
  return (
    <SiteLayout>
      <Hero />
      <MissionSection />
      <FormationsSection />
      <EntrepriseSection />
      <GuideSection />
    </SiteLayout>
  );
}
