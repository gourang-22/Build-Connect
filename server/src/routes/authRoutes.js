const express = require('express');
const router = express.Router();
const {
  register, login, getMe, updateProfile, toggleAvailability, changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadProfile } = require('../config/cloudinary');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, uploadProfile.single('profileImage'), updateProfile);
router.put('/availability', protect, toggleAvailability);
router.put('/change-password', protect, changePassword);

module.exports = router;
