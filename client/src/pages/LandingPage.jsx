import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const ROLES = [
  {
    id: 'worker',
    emoji: '👷',
    title: 'Workers',
    tagline: 'Find jobs & grow your career',
    color: '#FFC629',
    link: '/auth/signup?role=worker',
  },
  {
    id: 'contractor',
    emoji: '🏗️',
    title: 'Contractors',
    tagline: 'Hire skilled labor for your projects',
    color: '#FFC629',
    link: '/auth/signup?role=contractor',
  },
  {
    id: 'builder',
    emoji: '🏛️',
    title: 'Builders',
    tagline: 'Find tenders & build projects',
    color: '#FFC629',
    link: '/auth/signup?role=builder',
  },
  {
    id: 'domestic',
    emoji: '🏠',
    title: 'Domestic Clients',
    tagline: 'Get trusted help for home repairs',
    color: '#FFC629',
    link: '/auth/signup?role=domestic',
  },
];

const STATS = [
  { value: '50K+', label: 'Registered Workers' },
  { value: '5K+', label: 'Active Projects' },
  { value: '2K+', label: 'Happy Clients' },
  { value: '4.8 ★', label: 'Average Rating' },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Choose Your Role',
    desc: 'Select your profile as Worker, Contractor, Builder, or Domestic Client.',
  },
  {
    step: '2',
    title: 'Find Opportunities',
    desc: 'Browse jobs, tenders, or post requirements based on your needs.',
  },
  {
    step: '3',
    title: 'Get Hired / Win',
    desc: 'Apply for jobs, get shortlisted, or win commercial tenders.',
  },
  {
    step: '4',
    title: 'Work & Succeed',
    desc: 'Complete your work, get paid safely, and grow your verified reputation.',
  },
];

const TRUST_SAFETY = [
  {
    icon: '🛡️',
    title: 'Verified Profiles',
    desc: 'Every tradesman and contractor profile is background & ID verified.',
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    desc: 'Transparent milestones and guaranteed settlements on job completion.',
  },
  {
    icon: '🎧',
    title: 'Dispute Support',
    desc: 'Dedicated resolution team for site contracts and home repair tickets.',
  },
];

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FA' }}>
      <Navbar />

      {/* ── 1. Hero Section (Split banner with Construction Photography) ── */}
      <section
        style={{
          backgroundColor: '#101820',
          color: '#FFFFFF',
          padding: '60px clamp(16px, 5vw, 64px) 70px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Text Column */}
          <div style={{ maxWidth: '600px' }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 198, 41, 0.15)',
                color: '#FFC629',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '18px',
                border: '1px solid rgba(255, 198, 41, 0.3)',
              }}
            >
              ⚡ INDIA'S TRUSTED CIVIL &amp; TRADES NETWORK
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                margin: '0 0 18px',
                letterSpacing: '-0.02em',
              }}
            >
              The All-in-One Platform for{' '}
              <span style={{ color: '#FFC629' }}>Construction &amp; Skilled Labor</span>
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: '#CBD5E1',
                lineHeight: 1.6,
                margin: '0 0 32px',
              }}
            >
              Connecting workers, contractors, builders and homeowners — with trust, transparency and ease.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/auth/signup" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link
                to="/how-it-works"
                className="btn btn-secondary btn-lg"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                }}
              >
                ▶ How It Works
              </Link>
            </div>
          </div>

          {/* Right Photographic Visual Card */}
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
              border: '2px solid rgba(255,255,255,0.1)',
              position: 'relative',
              maxHeight: '440px',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80"
              alt="Construction team on site"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80';
              }}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '440px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Overlay Banner */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(16,24,32,0.95), transparent)',
                padding: '24px 24px 20px',
                color: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>👷‍♂️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Verified Site Teams &amp; Solo Pros</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Available across Mumbai, Bengaluru, Delhi &amp; Pune</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Four Role Cards (Direct from Reference Image 3) ── */}
      <section style={{ maxWidth: '1240px', margin: '-32px auto 50px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {ROLES.map((r) => (
            <Link
              key={r.id}
              to={r.link}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px 20px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 16px rgba(16, 24, 32, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#FFC629';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 198, 41, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 24, 32, 0.06)';
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 198, 41, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  flexShrink: 0,
                }}
              >
                {r.emoji}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 4px', color: '#101820' }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  {r.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Platform Statistics Bar (from Reference Image 3) ── */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 60px', padding: '0 24px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            padding: '24px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {STATS.map((s, idx) => (
            <div key={idx} style={{ padding: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#101820', letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. How It Works (from Reference Image 3, Section 2) ── */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 70px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '10px' }}>
            STEP-BY-STEP WORKFLOW
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#101820', margin: '8px 0 0' }}>
            How It Works
          </h2>
          <p style={{ color: '#64748B', marginTop: '6px' }}>
            Simple 4-stage process designed for speed, clarity and reliability.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.step}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                padding: '28px 22px',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FFC629',
                  color: '#101820',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  marginBottom: '16px',
                }}
              >
                {step.step}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px', color: '#101820' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Trust & Safety Section (from Reference Image 3) ── */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#101820', margin: '0 0 6px' }}>
            Trust &amp; Safety
          </h2>
          <p style={{ color: '#64748B', margin: 0 }}>
            Every contractor, civil squad and homeowner protected by transparent platform guarantees.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {TRUST_SAFETY.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                padding: '28px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '18px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#101820', margin: '0 0 6px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Final Call to Action ── */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 90px', padding: '0 24px' }}>
        <div
          style={{
            backgroundColor: '#101820',
            borderRadius: '24px',
            padding: '56px 40px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 12px 36px rgba(16,24,32,0.15)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px' }}>
            Ready to Build With BuildConnect?
          </h2>
          <p style={{ color: '#CBD5E1', maxWidth: '580px', margin: '0 auto 28px', fontSize: '1rem', lineHeight: 1.6 }}>
            Join thousands of civil workers, commercial contractors, top builders, and local homeowners today.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth/signup" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
            <Link to="/auth/login" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'transparent', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
