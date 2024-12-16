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

            // Check if the CNIC is blocked
            const blockedCnic = await User.findOne({ blockedCnic: cnic });
            if (blockedCnic) {
                throw new Error('Your CNIC is blocked. Registration not allowed.');
            }

            // Check if email already exists
            let user = await User.findOne({ email });
            if (user) {
                throw new Error('User already exists with this email.');
            }

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

    // Block user and add CNIC to the blocked list
    async blockUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            if (!user.cnic) {
                throw new Error('User CNIC not available. Cannot block user.');
            }

            // Check if CNIC is already in blocked list
            if (!user.blockedCnic.includes(user.cnic)) {
                user.blockedCnic.push(user.cnic);
            }

            user.isBlocked = true;
            await user.save();

            return { message: 'User blocked and CNIC added to blocked list', user };
        } catch (error) {
            console.error('Error blocking user:', error.message);
            throw new Error(error.message);
        }
    }

    // Unblock user and remove CNIC from the blocked list
    async unblockUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            user.isBlocked = false;
            user.blockedCnic = user.blockedCnic.filter(cnic => cnic !== user.cnic);
            await user.save();

            return { message: 'User unblocked and CNIC removed from blocked list', user };
        } catch (error) {
            console.error('Error unblocking user:', error.message);
            throw new Error(error.message);
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


    // Process Shop Verification
    async processShopVerification(userData, files) {
        try {
            const { idCardFront, idCardBack, shopPicture } = files;

            // Validate the presence of required files
            if (!idCardFront || !idCardBack || !shopPicture) {
                throw new Error('All files (idCardFront, idCardBack, shopPicture) are required!');
            }

            // Check if email is provided
            if (!userData.cnic) {
                throw new Error('Cnic is required for verification');
            }

            console.log('userData.cnic:', userData.cnic);

            // Check if the user exists in the database
            const existingUser = await User.findOne({ cnic: userData.cnic });

            if (!existingUser) {
                throw new Error('User not found');
            }

            // Prepare the data to save to the database
            const verificationData = {
                ...userData,  // Include user data (such as email, name, etc.)
                idCardFront: idCardFront[0].path,  // Path to the ID card front
                idCardBack: idCardBack[0].path,  // Path to the ID card back
                shopPicture: shopPicture[0].path,  // Path to the shop picture
                verificationDate: new Date(),  // Date when verification was done
                verificationDocuments: true,  // Mark the documents as verified
            };

            // Update the user in the database with the verification data
            const updatedUser = await User.findOneAndUpdate(
                { cnic: userData.cnic },  // Find the user by email
                { $set: verificationData },  // Set the new verification data
                { new: true }  // Return the updated user document
            );

            if (!updatedUser) {
                throw new Error('Error updating user');
            }

            return updatedUser;
        } catch (error) {
            throw new Error(`Error processing shop verification: ${error.message}`);
        }
    }


    // Process Individual Verification (this function seems okay)
    async processIndividualVerification(userData, files) {
        try {
            const { idCardFront, idCardBack } = files;

            // Example logic: Store file paths and user data in a database
            const individualVerificationData = {
                ...userData,
                idCardFront: idCardFront[0].path,
                idCardBack: idCardBack[0].path,
            };

            // Replace with actual DB call
            console.log('Saving individual verification data:', individualVerificationData);
            return individualVerificationData;
        } catch (error) {
            throw new Error(`Error processing individual verification: ${error.message}`);
        }
    }

    generateGoogleToken(user) {
        return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    }
    
}


module.exports = new AuthService();
