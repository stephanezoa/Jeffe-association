import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MemberNode {
  id: string;
  matricule?: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  sponsorId: string | null;
  treePath: string;
  treeDepth: number;
  createdAt: string;
}

export const SponsorshipTree: React.FC = () => {
  const [nodes, setNodes] = useState<MemberNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [depth, setDepth] = useState<number>(10);
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteResult, setInviteResult] = useState('');

  useEffect(() => {
    fetchTree();
  }, [depth]);

  const fetchTree = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/sponsorship/tree?depth=${depth}`);
      setNodes(res.data.data.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/sponsorship/invitations', { targetEmail: inviteEmail });
      setInviteResult(`Lien généré : ${window.location.origin}${res.data.data.inviteUrl}`);
      setInviteEmail('');
    } catch (err: any) {
      setInviteResult(err.response?.data?.error?.message || 'Erreur lors de la génération');
    }
  };

  const filteredNodes = nodes.filter(n =>
    !search ||
    `${n.firstName} ${n.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    n.email.toLowerCase().includes(search.toLowerCase()) ||
    (n.matricule && n.matricule.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>Arbre Généalogique du Réseau (Parrainage)</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Profondeur de génération :</label>
          <select
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
          >
            <option value={2}>2 Générations</option>
            <option value={5}>5 Générations</option>
            <option value={10}>10 Générations</option>
            <option value={15}>15 Générations</option>
            <option value={20}>20 Générations</option>
            <option value={50}>50 Générations (Toutes)</option>
          </select>
        </div>
      </div>

      {/* Formulaire de Parrainage (Invitation) */}
      <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
        <h4 style={{ color: '#f8fafc', margin: '0 0 0.5rem 0' }}>Générer un lien d'invitation filleul</h4>
        {inviteResult && <p style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{inviteResult}</p>}
        <form onSubmit={handleGenerateInvite} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="Email du futur filleul (optionnel)"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
          />
          <button
            type="submit"
            style={{ background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Créer l'Invitation
          </button>
        </form>
      </div>

      {/* Barre de Recherche dans le réseau */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Rechercher par nom, email ou matricule dans votre descendance..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
        />
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Chargement de la descendance sur {depth} générations...</p>
      ) : filteredNodes.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Aucun membre trouvé dans votre réseau pour ces critères.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredNodes.map((node) => (
            <div
              key={node.id}
              style={{
                marginLeft: `${Math.min(node.treeDepth, 10) * 16}px`,
                background: '#1e293b',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                borderLeft: `4px solid ${node.treeDepth === 0 ? '#c084fc' : node.treeDepth === 1 ? '#38bdf8' : '#4ade80'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '1rem' }}>
                    {node.firstName} {node.lastName}
                  </span>
                  {node.matricule && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#cbd5e1' }}>
                      {node.matricule}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>
                  Génération {node.treeDepth}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Email: {node.email} • Statut: <strong style={{ color: node.status === 'active' ? '#4ade80' : '#f87171' }}>{node.status}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
