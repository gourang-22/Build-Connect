import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getMyTeam,
  getAllTeams,
  createTeam,
  requestJoinTeam,
  resolveJoinRequest,
  removeMember,
  leaveTeam,
} from '../../utils/api';

const TeamManagement = () => {
  const { user, refreshUser } = useAuth();
  const [team, setTeam] = useState(null);
  const [allTeams, setAllTeams] = useState([]);
  const [activeView, setActiveView] = useState('my-team'); // 'my-team' | 'explore'

  // Loading & Feedback
  const [loading, setLoading] = useState(true);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Explore Filter
  const [searchCity, setSearchCity] = useState(user?.location?.city || '');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Create Form State
  const [createData, setCreateData] = useState({
    name: '',
    description: '',
    maxSize: 10,
    city: user?.location?.city || '',
  });
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch Worker's Current Team
  const fetchTeam = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyTeam();
      setTeam(res.data?.team || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch All Teams for Explore Feed
  const fetchExploreTeams = useCallback(async (cityParam = searchCity) => {
    setExploreLoading(true);
    try {
      const params = {};
      if (cityParam && cityParam.trim()) params.city = cityParam.trim();
      if (searchKeyword && searchKeyword.trim()) params.search = searchKeyword.trim();

      const res = await getAllTeams(params);
      setAllTeams(res.data?.teams || []);
    } catch (err) {
      console.error('Failed to load explore teams:', err);
    } finally {
      setExploreLoading(false);
    }
  }, [searchCity, searchKeyword]);

  useEffect(() => {
    fetchTeam();
    fetchExploreTeams();
  }, [fetchTeam, fetchExploreTeams]);

  // Create Team Handler
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCreating(true);

    try {
      const res = await createTeam({
        name: createData.name,
        description: createData.description,
        maxSize: Number(createData.maxSize) || 10,
        location: { city: createData.city },
      });
      setTeam(res.data.team);
      setSuccess('Team created successfully! Your profile is now designated as Team Leader.');
      setShowCreateForm(false);
      await refreshUser();
      await fetchExploreTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team. Try again.');
    } finally {
      setCreating(false);
    }
  };

  // Request to Join Team Handler
  const handleRequestJoin = async (targetTeamId, teamName) => {
    setActionLoadingId(targetTeamId);
    setError(null);
    setSuccess(null);
    try {
      await requestJoinTeam(targetTeamId);
      setSuccess(`Join request sent to ${teamName}! The Team Leader will review your application.`);
      setTimeout(() => setSuccess(null), 4000);
      await fetchExploreTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send join request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Team Leader resolves incoming join request (Accept or Decline)
  const handleResolveRequest = async (workerId, action, workerName) => {
    if (!team?._id) return;
    setActionLoadingId(workerId);
    setError(null);
    setSuccess(null);
    try {
      const res = await resolveJoinRequest(team._id, { workerId, action });
      setTeam(res.data.team);
      setSuccess(
        action === 'accept'
          ? `✓ ${workerName} has been accepted into your team roster!`
          : `Join request from ${workerName} was declined.`
      );
      setTimeout(() => setSuccess(null), 4000);
      await fetchExploreTeams();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} request.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Remove Member Handler (Leader only)
  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }
    setActionLoadingId(memberId);
    setError(null);
    try {
      await removeMember(team._id, memberId);
      setSuccess(`Removed ${memberName} from team.`);
      setTimeout(() => setSuccess(null), 3000);
      await fetchTeam();
      await fetchExploreTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Leave Team Handler (Member only)
  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
    setActionLoadingId('leave');
    setError(null);
    try {
      await leaveTeam(team._id);
      setTeam(null);
      setSuccess('You have left the team.');
      await refreshUser();
      await fetchExploreTeams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave team.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const isLeader = team && team.leaderId?._id === user?._id;
  const pendingRequests = team?.pendingRequests || [];

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner Navigation & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Workforce Squads & Teams
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Band together with fellow tradesmen, bid on high-headcount tenders, and manage member rosters.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 4, gap: 4 }}>
          <button
            type="button"
            className={`btn ${activeView === 'my-team' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setActiveView('my-team')}
          >
            👥 My Squad {team && `(${team.name})`}
          </button>
          <button
            type="button"
            className={`btn ${activeView === 'explore' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => {
              setActiveView('explore');
              fetchExploreTeams();
            }}
          >
            🔍 Explore Squads
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW A: MY TEAM VIEW                                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeView === 'my-team' && (
        <>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
              <div className="spinner" />
              <p style={{ color: 'var(--text-muted)' }}>Retrieving your squad data...</p>
            </div>
          ) : team ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Team Overview Card */}
              <section
                style={{
                  background: 'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(21,30,53,0.95))',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                  <div style={{ maxWidth: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                        Active Civil Squad
                      </span>
                      {isLeader && (
                        <span style={{ background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                          ★ You are Squad Leader
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{team.name}</h2>
                    <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {team.description || 'Specialized multi-trade labor crew.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 18px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Roster</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                        {(team.workerIds?.length || 0) + 1} / {team.maxSize}
                      </div>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 18px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Base City</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', marginTop: 2 }}>
                        📍 {team.location?.city || 'Local Area'}
                      </div>
                    </div>
                  </div>
                </div>

                {team.tradeCategories && team.tradeCategories.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      Represented Trades:
                    </span>
                    {team.tradeCategories.map((trade, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'rgba(59,130,246,0.15)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59,130,246,0.3)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        🔨 {trade}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* ── SECTION: Team Leader Incoming Join Requests ── */}
              {isLeader && (
                <section
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 24,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>📬</span> Incoming Join Requests ({pendingRequests.length})
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Workers applying to join your squad roster
                    </span>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <div style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      ✓ No pending join requests. Other workers can find and apply to your squad from the Explore feed.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                      {pendingRequests.map((applicant) => (
                        <div
                          key={applicant._id}
                          style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                flexShrink: 0,
                                overflow: 'hidden',
                              }}
                            >
                              {applicant.profileImage?.url ? (
                                <img
                                  src={applicant.profileImage.url}
                                  alt={applicant.name}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <span>{applicant.name?.[0] || 'W'}</span>
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{applicant.name}</div>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
                                <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                                  {applicant.tradeCategory}
                                </span>
                                <span style={{ fontSize: '0.78rem', color: 'var(--warning)', fontWeight: 600 }}>
                                  ⭐ {applicant.rating?.average || 5.0}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {applicant.dailyWageExpectation && (
                              <div>Wage: <strong style={{ color: 'var(--text-primary)' }}>₹{applicant.dailyWageExpectation}/day</strong></div>
                            )}
                            {applicant.phone && <div>Phone: {applicant.phone}</div>}
                            {applicant.skills && applicant.skills.length > 0 && (
                              <div>Skills: {applicant.skills.join(', ')}</div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                            <button
                              type="button"
                              disabled={actionLoadingId === applicant._id}
                              onClick={() => handleResolveRequest(applicant._id, 'accept', applicant.name)}
                              className="btn btn-primary btn-sm"
                              style={{ flex: 1 }}
                            >
                              {actionLoadingId === applicant._id ? 'Processing...' : '✓ Accept'}
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId === applicant._id}
                              onClick={() => handleResolveRequest(applicant._id, 'decline', applicant.name)}
                              className="btn btn-danger btn-sm"
                              style={{ flex: 1 }}
                            >
                              ✕ Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* ── Team Member Roster List ── */}
              <section
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    Current Member Roster
                  </h3>
                  {!isLeader && (
                    <button
                      type="button"
                      disabled={actionLoadingId === 'leave'}
                      onClick={handleLeaveTeam}
                      className="btn btn-danger btn-sm"
                    >
                      🚪 Leave Squad
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Leader Row */}
                  <div
                    style={{
                      background: 'rgba(249,115,22,0.06)',
                      border: '1px solid var(--border-accent)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent), #e05d05)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {team.leaderId?.profileImage?.url ? (
                          <img
                            src={team.leaderId.profileImage.url}
                            alt="Leader"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span>{team.leaderId?.name?.[0] || 'L'}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{team.leaderId?.name}</span>
                          <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                            Squad Leader
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                          <span>🔨 {team.leaderId?.tradeCategory}</span>
                          <span>⭐ {team.leaderId?.rating?.average || 5.0}</span>
                          {team.leaderId?.phone && <span>📞 {team.leaderId.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Member Rows */}
                  {team.workerIds && team.workerIds.length > 0 ? (
                    team.workerIds.map((m) => (
                      <div
                        key={m._id}
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 16,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: '50%',
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              flexShrink: 0,
                              overflow: 'hidden',
                            }}
                          >
                            {m.profileImage?.url ? (
                              <img
                                src={m.profileImage.url}
                                alt={m.name}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span>{m.name?.[0] || 'M'}</span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</div>
                            <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                              <span>🔨 {m.tradeCategory}</span>
                              <span>⭐ {m.rating?.average || 5.0}</span>
                              {m.phone && <span>📞 {m.phone}</span>}
                            </div>
                          </div>
                        </div>

                        {isLeader && (
                          <button
                            type="button"
                            disabled={actionLoadingId === m._id}
                            onClick={() => handleRemoveMember(m._id, m.name)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--danger)' }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No other squad members yet. Other workers can discover and apply to your squad in the Explore tab.
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            /* ── Worker has NO team yet ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px', gap: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
              <span style={{ fontSize: '3.5rem' }}>👥</span>
              <div style={{ maxWidth: 520 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  You are not currently part of a Squad
                </h2>
                <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Create your own team to step up as a Leader and take on large-scale contractor tenders, or browse active squads in your city to request membership.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="btn btn-primary"
                >
                  ⚡ Create a New Squad
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('explore');
                    fetchExploreTeams();
                  }}
                  className="btn btn-secondary"
                >
                  🔍 Explore Existing Squads
                </button>
              </div>

              {/* Create Team Form Drawer / Card */}
              {showCreateForm && (
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 28,
                    width: '100%',
                    maxWidth: 600,
                    textAlign: 'left',
                    marginTop: 10,
                  }}
                >
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 18px', color: 'var(--text-primary)' }}>
                    Launch Your Civil Squad
                  </h3>
                  <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Squad Name *</label>
                      <input
                        type="text"
                        required
                        value={createData.name}
                        onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                        placeholder="e.g. Apex Civil & Masonry Squad"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mission / Trade Specialization</label>
                      <textarea
                        rows={3}
                        value={createData.description}
                        onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                        placeholder="Describe your crew's trade specializations, past construction projects..."
                        className="form-textarea"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">Max Member Capacity</label>
                        <input
                          type="number"
                          min="2"
                          max="50"
                          value={createData.maxSize}
                          onChange={(e) => setCreateData({ ...createData, maxSize: e.target.value })}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Base City</label>
                        <input
                          type="text"
                          value={createData.city}
                          onChange={(e) => setCreateData({ ...createData, city: e.target.value })}
                          placeholder="e.g. Mumbai"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <button type="submit" disabled={creating} className="btn btn-primary">
                        {creating ? 'Launching...' : 'Launch Squad & Become Leader'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* VIEW B: EXPLORE TEAMS FEED                                   */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeView === 'explore' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Search & City Filter Bar */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-lg)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)', alignItems: 'center' }}>
            <div style={{ flex: 2, minWidth: 200 }}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search squads by name or trade..."
                className="form-input"
              />
            </div>

            <div style={{ flex: 1, minWidth: 160 }}>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="City (e.g. Mumbai)..."
                className="form-input"
              />
            </div>

            <button
              type="button"
              onClick={() => fetchExploreTeams(searchCity)}
              className="btn btn-primary"
            >
              Filter Squads
            </button>
          </div>

          {/* Teams Grid */}
          {exploreLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
              <div className="spinner" />
              <p style={{ color: 'var(--color-text-muted)' }}>Loading workforce squads...</p>
            </div>
          ) : allTeams.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px', gap: 14, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontSize: '3rem' }}>👥</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>No squads found</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: 450, margin: 0 }}>
                No active squads currently match your search filter. You can launch your own squad!
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveView('my-team');
                  setShowCreateForm(true);
                }}
                className="btn btn-primary btn-sm"
              >
                + Launch a Squad
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {allTeams.map((t) => {
                const isMyCurrentTeam = team && team._id === t._id;
                const isLeaderOfThis = t.leaderId?._id === user?._id;
                const isMemberOfThis = t.workerIds?.some((m) => (m._id || m) === user?._id);
                const isFull = (t.workerIds?.length || 0) + 1 >= t.maxSize;
                const hasPendingRequest = t.pendingRequests?.some(
                  (reqUser) => (reqUser._id || reqUser) === user?._id
                );

                return (
                  <div
                    key={t._id}
                    className="card-hover"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: 'var(--radius-xl)',
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <span style={{ background: 'var(--color-bg-page)', color: 'var(--color-charcoal)', border: '1px solid #E5E7EB', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.74rem', fontWeight: 700 }}>
                          📍 {t.location?.city || 'India'}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '8px 0 0', color: 'var(--color-text-primary)', wordBreak: 'break-word' }}>{t.name}</h3>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600, background: 'var(--color-bg-page)', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap' }}>
                        {(t.workerIds?.length || 0) + 1}/{t.maxSize} Members
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}>
                      {t.description || 'Dedicated multi-trade civil squad.'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-bg-page)', border: '1px solid #E5E7EB', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'var(--color-yellow)',
                          color: 'var(--color-charcoal)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        {t.leaderId?.profileImage?.url ? (
                          <img
                            src={t.leaderId.profileImage.url}
                            alt="Leader"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span>{t.leaderId?.name?.[0] || 'L'}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                          {t.leaderId?.name || 'Leader'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                          Leader • {t.leaderId?.tradeCategory || 'Craftsman'} • ⭐ {t.leaderId?.rating?.average || 5.0}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {t.tradeCategories?.map((trade, idx) => (
                        <span key={idx} style={{ background: 'var(--color-bg-page)', color: 'var(--color-charcoal)', border: '1px solid #E5E7EB', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 600 }}>
                          🔨 {trade}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                      {isMyCurrentTeam || isLeaderOfThis || isMemberOfThis ? (
                        <div style={{ background: 'var(--color-success-tint)', color: 'var(--color-success)', border: '1px solid var(--color-success-border)', padding: 10, borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem' }}>
                          ✓ Your Active Squad
                        </div>
                      ) : hasPendingRequest ? (
                        <button disabled className="btn btn-secondary btn-sm btn-full" style={{ opacity: 0.7 }}>
                          ⏳ Request Pending
                        </button>
                      ) : isFull ? (
                        <button disabled className="btn btn-secondary btn-sm btn-full" style={{ opacity: 0.7 }}>
                          Squad Full
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoadingId === t._id}
                          onClick={() => handleRequestJoin(t._id, t.name)}
                          className="btn btn-primary btn-sm btn-full"
                        >
                          {actionLoadingId === t._id ? 'Sending Request...' : 'Request to Join Squad'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default TeamManagement;
