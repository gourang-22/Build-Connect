import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContractorLaborRequests } from '../../utils/api';

const MyActiveSites = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveSites();
  }, []);

  const fetchActiveSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getContractorLaborRequests();
      setJobs(res.data?.jobs || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to fetch active sites data.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Find all sites that are either 'in_progress' or have hired personnel
  const activeSites = jobs.filter((job) => {
    const hasHired = job.applications?.some((a) => a.status === 'hired');
    return job.status === 'in_progress' || hasHired || job.awardedTo?.userId || job.awardedTo?.teamId;
  });

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Active Job Sites & Workforce Deployment
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: '4px 0 0' }}>
            Monitor real-time deployment of hired solo specialists and contracted squads across your civil sites.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={fetchActiveSites}
            className="btn btn-secondary btn-sm"
          >
            🔄 Refresh Sites
          </button>
          <Link to="/contractor/post-job" className="btn btn-primary btn-sm">
            ➕ Post New Site Need
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Sites Listing */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)' }}>Tracking deployed job sites...</p>
        </div>
      ) : activeSites.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px', gap: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
          <span style={{ fontSize: '3rem' }}>🏗️</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>No Deployed Job Sites Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 450, margin: 0 }}>
            You currently have no active sites with hired workers. Review your incoming applicants to hire and deploy teams!
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            <Link to="/contractor/applicants" className="btn btn-primary btn-sm">
              Review Applicants
            </Link>
            <Link to="/contractor/post-job" className="btn btn-secondary btn-sm">
              Post Labor Request
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activeSites.map((site) => {
            const hiredApps =
              site.applications?.filter((a) => a.status === 'hired') || [];

            return (
              <div
                key={site._id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Site Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                        {site.tradeCategory}
                      </span>
                      <span style={{ background: 'var(--success-dim)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                        ● Site In Progress
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{site.title}</h2>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      📍 {site.location?.address ? `${site.location.address}, ` : ''}
                      {site.location?.city || 'Local Site'}
                      {site.location?.state ? `, ${site.location.state}` : ''}
                    </div>
                  </div>

                  <Link
                    to={`/contractor/applicants?jobId=${site._id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Manage Applicants ({site.applications?.length || 0})
                  </Link>
                </div>

                {/* Site Metrics bar */}
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 16px', display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span>
                    Required Headcount: <strong style={{ color: 'var(--text-primary)' }}>{site.headcountNeeded || 1} Workers</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Contract Budget:{' '}
                    <strong style={{ color: 'var(--accent)' }}>
                      ₹{site.budget?.amount?.toLocaleString() || 'Negotiated'} ({site.budget?.type})
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Mode: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{site.hiringMode}</strong>
                  </span>
                </div>

                {/* Deployed Personnel Section */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: 12 }}>
                    👷 Deployed Workforce Roster ({hiredApps.length > 0 ? hiredApps.length : (site.awardedTo?.userId || site.awardedTo?.teamId ? 1 : 0)})
                  </div>

                  {hiredApps.length === 0 && !site.awardedTo?.userId && !site.awardedTo?.teamId ? (
                    <div style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', padding: 16, borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      No workers officially assigned yet. Go to <Link to={`/contractor/applicants?jobId=${site._id}`} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Applicant Review</Link> to hire workers.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                      {/* Render hired applications */}
                      {hiredApps.map((hiredApp) => {
                        const isSquad = !!hiredApp.teamId || hiredApp.isTeamApplication;
                        const worker = hiredApp.applicantId;
                        const squad = hiredApp.teamId;

                        return (
                          <div
                            key={hiredApp._id}
                            style={{
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)',
                              padding: 14,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: isSquad ? 'var(--accent-dim)' : 'var(--bg-card)',
                                color: isSquad ? 'var(--accent)' : 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                flexShrink: 0,
                                overflow: 'hidden',
                              }}
                            >
                              {isSquad ? (
                                <span>👥</span>
                              ) : worker?.profileImage?.url ? (
                                <img
                                  src={worker.profileImage.url}
                                  alt="Worker"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <span>{worker?.name?.[0] || 'W'}</span>
                              )}
                            </div>

                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                                {isSquad ? squad?.name || 'Squad Crew' : worker?.name || 'Assigned Worker'}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                                {isSquad
                                  ? `👥 Squad of ${squad?.memberCount || 5} Workers`
                                  : `🔨 ${worker?.tradeCategory || site.tradeCategory}`}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: 8, marginTop: 2 }}>
                                <span>⭐ {worker?.rating?.average || '5.0'}</span>
                                {worker?.phone && <span>📞 {worker.phone}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* If awardedTo is set directly */}
                      {site.awardedTo?.userId && !hiredApps.some(a => a.applicantId?._id === site.awardedTo.userId._id) && (
                        <div
                          style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: 'var(--bg-card)',
                              color: 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              flexShrink: 0,
                              overflow: 'hidden',
                            }}
                          >
                            {site.awardedTo.userId.profileImage?.url ? (
                              <img
                                src={site.awardedTo.userId.profileImage.url}
                                alt="Worker"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <span>{site.awardedTo.userId.name?.[0] || 'W'}</span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{site.awardedTo.userId.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                              🔨 {site.awardedTo.userId.tradeCategory || site.tradeCategory}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              📞 {site.awardedTo.userId.phone || 'Phone verified'}
                            </div>
                          </div>
                        </div>
                      )}

                      {site.awardedTo?.teamId && !hiredApps.some(a => a.teamId?._id === site.awardedTo.teamId._id) && (
                        <div
                          style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>👥</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{site.awardedTo.teamId.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                              👥 Squad Crew ({site.awardedTo.teamId.memberCount || 'Full'} Members)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyActiveSites;
