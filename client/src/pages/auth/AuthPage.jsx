import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_OPTIONS = [
  { value: 'worker',     icon: '👷', title: 'Worker',          desc: 'Find jobs & grow' },
  { value: 'contractor', icon: '🏗️', title: 'Contractor',      desc: 'Hire labor & bid' },
  { value: 'builder',    icon: '🏛️', title: 'Builder',         desc: 'Post tenders & projects' },
  { value: 'domestic',   icon: '🏠', title: 'Domestic Client', desc: 'Get home help' },
];

const TRADE_CATEGORIES = [
  'Electrician', 'Plumber', 'Mason', 'Carpenter', 'Painter',
  'Welder', 'Tiler', 'Roofer', 'HVAC Technician', 'Civil Engineer',
  'Steel Fixer', 'Scaffolder', 'Glazier', 'Flooring Specialist', 'General Labor',
  'AC Repair', 'Pest Control', 'Appliance Repair', 'Deep Cleaning', 'Furniture Assembly',
];

const ROLE_DASHBOARDS = {
  worker:     '/worker/dashboard',
  contractor: '/contractor/dashboard',
  builder:    '/builder/dashboard',
  domestic:   '/domestic/dashboard',
};

const AuthPage = ({ mode = 'login' }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = mode === 'login';
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'worker',
    tradeCategory: 'Mason',
    phone: '',
    city: 'Mumbai',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'phone'

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(form.email, form.password);
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone,
          location: { city: form.city },
          ...(form.role === 'worker' && { tradeCategory: form.tradeCategory }),
        };
        user = await register(payload);
      }

      const dest = from || ROLE_DASHBOARDS[user.role] || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7F8FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid #E5E7EB',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          overflow: 'hidden',
        }}
      >
        {/* Left Form Column */}
        <div style={{ padding: '36px clamp(20px, 4vw, 44px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Logo Header */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{ width: '34px', height: '34px', backgroundColor: '#FFC629', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              🏗️
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#101820' }}>
              Build<span style={{ color: '#FFC629' }}>Connect</span>
            </span>
          </Link>

          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#101820', margin: '0 0 6px' }}>
              {isLogin ? 'Sign In' : 'Create Your Account'}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0 0 24px' }}>
              {isLogin ? 'Welcome back! Login to your BuildConnect account' : 'Choose your role to get started'}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '18px' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Role Picker for Sign Up (from Reference Image 3) */}
          {!isLogin && (
            <div style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Select Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {ROLE_OPTIONS.map((opt) => {
                  const isSelected = form.role === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => setForm((f) => ({ ...f, role: opt.value }))}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #FFC629' : '1px solid #E5E7EB',
                        backgroundColor: isSelected ? 'rgba(255, 198, 41, 0.12)' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#101820' }}>{opt.title}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{opt.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Method Tabs for Login (Email vs Phone) */}
          {isLogin && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#F1F3F7', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: authMethod === 'email' ? '#FFC629' : 'transparent',
                  color: authMethod === 'email' ? '#101820' : '#64748B',
                  fontWeight: authMethod === 'email' ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: authMethod === 'phone' ? '#FFC629' : 'transparent',
                  color: authMethod === 'phone' ? '#101820' : '#64748B',
                  fontWeight: authMethod === 'phone' ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Phone
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={form.name}
                  onChange={update('name')}
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{authMethod === 'phone' ? 'Phone Number *' : 'Email Address *'}</label>
              <input
                type={authMethod === 'phone' ? 'tel' : 'email'}
                required
                placeholder={authMethod === 'phone' ? '+91 98765 43210' : 'you@example.com'}
                value={form.email}
                onChange={update('email')}
                className="form-input"
              />
            </div>

            {!isLogin && form.role === 'worker' && (
              <div className="form-group">
                <label className="form-label">Trade Specialty *</label>
                <select
                  value={form.tradeCategory}
                  onChange={update('tradeCategory')}
                  className="form-select"
                  required
                >
                  {TRADE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={update('phone')}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={update('city')}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password *</label>
                {isLogin && (
                  <span style={{ fontSize: '0.75rem', color: '#B45309', cursor: 'pointer', fontWeight: 600 }}>
                    Forgot password?
                  </span>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={form.password}
                onChange={update('password')}
                className="form-input"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  className="form-input"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ marginTop: '10px', height: '44px', fontSize: '0.95rem' }}
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Social login buttons (from Reference Image 3) */}
          {isLogin && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '14px', position: 'relative' }}>
                <span>or continue with</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px', fontSize: '0.8rem' }}
                >
                  <span>🌐</span> Google
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px', fontSize: '0.8rem' }}
                >
                  <span>🍎</span> Apple
                </button>
              </div>
            </div>
          )}

          {/* Switch link */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.82rem', color: '#64748B' }}>
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link to="/auth/signup" style={{ color: '#101820', fontWeight: 700, textDecoration: 'underline' }}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/auth/login" style={{ color: '#101820', fontWeight: 700, textDecoration: 'underline' }}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Photo Column (from Reference Image 3) */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#101820',
            overflow: 'hidden',
            minHeight: '380px',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80"
            alt="Skilled construction worker"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80';
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: '36px',
              background: 'linear-gradient(to top, rgba(16,24,32,0.95) 20%, transparent)',
              color: '#FFFFFF',
              width: '100%',
            }}
          >
            <div style={{ display: 'inline-block', backgroundColor: '#FFC629', color: '#101820', fontWeight: 800, fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' }}>
              DIRECT WORKFORCE PLATFORM
            </div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px' }}>
              Build Without Friction
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              Connect directly with verified civil tradesmen, commercial contractors and builders across India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
