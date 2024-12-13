// Import required modules
const express = require('express');
const userController = require('../controllers/userController');
const { SendOTP } = require('../controllers/otpController');
const authMiddleware = require('../middleware/authMiddleware');
// Initialize the router
const router = express.Router();

// Define the routes

// Sign Up route
router.post('/signup', userController.signup);

// Sign In route
router.post('/signin', userController.signin);

// Reset Password route
router.post('/reset-password', userController.resetPassword);

// Update Password route
router.post('/update-password', userController.updatePassword);

// Get all users (Only admin)
router.get('/allusers', userController.getAllUsers);

// Get user by ID (admin, seller, customer, user)
router.get('/users/:userId', authMiddleware, userController.getUserById);

// Get profile of user (admin, seller, customer, user)
router.get('/profile', authMiddleware, userController.getProfileUser);

// Update user profile (admin, seller, customer, user)
router.put('/update-profile', authMiddleware, userController.updateUserProfile);

// Block user (Only admin)
router.patch('/user/block/:userId', authMiddleware, userController.blockUser);

// Unlock user (Only admin)
router.patch('/user/unlock/:userId', authMiddleware, userController.unlockUser);

// Delete user (Only admin)
router.delete('/user/delete/:userId', userController.deleteUser);

// Send OTP route
router.post('/send-otp', SendOTP);

// Export the router
module.exports = router;
