const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    // ── Who sees this job? ────────────────────────────────────────────────────
    // 'worker'     => shown in Worker job feed
    // 'contractor' => shown in Contractor tender feed
    targetAudience: {
      type: String,
      enum: {
        values: ['worker', 'contractor'],
        message: 'targetAudience must be worker or contractor',
      },
      required: true,
    },

    // ── Who posted it? ────────────────────────────────────────────────────────
    // 'builder'    => posted by a Builder
    // 'contractor' => posted by a Contractor (hiring downward)
    // 'domestic'   => posted by a Domestic Client
    employerType: {
      type: String,
      enum: {
        values: ['builder', 'contractor', 'domestic'],
        message: 'employerType must be builder, contractor, or domestic',
      },
      required: true,
    },

    // Reference to the posting user
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── Trade / Category ──────────────────────────────────────────────────────
    tradeCategory: {
      type: String,
      trim: true,
    },
    // For contractor/builder multi-trade requirements
    tradeRequirements: [
      {
        category: { type: String },
        headcount: { type: Number, default: 1 },
      },
    ],

    // ── Hiring preferences ────────────────────────────────────────────────────
    // 'solo', 'team', 'both'
    hiringMode: {
      type: String,
      enum: ['solo', 'team', 'both'],
      default: 'both',
    },

    // ── Tender-specific (Builder → Contractor) ────────────────────────────────
    isTender: { type: Boolean, default: false },
    projectPhase: { type: String, trim: true }, // e.g. "Foundation Laying - Tower B"
    totalBudget: { type: Number, min: 0 },
    timeline: {
      startDate: Date,
      endDate: Date,
      durationMonths: Number,
    },

    // ── Micro-job / Labor Request ─────────────────────────────────────────────
    budget: {
      amount: { type: Number, min: 0 },
      type: { type: String, enum: ['daily', 'weekly', 'fixed', 'negotiable'], default: 'daily' },
    },
    urgency: {
      type: String,
      enum: ['today', 'tomorrow', 'this_week', 'flexible'],
      default: 'flexible',
    },
    headcountNeeded: { type: Number, min: 1, default: 1 },

    // ── Location ─────────────────────────────────────────────────────────────
    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    // ── Status ────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['open', 'in_progress', 'completed', 'cancelled', 'closed'],
      default: 'open',
    },

    // ── Applications / Bids ──────────────────────────────────────────────────
    applications: [
      {
        applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
        isTeamApplication: { type: Boolean, default: false },
        // For tender bids
        bidAmount: { type: Number },
        proposedTimeline: { type: String },
        coverLetter: { type: String, maxlength: 2000 },
        portfolioUrls: [{ type: String }],
        status: {
          type: String,
          enum: ['pending', 'shortlisted', 'hired', 'rejected'],
          default: 'pending',
        },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Awarded contractor/worker (after hiring) ─────────────────────────────
    awardedTo: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    },

    // ── Media ────────────────────────────────────────────────────────────────
    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    // ── Completion & Review ──────────────────────────────────────────────────
    completedAt: { type: Date },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, maxlength: 1000 },
      reviewedAt: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Compound indexes for filtered queries ────────────────────────────────────
jobSchema.index({ targetAudience: 1, tradeCategory: 1, status: 1 });
jobSchema.index({ employerType: 1, postedBy: 1, status: 1 });
jobSchema.index({ isTender: 1, status: 1 });
jobSchema.index({ 'location.city': 1 });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
