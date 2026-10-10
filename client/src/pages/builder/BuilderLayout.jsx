import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import PortalTopBar from '../../components/layout/PortalTopBar';

const PAGE_TITLES = {
  dashboard:      'Dashboard',
  'post-project': 'Post a Project',
  review:         'Bid Review',
  oversight:      'Project Oversight',
};

const BuilderLayout = () => {
  const location = useLocation();
  const segment = location.pathname.split('/').pop();
  const title = PAGE_TITLES[segment] || 'Builder Portal';

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

export default BuilderLayout;
