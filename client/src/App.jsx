import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/routing/ProtectedRoute';

// Public pages
import LandingPage  from './pages/LandingPage';
import AboutPage    from './pages/AboutPage';
import AuthPage     from './pages/auth/AuthPage';

// Worker Portal pages
import WorkerLayout     from './pages/worker/WorkerLayout';
import WorkerDashboard  from './pages/worker/WorkerDashboard';
import MyGigs           from './pages/worker/MyGigs';
import TeamManagement   from './pages/worker/TeamManagement';
import WorkerProfile    from './pages/worker/WorkerProfile';

// Contractor Portal pages
import ContractorLayout        from './pages/contractor/ContractorLayout';
import ContractorDashboard     from './pages/contractor/ContractorDashboard';
import PostLaborRequest        from './pages/contractor/PostLaborRequest';
import LaborApplicantReview    from './pages/contractor/LaborApplicantReview';
import TenderFeed              from './pages/contractor/TenderFeed';
import MyActiveSites           from './pages/contractor/MyActiveSites';

// Builder Portal pages
import BuilderLayout          from './pages/builder/BuilderLayout';
import BuilderDashboard       from './pages/builder/BuilderDashboard';
import PostProject            from './pages/builder/PostProject';
import BidApplicantReview     from './pages/builder/BidApplicantReview';
import ProjectOversight       from './pages/builder/ProjectOversight';

// Domestic Client Portal pages
import DomesticLayout         from './pages/domestic/DomesticLayout';
import HomeownerDashboard     from './pages/domestic/HomeownerDashboard';
import PostMicroJob           from './pages/domestic/PostMicroJob';
import WorkerMatchingReview   from './pages/domestic/WorkerMatchingReview';
import JobCompletionPayment   from './pages/domestic/JobCompletionPayment';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<AboutPage />} />

        {/* Auth — redirect if already logged in */}
        <Route
          path="/auth/login"
          element={<PublicOnlyRoute><AuthPage mode="login" /></PublicOnlyRoute>}
        />
        <Route
          path="/auth/signup"
          element={<PublicOnlyRoute><AuthPage mode="signup" /></PublicOnlyRoute>}
        />

        {/* Worker Portal — RBAC enforced */}
        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRoles={['worker']}>
              <WorkerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="feed" element={<Navigate to="/worker/dashboard" replace />} />
          <Route path="active-jobs" element={<MyGigs />} />
          <Route path="gigs" element={<Navigate to="/worker/active-jobs" replace />} />
          <Route path="teams" element={<TeamManagement />} />
          <Route path="squad" element={<Navigate to="/worker/teams" replace />} />
          <Route path="profile" element={<WorkerProfile />} />
        </Route>

        {/* Contractor Portal — RBAC enforced */}
        <Route
          path="/contractor"
          element={
            <ProtectedRoute allowedRoles={['contractor']}>
              <ContractorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ContractorDashboard />} />
          <Route path="post-job" element={<PostLaborRequest />} />
          <Route path="applicants" element={<LaborApplicantReview />} />
          <Route path="tenders" element={<TenderFeed />} />
          <Route path="sites" element={<MyActiveSites />} />
        </Route>

        {/* Builder Portal — RBAC enforced */}
        <Route
          path="/builder"
          element={
            <ProtectedRoute allowedRoles={['builder']}>
              <BuilderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BuilderDashboard />} />
          <Route path="post-project" element={<PostProject />} />
          <Route path="review" element={<BidApplicantReview />} />
          <Route path="oversight" element={<ProjectOversight />} />
        </Route>

        {/* Domestic Client Portal — RBAC enforced */}
        <Route
          path="/domestic"
          element={
            <ProtectedRoute allowedRoles={['domestic']}>
              <DomesticLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HomeownerDashboard />} />
          <Route path="post-job" element={<PostMicroJob />} />
          <Route path="workers" element={<WorkerMatchingReview />} />
          <Route path="review" element={<WorkerMatchingReview />} />
          <Route path="complete" element={<JobCompletionPayment />} />
          <Route path="completion" element={<JobCompletionPayment />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
