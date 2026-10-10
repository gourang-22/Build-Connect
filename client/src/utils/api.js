import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const getMe        = ()     => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const updateAvailability = (isAvailable) => API.put('/auth/availability', { isAvailable });

// ── Worker Jobs ───────────────────────────────────────────────────────────────
export const getWorkerFeed  = (params) => API.get('/jobs/worker/feed', { params });
export const getMyGigs      = ()       => API.get('/jobs/worker/my-gigs');
export const getActiveJobs  = ()       => API.get('/jobs/worker/my-gigs');
export const getJobById     = (jobId)  => API.get(`/jobs/${jobId}`);
export const applyForJob    = (jobId, data) => API.post(`/jobs/${jobId}/apply`, data);

// ── Teams ─────────────────────────────────────────────────────────────────────
export const createTeam         = (data)                     => API.post('/teams', data);
export const getAllTeams        = (params)                   => API.get('/teams/all', { params });
export const requestJoinTeam    = (teamId)                   => API.post(`/teams/${teamId}/request-join`);
export const resolveJoinRequest = (teamId, data)             => API.post(`/teams/${teamId}/resolve-request`, data);
export const getMyTeam          = ()                         => API.get('/teams/my-team');
export const removeMember       = (teamId, memberId)         => API.delete(`/teams/${teamId}/members/${memberId}`);
export const leaveTeam          = (teamId)                   => API.post(`/teams/${teamId}/leave`);
export const joinTeam           = (inviteCode)               => API.post('/teams/join', { inviteCode });
export const applyAsTeam        = (jobId, teamId, data)      => API.post(`/jobs/${jobId}/apply`, { teamId, ...data });

// ── Contractor APIs ───────────────────────────────────────────────────────────
export const postLaborRequest           = (data) => API.post('/jobs/contractor/labor-request', data);
export const getContractorLaborRequests = ()     => API.get('/jobs/contractor/labor-requests');
export const getContractorTenderFeed    = (params) => API.get('/jobs/contractor/tender-feed', { params });
export const getContractorBids          = ()     => API.get('/jobs/contractor/my-bids');
export const getJobApplicants           = (jobId) => API.get(`/jobs/${jobId}/applicants`);
export const updateApplicationStatus    = (jobId, applicationId, status) =>
  API.put(`/jobs/${jobId}/applicants/${applicationId}`, { status });
export const submitTenderBid            = (jobId, data) => API.post(`/jobs/${jobId}/apply`, data);

// ── Builder APIs ──────────────────────────────────────────────────────────────
export const builderPostJob       = (data) => API.post('/jobs/builder/post', data);
export const postProject          = (data) => API.post('/jobs/builder/post', data);
export const getBuilderProjects   = ()     => API.get('/jobs/builder/projects');
export const awardContract        = (projectId, bidId) => API.put(`/jobs/${projectId}/award`, { bidId });

// ── Domestic APIs ─────────────────────────────────────────────────────────────
export const domesticPostJob      = (data) => API.post('/jobs/domestic/post', data);
export const postDomesticJob      = (data) => API.post('/jobs/domestic/post', data);
export const getDomesticJobs      = ()     => API.get('/jobs/domestic/my-jobs');
export const getNearbyWorkers     = (params) => API.get('/jobs/domestic/workers', { params });
export const resolveJob           = (jobId, data) => API.put(`/jobs/${jobId}/resolve`, data);

export default API;
