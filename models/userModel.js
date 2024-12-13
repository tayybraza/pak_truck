
let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: function () {
            return this.verified; // Only required if verified is true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.verified; // Only require password if user is verified
        },
        minLength: [8, "Password must have at least 8 characters"],
    },
    accountMode: {
        type: String,
        enum: ["individual", "shop"],
        required: function () {
            return this.verified;
        }
    },
    shopCategory: {
        type: String,
        enum: ["factory", "showRoom", "shop"],
        required: function () {
            return this.accountMode === "shop";
        }
    },
    otp: {
        type: String
    },

    otpExpiry: {
        type: Date,
        select: false
    },

    verified: {
        type: Boolean,
        default: false
    },
    shopeName: {
        type: String,
        required: function () {
            return this.accountMode === "shop";
        }
    },
    cnic: {
        type: String,
        required: function () {
            return this.accountMode === "shop";
        }
    },
    shopeAddress: {
        type: String,
        required: function () {
            return this.accountMode === "shop";
        }
    },
    role: {
        type: String,
        enum: ["admin", "seller", "customer", "user"],
        default: "seller" // Default role is seller
    },
    isBlocked: { // New field to track if the user is blocked
        type: Boolean,
        default: false
    },
        // Optional fields for user profile
    username: {
        type: String,
        trim: true,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    phoneNo: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);