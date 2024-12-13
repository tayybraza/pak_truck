
let User = require('../models/userModel.js');
let transport = require('../Mailer/transporter.js');
let { SendotpSchema } = require('../validators/userValidation.js');
let { Verification_Email_Template } = require('../Mailer/EmailTemplate.js');



const SendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: true, message: "Email is required" });

    try {

        let { error } = SendotpSchema.validate({ email })

        if (error) {
            return res.status(401).json({ error: true, message: error.details[0].message });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, otp, otpExpiry });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }

        await user.save();

        await transport.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Verification OTP Code',
            html: Verification_Email_Template.replace('{verificationCode}', otp)
        });

        res.status(200).json({ success: true, message: `OTP sent successfully to ${email}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

module.exports = { SendOTP };






