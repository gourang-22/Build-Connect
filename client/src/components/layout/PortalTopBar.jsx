import { useAuth } from '../../context/AuthContext';

const PortalTopBar = ({ title }) => {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#101820' }}>
          {title || 'Dashboard'}
        </h2>
        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
          {greeting}, <strong style={{ color: '#101820' }}>{user?.name?.split(' ')[0] || 'User'}</strong> 👋
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* City Location indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F8FAFC',
            border: '1px solid #E5E7EB',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: '#475569',
            fontWeight: 500,
          }}
        >
          <span>📍</span>
          <span>{user?.location?.city || 'Mumbai, India'}</span>
        </div>

        {/* Worker availability status */}
        {user?.role === 'worker' && (
          <span
            className={`badge ${user?.isAvailable ? 'badge-success' : 'badge-gray'}`}
            style={{ padding: '6px 12px' }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            {user?.isAvailable ? 'Online & Available' : 'Off-Duty'}
          </span>
        )}

        {/* Role badge */}
        <span
          className="badge badge-yellow"
          style={{ padding: '6px 12px', textTransform: 'capitalize' }}
        >
          {user?.role}
        </span>
      </div>
    </header>
  );
};

export default PortalTopBar;
