import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface SiteLayoutProps {
  children: React.ReactNode;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-white">
    <a
      href="#contenu"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
    >
      Aller au contenu
    </a>
    <Navbar />
    <main id="contenu" className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);
