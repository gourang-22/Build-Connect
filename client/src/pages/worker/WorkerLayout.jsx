import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import PortalTopBar from '../../components/layout/PortalTopBar';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  'active-jobs': 'My Active Gigs',
  teams:        'Team Management',
  profile:      'My Profile',
};

const WorkerLayout = () => {
  const location = useLocation();
  const segment = location.pathname.split('/').pop();
  const title = PAGE_TITLES[segment] || 'Worker Portal';

  return (
    <div className="portal-shell">
      <Sidebar />
      <div className="portal-content">
        <PortalTopBar title={title} />
        <main className="portal-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;
