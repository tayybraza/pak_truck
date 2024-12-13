let joi = require('joi');

let SendotpSchema = joi.object({
    email: joi.string().required()
        .email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } })
})

let SignupSchema = joi.object({
    fullname: joi.string().min(3).required(),
    email: joi.string().email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } }).required(),
    password: joi.string().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
        .required(),
    otp: joi.string().pattern(new RegExp('^\\d{6}$')).required(),
    accountMode: joi.string().valid('individual', 'shop').required(),
    shopCategory: joi.string().valid('factory', 'showRoom')
        .when('accountMode', { is: 'shop', then: joi.required() }),
    shopeName: joi.string().when('accountMode', { is: 'shop', then: joi.required() }),
    cnic: joi.string().when('accountMode', { is: 'shop', then: joi.required() }),
    shopeAddress: joi.string().when('accountMode', { is: 'shop', then: joi.required() }),
    role: joi.string().valid('admin', 'seller', 'customer', 'user').default('seller')
});


let SigninSchema = joi.object({
    email: joi.string().required().email({
        tlds: { allow: ['com', 'net', 'org', 'edu'] }
    }),
    password: joi.string().required().min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'))
});

let ResetpasswordSchema = joi.object({
    email: joi.string().required().email({ tlds: { allow: ['com', 'net', 'org', 'edu'] } }),
    newpassword: joi.string().required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')),
    otp: joi.string().pattern(new RegExp('^\\d{6}$'))
})

module.exports = { SendotpSchema, SignupSchema, SigninSchema, ResetpasswordSchema };
