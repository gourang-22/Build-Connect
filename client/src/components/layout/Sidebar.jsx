import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PORTAL_CONFIG = {
  worker: {
    label: 'Worker Portal',
    nav: [
      { to: '/worker/dashboard', icon: '▦', label: 'Dashboard' },
      { to: '/worker/active-jobs', icon: '💼', label: 'My Gigs' },
      { to: '/worker/teams', icon: '👥', label: 'My Squad' },
      { to: '/worker/profile', icon: '👤', label: 'Profile' },
    ],
  },
  contractor: {
    label: 'Contractor Portal',
    nav: [
      { to: '/contractor/dashboard', icon: '▦', label: 'Dashboard' },
      { to: '/contractor/post-job', icon: '📋', label: 'Post Job' },
      { to: '/contractor/applicants', icon: '🗂️', label: 'Applicants' },
      { to: '/contractor/tenders', icon: '📑', label: 'Tenders' },
      { to: '/contractor/sites', icon: '🏗️', label: 'Sites' },
    ],
  },
  builder: {
    label: 'Builder Portal',
    nav: [
      { to: '/builder/dashboard', icon: '▦', label: 'Dashboard' },
      { to: '/builder/post-project', icon: '🏢', label: 'Projects' },
      { to: '/builder/review', icon: '📊', label: 'Bids' },
      { to: '/builder/oversight', icon: '👁️', label: 'Tenders & Oversight' },
    ],
  },
  domestic: {
    label: 'Homeowner Portal',
    nav: [
      { to: '/domestic/dashboard', icon: '▦', label: 'Dashboard' },
      { to: '/domestic/post-job', icon: '🔧', label: 'Post Job' },
      { to: '/domestic/workers', icon: '📍', label: 'Nearby Pros' },
      { to: '/domestic/complete', icon: '💳', label: 'Payments' },
    ],
  },
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const config = PORTAL_CONFIG[user.role] || PORTAL_CONFIG.worker;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        backgroundColor: '#101820',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#FFC629',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(255, 198, 41, 0.3)',
          }}
        >
          🏗️
        </div>
        <span
          style={{
            fontWeight: 800,
            fontSize: '1.25rem',
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          Build<span style={{ color: '#FFC629' }}>Connect</span>
        </span>
      </div>

      {/* Role Pill */}
      <div style={{ padding: '14px 20px 6px' }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#94A3B8',
            letterSpacing: '0.08em',
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Nav Menu */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '10px 14px',
          flex: 1,
        }}
      >
        {config.nav.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 16px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: isActive ? 700 : 500,
              backgroundColor: isActive ? '#FFC629' : 'transparent',
              color: isActive ? '#101820' : '#E2E8F0',
              textDecoration: 'none',
              transition: 'all 0.18s ease',
              boxShadow: isActive ? '0 2px 8px rgba(255, 198, 41, 0.25)' : 'none',
            })}
          >
            <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>
              {icon}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Card & Logout at Bottom */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#0D141B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFC629',
              color: '#101820',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {user.profileImage?.url ? (
              <img
                src={user.profileImage.url}
                alt={user.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user.name}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.72rem', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            color: '#CBD5E1',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 0.2s',
          }}
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
