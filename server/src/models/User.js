const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TRADE_CATEGORIES = [
  'Electrician', 'Plumber', 'Mason', 'Carpenter', 'Painter',
  'Welder', 'Tiler', 'Roofer', 'HVAC Technician', 'Civil Engineer',
  'Steel Fixer', 'Scaffolder', 'Glazier', 'Flooring Specialist', 'General Labor',
  'AC Repair', 'Pest Control', 'Appliance Repair', 'Deep Cleaning', 'Furniture Assembly',
  'Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Masonry'
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['worker', 'contractor', 'builder', 'domestic'],
        message: 'Role must be one of: worker, contractor, builder, domestic',
      },
      required: [true, 'Role is required'],
    },

    // ── Worker-specific fields ──────────────────────────────────────────────
    tradeCategory: {
      type: String,
      enum: {
        values: TRADE_CATEGORIES,
        message: `Trade category must be one of: ${TRADE_CATEGORIES.join(', ')}`,
      },
      required: function () {
        return this.role === 'worker';
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    dailyWageExpectation: {
      type: Number,
      min: 0,
    },
    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },
    skills: [{ type: String, trim: true }],
    verificationDocuments: [
      {
        name: { type: String },
        url: { type: String },
        publicId: { type: String },
      },
    ],
    currentTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },

    // ── Contractor-specific fields ──────────────────────────────────────────
    companyName: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    specializations: [{ type: String, trim: true }], // trade categories managed

    // ── Builder-specific fields ─────────────────────────────────────────────
    organizationName: { type: String, trim: true },
    projectTypeFocus: [{ type: String, trim: true }], // e.g. 'Residential', 'Commercial'

    // ── Common profile fields ───────────────────────────────────────────────
    profileImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    bio: { type: String, maxlength: 1000 },
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
    portfolio: [
      {
        title: String,
        description: String,
        imageUrl: String,
        publicId: String,
      },
    ],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Hash password before save ────────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method: compare passwords ──────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Index for geo-search potential ──────────────────────────────────────────
userSchema.index({ role: 1, tradeCategory: 1, isActive: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
