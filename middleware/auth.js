const AppError = require('../errorHandlers/apperror');
const catchAsync = require("../middleware/catchAsync");
const jwt = require("jsonwebtoken");


exports.isAuthenticatedUser = catchAsync(async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
    } else {
        return res.status(400).json({ message: "Please login to access these resource" });
    }
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        4
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};

