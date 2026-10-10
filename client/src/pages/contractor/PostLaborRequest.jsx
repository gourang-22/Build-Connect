import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLaborRequest } from '../../utils/api';

const TRADE_CATEGORIES = [
  'Select trade',
  'Helper',
  'Mason',
  'Electrician',
  'Carpenter',
  'Plumber',
  'Painter',
  'Welder',
  'Steel Fixer',
  'Bar Bender',
  'Tiler',
];

const PostLaborRequest = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State matching Screen 8
  const [tradeCategory, setTradeCategory] = useState('Select trade');
  const [headcount, setHeadcount] = useState(5);
  const [hiringMode, setHiringMode] = useState('Solo'); // 'Solo' | 'Squad' | 'Both'
  const [budgetType, setBudgetType] = useState('Daily Wage');
  const [wageAmount, setWageAmount] = useState(800);
  const [urgency, setUrgency] = useState('ASAP'); // 'Normal' | 'Urgent' | 'ASAP'
  const [siteAddress, setSiteAddress] = useState('');
  const [city, setCity] = useState('Mumbai');

  // Step 2 and 3 extra details
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);

  const handleNextStep = async () => {
    if (currentStep < 4) {
      if (currentStep === 1) {
        if (tradeCategory === 'Select trade') {
          setError('Please select a trade category.');
          return;
        }
        if (!siteAddress.trim()) {
          setError('Please enter the site address.');
          return;
        }
      }
      setError(null);
      setCurrentStep(currentStep + 1);
    } else {
      // Final Submit
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: `${tradeCategory} Labor Procurement`,
        description: description || `Urgent requirement for ${headcount} ${tradeCategory}(s) at ${siteAddress}.`,
        tradeCategory: tradeCategory === 'Select trade' ? 'Mason' : tradeCategory,
        headcountNeeded: Number(headcount) || 1,
        hiringMode: hiringMode.toLowerCase(),
        urgency: urgency === 'ASAP' ? 'today' : urgency === 'Urgent' ? 'tomorrow' : 'flexible',
        budget: {
          amount: Number(wageAmount) || 800,
          type: budgetType === 'Daily Wage' ? 'day' : 'fixed',
        },
        location: {
          address: siteAddress,
          city: city || 'Mumbai',
        },
      };

      await postLaborRequest(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/contractor/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const STEPS = [
    { num: 1, label: 'Details' },
    { num: 2, label: 'Requirements' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Review' },
  ];

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Title */}
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--color-charcoal)',
          margin: 0,
        }}
      >
        Post a Labor Request
      </h1>

      {/* Main Form Card (Screen 8) */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '32px 36px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Step Progress Wizard (Screen 8: 1 Details, 2 Requirements, 3 Location, 4 Review) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 20 }}>
          {STEPS.map((s, idx) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isActive || isCompleted ? 'var(--color-yellow)' : '#E2E8F0',
                    color: isActive || isCompleted ? 'var(--color-charcoal)' : 'var(--color-muted)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-charcoal)' : 'var(--color-muted)',
                  }}
                >
                  {s.label}
                </span>
                {idx < STEPS.length - 1 && (
                  <div style={{ width: 30, height: 1, backgroundColor: '#E2E8F0', margin: '0 8px' }} />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '10px 14px', backgroundColor: '#DCFCE7', color: 'var(--color-success)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            Labor request published successfully! Redirecting...
          </div>
        )}

        {/* Step 1: Details (Matches Screen 8 UI exactly) */}
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Row 1: Trade Category & Headcount */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
                  Trade Category
                </label>
                <select
                  value={tradeCategory}
                  onChange={(e) => setTradeCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--color-white)',
                    outline: 'none',
                  }}
                >
                  {TRADE_CATEGORIES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
                  Headcount
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={headcount}
                  onChange={(e) => setHeadcount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Row 2: Hiring Mode Pills (Solo, Squad, Both) */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 8 }}>
                Hiring Mode
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                {['Solo', 'Squad', 'Both'].map((mode) => {
                  const isSelected = hiringMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setHiringMode(mode)}
                      style={{
                        padding: '8px 22px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-yellow)' : 'var(--color-white)',
                        fontWeight: isSelected ? 700 : 500,
                        color: 'var(--color-charcoal)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Budget & Wage Type */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
                Budget & Wage Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12 }}>
                <select
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--color-white)',
                  }}
                >
                  <option value="Daily Wage">Daily Wage</option>
                  <option value="Fixed Contract">Fixed Contract</option>
                </select>

                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--color-muted)' }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    value={wageAmount}
                    onChange={(e) => setWageAmount(e.target.value)}
                    placeholder="800"
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
            </div>

            {/* Row 4: Urgency Pills (Normal, Urgent, ASAP) */}
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
                        padding: '8px 22px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '1px solid var(--color-yellow)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-yellow)' : 'var(--color-white)',
                        fontWeight: isSelected ? 700 : 500,
                        color: 'var(--color-charcoal)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {u}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 5: Site Address */}
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
          </div>
        )}

        {/* Step 2: Requirements */}
        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
                Minimum Experience Required (Years)
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
                Detailed Work Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify key tasks, tools required, safety gear expectations, and daily shift hours..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', resize: 'none' }}
              />
            </div>
          </div>
        )}

        {/* Step 3: Location Details */}
        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-charcoal)', display: 'block', marginBottom: 6 }}>
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
              />
            </div>
            <div style={{ padding: '14px 18px', backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
              📍 Workers located within a 25 km radius will receive immediate notifications regarding this request.
            </div>
          </div>
        )}

        {/* Step 4: Review Summary */}
        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>Review Labor Request</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.875rem' }}>
              <div><strong>Trade:</strong> {tradeCategory}</div>
              <div><strong>Headcount:</strong> {headcount} workers</div>
              <div><strong>Hiring Mode:</strong> {hiringMode}</div>
              <div><strong>Wage:</strong> ₹{wageAmount} / {budgetType}</div>
              <div><strong>Urgency:</strong> {urgency}</div>
              <div><strong>Address:</strong> {siteAddress}, {city}</div>
            </div>
          </div>
        )}

        {/* Bottom Action Button (Screen 8: Yellow "Next Step →") */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn btn-secondary"
              style={{ padding: '10px 22px', fontSize: '0.875rem' }}
            >
              ← Back
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNextStep}
            disabled={submitting}
            className="btn btn-primary"
            style={{
              padding: '12px 32px',
              fontSize: '0.9375rem',
              fontWeight: 700,
            }}
          >
            {submitting ? 'Submitting...' : currentStep === 4 ? 'Publish Request' : 'Next Step →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostLaborRequest;
