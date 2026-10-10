import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getContractorTenderFeed, getContractorBids, submitTenderBid } from '../../utils/api';

const TenderFeed = () => {
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [error, setError] = useState(null);

  // Selected Tender for Bidding Modal
  const [selectedTender, setSelectedTender] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [proposedTimeline, setProposedTimeline] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const fetchTendersAndBids = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (cityFilter.trim()) params.city = cityFilter.trim();

      const [tendersRes, bidsRes] = await Promise.all([
        getContractorTenderFeed(params),
        getContractorBids(),
      ]);

      setTenders(tendersRes.data?.tenders || []);
      setMyBids(bidsRes.data?.bids || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to load builder tender feed.'
      );
    } finally {
      setLoading(false);
    }
  }, [cityFilter]);

  useEffect(() => {
    fetchTendersAndBids();
  }, [fetchTendersAndBids]);

  const handleOpenBidModal = (tender) => {
    setSelectedTender(tender);
    setBidAmount(tender.totalBudget || '');
    setProposedTimeline(
      tender.timeline?.durationMonths
        ? `${tender.timeline.durationMonths} Months`
        : 'As scheduled'
    );
    setCoverLetter('');
    setModalError(null);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setModalError(null);
    setSubmittingBid(true);

    try {
      const payload = {
        bidAmount: Number(bidAmount) || undefined,
        proposedTimeline,
        coverLetter,
      };

      await submitTenderBid(selectedTender._id, payload);
      setToastMsg('Tender bid submitted successfully to the Builder!');
      setTimeout(() => setToastMsg(null), 3500);
      setSelectedTender(null);
      await fetchTendersAndBids();
    } catch (err) {
      setModalError(
        err.response?.data?.message ||
        'Failed to submit tender bid. Please check your inputs.'
      );
    } finally {
      setSubmittingBid(false);
    }
  };

  return (
    <div style={{ padding: '28px 24px', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Hero Card with High-Contrast Light Text ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #101820 0%, #1A2533 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-xl)',
          padding: '30px 34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ background: 'rgba(59,130,246,0.2)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.35)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
              🏛️ Builder Commercial Projects
            </span>
            <span style={{ background: 'rgba(255,198,41,0.18)', color: '#FFC629', border: '1px solid rgba(255,198,41,0.4)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: 700 }}>
              Multi-Phase Tenders
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#FFFFFF', lineHeight: 1.25 }}>
            High-Budget Builder Tender Feed
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', margin: '8px 0 0', maxWidth: 640 }}>
            Direct access to prime infrastructure and residential tower contracts posted by verified Builders.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={fetchTendersAndBids}
            className="btn btn-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.25)',
              fontWeight: 600,
            }}
          >
            🔄 Refresh Tenders
          </button>
        </div>
      </section>

      {/* Notifications */}
      {toastMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>✅</span>
          <span>{toastMsg}</span>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Filter Row */}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-lg)', padding: '14px 20px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ flex: 1, maxWidth: 420 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search tenders by City (e.g. Mumbai, Bengaluru)..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          Showing <strong style={{ color: 'var(--color-text-primary)' }}>{tenders.length}</strong> active open tender{tenders.length === 1 ? '' : 's'}
        </div>
      </section>

      {/* Tender Grid */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 12 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--color-text-muted)' }}>Loading builder tender catalog...</p>
        </div>
      ) : tenders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '60px 20px', gap: 14, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-xl)' }}>
          <span style={{ fontSize: '3rem' }}>🏛️</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>No Open Tenders Found</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: 450, margin: 0 }}>
            There are currently no active builder tenders matching your location filter. Check back soon as builders post new project phases daily.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {tenders.map((tender) => {
            const hasBid = myBids.some((b) => b._id === tender._id);

            return (
              <article
                key={tender._id}
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      {tender.projectPhase && (
                        <span style={{ background: 'rgba(59,130,246,0.12)', color: '#2563EB', border: '1px solid rgba(59,130,246,0.25)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 600, display: 'inline-block', marginBottom: 6 }}>
                          Phase: {tender.projectPhase}
                        </span>
                      )}
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>{tender.title}</h3>
                    </div>

                    {hasBid && (
                      <span style={{ background: 'var(--color-success-tint)', color: 'var(--color-success)', border: '1px solid var(--color-success-border)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>
                        ✓ Bid Submitted
                      </span>
                    )}
                  </div>
                </div>

                {/* Builder Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-bg-page)', border: '1px solid #E5E7EB', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.4rem' }}>🏛️</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                      {tender.postedBy?.organizationName || tender.postedBy?.name || 'Lead Builder'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      ⭐ Rating: {tender.postedBy?.rating?.average || '5.0'} · Verified Builder
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div style={{ background: 'rgba(255, 198, 41, 0.08)', border: '1px solid rgba(255, 198, 41, 0.35)', padding: '14px 18px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                      Total Tender Envelope
                    </span>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-charcoal)', marginTop: 2 }}>
                      {tender.totalBudget ? `₹${tender.totalBudget.toLocaleString()}` : 'Budget On Request'}
                    </div>
                  </div>
                  <span style={{ fontSize: '1.8rem' }}>💼</span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {tender.description}
                </p>

                {/* Trade Requirements */}
                {tender.tradeRequirements && tender.tradeRequirements.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
                      Trade Squads Required:
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {tender.tradeRequirements.map((tr, idx) => (
                        <span key={idx} style={{ background: 'var(--color-bg-page)', color: 'var(--color-charcoal)', border: '1px solid #E5E7EB', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 600 }}>
                          {tr.category}: {tr.headcount}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location & Timeline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #E5E7EB' }}>
                  <span>📍 {tender.location?.city || 'Site Location'}</span>
                  <span>
                    ⏱️ {tender.timeline?.durationMonths ? `${tender.timeline.durationMonths} Months` : 'Project Timeline'}
                  </span>
                </div>

                {/* Footer Button */}
                <button
                  type="button"
                  onClick={() => handleOpenBidModal(tender)}
                  className={`btn ${hasBid ? 'btn-secondary' : 'btn-primary'} btn-sm btn-full`}
                >
                  {hasBid ? 'Review / Update Bid' : '📝 Submit Detailed Bid'}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Submit Bid Modal ── */}
      {selectedTender && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          onClick={() => setSelectedTender(null)}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                background: 'var(--bg-elevated)',
              }}
            >
              <div>
                <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: 6 }}>
                  🏛️ {selectedTender.postedBy?.organizationName || 'Builder Project'}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Bid Proposal: {selectedTender.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTender(null)}
                className="btn btn-ghost"
                style={{ width: 36, height: 36, padding: 0, borderRadius: '50%' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {modalError && (
                <div className="alert alert-danger">
                  <span>⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Builder Tender Envelope
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60A5FA', marginTop: 2 }}>
                    {selectedTender.totalBudget ? `₹${selectedTender.totalBudget.toLocaleString()}` : 'Budget on request'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Project Location
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                    {selectedTender.location?.city || 'Local Site'}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitBid} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Total Contract Cost Bid (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 4500000"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Proposed Delivery Timeline *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 5 Months"
                      value={proposedTimeline}
                      onChange={(e) => setProposedTimeline(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Technical Proposal & Methodology *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="State your machinery capacity, squad deployment plan, quality control processes, and past comparable project completions..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingBid}
                  className="btn btn-primary btn-full"
                >
                  {submittingBid ? 'Submitting Proposal to Builder...' : '🚀 Confirm & Submit Tender Bid'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderFeed;
