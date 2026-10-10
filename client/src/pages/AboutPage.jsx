import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Choose Your Role',
    desc: 'Select your profile as Worker, Contractor, Builder or Domestic Client.',
  },
  {
    step: '2',
    title: 'Find Opportunities',
    desc: 'Browse jobs, tenders or post requirements based on your needs.',
  },
  {
    step: '3',
    title: 'Get Hired / Win',
    desc: 'Apply for jobs, get shortlisted or win tenders with transparent terms.',
  },
  {
    step: '4',
    title: 'Work & Succeed',
    desc: 'Complete your work, get paid and grow your reputation.',
  },
];

const TRUST_SAFETY = [
  {
    icon: '🛡️',
    title: 'Verified Profiles',
    desc: 'ID & skill verification for every active tradesman and contractor.',
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    desc: 'Milestone escrow & guaranteed safe payments on job completion.',
  },
  {
    icon: '🎧',
    title: 'Dispute Support',
    desc: 'Dedicated support team for resolving site and payment queries.',
  },
];

const AboutPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FA' }}>
      <Navbar />

      {/* Hero Section matching Reference Image 3 */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '60px clamp(16px, 5vw, 64px) 70px',
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
          <div>
            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
                fontWeight: 800,
                color: '#101820',
                lineHeight: 1.15,
                margin: '0 0 16px',
                letterSpacing: '-0.02em',
              }}
            >
              Built on Trust.{' '}
              <span style={{ color: '#FFC629' }}>Powered by People.</span>
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: '#64748B',
                lineHeight: 1.7,
                margin: '0 0 28px',
              }}
            >
              BuildConnect is a digital platform that bridges the gap between skilled workers, contractors, builders and homeowners — making construction and home services simpler, safer and more transparent.
            </p>

            <Link to="/auth/signup" className="btn btn-primary btn-lg">
              Learn More
            </Link>
          </div>

          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid #E5E7EB',
              maxHeight: '400px',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80"
              alt="Engineers and civil workers reviewing blueprints"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80';
              }}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ maxWidth: '1240px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: '#101820', margin: '0 0 6px' }}>
            How It Works
          </h2>
          <p style={{ color: '#64748B', margin: 0 }}>
            Structured 4-step path from registration to project completion.
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
                padding: '28px 24px',
                boxShadow: 'var(--shadow-sm)',
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

      {/* Trust & Safety Section */}
      <section style={{ maxWidth: '1240px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: '#101820', margin: '0 0 6px' }}>
            Trust &amp; Safety
          </h2>
          <p style={{ color: '#64748B', margin: 0 }}>
            Core safeguards guaranteeing reliable collaboration.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
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
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  fontSize: '1.8rem',
                  width: '50px',
                  height: '50px',
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

      <Footer />
    </div>
  );
};

export default AboutPage;
