import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDomesticJobs } from '../../utils/api';

const QUICK_CATEGORIES = [
  { id: 'electrical', name: 'Electrical', icon: '⚡' },
  { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
  { id: 'ac', name: 'AC Repair', icon: '❄️' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚' },
  { id: 'painting', name: 'Painting', icon: '🎨' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
];

const HomeownerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDomesticJobs()
      .then((res) => setJobs(res.data?.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openCount = jobs.filter((j) => j.status === 'open').length;
  const inProgressCount = jobs.filter((j) => j.status === 'in_progress').length;
  const completedCount = jobs.filter((j) => j.status === 'completed').length;
  const totalCount = jobs.length;

  const STATS = [
    { label: 'Active Jobs', value: openCount + inProgressCount, icon: '📋', tint: '#FEF9C3' },
    { label: 'In Progress', value: inProgressCount, icon: '⚙️', tint: '#DBEAFE' },
    { label: 'Completed',   value: completedCount,   icon: '✅', tint: '#DCFCE7' },
    { label: 'Total Jobs',  value: totalCount,      icon: '💰', tint: '#FEF3C7' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Section A: Dashboard Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--color-charcoal)',
              margin: '0 0 4px 0',
            }}
          >
            Homeowner Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Welcome back, {user?.name || 'Homeowner'}. Monitor your home repair requests and specialist visits.
          </p>
        </div>

        <Link
          to="/domestic/post-job"
          className="btn btn-primary"
          style={{ padding: '10px 22px', fontSize: '0.875rem', fontWeight: 700 }}
        >
          + Post a Job
        </Link>
      </div>

      {/* ── Section B: Four Statistics Cards (Horizontal Desktop Row) ── */}
      <div className="stat-grid">
        {STATS.map(({ label, value, icon, tint }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                className="stat-icon"
                style={{ backgroundColor: tint }}
              >
                {icon}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Platform
              </span>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Section C: Main Responsive 2-Column Layout ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: 24,
          alignItems: 'start',
        }}
        className="homeowner-main-grid"
      >
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Quick Categories Bar */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                Popular Home Services
              </h3>
              <Link to="/domestic/workers" style={{ fontSize: '0.8125rem', color: '#B45309', fontWeight: 700, textDecoration: 'none' }}>
                Browse All Pros →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10 }}>
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigate(`/domestic/post-job?category=${cat.id}`)}
                  style={{
                    background: 'var(--color-bg-page)',
                    border: '1px solid #E5E7EB',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    transition: 'all var(--trans-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF9C3';
                    e.currentTarget.style.borderColor = 'var(--color-yellow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-page)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: My Posted Jobs */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: 14 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-charcoal)' }}>
                My Posted Jobs
              </h2>
              <Link to="/domestic/workers" className="btn btn-secondary btn-sm" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                Worker Matches
              </Link>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: 12 }}>
                <div className="spinner" />
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Loading service requests...</p>
              </div>
            ) : jobs.length === 0 ? (
              /* Section D: Polished, Centered Empty State */
              <div className="empty-state" style={{ padding: '40px 20px', border: 'none', boxShadow: 'none' }}>
                <div className="empty-state-icon">🏠</div>
                <h3>No Jobs Posted Yet</h3>
                <p>
                  Post your first home repair or service request to get matched with verified local specialists in your immediate neighborhood.
                </p>
                <Link to="/domestic/post-job" className="btn btn-primary" style={{ padding: '10px 26px', fontWeight: 700 }}>
                  + Post a Job
                </Link>
              </div>
            ) : (
              /* Jobs List */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 18px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid #E5E7EB',
                      backgroundColor: 'var(--color-bg-page)',
                      flexWrap: 'wrap',
                      gap: 14,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor: '#FEF9C3',
                          border: '2px solid var(--color-yellow)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.3rem',
                          flexShrink: 0,
                        }}
                      >
                        👨‍🔧
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
                          {job.title}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                          {job.location?.address || 'Your Address'} • Status: <strong>{job.status}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Link
                        to="/domestic/complete"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 14px' }}
                      >
                        Invoice
                      </Link>
                      <Link
                        to="/domestic/workers"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 18px', fontWeight: 700 }}
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Secondary Column: Profile Summary & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile Summary Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#FEF9C3',
                border: '3px solid var(--color-yellow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: 12,
              }}
            >
              🏡
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
              {user?.name || 'Homeowner'}
            </h3>
            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '9999px',
                marginBottom: 12,
              }}
            >
              🏠 Verified Domestic Client
            </span>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 <span>{user?.city || 'Mumbai, Maharashtra'}</span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 'var(--radius-xl)',
              padding: '22px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
              Quick Actions
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link
                to="/domestic/post-job"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', padding: '10px 14px', textAlign: 'left', fontWeight: 600 }}
              >
                ➕ Book a Home Repair
              </Link>
              <Link
                to="/domestic/workers"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', padding: '10px 14px', textAlign: 'left', fontWeight: 600 }}
              >
                📍 Find Nearby Specialists
              </Link>
              <Link
                to="/domestic/complete"
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'flex-start', padding: '10px 14px', textAlign: 'left', fontWeight: 600 }}
              >
                💳 Invoices & Payments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
