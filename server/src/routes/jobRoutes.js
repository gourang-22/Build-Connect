const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  getWorkerFeed,
  getMyGigs,
  applyForJob,
  postLaborRequest,
  getContractorTenderFeed,
  getContractorLaborRequests,
  getContractorBids,
  getJobApplicants,
  updateApplicationStatus,
  builderPostJob,
  getBuilderProjects,
  domesticPostJob,
  getDomesticJobs,
  getNearbyWorkers,
  resolveJob,
  getJobById,
} = require('../controllers/jobController');

// ── Worker Routes ─────────────────────────────────────────────────────────────
router.get('/worker/feed', protect, authorizeRoles('worker'), getWorkerFeed);
router.get('/worker/my-gigs', protect, authorizeRoles('worker'), getMyGigs);

// ── Contractor Routes ─────────────────────────────────────────────────────────
router.post('/contractor/labor-request', protect, authorizeRoles('contractor'), postLaborRequest);
router.get('/contractor/labor-requests', protect, authorizeRoles('contractor'), getContractorLaborRequests);
router.get('/contractor/tender-feed', protect, authorizeRoles('contractor'), getContractorTenderFeed);
router.get('/contractor/my-bids', protect, authorizeRoles('contractor'), getContractorBids);

// ── Builder Routes ────────────────────────────────────────────────────────────
router.post('/builder/post', protect, authorizeRoles('builder'), builderPostJob);
router.get('/builder/projects', protect, authorizeRoles('builder'), getBuilderProjects);

// ── Domestic Routes ───────────────────────────────────────────────────────────
router.post('/domestic/post', protect, authorizeRoles('domestic'), domesticPostJob);
router.get('/domestic/my-jobs', protect, authorizeRoles('domestic'), getDomesticJobs);
router.get('/domestic/workers', protect, authorizeRoles('domestic'), getNearbyWorkers);

// ── Shared / Generic ──────────────────────────────────────────────────────────
router.get('/:jobId', protect, getJobById);
router.post('/:jobId/apply', protect, authorizeRoles('worker', 'contractor'), applyForJob);
router.get('/:jobId/applicants', protect, authorizeRoles('contractor', 'builder', 'domestic'), getJobApplicants);
router.put('/:jobId/applicants/:applicationId', protect, authorizeRoles('contractor', 'builder', 'domestic'), updateApplicationStatus);
router.put('/:jobId/resolve', protect, authorizeRoles('domestic'), resolveJob);

module.exports = router;
