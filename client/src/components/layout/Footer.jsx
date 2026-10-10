import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '48px clamp(16px, 4vw, 48px) 28px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  background: 'var(--accent)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                🏗️
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '700',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                Build<span style={{ color: 'var(--accent)' }}>Connect</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '260px' }}>
              India's all-in-one platform connecting skilled workers, contractors, builders, and homeowners.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Platform
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/auth/signup', label: 'For Workers' },
                { to: '/auth/signup', label: 'For Contractors' },
                { to: '/auth/signup', label: 'For Builders' },
                { to: '/auth/signup', label: 'For Homeowners' },
              ].map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={(e) => (e.target.style.color = 'var(--accent)')}
                  onMouseOut={(e) => (e.target.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Company
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { to: '/about', label: 'About Us' },
                { to: '/how-it-works', label: 'How It Works' },
              ].map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseOver={(e) => (e.target.style.color = 'var(--accent)')}
                  onMouseOut={(e) => (e.target.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact / CTA */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Get Started
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '14px' }}>
              Join thousands of professionals on BuildConnect today.
            </p>
            <Link to="/auth/signup" className="btn btn-primary btn-sm">
              Create Free Account
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} BuildConnect. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service'].map((label) => (
              <span
                key={label}
                style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
