const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Expecting token in "Bearer TOKEN"

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key'); // Verifikasi token dengan secret key
        req.user = decoded; // Set user yang terverifikasi ke req
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

module.exports = authMiddleware;
