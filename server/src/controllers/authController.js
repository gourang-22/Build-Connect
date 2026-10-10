const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const {
    name, email, phone, password, role,
    // Worker
    tradeCategory, dailyWageExpectation, experienceYears, skills,
    // Contractor
    companyName, gstNumber, licenseNumber, specializations,
    // Builder
    organizationName, projectTypeFocus,
    // Common
    location, bio,
  } = req.body;

  // Validate worker tradeCategory
  if (role === 'worker' && !tradeCategory) {
    res.status(400);
    throw new Error('Workers must specify a tradeCategory');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const userData = {
    name, email, phone, password, role, location, bio,
    ...(role === 'worker' && { tradeCategory, dailyWageExpectation, experienceYears, skills }),
    ...(role === 'contractor' && { companyName, gstNumber, licenseNumber, specializations }),
    ...(role === 'builder' && { organizationName, projectTypeFocus }),
  };

  const user = await User.create(userData);

  if (user) {
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        tradeCategory: user.tradeCategory,
        companyName: user.companyName,
        organizationName: user.organizationName,
        profileImage: user.profileImage,
        rating: user.rating,
        isVerified: user.isVerified,
        location: user.location,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      tradeCategory: user.tradeCategory,
      companyName: user.companyName,
      organizationName: user.organizationName,
      profileImage: user.profileImage,
      rating: user.rating,
      isVerified: user.isVerified,
      location: user.location,
      currentTeamId: user.currentTeamId,
      isAvailable: user.isAvailable !== false,
    },
  });
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('currentTeamId', 'name inviteCode leaderId');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ success: true, user });
});

/**
 * @desc    Update profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const allowedFields = [
    'name', 'phone', 'bio', 'location', 'skills',
    'dailyWageExpectation', 'experienceYears', 'isAvailable',
    'companyName', 'gstNumber', 'licenseNumber', 'specializations',
    'organizationName', 'projectTypeFocus',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  // Handle profile image upload from Cloudinary (via multer middleware upstream)
  if (req.file) {
    user.profileImage = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  const updatedUser = await user.save();
  res.status(200).json({ success: true, user: updatedUser });
});

/**
 * @desc    Toggle Worker availability for work
 * @route   PUT /api/auth/availability
 * @access  Private
 */
const toggleAvailability = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (typeof req.body.isAvailable === 'boolean') {
    user.isAvailable = req.body.isAvailable;
  } else {
    user.isAvailable = !user.isAvailable;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: `Availability updated to ${user.isAvailable ? 'Available' : 'Unavailable'}`,
    isAvailable: user.isAvailable,
    user,
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  toggleAvailability,
  changePassword,
};
