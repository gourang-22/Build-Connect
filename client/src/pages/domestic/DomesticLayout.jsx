import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import PortalTopBar from '../../components/layout/PortalTopBar';

const PAGE_TITLES = {
  dashboard:  'Dashboard',
  'post-job': 'Post a Job',
  review:     'Worker Matches',
  completion: 'Completion & Payment',
};

const DomesticLayout = () => {
  const location = useLocation();
  const segment = location.pathname.split('/').pop();
  const title = PAGE_TITLES[segment] || 'Homeowner Portal';

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

export default DomesticLayout;
