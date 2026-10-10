const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team must have a leader'],
    },
    workerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Trade categories represented in this team
    tradeCategories: [{ type: String }],
    // Pending requests from workers wanting to join the team
    pendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Optional legacy invite code
    inviteCode: {
      type: String,
      sparse: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    maxSize: {
      type: Number,
      default: 20,
      min: 2,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    isActive: { type: Boolean, default: true },
    location: {
      city: String,
      state: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total member count (leader + workers)
teamSchema.virtual('memberCount').get(function () {
  return this.workerIds.length + 1; // +1 for leader
});

teamSchema.index({ leaderId: 1 });
teamSchema.index({ 'location.city': 1, isActive: 1 });

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;
