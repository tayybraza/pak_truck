// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
    const token = user.generateJwtToken();
    // const token = user.generateJwtToken(user._id, user.role);


    // const { _id, firstName, lastName, email, role, fullName } = user;
    res.status(statusCode).cookie("token", token).json({
        success: true,
        token,
        user,

    });
};

module.exports = sendToken;
