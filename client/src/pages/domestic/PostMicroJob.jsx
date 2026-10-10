import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postDomesticJob } from '../../utils/api';

const SERVICE_OPTIONS = [
  'Electrical Repair',
  'Plumbing Repair',
  'AC Repair & Servicing',
  'Carpentry & Woodwork',
  'House Painting',
  'Deep Cleaning',
  'Pest Control',
  'Appliance Repair',
  'General Handyman',
];

const PostMicroJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category');

  const initialCat = catParam === 'plumbing' ? 'Plumbing Repair'
    : catParam === 'ac' ? 'AC Repair & Servicing'
    : catParam === 'carpentry' ? 'Carpentry & Woodwork'
    : 'Electrical Repair';

  const [category, setCategory] = useState(initialCat);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Today'); // 'Today' | 'Tomorrow' | 'Weekend' | 'Flexible'
  const [visitFee, setVisitFee] = useState(300);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a problem title.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your home address.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        title,
        description: description || `${category} needed at ${address}.`,
        tradeCategory: category.split(' ')[0],
        urgency: urgency.toLowerCase(),
        budget: {
          amount: Number(visitFee) || 300,
          type: 'fixed',
        },
        location: {
          address,
          city: city || 'Mumbai',
        },
      };

      await postDomesticJob(payload);
      navigate('/domestic/workers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book service. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 740, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: '0 0 4px 0' }}>
          Book a Home Repair
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
          Connect with vetted local specialists for fast, transparent household fixes.
        </p>
      </div>

      {/* Main Form Card (Screen 15) */}
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
          gap: 22,
        }}
      >
        {error && (
          <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Row 1: Category & Problem Title (Screen 15) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
              Service Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-white)',
              }}
            >
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
              Problem Title
            </label>
            <input
              type="text"
              placeholder="e.g. Fan not working"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
        </div>

        {/* Description (Screen 15) */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

        {/* Urgency Pills (Screen 15: Today, Tomorrow, Weekend, Flexible) */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 8 }}>
            Urgency
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Today', 'Tomorrow', 'Weekend', 'Flexible'].map((u) => {
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

        {/* Fair Visit Fee (₹) */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
            Fair Visit Fee (₹)
          </label>
          <div style={{ position: 'relative', maxWidth: 280 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--color-muted)' }}>
              ₹
            </span>
            <input
              type="number"
              value={visitFee}
              onChange={(e) => setVisitFee(e.target.value)}
              placeholder="300"
              style={{
                width: '100%',
                padding: '10px 14px 10px 32px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
              }}
            />
          </div>
        </div>

        {/* Home Address */}
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
            Home Address
          </label>
          <input
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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

        {/* Action Button (Screen 15: Yellow Next Step) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
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
            {submitting ? 'Booking...' : 'Next Step →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostMicroJob;
