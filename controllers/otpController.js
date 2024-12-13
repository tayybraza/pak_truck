// otpController.js

let User = require('../models/userModel.js');
let transport = require('../Mailer/transporter.js');
let { SendotpSchema } = require('../validators/userValidation.js');
let { Verification_Email_Template } = require('../Mailer/EmailTemplate.js');

// const SendOTP = async (req, res) => {
//     const { email } = req.body;
    
//     // Check if email is provided
//     if (!email) {
//         return res.status(400).json({ error: true, message: "Email is required" });
//     }

//     try {
//         // Validate email using Joi schema
//         let { error } = SendotpSchema.validate({ email });
//         if (error) {
//             return res.status(401).json({ error: true, message: error.details[0].message });
//         }

//         // Generate OTP and set expiry time (10 minutes)
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expiry in 10 minutes

//         // Check if the user already exists
//         let user = await User.findOne({ email });

//         if (!user) {
//             // If user doesn't exist, create a new one with the generated OTP
//             user = new User({
//                 email,
//                 password: 'temporaryPassword123',  // Temporary password for new users
//                 otp,
//                 otpExpiry,
//             });
//         } else {
//             // If user exists, update OTP and expiry time
//             user.otp = otp;
//             user.otpExpiry = otpExpiry;
//         }

//         // Save the user (either new or updated)
//         await user.save();

//         // Send OTP email using the transporter (Nodemailer)
//         await transport.sendMail({
//             from: process.env.USER_EMAIL,
//             to: email,
//             subject: 'Verification OTP Code',
//             html: Verification_Email_Template.replace('{verificationCode}', otp),  // Email template with OTP
//         });

//         // Respond with success message
//         res.status(200).json({ success: true, message: `OTP sent successfully to ${email}` });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: true, message: "Internal Server Error" });
//     }
// }

const SendOTP = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    try {
        // Validate email using Joi schema
        let { error } = SendotpSchema.validate({ email });
        if (error) {
            return res.status(401).json({ error: true, message: error.details[0].message });
        }

        // Generate OTP and set expiry time (10 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expiry in 10 minutes

        // Check if the user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create a new one with the generated OTP
            user = new User({
                email,
                otp,
                otpExpiry,
                verified: false // Not verified yet
            });
        } else {
            // If user exists, update OTP and expiry time
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }

        // Save the user (either new or updated)
        await user.save();

        // Send OTP email using the transporter (Nodemailer)
        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Verification OTP Code',
            html: Verification_Email_Template.replace('{verificationCode}', otp),
        });

        // Respond with success message
        res.status(200).json({ success: true, message: `OTP sent successfully to ${email}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}



module.exports = { SendOTP };
