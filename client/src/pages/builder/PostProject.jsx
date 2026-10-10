import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postProject } from '../../utils/api';

const PostProject = () => {
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState('tender'); // 'tender' | 'labor'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State matching Screen 11
  const [projectTitle, setProjectTitle] = useState('');
  const [timeline, setTimeline] = useState('1 month'); // 'Immediate' | '1 month' | 'Short timeline'
  const [tradeRequirement, setTradeRequirement] = useState('Masonry');
  const [budgetAmount, setBudgetAmount] = useState('5000000');
  const [urgency, setUrgency] = useState('Urgent'); // 'Normal' | 'Urgent' | 'ASAP'
  const [siteAddress, setSiteAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) {
      setError('Please provide a project title.');
      return;
    }
    if (!siteAddress.trim()) {
      setError('Please specify the site address.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        title: projectTitle,
        description: description || `Commercial project requirement for ${tradeRequirement} at ${siteAddress}.`,
        projectType: activeChannel === 'tender' ? 'commercial_tender' : 'direct_labor',
        totalBudget: Number(budgetAmount) || 1000000,
        timeline: {
          proposedTimeline: timeline,
        },
        location: {
          address: siteAddress,
          city: city || 'Mumbai',
        },
      };

      await postProject(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/builder/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post project. Please verify inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
          Publish Project / Tender
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
          Choose between procuring full-scope commercial contractor bids or direct skilled trade labor.
        </p>
      </div>

      {/* Dual Channel Selectable Cards (Screen 11: A. Commercial Tender vs B. Direct Labor) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div
          onClick={() => setActiveChannel('tender')}
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px 24px',
            border: activeChannel === 'tender' ? '2px solid var(--color-yellow)' : '1px solid var(--color-border)',
            boxShadow: activeChannel === 'tender' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              A. Commercial Tender
            </span>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: activeChannel === 'tender' ? 'var(--color-yellow)' : '#E2E8F0',
                display: 'inline-block',
              }}
            />
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>
            Invite licensed general contractors to submit technical proposals, phase budgets, and milestone schedules.
          </p>
        </div>

        <div
          onClick={() => setActiveChannel('labor')}
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px 24px',
            border: activeChannel === 'labor' ? '2px solid var(--color-yellow)' : '1px solid var(--color-border)',
            boxShadow: activeChannel === 'labor' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              B. Direct Labor
            </span>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: activeChannel === 'labor' ? 'var(--color-yellow)' : '#E2E8F0',
                display: 'inline-block',
              }}
            />
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: '1.5' }}>
            Directly hire high-capacity labor squads and verified master tradesmen under daily wage or task rates.
          </p>
        </div>
      </div>

      {/* Main Form Card (Screen 11) */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '32px 36px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {error && (
          <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '10px 14px', backgroundColor: '#DCFCE7', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            Project published successfully! Redirecting...
          </div>
        )}

        {/* Project Title (Screen 11) */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
            Project Title
          </label>
          <input
            type="text"
            placeholder="e.g. Commercial Complex"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.875rem',
            }}
            required
          />
        </div>

        {/* Timeline Pills (Screen 11: Immediate, 1 month, Short timeline) */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 8 }}>
            Timeline
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Immediate', '1 month', 'Short timeline'].map((t) => {
              const isSelected = timeline === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimeline(t)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-yellow)' : 'var(--color-white)',
                    fontWeight: isSelected ? 700 : 500,
                    color: 'var(--color-charcoal)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trade Requirements & Budget (Screen 11) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
              Trade Requirements
            </label>
            <select
              value={tradeRequirement}
              onChange={(e) => setTradeRequirement(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-white)',
              }}
            >
              <option value="Masonry">Masonry</option>
              <option value="Civil Structure">Civil Structure</option>
              <option value="Electrical High-Tension">Electrical High-Tension</option>
              <option value="HVAC & Plumbing">HVAC & Plumbing</option>
              <option value="Multi-Trade Turnkey">Multi-Trade Turnkey</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
              Total Budget (₹)
            </label>
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="e.g. 5000000"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        {/* Urgency Pills (Screen 11: Normal, Urgent, ASAP) */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 8 }}>
            Urgency
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Normal', 'Urgent', 'ASAP'].map((u) => {
              const isSelected = urgency === u;
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-yellow)' : 'var(--color-white)',
                    fontWeight: isSelected ? 700 : 500,
                    color: 'var(--color-charcoal)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {u}
                </button>
              );
            })}
          </div>
        </div>

        {/* Site Address */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
            Site Address
          </label>
          <input
            type="text"
            placeholder="Enter site address"
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.875rem',
            }}
          />
        </div>

        {/* Bottom Prominent Yellow Button (Screen 11: Post Step →) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              padding: '12px 36px',
              fontSize: '0.9375rem',
              fontWeight: 700,
            }}
          >
            {submitting ? 'Publishing...' : 'Post Step →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostProject;
