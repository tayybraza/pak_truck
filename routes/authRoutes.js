// Import required modules
const express = require('express');
const userController = require('../controllers/userController');
const authService = require('../services/authService');
const { SendOTP } = require('../controllers/otpController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/fileUpload');
const passport = require('passport');

// Initialize the router
const router = express.Router();

// Define the routes
// Google Auth Routes
// Route to initiate Google Authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google Authentication
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/fail' }),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Google Authentication Successful',
            user: req.user,
        });
    }
);

// Route for failed login
router.get('/fail', (req, res) => {
    res.status(401).json({ success: false, message: 'Google Authentication Failed' });
});

// router.get(
//     '/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/signin' }),
//     async (req, res) => {
//         try {
//             const token = authService.generateGoogleToken(req.user);
//             res.status(200).json({ message: 'Login successful', token });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// );

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
// router.post('/user/block/:userId', authMiddleware, userController.blockUser);

router.post('/user/block/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await authService.blockUser(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Unblock User
router.post('/user/unlock/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await authService.unblockUser(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Unlock user (Only admin)
// router.patch('/user/unlock/:userId', authMiddleware, userController.unlockUser);

// Delete user (Only admin)
router.delete('/user/delete/:userId', userController.deleteUser);

// Send OTP route
router.post('/send-otp', SendOTP);


// Shop Verification Route (with file uploads)
router.post('/verify/shop', upload.fields([
    { name: 'idCardFront', maxCount: 1 },
    { name: 'idCardBack', maxCount: 1 },
    { name: 'shopPicture', maxCount: 1 }
]), userController.verifyShopAccount);

// Individual Verification Route (with file uploads)
router.post('/verify/individual', upload.fields([
    { name: 'idCardFront', maxCount: 1 },
    { name: 'idCardBack', maxCount: 1 }
]), userController.verifyIndividualAccount);


// Export the router
module.exports = router;
