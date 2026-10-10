const asyncHandler = require('express-async-handler');
const Team = require('../models/Team');
const User = require('../models/User');

/**
 * @desc    Create a new team
 * @route   POST /api/teams
 * @access  Private (worker)
 */
const createTeam = asyncHandler(async (req, res) => {
  const { name, description, maxSize, location } = req.body;

  // Check if already leading a team
  const existingTeam = await Team.findOne({ leaderId: req.user._id });
  if (existingTeam) {
    res.status(400);
    throw new Error('You are already a team leader. Disband or leave current team first.');
  }

  const team = await Team.create({
    name,
    description,
    maxSize: Number(maxSize) || 20,
    leaderId: req.user._id,
    workerIds: [],
    pendingRequests: [],
    tradeCategories: [req.user.tradeCategory],
    location,
  });

  // Update leader's currentTeamId
  await User.findByIdAndUpdate(req.user._id, { currentTeamId: team._id });

  const populated = await Team.findById(team._id)
    .populate('leaderId', 'name tradeCategory profileImage rating phone location')
    .populate('workerIds', 'name tradeCategory profileImage rating location');

  res.status(201).json({ success: true, team: populated });
});

/**
 * @desc    List all existing teams (with city filter or search)
 * @route   GET /api/teams/all
 * @access  Private (worker)
 */
const getAllTeams = asyncHandler(async (req, res) => {
  const { city, tradeCategory, search } = req.query;
  const filter = { isActive: true };

  if (city && city.trim() !== '') {
    filter['location.city'] = new RegExp(city.trim(), 'i');
  }
  if (tradeCategory && tradeCategory.trim() !== '') {
    filter.tradeCategories = tradeCategory.trim();
  }
  if (search && search.trim() !== '') {
    filter.name = new RegExp(search.trim(), 'i');
  }

  const teams = await Team.find(filter)
    .populate('leaderId', 'name tradeCategory rating profileImage phone location')
    .populate('workerIds', 'name tradeCategory rating profileImage')
    .populate('pendingRequests', 'name tradeCategory rating profileImage')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: teams.length, teams });
});

/**
 * @desc    Worker requests to join a team
 * @route   POST /api/teams/:teamId/request-join
 * @access  Private (worker)
 */
const requestJoinTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const team = await Team.findById(teamId);

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (!team.isActive) {
    res.status(400);
    throw new Error('This team is no longer active');
  }

  if (team.leaderId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You are the leader of this team');
  }

  if (team.workerIds.some((id) => id.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('You are already a registered member of this team');
  }

  if (team.workerIds.length + 1 >= team.maxSize) {
    res.status(400);
    throw new Error('This team has reached its maximum member capacity');
  }

  if (!team.pendingRequests) {
    team.pendingRequests = [];
  }

  const alreadyRequested = team.pendingRequests.some(
    (id) => id.toString() === req.user._id.toString()
  );

  if (alreadyRequested) {
    res.status(400);
    throw new Error('You have already submitted a join request to this team');
  }

  team.pendingRequests.push(req.user._id);
  await team.save();

  res.status(200).json({
    success: true,
    message: 'Join request successfully submitted to the Team Leader',
  });
});

/**
 * @desc    Team Leader resolves a join request (accept or decline)
 * @route   POST /api/teams/:teamId/resolve-request
 * @access  Private (worker — team leader)
 */
const resolveJoinRequest = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { workerId, action } = req.body; // 'accept' or 'decline'

  if (!workerId || !['accept', 'decline'].includes(action)) {
    res.status(400);
    throw new Error('workerId and valid action ("accept" or "decline") are required');
  }

  const team = await Team.findById(teamId);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (team.leaderId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the Team Leader can accept or decline join requests');
  }

  if (!team.pendingRequests) {
    team.pendingRequests = [];
  }

  const reqIndex = team.pendingRequests.findIndex(
    (id) => id.toString() === workerId.toString()
  );

  if (reqIndex === -1) {
    res.status(404);
    throw new Error('Join request not found or already resolved');
  }

  // Remove from pending list
  team.pendingRequests.splice(reqIndex, 1);

  if (action === 'accept') {
    if (team.workerIds.length + 1 >= team.maxSize) {
      res.status(400);
      throw new Error('Cannot accept: team is at maximum capacity');
    }

    if (!team.workerIds.some((id) => id.toString() === workerId.toString())) {
      team.workerIds.push(workerId);
    }

    const workerUser = await User.findById(workerId);
    if (workerUser) {
      if (workerUser.tradeCategory && !team.tradeCategories.includes(workerUser.tradeCategory)) {
        team.tradeCategories.push(workerUser.tradeCategory);
      }
      workerUser.currentTeamId = team._id;
      await workerUser.save();
    }
  }

  await team.save();

  const populated = await Team.findById(teamId)
    .populate('leaderId', 'name tradeCategory rating profileImage phone location')
    .populate('workerIds', 'name tradeCategory rating profileImage location phone dailyWageExpectation')
    .populate('pendingRequests', 'name tradeCategory rating profileImage phone dailyWageExpectation experienceYears skills');

  res.status(200).json({
    success: true,
    message: action === 'accept' ? 'Worker accepted into team!' : 'Join request declined.',
    team: populated,
  });
});

/**
 * @desc    Get my team details
 * @route   GET /api/teams/my-team
 * @access  Private (worker)
 */
const getMyTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    $or: [{ leaderId: req.user._id }, { workerIds: req.user._id }],
  })
    .populate('leaderId', 'name tradeCategory profileImage rating phone location')
    .populate('workerIds', 'name tradeCategory profileImage rating location phone dailyWageExpectation')
    .populate('pendingRequests', 'name tradeCategory profileImage rating phone dailyWageExpectation experienceYears skills');

  if (!team) {
    return res.status(200).json({ success: true, team: null, message: 'No team found' });
  }

  res.status(200).json({ success: true, team });
});

/**
 * @desc    Remove a member from team (leader only)
 * @route   DELETE /api/teams/:teamId/members/:memberId
 * @access  Private (worker — team leader)
 */
const removeMember = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.teamId);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (team.leaderId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the team leader can remove members');
  }

  const memberIdx = team.workerIds.findIndex(
    (id) => id.toString() === req.params.memberId.toString()
  );
  if (memberIdx === -1) {
    res.status(404);
    throw new Error('Member not found in team');
  }

  team.workerIds.splice(memberIdx, 1);
  await team.save();

  // Remove team from member's profile
  await User.findByIdAndUpdate(req.params.memberId, { currentTeamId: null });

  res.status(200).json({ success: true, message: 'Member removed from team' });
});

/**
 * @desc    Leave team (member)
 * @route   POST /api/teams/:teamId/leave
 * @access  Private (worker)
 */
const leaveTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.teamId);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  if (team.leaderId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Team leader cannot leave. Please disband the team instead.');
  }

  team.workerIds = team.workerIds.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await team.save();
  await User.findByIdAndUpdate(req.user._id, { currentTeamId: null });

  res.status(200).json({ success: true, message: 'You have left the team' });
});

/**
 * @desc    Join a team via invite code (backward compatibility)
 * @route   POST /api/teams/join
 * @access  Private (worker)
 */
const joinTeam = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    res.status(400);
    throw new Error('Invite code is required');
  }

  const team = await Team.findOne({ inviteCode: inviteCode.toUpperCase() });
  if (!team) {
    res.status(404);
    throw new Error('Invalid invite code. Team not found.');
  }

  if (!team.isActive) {
    res.status(400);
    throw new Error('This team is no longer active');
  }

  if (team.workerIds.length + 1 >= team.maxSize) {
    res.status(400);
    throw new Error('This team is already at full capacity');
  }

  const alreadyMember = team.workerIds.some((id) => id.toString() === req.user._id.toString());
  const isLeader = team.leaderId.toString() === req.user._id.toString();
  if (alreadyMember || isLeader) {
    res.status(400);
    throw new Error('You are already a member of this team');
  }

  team.workerIds.push(req.user._id);
  if (!team.tradeCategories.includes(req.user.tradeCategory)) {
    team.tradeCategories.push(req.user.tradeCategory);
  }
  await team.save();

  await User.findByIdAndUpdate(req.user._id, { currentTeamId: team._id });

  const populated = await Team.findById(team._id)
    .populate('leaderId', 'name tradeCategory profileImage rating')
    .populate('workerIds', 'name tradeCategory profileImage rating');

  res.status(200).json({ success: true, message: 'Successfully joined team', team: populated });
});

module.exports = {
  createTeam,
  getAllTeams,
  requestJoinTeam,
  resolveJoinRequest,
  getMyTeam,
  removeMember,
  leaveTeam,
  joinTeam,
};
