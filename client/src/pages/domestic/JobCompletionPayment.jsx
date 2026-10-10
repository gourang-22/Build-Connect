import { useState } from 'react';
import { Link } from 'react-router-dom';

const JobCompletionPayment = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'Cash' | 'UPI' | 'Card'
  const [processing, setProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentDone(true);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
          Job Completion & Payment
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
          Review the completed service, leave a specialist rating, and finalize invoice payment.
        </p>
      </div>

      {/* Main Card (Screen 17) */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {/* Specialist & Work Completed Row (Screen 17) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
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
              👨‍🔧
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
                AC Repair - Completed
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                Suresh Yadav • 3 Oct 2026, 4:00 PM
              </div>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80"
            alt="Repair completed"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80';
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* 1-5 Star Interactive Rating (Screen 17) */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 18 }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-charcoal)', display: 'block', marginBottom: 8 }}>
            Rate your experience
          </label>
          <div style={{ display: 'flex', gap: 8, fontSize: '1.75rem', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                style={{
                  color: (hoverRating || rating) >= star ? '#F59E0B' : '#CBD5E1',
                  transition: 'color 0.15s ease',
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
            Write a review
          </label>
          <textarea
            rows={3}
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.875rem',
              resize: 'none',
            }}
          />
        </div>

        {/* Itemized Invoice (Screen 17) */}
        <div style={{ backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-charcoal)', marginBottom: 12 }}>
            Invoice
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
              <span>Service Charge</span>
              <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>₹800</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
              <span>Parts & Materials</span>
              <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>₹200</span>
            </div>
            <div style={{ borderTop: '1px solid #CBD5E1', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              <span>Total</span>
              <span>₹1,000</span>
            </div>
          </div>
        </div>

        {/* Payment Options (Screen 17: Cash, UPI, Card) */}
        {!paymentDone && (
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 8 }}>
              Select Payment Method
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Cash', 'UPI', 'Card'].map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '8px 22px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-yellow)' : 'var(--color-white)',
                      fontWeight: isSelected ? 700 : 500,
                      color: 'var(--color-charcoal)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Yellow Pay & Complete Button */}
        {!paymentDone ? (
          <button
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="btn btn-primary"
            style={{
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              width: '100%',
              marginTop: 6,
            }}
          >
            {processing ? 'Processing Payment...' : 'Pay & Complete'}
          </button>
        ) : (
          <div
            style={{
              backgroundColor: '#DCFCE7',
              border: '1px solid #86EFAC',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>✓</span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#15803D' }}>
              Payment Successful!
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#166534' }}>
              Receipt sent to your email. Thank you for using BuildConnect!
            </div>
            <Link
              to="/domestic/dashboard"
              className="btn btn-secondary"
              style={{ marginTop: 8, padding: '8px 18px', fontSize: '0.8125rem' }}
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCompletionPayment;
