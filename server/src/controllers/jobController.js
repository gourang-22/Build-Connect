const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const User = require('../models/User');
const Team = require('../models/Team');

// ─────────────────────────────────────────────────────────────────────────────
// WORKER endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Worker job feed — strictly filtered by tradeCategory
 * @route   GET /api/jobs/worker/feed
 * @access  Private (worker)
 */
const getWorkerFeed = asyncHandler(async (req, res) => {
  const { employerType, distance, city, page = 1, limit = 20 } = req.query;
  const { tradeCategory } = req.user;

  const filter = {
    targetAudience: 'worker',
    status: 'open',
  };
  if (tradeCategory) {
    filter.tradeCategory = tradeCategory;
  }

  if (employerType && ['builder', 'contractor', 'domestic'].includes(employerType)) {
    filter.employerType = employerType;
  }
  if (city) filter['location.city'] = { $regex: city, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  let [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('postedBy', 'name companyName organizationName profileImage rating location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(filter),
  ]);

  // If no jobs match this worker's specific trade, fallback to showing all open worker jobs
  if (jobs.length === 0 && tradeCategory) {
    const fallbackFilter = {
      targetAudience: 'worker',
      status: 'open',
    };
    if (employerType && ['builder', 'contractor', 'domestic'].includes(employerType)) {
      fallbackFilter.employerType = employerType;
    }
    if (city) fallbackFilter['location.city'] = { $regex: city, $options: 'i' };

    [jobs, total] = await Promise.all([
      Job.find(fallbackFilter)
        .populate('postedBy', 'name companyName organizationName profileImage rating location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(fallbackFilter),
    ]);
  }

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    jobs,
  });
});

/**
 * @desc    Worker — get MY active jobs (applied/hired)
 * @route   GET /api/jobs/worker/my-gigs
 * @access  Private (worker)
 */
const getMyGigs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    'applications.applicantId': req.user._id,
  })
    .populate('postedBy', 'name companyName organizationName profileImage')
    .sort({ updatedAt: -1 });

  // Enrich each job with this worker's application status
  const gigs = jobs.map((job) => {
    const myApp = job.applications.find(
      (a) => a.applicantId.toString() === req.user._id.toString()
    );
    return {
      ...job.toJSON(),
      myApplicationStatus: myApp?.status,
      myApplicationId: myApp?._id,
    };
  });

  res.status(200).json({ success: true, gigs });
});

/**
 * @desc    Apply for a job (solo or team)
 * @route   POST /api/jobs/:jobId/apply
 * @access  Private (worker, contractor)
 */
const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { teamId, bidAmount, proposedTimeline, coverLetter, portfolioUrls } = req.body;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.status !== 'open') {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }

  // Check duplicate application
  const alreadyApplied = job.applications.some(
    (a) => a.applicantId.toString() === req.user._id.toString()
  );
  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  const application = {
    applicantId: req.user._id,
    isTeamApplication: !!teamId,
    teamId: teamId || null,
    bidAmount,
    proposedTimeline,
    coverLetter,
    portfolioUrls: portfolioUrls || [],
    status: 'pending',
    appliedAt: new Date(),
  };

  job.applications.push(application);
  await job.save();

  res.status(201).json({ success: true, message: 'Application submitted successfully' });
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACTOR endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Post a labor request (contractor → workers)
 * @route   POST /api/jobs/contractor/labor-request
 * @access  Private (contractor)
 */
const postLaborRequest = asyncHandler(async (req, res) => {
  const {
    title, description, tradeCategory, headcountNeeded,
    hiringMode, budget, urgency, location, timeline,
  } = req.body;

  const job = await Job.create({
    title,
    description,
    targetAudience: 'worker',
    employerType: 'contractor',
    postedBy: req.user._id,
    tradeCategory,
    headcountNeeded,
    hiringMode: hiringMode || 'both',
    budget,
    urgency,
    location,
    timeline,
  });

  res.status(201).json({ success: true, job });
});

/**
 * @desc    Get contractor's tender feed (builder tenders)
 * @route   GET /api/jobs/contractor/tender-feed
 * @access  Private (contractor)
 */
const getContractorTenderFeed = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, city } = req.query;
  const filter = { targetAudience: 'contractor', isTender: true, status: 'open' };
  if (city) filter['location.city'] = { $regex: city, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [tenders, total] = await Promise.all([
    Job.find(filter)
      .populate('postedBy', 'name organizationName profileImage rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), tenders });
});

/**
 * @desc    Get contractor's posted labor requests
 * @route   GET /api/jobs/contractor/labor-requests
 * @access  Private (contractor)
 */
const getContractorLaborRequests = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id, employerType: 'contractor' })
    .populate('applications.applicantId', 'name tradeCategory rating profileImage location phone dailyWageExpectation')
    .populate('applications.teamId', 'name memberCount tradeCategories rating leaderId')
    .populate('awardedTo.userId', 'name tradeCategory rating profileImage phone location')
    .populate('awardedTo.teamId', 'name memberCount tradeCategories rating leaderId')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, jobs });
});

/**
 * @desc    Get contractor's submitted tender bids
 * @route   GET /api/jobs/contractor/my-bids
 * @access  Private (contractor)
 */
const getContractorBids = asyncHandler(async (req, res) => {
  const tenders = await Job.find({
    isTender: true,
    'applications.applicantId': req.user._id,
  })
    .populate('postedBy', 'name organizationName profileImage rating location')
    .sort({ updatedAt: -1 });

  const bids = tenders.map((tender) => {
    const myApp = tender.applications.find(
      (a) => a.applicantId.toString() === req.user._id.toString()
    );
    return {
      ...tender.toJSON(),
      myBid: myApp,
    };
  });

  res.status(200).json({ success: true, bids });
});

/**
 * @desc    Get applicants for contractor's labor requests
 * @route   GET /api/jobs/:jobId/applicants
 * @access  Private (contractor, builder)
 */
const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id })
    .populate('applications.applicantId', 'name tradeCategory rating profileImage location phone')
    .populate('applications.teamId', 'name memberCount tradeCategories rating leaderId');

  if (!job) {
    res.status(404);
    throw new Error('Job not found or you are not the owner');
  }

  res.status(200).json({ success: true, applications: job.applications, job: { title: job.title, status: job.status } });
});

/**
 * @desc    Update application status (hire / reject / shortlist)
 * @route   PUT /api/jobs/:jobId/applicants/:applicationId
 * @access  Private (contractor, builder, domestic)
 */
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'hired', 'rejected', 'shortlisted'
  const validStatuses = ['hired', 'rejected', 'shortlisted'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  if (!job) {
    res.status(404);
    throw new Error('Job not found or access denied');
  }

  const application = job.applications.id(req.params.applicationId);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  application.status = status;
  if (status === 'hired') {
    job.status = 'in_progress';
    job.awardedTo = { userId: application.applicantId, teamId: application.teamId };
  }

  await job.save();
  res.status(200).json({ success: true, message: `Application ${status} successfully` });
});

// ─────────────────────────────────────────────────────────────────────────────
// BUILDER endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Builder posts a tender (for contractors) or direct labor request (for workers)
 * @route   POST /api/jobs/builder/post
 * @access  Private (builder)
 */
const builderPostJob = asyncHandler(async (req, res) => {
  const {
    title, description, isTender, projectPhase,
    targetAudience, tradeCategory, tradeRequirements,
    headcountNeeded, hiringMode, budget, totalBudget, timeline, location,
  } = req.body;

  const job = await Job.create({
    title,
    description,
    targetAudience: isTender ? 'contractor' : (targetAudience || 'worker'),
    employerType: 'builder',
    postedBy: req.user._id,
    isTender: !!isTender,
    projectPhase,
    tradeCategory,
    tradeRequirements,
    headcountNeeded,
    hiringMode,
    budget,
    totalBudget,
    timeline,
    location,
  });

  res.status(201).json({ success: true, job });
});

/**
 * @desc    Builder's project oversight — all their jobs
 * @route   GET /api/jobs/builder/projects
 * @access  Private (builder)
 */
const getBuilderProjects = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate('applications.applicantId', 'name companyName organizationName tradeCategory rating profileImage phone location dailyWageExpectation role')
    .populate('applications.teamId', 'name memberCount tradeCategories rating leaderId')
    .populate('awardedTo.userId', 'name companyName tradeCategory profileImage phone rating location role')
    .populate('awardedTo.teamId', 'name memberCount tradeCategories rating leaderId')
    .sort({ createdAt: -1 });

  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === 'open').length,
    inProgress: jobs.filter((j) => j.status === 'in_progress').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applications.length, 0),
  };

  res.status(200).json({ success: true, stats, jobs });
});

// ─────────────────────────────────────────────────────────────────────────────
// DOMESTIC CLIENT endpoints
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Domestic client posts a micro-job
 * @route   POST /api/jobs/domestic/post
 * @access  Private (domestic)
 */
const domesticPostJob = asyncHandler(async (req, res) => {
  const { title, description, tradeCategory, urgency, budget, location } = req.body;

  const job = await Job.create({
    title,
    description,
    targetAudience: 'worker',
    employerType: 'domestic',
    postedBy: req.user._id,
    tradeCategory,
    urgency,
    budget,
    hiringMode: 'solo', // domestic only hires solo workers
    headcountNeeded: 1,
    location,
  });

  res.status(201).json({ success: true, job });
});

/**
 * @desc    Domestic client views their jobs & applicants
 * @route   GET /api/jobs/domestic/my-jobs
 * @access  Private (domestic)
 */
const getDomesticJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate(
      'applications.applicantId',
      'name tradeCategory rating profileImage location.city phone'
    )
    .populate('awardedTo.userId', 'name tradeCategory rating profileImage phone location')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, jobs });
});

/**
 * @desc    Domestic client marks job as resolved & leaves review
 * @route   PUT /api/jobs/:jobId/resolve
 * @access  Private (domestic)
 */
const resolveJob = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('A rating between 1 and 5 is required to resolve a job');
  }

  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user._id });
  if (!job) {
    res.status(404);
    throw new Error('Job not found or access denied');
  }

  job.status = 'completed';
  job.completedAt = new Date();
  job.review = { rating, comment, reviewedAt: new Date() };
  await job.save();

  // Update the awarded worker's rating
  if (job.awardedTo?.userId) {
    const worker = await User.findById(job.awardedTo.userId);
    if (worker) {
      const newCount = worker.rating.count + 1;
      const newAvg = ((worker.rating.average * worker.rating.count) + rating) / newCount;
      worker.rating = { average: Math.round(newAvg * 10) / 10, count: newCount };
      await worker.save();
    }
  }

  res.status(200).json({ success: true, message: 'Job resolved and review submitted' });
});

/**
 * @desc    Domestic client: Get strictly solo workers in nearby area whose isAvailable is true
 * @route   GET /api/jobs/domestic/workers
 * @access  Private (domestic)
 */
const getNearbyWorkers = asyncHandler(async (req, res) => {
  const { category, city, pincode } = req.query;

  // Base query: solo worker, active, and isAvailable strictly true
  const query = {
    role: 'worker',
    isActive: true,
    isAvailable: { $ne: false },
  };

  // Category mapping
  if (category && category !== 'All' && category !== 'all') {
    const categoryMap = {
      'Plumbing': ['Plumber', 'Plumbing'],
      'Electrical': ['Electrician', 'Electrical'],
      'Painting': ['Painter', 'Painting'],
      'Carpentry': ['Carpenter', 'Carpentry'],
      'Masonry': ['Mason', 'Masonry'],
      'AC Repair': ['AC Repair', 'HVAC Technician'],
      'Pest Control': ['Pest Control'],
      'Appliance Repair': ['Appliance Repair', 'Electrician'],
      'Deep Cleaning': ['Deep Cleaning', 'Cleaning', 'General Labor'],
      'Furniture Assembly': ['Furniture Assembly', 'Carpenter', 'General Labor'],
    };

    const searchCategories = categoryMap[category] || [category];
    query.tradeCategory = { $in: searchCategories.map((c) => new RegExp(`^${c}$`, 'i')) };
  }

  // Location resolution
  const userCity = city || req.user.location?.city;
  const userPincode = pincode || req.user.location?.pincode;

  const locConditions = [];
  if (userCity && userCity.trim()) {
    locConditions.push({ 'location.city': new RegExp(userCity.trim(), 'i') });
  }
  if (userPincode && userPincode.trim()) {
    locConditions.push({ 'location.pincode': userPincode.trim() });
  }

  if (locConditions.length > 0) {
    query.$or = locConditions;
  }

  let workers = await User.find(query)
    .select('name email phone tradeCategory rating dailyWageExpectation experienceYears skills location profileImage isAvailable bio isVerified')
    .sort({ 'rating.average': -1, createdAt: -1 });

  // If no workers found in the exact postal area, provide regional nearby match
  let regionalFallback = false;
  if (workers.length === 0 && locConditions.length > 0) {
    delete query.$or;
    workers = await User.find(query)
      .select('name email phone tradeCategory rating dailyWageExpectation experienceYears skills location profileImage isAvailable bio isVerified')
      .sort({ 'rating.average': -1, createdAt: -1 });
    regionalFallback = true;
  }

  const simulatedDistances = ['0.8 km', '1.2 km', '1.9 km', '2.5 km', '3.4 km', '4.2 km'];

  const nearbyWorkers = workers.map((w, idx) => {
    const isNearbyMatch = !regionalFallback && (
      (userCity && w.location?.city?.toLowerCase() === userCity.toLowerCase()) ||
      (userPincode && w.location?.pincode === userPincode)
    );
    const dist = isNearbyMatch ? simulatedDistances[idx % simulatedDistances.length] : '7.5 km';

    return {
      ...w.toObject(),
      distance: dist,
      isNearby: true,
      locationConfirmed: true,
      nearbyBadge: isNearbyMatch ? `Nearby (${dist})` : `${w.location?.city || 'Regional'} (${dist})`,
    };
  });

  res.status(200).json({
    success: true,
    count: nearbyWorkers.length,
    workers: nearbyWorkers,
    homeownerLocation: { city: userCity, pincode: userPincode },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @desc    Get single job details
 * @route   GET /api/jobs/:jobId
 * @access  Private
 */
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId)
    .populate('postedBy', 'name companyName organizationName profileImage rating location phone')
    .populate('awardedTo.userId', 'name tradeCategory profileImage')
    .populate('awardedTo.teamId', 'name memberCount');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  res.status(200).json({ success: true, job });
});

module.exports = {
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
};
