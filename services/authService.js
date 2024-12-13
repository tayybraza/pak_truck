const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const transport = require('../services/otpService');
const { Welcome_Email_Template, Forget_Password_Template, password_Reset_Successfully_Template } = require('../Mailer/EmailTemplate');
const { generateToken } = require('../utils/tokenGenerator');
const { handleError } = require('../utils/errorHandler');

class AuthService {
    // Function for Singup and OTP verification flow
    async signup(userDetails) {
        try {
            const { email, otp, password } = userDetails;

            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                // If user exists but not verified, check OTP
                if (!user.verified && user.otp === otp && Date.now() < user.otpExpiry) {
                    user.password = await bcrypt.hash(password, 10); // Hash the password
                    user.verified = true; // Mark the user as verified
                    await user.save();
                    return { message: 'User signed up and verified successfully', user };
                } else if (!user.verified) {
                    throw new Error('OTP expired or incorrect');
                } else {
                    throw new Error('User already exists with this email');
                }
            }

            // If user doesn't exist, proceed with creating a new user
            const newUser = new User({
                email,
                otp,
                password: await bcrypt.hash(password, 10), // Hash password
                verified: false,  // Initially not verified
                otpExpiry: Date.now() + 10 * 60 * 1000, // OTP expiry time
            });

            await newUser.save();
            // Send OTP email
            await transport.sendEmail(email, `Your OTP is ${otp}`);

            return { message: 'User created successfully. Please verify with OTP.', user: newUser };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async signin(credentials) {
        try {
            const { email, password } = credentials;
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Invalid credentials');

            // Generate JWT token
            const token = generateToken(user._id);

            // Return both the user data and token
            return { message: 'User signed in successfully', token, user }; // User includes role now
        } catch (error) {
            throw handleError(error);
        }
    }

    async resetPassword(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');

            // Generate a password reset token and send email
            const resetToken = generateToken(user._id, '1h');  // Token expires in 1 hour
            await transport.sendEmail(email, Forget_Password_Template(resetToken));

            return { message: 'Password reset email sent successfully' };
        } catch (error) {
            throw handleError(error);
        }
    }

    async updatePassword(token, newPassword) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) throw new Error('User not found');

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            await transport.sendEmail(user.email, password_Reset_Successfully_Template());

            return { message: 'Password updated successfully' };
        } catch (error) {
            throw handleError(error);
        }
    }

    // Get all users (Only admin access)
    async getAllUsers() {
        try {
            const users = await User.find();
            return { users };
        } catch (error) {
            throw handleError(error);
        }
    }

    // Get user by ID (Access for admin, seller, customer, user)
    async getUserById(userId, role) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            if (role !== 'admin' && user._id.toString() !== userId.toString()) {
                throw new Error('You do not have permission to access this user');
            }
            return { user };
        } catch (error) {
            throw handleError(error);
        }
    }

    // Get profile of user (Access for admin, seller, customer, user)
    async getProfileUser(userId, role) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            if (role !== 'admin' && user._id.toString() !== userId.toString()) {
                throw new Error('You do not have permission to access this profile');
            }
            return { user };
        } catch (error) {
            throw handleError(error);
        }
    }

    // Update User Profile.......
    async updateUserProfile(userId, updateData, userRole) {
        try {
            // Extract data
            const { username, country, city, phoneNo, fullname, newAttribute } = updateData;

            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            // Update fields
            if (username) user.username = username;
            if (country) user.country = country;
            if (city) user.city = city;
            if (phoneNo) user.phoneNo = phoneNo;
            if (fullname) user.fullname = fullname;
            if (newAttribute) user.newAttribute = newAttribute; // Add your new attribute here

            // Save changes
            await user.save();

            return { message: "Profile updated successfully", user };
        } catch (error) {
            console.error('Error updating profile:', error);
            throw new Error(error.message);
        }
    }

    // Block user (Only admin access)
    async blockUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            user.isBlocked = true;
            await user.save();
            return { message: 'User blocked successfully', user };
        } catch (error) {
            throw handleError(error);
        }
    }

    // Unlock user (Only admin access)
    async unlockUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            user.isBlocked = false;
            await user.save();
            return { message: 'User unlocked successfully', user };
        } catch (error) {
            throw handleError(error);
        }
    }

    // Delete user (Only admin access)
    async deleteUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            await user.remove();
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw handleError(error);
        }
    }
}


module.exports = new AuthService();
