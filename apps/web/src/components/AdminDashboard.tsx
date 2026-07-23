import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Stats {
  totalMembers: number;
  activeMembers: number;
  suspendedMembers: number;
  pendingModerations: number;
  newsletterSubscribers: number;
  totalEvents: number;
  totalCourses: number;
}

interface ModerationItem {
  id: string;
  entity_type: string;
  entity_id: string;
  status: string;
  author_first_name: string;
  author_last_name: string;
  author_email: string;
  created_at: string;
}

interface MemberItem {
  id: string;
  matricule: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  tree_depth: number;
  created_at: string;
}

interface AuditLogItem {
  id: string;
  actor_id: string;
  actor_ip: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'moderation' | 'members' | 'rbac' | 'newsletter' | 'audit'>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [grantMemberId, setGrantMemberId] = useState('');
  const [permissionKey, setPermissionKey] = useState('articles.approve');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'moderation') fetchModerationQueue();
    if (activeTab === 'members') fetchMembers();
    if (activeTab === 'audit') fetchAuditLogs();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/v1/admin/dashboard/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModerationQueue = async () => {
    try {
      const res = await axios.get('/api/v1/admin/moderation/queue');
      setModerationQueue(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/v1/admin/members');
      setMembers(res.data.data.members || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await axios.get('/api/v1/admin/audit-logs');
      setAuditLogs(res.data.data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewModeration = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await axios.post(`/api/v1/admin/moderation/${id}/review`, { status, comment: `Action effectuée depuis le Back-office` });
      setMsg(`Élément ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès!`);
      fetchModerationQueue();
      fetchStats();
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Erreur lors de la modération');
    }
  };

  const handleToggleMemberStatus = async (memberId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await axios.post('/api/v1/admin/members/status', { memberId, status: newStatus });
      setMsg(`Membre passé à l'état : ${newStatus}`);
      fetchMembers();
      fetchStats();
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleGrantPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/admin/permissions/grant', { memberId: grantMemberId, permissionKey });
      setMsg(`Permission ${permissionKey} accordée avec succès au membre ${grantMemberId}`);
      setGrantMemberId('');
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Erreur lors de l\'attribution de la permission');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/newsletter/campaigns', { subject: campaignSubject, content: campaignContent });
      setMsg('Campagne créée dans le système Newsletter!');
      setCampaignSubject('');
      setCampaignContent('');
    } catch (err: any) {
      setMsg(err.response?.data?.error?.message || 'Erreur lors de la création');
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#c084fc', fontSize: '1.8rem', marginBottom: '1rem' }}>
        Back-Office & Administration VESTIGE
      </h1>

      {msg && <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>{msg}</div>}

      {/* Navigation des Onglets Administrateur */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'stats', label: 'Vue d\'ensemble' },
          { id: 'moderation', label: 'File de Modération' },
          { id: 'members', label: 'Gestion des Membres' },
          { id: 'rbac', label: 'Habilitations & Rôles' },
          { id: 'newsletter', label: 'Newsletter & Campagnes' },
          { id: 'audit', label: 'Journal d\'Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? '#c084fc' : '#1e293b',
              color: activeTab === tab.id ? '#0f172a' : '#f8fafc',
              padding: '0.6rem 1.2rem',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Métriques Vue d'ensemble */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8' }}>Membres Totaux</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc' }}>{stats?.totalMembers || 0}</div>
          </div>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8' }}>Membres Actifs</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>{stats?.activeMembers || 0}</div>
          </div>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8' }}>Membres Suspendus</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f87171' }}>{stats?.suspendedMembers || 0}</div>
          </div>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8' }}>Abonnés Newsletter</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c084fc' }}>{stats?.newsletterSubscribers || 0}</div>
          </div>
        </div>
      )}

      {/* 2. File de Modération */}
      {activeTab === 'moderation' && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>File d'attente de modération transversale</h3>
          {moderationQueue.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>Aucune demande de modération en attente.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {moderationQueue.map((item) => (
                <div key={item.id} style={{ background: '#0f172a', padding: '1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#38bdf8' }}>{item.entity_type.toUpperCase()}</strong> — Auteur: {item.author_first_name} {item.author_last_name} ({item.author_email})
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Soumis le: {new Date(item.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleReviewModeration(item.id, 'approved')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Approuver
                    </button>
                    <button onClick={() => handleReviewModeration(item.id, 'rejected')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Gestion des Membres */}
      {activeTab === 'members' && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Gestion du Répertoire des Membres</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {members.map((m) => (
              <div key={m.id} style={{ background: '#0f172a', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#f8fafc' }}>{m.first_name} {m.last_name}</strong> ({m.matricule}) — {m.email}
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Génération: {m.tree_depth} • Statut: <span style={{ color: m.status === 'active' ? '#4ade80' : '#f87171' }}>{m.status}</span></div>
                </div>
                <button
                  onClick={() => handleToggleMemberStatus(m.id, m.status)}
                  style={{ background: m.status === 'active' ? '#ef4444' : '#22c55e', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {m.status === 'active' ? 'Suspendre' : 'Réactiver'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Habilitations RBAC */}
      {activeTab === 'rbac' && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Attribution des Habilitations Granulaires</h3>
          <form onSubmit={handleGrantPermission}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>ID du membre administrateur</label>
              <input
                type="text"
                value={grantMemberId}
                onChange={(e) => setGrantMemberId(e.target.value)}
                placeholder="UUID du membre"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Permission à accorder</label>
              <select
                value={permissionKey}
                onChange={(e) => setPermissionKey(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              >
                <option value="articles.approve">articles.approve (Approuver articles)</option>
                <option value="events.approve">events.approve (Approuver événements)</option>
                <option value="courses.approve">courses.approve (Approuver formations)</option>
                <option value="cms.edit">cms.edit (Modifier textes CMS)</option>
                <option value="members.manage">members.manage (Gérer membres)</option>
                <option value="newsletter.manage">newsletter.manage (Gérer newsletter)</option>
              </select>
            </div>
            <button type="submit" style={{ background: '#c084fc', color: '#0f172a', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Accorder la Habilitation
            </button>
          </form>
        </div>
      )}

      {/* 5. Newsletter */}
      {activeTab === 'newsletter' && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Créateur de Campagne Newsletter</h3>
          <form onSubmit={handleCreateCampaign}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Sujet de l'email</label>
              <input
                type="text"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="Ex: Nouveaux cours et événements Vestige"
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Contenu du message</label>
              <textarea
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
                rows={5}
                placeholder="Rédigez le contenu de la newsletter..."
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <button type="submit" style={{ background: '#0284c7', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
              Créer la Campagne
            </button>
          </form>
        </div>
      )}

      {/* 6. Journal d'Audit */}
      {activeTab === 'audit' && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '1rem' }}>Journal d'Audit Métier (`audit_logs`)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {auditLogs.map((log) => (
              <div key={log.id} style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>[{log.action}]</span> — Acteur: {log.actor_id} (IP: {log.actor_ip})
                <div style={{ color: '#64748b' }}>Entité: {log.entity_type} ({log.entity_id}) • Date: {new Date(log.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
