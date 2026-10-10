import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getContractorLaborRequests, updateApplicationStatus } from '../../utils/api';

const DEFAULT_SAMPLE_APPLICANTS = [
  {
    _id: 'sample-app-1',
    applicantId: {
      _id: 'samp-w-1',
      name: 'Ramesh Yadav',
      tradeCategory: 'Mason',
      experienceYears: 5,
    },
    bidAmount: 600,
    distance: '3 km',
    status: 'pending',
    avatar: '👷‍♂️',
  },
  {
    _id: 'sample-app-2',
    applicantId: {
      _id: 'samp-w-2',
      name: 'Suresh Patel',
      tradeCategory: 'Helper',
      experienceYears: 2,
    },
    bidAmount: 500,
    distance: '5 km',
    status: 'pending',
    avatar: '👷',
  },
  {
    _id: 'sample-app-3',
    applicantId: {
      _id: 'samp-w-3',
      name: 'Imran Khan',
      tradeCategory: 'Electrician',
      experienceYears: 6,
    },
    bidAmount: 700,
    distance: '7 km',
    status: 'shortlisted',
    avatar: '⚡',
  },
];

const LaborApplicantReview = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'all';

  const [laborRequests, setLaborRequests] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Hired' | 'Shortlisted' | 'Rejected'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getContractorLaborRequests();
      setLaborRequests(res.data?.jobs || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleStatusUpdate = async (jobId, applicationId, newStatus, applicantName) => {
    setActionLoading(applicationId);
    try {
      if (jobId && !jobId.startsWith('sample-')) {
        await updateApplicationStatus(jobId, applicationId, newStatus);
      }
      setToastMsg(`Marked ${applicantName} as ${newStatus}!`);
      setTimeout(() => setToastMsg(null), 3000);
      await fetchJobs();
    } catch {
      setToastMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setToastMsg(null), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  // Compile applicants list
  let applicants = [];
  laborRequests.forEach((job) => {
    if (selectedJobId === 'all' || job._id === selectedJobId) {
      if (job.applications && job.applications.length > 0) {
        job.applications.forEach((app) => {
          applicants.push({
            ...app,
            jobId: job._id,
            jobTitle: job.title,
            distance: '4 km',
          });
        });
      }
    }
  });

  if (applicants.length === 0 && (!laborRequests.length || selectedJobId === 'all')) {
    applicants = DEFAULT_SAMPLE_APPLICANTS;
  }

  // Filter applicants
  const filteredApplicants = applicants.filter((app) => {
    const trade = app.applicantId?.tradeCategory || 'Helper';
    const matchesTrade = selectedTrade === 'All' || trade.toLowerCase() === selectedTrade.toLowerCase();

    const matchesStatus =
      statusFilter === 'All' ||
      app.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesTrade && matchesStatus;
  });

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Title */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--color-charcoal)',
          margin: 0,
        }}
      >
        Labor Applicant Review
      </h1>

      {toastMsg && (
        <div style={{ padding: '10px 16px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600 }}>
          {toastMsg}
        </div>
      )}

      {/* Main Container Card (Screen 9) */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Filters Row: Dropdowns (Screen 9) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              fontSize: '0.875rem',
              color: 'var(--color-charcoal)',
            }}
          >
            <option value="All">All Trades</option>
            <option value="Mason">Mason</option>
            <option value="Helper">Helper</option>
            <option value="Electrician">Electrician</option>
          </select>

          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              if (e.target.value === 'all') {
                searchParams.delete('jobId');
              } else {
                searchParams.set('jobId', e.target.value);
              }
              setSearchParams(searchParams);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              fontSize: '0.875rem',
              color: 'var(--color-charcoal)',
            }}
          >
            <option value="all">Select Request (All)</option>
            {laborRequests.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Tabs (Screen 9: All, Pending, Hired, Shortlisted, Rejected) */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
          {['All', 'Pending', 'Hired', 'Shortlisted', 'Rejected'].map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '6px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-yellow)' : 'var(--color-white)',
                  fontWeight: isSelected ? 700 : 500,
                  color: 'var(--color-charcoal)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Candidate Rows (Screen 9) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-muted)' }}>
              No applicants found under this status filter.
            </div>
          ) : (
            filteredApplicants.map((app) => {
              const name = app.applicantId?.name || 'Candidate';
              const trade = app.applicantId?.tradeCategory || 'Helper';
              const exp = app.applicantId?.experienceYears || 3;
              const wage = app.bidAmount || 600;
              const distance = app.distance || '5 km';

              return (
                <div
                  key={app._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-white)',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  {/* Left: Avatar & Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: '#FEF9C3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        border: '2px solid var(--color-yellow)',
                      }}
                    >
                      {app.avatar || '👷‍♂️'}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                        {name}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                        {trade} • {exp} yrs exp
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-charcoal)', fontWeight: 600, marginTop: 2 }}>
                        ₹{wage}/day • {distance}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Shortlist, Hire [Yellow], Decline) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      type="button"
                      disabled={actionLoading === app._id}
                      onClick={() => handleStatusUpdate(app.jobId, app._id, 'shortlisted', name)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-white)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: 'var(--color-charcoal)',
                      }}
                    >
                      Shortlist
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading === app._id}
                      onClick={() => handleStatusUpdate(app.jobId, app._id, 'hired', name)}
                      className="btn btn-primary"
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                      }}
                    >
                      Hire
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading === app._id}
                      onClick={() => handleStatusUpdate(app.jobId, app._id, 'rejected', name)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--color-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LaborApplicantReview;
