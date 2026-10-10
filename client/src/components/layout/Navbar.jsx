import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_DASHBOARDS = {
  worker:     '/worker/dashboard',
  contractor: '/contractor/dashboard',
  builder:    '/builder/dashboard',
  domestic:   '/domestic/dashboard',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%' }}>
      {/* Top Tagline Strip (from Reference Image) */}
      <div
        style={{
          backgroundColor: '#0A0F14',
          color: '#94A3B8',
          fontSize: '0.75rem',
          padding: '6px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span>Skilled People</span>
          <span>|</span>
          <span>Trusted Projects</span>
          <span>|</span>
          <span>Stronger Tomorrow</span>
        </div>
        <div style={{ display: 'none', md: 'block', color: '#FFC629', fontWeight: 600 }}>
          Connecting Workers, Contractors, Builders &amp; Homeowners
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          height: '70px',
          backgroundColor: '#101820',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 4vw, 48px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
          }}
        >
          {/* Logo Icon with Yellow Graphic */}
          <div
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#FFC629',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 2px 8px rgba(255,198,41,0.35)',
            }}
          >
            🏗️
          </div>
          <span
            style={{
              fontFamily: 'var(--font-family)',
              fontWeight: '800',
              fontSize: '1.35rem',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}
          >
            Build<span style={{ color: '#FFC629' }}>Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              color: isActive ? '#FFC629' : '#E2E8F0',
              fontWeight: isActive ? '700' : '500',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            style={({ isActive }) => ({
              color: isActive ? '#FFC629' : '#E2E8F0',
              fontWeight: isActive ? '700' : '500',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            })}
          >
            About Us
          </NavLink>

          <NavLink
            to="/how-it-works"
            style={({ isActive }) => ({
              color: isActive ? '#FFC629' : '#E2E8F0',
              fontWeight: isActive ? '700' : '500',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            })}
          >
            How It Works
          </NavLink>
        </div>

        {/* Right CTA / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to={ROLE_DASHBOARDS[user.role] || '/worker/dashboard'}
                className="btn btn-primary btn-sm"
              >
                Go to Portal →
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                style={{ color: '#94A3B8' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/auth/login"
                style={{
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
