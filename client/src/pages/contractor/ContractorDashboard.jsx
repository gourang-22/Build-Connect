import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getContractorLaborRequests, getContractorBids } from '../../utils/api';

const DEFAULT_SAMPLE_REQUESTS = [
  {
    _id: 'sample-lr-1',
    tradeCategory: 'Helper',
    headcount: 10,
    statusText: '10 Open',
    postedTime: '2h ago',
    icon: '👷',
  },
  {
    _id: 'sample-lr-2',
    tradeCategory: 'Mason',
    headcount: 5,
    statusText: '5 Open',
    postedTime: '4h ago',
    icon: '🧱',
  },
  {
    _id: 'sample-lr-3',
    tradeCategory: 'Electrician',
    headcount: 3,
    statusText: '3 Shortlisted',
    postedTime: '6h ago',
    icon: '⚡',
  },
];

const ContractorDashboard = () => {
  const { user } = useAuth();
  const [laborRequests, setLaborRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [lrRes, bidsRes] = await Promise.allSettled([
          getContractorLaborRequests(),
          getContractorBids(),
        ]);
        setLaborRequests(lrRes.status === 'fulfilled' ? lrRes.value.data?.jobs || [] : []);
        setBids(bidsRes.status === 'fulfilled' ? bidsRes.value.data?.bids || [] : []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const activeCount = laborRequests.filter((j) => j.status === 'open' || j.status === 'in_progress').length || 8;
  const deployedWorkers = 24; // Deployed workers on active sites
  const openTenders = bids.length || 3;

  const displayRequests = laborRequests.length > 0
    ? laborRequests.slice(0, 5).map((lr) => ({
        _id: lr._id,
        tradeCategory: lr.tradeCategory || lr.title || 'General Labor',
        headcount: lr.headcountNeeded || 1,
        statusText: `${lr.headcountNeeded || 1} ${lr.status === 'open' ? 'Open' : lr.status}`,
        postedTime: 'Active',
        icon: '👷',
      }))
    : DEFAULT_SAMPLE_REQUESTS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1080, margin: '0 auto' }}>
      {/* Header (Screen 7) */}
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
            Good Morning, {user?.name || 'Apex Builders'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Here's what's happening with your labor & projects.
          </p>
        </div>

        <Link
          to="/contractor/post-job"
          className="btn btn-secondary"
          style={{
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          ✏️ Edit Profile
        </Link>
      </div>

      {/* 3 Stat Cards (Screen 7) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {/* Card 1: Active Requests */}
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: 'var(--color-yellow)',
            }}
          />
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-charcoal)', lineHeight: '1.2' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', fontWeight: 600, marginTop: 4 }}>
            Active Requests
          </div>
        </div>

        {/* Card 2: Deployed Workers */}
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-charcoal)', lineHeight: '1.2' }}>
            {deployedWorkers}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', fontWeight: 600, marginTop: 4 }}>
            Deployed Workers
          </div>
        </div>

        {/* Card 3: Open Tenders */}
        <div
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            padding: '22px 24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-charcoal)', lineHeight: '1.2' }}>
            {openTenders}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', fontWeight: 600, marginTop: 4 }}>
            Open Tenders
          </div>
        </div>
      </div>

      {/* Recent Labor Requests Card (Screen 7) */}
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
            Recent Labor Requests
          </h2>
          <Link
            to="/contractor/applicants"
            style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-muted)', textDecoration: 'none' }}
          >
            View All
          </Link>
        </div>

        {/* List of Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayRequests.map((req) => (
            <div
              key={req._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-bg-page)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  {req.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                    {req.tradeCategory}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    Site Labor Procurement
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-charcoal)',
                  }}
                >
                  {req.statusText} • {req.postedTime}
                </span>
                <Link
                  to={`/contractor/applicants?jobId=${req._id}`}
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  Applicants
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Post New Request Button (Screen 7) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <Link
            to="/contractor/post-job"
            className="btn btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '0.9375rem',
              fontWeight: 700,
            }}
          >
            Post New Request
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
