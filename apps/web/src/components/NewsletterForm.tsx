import React, { useState } from 'react';
import axios from 'axios';

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('/api/v1/newsletter/subscribe', { email });
      setMessage(res.data.data.message);
      setEmail('');
    } catch (err: any) {
      setMessage(err.response?.data?.error?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', maxWidth: '500px', margin: '1rem 0' }}>
      <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>Restez informé avec la Newsletter Vestige</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Inscrivez-vous pour recevoir les dernières opportunités, événements et formations.
      </p>
      {message && <p style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          required
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ background: '#38bdf8', color: '#0f172a', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'S\'abonner...' : 'S\'abonner'}
        </button>
      </form>
    </div>
  );
};
