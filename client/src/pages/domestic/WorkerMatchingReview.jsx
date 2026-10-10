import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NEARBY_SPECIALISTS = [
  {
    _id: 'spec-1',
    name: 'Suresh Yadav',
    trade: 'Electrician',
    rating: 4.8,
    reviews: 24,
    distance: '2.1 km',
    visitFee: 450,
    avatar: '👨‍🔧',
    phone: '+91 98201 44521',
  },
  {
    _id: 'spec-2',
    name: 'Imran Shaikh',
    trade: 'Plumber',
    rating: 4.7,
    reviews: 18,
    distance: '3.4 km',
    visitFee: 400,
    avatar: '🔧',
    phone: '+91 98332 11984',
  },
  {
    _id: 'spec-3',
    name: 'Ramesh Patel',
    trade: 'AC Technician',
    rating: 4.6,
    reviews: 12,
    distance: '4.7 km',
    visitFee: 500,
    avatar: '❄️',
    phone: '+91 97114 62890',
  },
];

const INCOMING_BIDS = [
  {
    _id: 'bid-1',
    name: 'Santosh Kumar',
    trade: 'Electrician',
    proposedFee: 350,
    timeline: 'Within 45 mins',
    rating: 4.9,
    reviews: 31,
    avatar: '⚡',
  },
  {
    _id: 'bid-2',
    name: 'Mohd Arif',
    trade: 'Plumber',
    proposedFee: 300,
    timeline: 'Available at 4 PM',
    rating: 4.7,
    reviews: 19,
    avatar: '👨‍🔧',
  },
];

const WorkerMatchingReview = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' | 'bids'
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [callAlert, setCallAlert] = useState(null);

  const handleCall = (name, phone) => {
    setCallAlert(`Connecting call to ${name} (${phone})...`);
    setTimeout(() => {
      setCallAlert(null);
      navigate('/domestic/complete');
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
          Nearby Specialist Matching
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
          Browse verified trade technicians in your immediate locality or review active proposals.
        </p>
      </div>

      {callAlert && (
        <div style={{ padding: '12px 18px', backgroundColor: '#FEF9C3', color: '#854D0E', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.875rem' }}>
          📞 {callAlert}
        </div>
      )}

      {/* Main Container Card (Screen 16) */}
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
        {/* Tabs (Screen 16: Nearby Specialists vs Incoming Bids) */}
        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--color-border)', paddingBottom: 16 }}>
          <button
            type="button"
            onClick={() => setActiveTab('nearby')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'nearby' ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
              backgroundColor: activeTab === 'nearby' ? 'var(--color-yellow)' : 'var(--color-white)',
              fontWeight: activeTab === 'nearby' ? 700 : 500,
              color: 'var(--color-charcoal)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Nearby Specialists
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bids')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'bids' ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
              backgroundColor: activeTab === 'bids' ? 'var(--color-yellow)' : 'var(--color-white)',
              fontWeight: activeTab === 'bids' ? 700 : 500,
              color: 'var(--color-charcoal)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Incoming Bids ({INCOMING_BIDS.length})
          </button>
        </div>

        {/* Tab 1: Nearby Specialists (Screen 16) */}
        {activeTab === 'nearby' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {NEARBY_SPECIALISTS.map((spec) => (
              <div
                key={spec._id}
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
                {/* Left: Avatar & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: '#FEF9C3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      border: '2px solid var(--color-yellow)',
                    }}
                  >
                    {spec.avatar}
                  </div>

                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                      {spec.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                      {spec.trade} • ⭐ {spec.rating} ({spec.reviews}) • {spec.distance}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-charcoal)', fontWeight: 600, marginTop: 2 }}>
                      ₹{spec.visitFee} Indicative Visit Fee
                    </div>
                  </div>
                </div>

                {/* Right: Actions (View Profile & Yellow Call button) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSpecialist(spec)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 600 }}
                  >
                    View Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCall(spec.name, spec.phone)}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 22px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Incoming Bids */}
        {activeTab === 'bids' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {INCOMING_BIDS.map((bid) => (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: '#E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                    }}
                  >
                    {bid.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                      {bid.name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                      {bid.trade} • ⭐ {bid.rating} ({bid.reviews}) • {bid.timeline}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-charcoal)', fontWeight: 700, marginTop: 2 }}>
                      Proposed Fee: ₹{bid.proposedFee}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleCall(bid.name, '+91 98000 00000')}
                    className="btn btn-primary"
                    style={{ padding: '8px 22px', fontSize: '0.8125rem', fontWeight: 700 }}
                  >
                    Book Specialist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specialist Profile Modal */}
      {selectedSpecialist && (
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
          onClick={() => setSelectedSpecialist(null)}
        >
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: 480,
              width: '100%',
              padding: 24,
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{selectedSpecialist.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedSpecialist(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              <div><strong>Trade Specialization:</strong> {selectedSpecialist.trade}</div>
              <div><strong>Rating:</strong> ⭐ {selectedSpecialist.rating} ({selectedSpecialist.reviews} customer reviews)</div>
              <div><strong>Proximity:</strong> {selectedSpecialist.distance} from your address</div>
              <div><strong>Indicative Fee:</strong> ₹{selectedSpecialist.visitFee}</div>
              <div><strong>ID & Background Check:</strong> Verified ✓</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setSelectedSpecialist(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.875rem' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedSpecialist(null);
                  handleCall(selectedSpecialist.name, selectedSpecialist.phone);
                }}
                className="btn btn-primary"
                style={{ padding: '8px 22px', fontSize: '0.875rem', fontWeight: 700 }}
              >
                Call Specialist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerMatchingReview;
