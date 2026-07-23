import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';
import { SponsorshipTree } from '../components/SponsorshipTree';
import { NewsletterForm } from '../components/NewsletterForm';

type Tab = 'newsletter' | 'network' | 'admin';

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'network', label: 'Mon Réseau (Parrainage)', color: '#38bdf8' },
  { id: 'admin', label: 'Back-Office Admin', color: '#c084fc' },
  { id: 'newsletter', label: 'Newsletter', color: '#4ade80' },
];

/** Espace membre / back-office VESTIGE (interface de travail, hors maquette publique). */
export default function EspacePage() {
  const [currentTab, setCurrentTab] = useState<Tab>('network');

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid #334155',
            paddingBottom: '1rem',
            marginBottom: '2rem',
          }}
        >
          <h1 style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>VESTIGE</h1>
          <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                style={{
                  background: currentTab === tab.id ? tab.color : 'transparent',
                  color: currentTab === tab.id ? '#0f172a' : '#f8fafc',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {tab.label}
              </button>
            ))}
            <Link
              to="/"
              style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none', paddingLeft: '0.5rem' }}
            >
              ← Site public
            </Link>
          </nav>
        </header>

        <main>
          {currentTab === 'newsletter' && <NewsletterForm />}
          {currentTab === 'network' && <SponsorshipTree />}
          {currentTab === 'admin' && <AdminDashboard />}
        </main>
      </div>
    </div>
  );
}
