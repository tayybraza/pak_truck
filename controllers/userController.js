const User = require('../models/userModel'); // Import the User model
const authService = require('../services/authService');
const { SignupSchema } = require('../validators/userValidation');
const bcrypt = require('bcryptjs');

class UserController {

    async signup(req, res) {
        try {
            // Validate request body against the schema
            const { error } = await SignupSchema.validateAsync(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { email, otp, password, fullname, shopCategory, accountMode, shopeName, cnic, shopeAddress, role } = req.body;

            // Get the user based on the email
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            // Debugging: Check OTP and expiry
            console.log('OTP Expiry:', user.otpExpiry);
            console.log('Current Time:', Date.now());
            console.log('Stored OTP:', user.otp);
            console.log('Entered OTP:', otp);

            // Check OTP validity and expiry
            if (user.otp !== otp) {
                return res.status(400).json({ message: "OTP is incorrect" });
            }

            // Check if OTP has expired
            if (Date.now() > user.otpExpiry) {
                return res.status(400).json({ message: "OTP expired" });
            }

            // Proceed with signup if OTP is correct
            // Update user details and save
            user.password = await bcrypt.hash(password, 10);
            user.verified = true;
            user.fullname = fullname;
            user.accountMode = accountMode;
            user.role = role || "seller";

            if (accountMode === "shop") {
                user.shopCategory = shopCategory;
                user.shopeName = shopeName;
                user.cnic = cnic;
                user.shopeAddress = shopeAddress;
            }

            // Ye purany wala code hy without shopeCategory 
            // user.password = await bcrypt.hash(password, 10);  // Hash the password
            // user.verified = true;  // Mark the user as verified
            // user.fullname = fullname; // Assign fullname
            // user.accountMode = accountMode; // Assign accountMode
            // user.role = role || "seller"; // Assign the role (default is seller)
            // user.shopeName = accountMode === 'shop' ? shopeName : undefined;
            // user.cnic = accountMode === 'shop' ? cnic : undefined;
            // user.shopeAddress = accountMode === 'shop' ? shopeAddress : undefined;

            await user.save();

            res.status(201).json({ message: 'User signed up and verified successfully', user });

        } catch (error) {
            console.error('Error in signup:', error);
            res.status(400).json({ message: error.message });
        }
    }

    async signin(req, res) {
        try {
            const result = await authService.signin(req.body);
            // Send user data and token in the response
            res.status(200).json({
                message: result.message,
                token: result.token,
                user: result.user // This will include the full user details
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const result = await authService.resetPassword(req.body.email);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updatePassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const result = await authService.updatePassword(token, newPassword);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get all users (Only admin access)
    async getAllUsers(req, res) {
        try {
            const result = await authService.getAllUsers();
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get user by ID (Access for admin, seller, customer, user)
    async getUserById(req, res) {
        try {
            console.log('User object:', req.user); // Debugging line to check req.user

            const { userId } = req.params;
            const role = req.user ? req.user.role : null;  // Ensure role is defined before passing

            if (!role) {
                return res.status(400).json({ message: 'User role is undefined' });
            }

            const result = await authService.getUserById(userId, role);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Get profile of user (Access for admin, seller, customer, user)
    async getProfileUser(req, res) {
        try {
            const result = await authService.getProfileUser(req.user._id, req.user.role);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update user profile (Access for admin, seller, customer, user)
    async updateUserProfile(req, res) {
        try {
            const result = await authService.updateUserProfile(req.user._id, req.body, req.user.role);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Block user (Only admin access)
    async blockUser(req, res) {
        try {
            const { userId } = req.params;
            const { reason } = req.body; // Get reason from request body

            // Check if the user is admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'You do not have permission to block users' });
            }

            // Validate reason
            const validReasons = ["Violation of Terms", "Inappropriate Behavior", "Spamming", "Suspicious Activity"];
            if (!validReasons.includes(reason)) {
                return res.status(400).json({ message: 'Invalid block reason' });
            }

            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Block the user and set the reason
            user.isBlocked = true;
            user.blockReason = reason;
            await user.save(); // Save the changes

            res.status(200).json({
                message: 'User blocked successfully',
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    isBlocked: user.isBlocked,
                    blockReason: user.blockReason
                }
            });

        } catch (error) {
            console.error('Error blocking user:', error);
            res.status(400).json({ message: error.message });
        }
    }

    // Unlock user (Only admin access)
    async unlockUser(req, res) {
        try {
            const { userId } = req.params;

            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'You do not have permission to unlock users' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Unlock the user and clear the block reason
            user.isBlocked = false;
            user.blockReason = null;
            await user.save();

            res.status(200).json({
                message: 'User unlocked successfully',
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    isBlocked: user.isBlocked,
                    blockReason: user.blockReason
                }
            });

        } catch (error) {
            console.error('Error unlocking user:', error);
            res.status(400).json({ message: error.message });
        }
    }

    // Delete user (Only admin access)
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'You do not have permission to delete users' });
            }
            const result = await authService.deleteUser(userId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Verify Shop Account
    async verifyShopAccount(req, res) {
        try {
            const { idCardFront, idCardBack, shopPicture } = req.files;

            if (!idCardFront || !idCardBack || !shopPicture) {
                return res.status(400).json({ message: 'All files (idCardFront, idCardBack, shopPicture) are required!' });
            }

            console.log('Files received:', idCardFront, idCardBack, shopPicture);

            // Pass data to the service method for shop verification
            const result = await authService.processShopVerification(req.body, {
                idCardFront,
                idCardBack,
                shopPicture,
            });

            res.status(200).json({ message: 'Shop account verified successfully!', data: result });
        } catch (error) {
            console.error('Error verifying shop account:', error);
            res.status(500).json({ message: 'Error verifying shop account', error: error.message });
        }
    }


    // Verify Individual Account
    async verifyIndividualAccount(req, res) {
        try {
            const { idCardFront, idCardBack } = req.files;

            if (!idCardFront || !idCardBack) {
                return res.status(400).json({ message: 'Both idCardFront and idCardBack are required!' });
            }

            // Pass data to the service method for individual verification
            const result = await authService.processIndividualVerification(req.body, {
                idCardFront,
                idCardBack,
            });

            res.status(200).json({ message: 'Individual account verified successfully!', data: result });
        } catch (error) {
            console.error('Error verifying individual account:', error);
            res.status(500).json({ message: 'Error verifying individual account', error: error.message });
        }
    }



}

module.exports = new UserController();
