import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBuilderProjects } from '../../utils/api';

const DEFAULT_SAMPLE_PROJECTS = [
  {
    _id: 'samp-proj-1',
    title: 'Residential Tower',
    location: 'Mumbai',
    targetDate: '12 Nov 2026',
    progress: 60,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=400&q=80',
    status: 'Construction',
  },
  {
    _id: 'samp-proj-2',
    title: 'Metro Station Project',
    location: 'Pune',
    targetDate: '15 Nov 2026',
    progress: 30,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    status: 'Bidding',
  },
  {
    _id: 'samp-proj-3',
    title: 'Commercial Complex',
    location: 'Bangalore',
    targetDate: '5 Nov 2026',
    progress: 20,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    status: 'Planning',
  },
];

const BuilderDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBuilderProjects()
      .then((res) => {
        const pList = res.data?.jobs || [];
        setProjects(pList.length > 0 ? pList : DEFAULT_SAMPLE_PROJECTS);
      })
      .catch(() => {
        setProjects(DEFAULT_SAMPLE_PROJECTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeProjectsCount = projects.length || 8;
  const activeTendersCount = 24;
  const totalBudgetStr = '₹12.5 Cr';

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header (Screen 10) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
            Project Overview
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Here's what's happening with your labor & projects.
          </p>
        </div>

        <Link
          to="/builder/post-project"
          className="btn btn-primary"
          style={{ padding: '9px 20px', fontSize: '0.875rem', fontWeight: 700 }}
        >
          + Publish Project
        </Link>
      </div>

      {/* 3 Stat Cards (Screen 10) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {/* Card 1: Active Projects */}
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
            {activeProjectsCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', fontWeight: 600, marginTop: 4 }}>
            Active Projects
          </div>
        </div>

        {/* Card 2: Active Tenders */}
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
            {activeTendersCount}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', fontWeight: 600, marginTop: 4 }}>
            Active Tenders
          </div>
        </div>

        {/* Card 3: Total Budget */}
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
            {totalBudgetStr}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', fontWeight: 600, marginTop: 4 }}>
            Total Budget
          </div>
        </div>
      </div>

      {/* Recent Projects Section (Screen 10) */}
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
            Recent Projects
          </h2>
          <Link to="/builder/oversight" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-muted)', textDecoration: 'none' }}>
            View All
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {projects.map((proj, idx) => {
            const progressVal = proj.progress || (60 - idx * 20);
            return (
              <div
                key={proj._id}
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
                {/* Left: Thumbnail & Project Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 300px' }}>
                  <img
                    src={proj.image || DEFAULT_SAMPLE_PROJECTS[idx % DEFAULT_SAMPLE_PROJECTS.length].image}
                    alt={proj.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=400&q=80';
                    }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      backgroundColor: '#E5E7EB',
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
                      {proj.title}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                      {proj.location?.city || proj.location || 'Mumbai'} • {proj.targetDate || '12 Nov 2026'}
                    </div>
                  </div>
                </div>

                {/* Right: Progress Bar & Milestone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 220 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 4 }}>
                      <span>Progress</span>
                      <span>{progressVal}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${progressVal}%`, height: '100%', backgroundColor: 'var(--color-yellow)' }} />
                    </div>
                  </div>

                  <Link
                    to="/builder/oversight"
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 600 }}
                  >
                    Track
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Action Button (Screen 10) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <Link
            to="/builder/post-project"
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.9375rem', fontWeight: 700 }}
          >
            Publish Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuilderDashboard;
