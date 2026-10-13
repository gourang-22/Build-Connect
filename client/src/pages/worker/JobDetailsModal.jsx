import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applyForJob } from '../../utils/api';

const JobDetailsModal = ({ job, onClose, onApplySuccess, userTeam }) => {
  const { user } = useAuth();
  const [isTeamBid, setIsTeamBid] = useState(false);
  const [bidAmount, setBidAmount] = useState(
    job?.budget?.amount || user?.dailyWageExpectation || 600
  );
  const [proposedTimeline, setProposedTimeline] = useState('Available immediately');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!job) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (job._id && job._id.startsWith('sample-')) {
        setError('This is a preview template card. Please refresh your feed to view and apply to live verified jobs from our database.');
        setSubmitting(false);
        return;
      }

      const payload = {
        bidAmount: Number(bidAmount) || undefined,
        proposedTimeline,
        coverLetter,
        teamId: isTeamBid && userTeam?._id ? userTeam._id : undefined,
      };
      await applyForJob(job._id, payload);
      setSuccessMsg('Proposal submitted successfully! You can track this under My Gigs.');
      setTimeout(() => {
        if (onApplySuccess) onApplySuccess(job._id);
        onClose();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to submit proposal. Please verify your inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(16, 24, 32, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          animation: 'fadeUp 0.2s ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header (Screen 5: < Back) */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-charcoal)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            ← Back
          </button>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted)' }}>
            Job ID #{job._id?.slice(-6) || 'BC-408'}
          </span>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header Row with Thumbnail (Screen 5) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-charcoal)',
                  margin: '0 0 6px 0',
                }}
              >
                {job.title}
              </h2>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: 8 }}>
                {job.company || 'Apex Construction'} • {job.location?.city || 'Andheri'} (
                {job.location?.distance || '8 km'})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8125rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  ₹{job.budget?.amount || 600}/day
                </span>
                <span>•</span>
                <span style={{ color: 'var(--color-muted)' }}>⏱ {job.hours || '8 hrs'}</span>
                <span>•</span>
                <span style={{ color: 'var(--color-muted)' }}>🕒 {job.postedTime || '2 days ago'}</span>
              </div>
            </div>

            <img
              src={job.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=300&q=80'}
              alt={job.title}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=300&q=80';
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-lg)',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          </div>

          {/* Job Description (Screen 5) */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0 0 8px 0' }}>
              Job Description
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
              <li>Build brick walls, partitions, and masonry structures adhering to architectural blueprints.</li>
              <li>Read drawings, take on-site measurements, and prepare mortar mixes.</li>
              <li>Maintain high safety standards and proper PPE equipment throughout daily operations.</li>
            </ul>
          </div>

          {/* Requirements (Screen 5) */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)', margin: '0 0 8px 0' }}>
              Requirements
            </h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(job.requirements || ['Experience', 'Own Tools', 'ID Proof']).map((req) => (
                <span
                  key={req}
                  style={{
                    backgroundColor: 'var(--color-bg-page)',
                    border: '1px solid var(--color-border)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--color-charcoal)',
                  }}
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Employer Rating (Screen 5) */}
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--color-bg-page)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                }}
              >
                👷‍♂️
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                  {job.employerName || 'Apex Construction'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                  ⭐ {job.employerRating || 4.8} ({job.employerReviews || 30} reviews)
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                padding: '4px 8px',
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              Verified Employer
            </span>
          </div>

          {/* Proposal Submission Form */}
          <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{ color: 'var(--color-error)', fontSize: '0.8125rem', background: '#FEE2E2', padding: '8px 12px', borderRadius: 6 }}>
                {error}
              </div>
            )}
            {successMsg && (
              <div style={{ color: 'var(--color-success)', fontSize: '0.8125rem', background: '#DCFCE7', padding: '8px 12px', borderRadius: 6 }}>
                {successMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 4 }}>
                  Your Proposed Rate (₹/day)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 4 }}>
                  Availability / Timeline
                </label>
                <input
                  type="text"
                  value={proposedTimeline}
                  onChange={(e) => setProposedTimeline(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 4 }}>
                Pitch / Note to Employer (Optional)
              </label>
              <textarea
                rows={2}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Mention your relevant experience, tools you own, or previous similar projects..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  resize: 'none',
                }}
              />
            </div>

            {/* Solo or Squad application option */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <input
                type="checkbox"
                id="apply-as-squad"
                checked={isTeamBid}
                onChange={(e) => setIsTeamBid(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="apply-as-squad" style={{ fontSize: '0.8125rem', color: 'var(--color-charcoal)', cursor: 'pointer', fontWeight: 500 }}>
                Apply as a Squad / Team (deploy entire registered squad)
              </label>
            </div>

            {/* Prominent Yellow Button (Screen 5) */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 700,
                marginTop: 8,
              }}
            >
              {submitting ? 'Submitting...' : 'Apply Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
