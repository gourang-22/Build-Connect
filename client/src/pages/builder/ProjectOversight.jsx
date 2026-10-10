import { useState } from 'react';

const MILESTONES = [
  { step: 1, label: 'Planning', status: 'completed' },
  { step: 2, label: 'Bidding', status: 'completed' },
  { step: 3, label: 'Construction', status: 'active' },
  { step: 4, label: 'Finishing', status: 'pending' },
  { step: 5, label: 'Handover', status: 'pending' },
];

const ProjectOversight = () => {
  const [selectedProject, setSelectedProject] = useState('Commercial Complex');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header (Screen 13) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
            Project Tracker
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Real-time stage tracking, contractor oversight, and workforce deployment quotas.
          </p>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-white)',
            fontSize: '0.875rem',
            color: 'var(--color-charcoal)',
          }}
        >
          <option value="Commercial Complex">Commercial Complex</option>
          <option value="Residential Tower">Residential Tower</option>
          <option value="Metro Station Project">Metro Station Project</option>
        </select>
      </div>

      {/* Main Container Card (Screen 13) */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* 5-Stage Milestone Tracker (Screen 13) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-lg)' }}>
          {MILESTONES.map((m, idx) => {
            const isCompleted = m.status === 'completed';
            const isActive = m.status === 'active';

            return (
              <div key={m.step} style={{ display: 'flex', alignItems: 'center', flex: idx < MILESTONES.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isCompleted || isActive ? 'var(--color-yellow)' : '#E2E8F0',
                      color: 'var(--color-charcoal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.8125rem',
                      border: isActive ? '2px solid var(--color-charcoal)' : 'none',
                    }}
                  >
                    {isCompleted ? '✓' : m.step}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--color-charcoal)' : 'var(--color-muted)',
                    }}
                  >
                    {m.label}
                  </span>
                </div>

                {idx < MILESTONES.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 3,
                      backgroundColor: isCompleted ? 'var(--color-yellow)' : '#E2E8F0',
                      margin: '0 8px',
                      marginBottom: 20,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Project Details & Split View (Screen 13) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28, alignItems: 'center' }}>
          {/* Left: Project Details & Workforce Quotas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', fontWeight: 600 }}>Active Project</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '2px 0 6px 0' }}>
                {selectedProject}
              </h2>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-charcoal)', fontWeight: 500 }}>
                Prime Contractor: <strong style={{ color: 'var(--color-charcoal)' }}>BuildPro Infra</strong>
              </div>
            </div>

            {/* Workforce Quotas (Screen 13) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                Workforce Quota
              </div>

              {/* Masons Quota: 40/40 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  <span>Masons</span>
                  <span>40/40 (100%)</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-yellow)' }} />
                </div>
              </div>

              {/* Electricians Quota: 12/20 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  <span>Electricians</span>
                  <span>12/20 (60%)</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '60%', height: '100%', backgroundColor: 'var(--color-yellow)' }} />
                </div>
              </div>

              {/* Helpers Quota: 25/40 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 4 }}>
                  <span>Helpers</span>
                  <span>25/40 (62%)</span>
                </div>
                <div style={{ width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', backgroundColor: 'var(--color-yellow)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Construction Preview Photo (Screen 13) */}
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 260, border: '1px solid var(--color-border)' }}>
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=600&q=80"
              alt="Site Progress"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOversight;
