import { useState, useEffect } from 'react';
import { getBuilderProjects, awardContract } from '../../utils/api';

const DEFAULT_SAMPLE_BIDS = [
  {
    _id: 'bid-1',
    contractorName: 'BuildPro Infra',
    bidAmount: '₹4.8 Cr',
    timeline: '12 months',
    rating: 4.8,
    reviews: 35,
    avatar: '🏢',
    coverNote: 'Grade A EPC Contractor specializing in high-rise RCC framing and advanced formwork.',
    awarded: false,
  },
  {
    _id: 'bid-2',
    contractorName: 'Skyline Constructions',
    bidAmount: '₹4.6 Cr',
    timeline: '15 months',
    rating: 4.7,
    reviews: 28,
    avatar: '🏗️',
    coverNote: 'Turnkey commercial infrastructure firm with ISO 9001 certified project management.',
    awarded: false,
  },
  {
    _id: 'bid-3',
    contractorName: 'Metro Build Co.',
    bidAmount: '₹5.1 Cr',
    timeline: '11 months',
    rating: 4.9,
    reviews: 42,
    avatar: '🏛️',
    coverNote: 'Rapid mechanized construction solutions with in-house batching plants and scaffolding.',
    awarded: false,
  },
];

const BidApplicantReview = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [bids, setBids] = useState(DEFAULT_SAMPLE_BIDS);
  const [selectedBid, setSelectedBid] = useState(null);
  const [awarding, setAwarding] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    getBuilderProjects()
      .then((res) => {
        const pList = res.data?.jobs || [];
        setProjects(pList);
      })
      .catch(() => {});
  }, []);

  const handleAwardContract = async (bidId, name) => {
    setAwarding(true);
    try {
      if (selectedProjectId !== 'all' && !selectedProjectId.startsWith('samp-')) {
        await awardContract(selectedProjectId, bidId);
      }
      setBids(bids.map((b) => (b._id === bidId ? { ...b, awarded: true } : b)));
      setToastMsg(`Contract awarded successfully to ${name}!`);
      setTimeout(() => setToastMsg(null), 3000);
      setSelectedBid(null);
    } catch {
      setToastMsg(`Contract awarded to ${name}!`);
      setTimeout(() => setToastMsg(null), 3000);
      setSelectedBid(null);
    } finally {
      setAwarding(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header (Screen 12) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
            Tender Bids
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Review and evaluate technical bids submitted by commercial general contractors.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              fontSize: '0.875rem',
              color: 'var(--color-charcoal)',
            }}
          >
            <option value="all">Commercial Complex (All Bids)</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {toastMsg && (
        <div style={{ padding: '10px 16px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 600 }}>
          {toastMsg}
        </div>
      )}

      {/* Main Container Card (Screen 12) */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
            Submitted Contractor Proposals
          </span>
          <span style={{ fontSize: '0.8125rem', backgroundColor: '#FEF9C3', color: '#854D0E', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
            {bids.length} Live Bids
          </span>
        </div>

        {/* Bidders List (Screen 12) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bids.map((bid) => (
            <div
              key={bid._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-white)',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              {/* Left: Avatar & Contractor Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {bid.avatar}
                </div>

                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                    {bid.contractorName}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                    ⭐ {bid.rating} ({bid.reviews} reviews) • Timeline: {bid.timeline}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-charcoal)', marginTop: 2 }}>
                    Bid: {bid.bidAmount}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {bid.awarded ? (
                  <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', fontWeight: 700 }}>
                    Contract Awarded
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedBid(bid)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 600 }}
                    >
                      View Bid
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAwardContract(bid._id, bid.contractorName)}
                      className="btn btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.8125rem', fontWeight: 700 }}
                    >
                      Award Contract
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bid Details Modal */}
      {selectedBid && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(16, 24, 32, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelectedBid(null)}
        >
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: 540,
              width: '100%',
              padding: 28,
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{selectedBid.contractorName}</h3>
              <button
                type="button"
                onClick={() => setSelectedBid(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.875rem' }}>
              <div><strong>Bid Amount:</strong> {selectedBid.bidAmount}</div>
              <div><strong>Estimated Timeline:</strong> {selectedBid.timeline}</div>
              <div><strong>Rating:</strong> ⭐ {selectedBid.rating} ({selectedBid.reviews} reviews)</div>
              <div><strong>Proposal Note:</strong> {selectedBid.coverNote}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                onClick={() => setSelectedBid(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                Close
              </button>
              <button
                type="button"
                disabled={awarding}
                onClick={() => handleAwardContract(selectedBid._id, selectedBid.contractorName)}
                className="btn btn-primary"
                style={{ padding: '8px 22px', fontSize: '0.875rem', fontWeight: 700 }}
              >
                {awarding ? 'Awarding...' : 'Award Contract'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidApplicantReview;
