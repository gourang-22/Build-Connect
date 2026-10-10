const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
  createTeam,
  getAllTeams,
  requestJoinTeam,
  resolveJoinRequest,
  getMyTeam,
  removeMember,
  leaveTeam,
  joinTeam,
} = require('../controllers/teamController');

// All team routes require authenticated worker role
router.use(protect);
router.use(authorizeRoles('worker'));

// Team discovery & membership routes
router.get('/all', getAllTeams);
router.post('/', createTeam);
router.post('/join', joinTeam);
router.get('/my-team', getMyTeam);
router.post('/:teamId/request-join', requestJoinTeam);
router.post('/:teamId/resolve-request', resolveJoinRequest);
router.delete('/:teamId/members/:memberId', removeMember);
router.post('/:teamId/leave', leaveTeam);

module.exports = router;
