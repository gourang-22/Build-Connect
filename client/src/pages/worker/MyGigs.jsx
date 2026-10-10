import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveJobs } from '../../utils/api';
import JobDetailsModal from './JobDetailsModal';

const STATUS_BADGE = {
  pending:     'badge-yellow',
  hired:       'badge-success',
  shortlisted: 'badge-yellow',
  rejected:    'badge-danger',
  completed:   'badge-success',
};

const MyGigs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getActiveJobs();
      setJobs(res.data?.gigs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your jobs.');
    } finally {
      setLoading(false);
    }
  };

  const pendingJobs = jobs.filter(
    (g) => g.myApplicationStatus === 'pending' && g.status !== 'completed'
  );
  const activeJobs = jobs.filter(
    (g) =>
      (g.myApplicationStatus === 'hired' ||
        g.myApplicationStatus === 'shortlisted' ||
        g.status === 'in_progress') &&
      g.status !== 'completed'
  );
  const completedJobs = jobs.filter(
    (g) => g.status === 'completed' || g.myApplicationStatus === 'completed'
  );

  const currentList =
    activeTab === 'pending'
      ? pendingJobs
      : activeTab === 'active'
      ? activeJobs
      : completedJobs;

  const TABS = [
    { key: 'pending',   label: 'Pending Applications', count: pendingJobs.length },
    { key: 'active',    label: 'Hired & Active',       count: activeJobs.length },
    { key: 'completed', label: 'Completed',            count: completedJobs.length },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Page Header ── */}
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
            My Active Gigs
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Track submitted applications, active contract deployments, and completed civil work.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchJobs}
          id="gigs-refresh"
          style={{ padding: '8px 16px', fontWeight: 600 }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ── Polished Segmented Control Tabs ── */}
      <div>
        <div className="tabs">
          {TABS.map(({ key, label, count }) => (
            <button
              key={key}
              type="button"
              className={`tab-btn${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
              id={`gigs-tab-${key}`}
            >
              <span>{label}</span>
              {count > 0 && (
                <span
                  style={{
                    backgroundColor: activeTab === key ? '#101820' : '#CBD5E1',
                    color: activeTab === key ? '#FFFFFF' : '#101820',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: '9999px',
                    marginLeft: 4,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content Area ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--color-text-muted)' }}>Loading gigs activity...</p>
        </div>
      ) : currentList.length === 0 ? (
        /* ── Centered Empty State Panel (Fix for Screenshot 3) ── */
        <div className="empty-state">
          <div className="empty-state-icon">
            {activeTab === 'pending' ? '📑' : activeTab === 'active' ? '🔨' : '🏆'}
          </div>
          <h3>
            {activeTab === 'pending'
              ? 'No Pending Applications'
              : activeTab === 'active'
              ? 'No Active Jobs in Progress'
              : 'No Completed Jobs Yet'}
          </h3>
          <p>
            {activeTab === 'pending'
              ? 'You have not submitted proposals to open jobs yet. Browse available contractor and builder listings in your locality.'
              : activeTab === 'active'
              ? 'You currently have no hired active contracts underway. Once an employer hires you, site instructions will appear here.'
              : 'Finished contracts, employer ratings, and wage payment confirmations will be archived here upon job completion.'}
          </p>
          {activeTab === 'pending' && (
            <Link to="/worker/dashboard" className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700 }}>
              ⚡ Explore Job Feed
            </Link>
          )}
          {activeTab !== 'pending' && (
            <Link to="/worker/dashboard" className="btn btn-secondary" style={{ padding: '9px 20px', fontWeight: 600 }}>
              Browse Available Work
            </Link>
          )}
        </div>
      ) : (
        /* ── Responsive Job Listing Cards ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {currentList.map((job) => (
            <div
              key={job._id}
              className="card-hover"
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 'var(--radius-xl)',
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Title & Status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <span
                    style={{
                      background: 'var(--color-bg-page)',
                      color: 'var(--color-charcoal)',
                      border: '1px solid #E5E7EB',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'inline-block',
                      marginBottom: 6,
                    }}
                  >
                    {job.tradeCategory}
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.3 }}>
                    {job.title}
                  </h4>
                </div>
                <span className={`badge ${STATUS_BADGE[job.myApplicationStatus] || 'badge-yellow'}`}>
                  {job.myApplicationStatus || job.status}
                </span>
              </div>

              {/* Employer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-bg-page)', border: '1px solid #E5E7EB', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--color-yellow)',
                    color: 'var(--color-charcoal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                  }}
                >
                  {job.postedBy?.name?.[0] || 'E'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                    {job.postedBy?.name || job.company || 'Verified Client'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                    {job.postedBy?.companyName || 'Site Contractor'}
                  </div>
                </div>
              </div>

              {/* Details breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Location</span>
                  <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    📍 {job.location?.city || 'On-site'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Agreed Wage</span>
                  <span style={{ color: 'var(--color-charcoal)', fontWeight: 800 }}>
                    {job.budget?.amount
                      ? `₹${job.budget.amount.toLocaleString()}/${job.budget.type || 'day'}`
                      : 'Standard Rate'}
                  </span>
                </div>
                {job.timeline?.startDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Start Date</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {new Date(job.timeline.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="btn btn-secondary btn-sm btn-full"
                onClick={() => setSelectedJob(job)}
                id={`gig-view-${job._id}`}
                style={{ marginTop: 'auto', fontWeight: 600 }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplySuccess={() => {
            fetchJobs();
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default MyGigs;
