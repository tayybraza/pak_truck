const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Get the token from the Authorization header
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;  // Attach user details to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
