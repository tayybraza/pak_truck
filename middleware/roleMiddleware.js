// middleware/roleMiddleware.js

// Middleware to check if the user has a specific role
exports.checkRole = (roles) => {
    return (req, res, next) => {
        // Ensure the user has a role
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if the user's role matches one of the allowed roles
        const userRoleName = req.user.role.roleName; // Access roleName from the role object
        if (!roles.includes(userRoleName)) {
            return res.status(403).json({ message: `User role ${userRoleName} is not authorized to access this route` });
        }

        next();
    };
};
