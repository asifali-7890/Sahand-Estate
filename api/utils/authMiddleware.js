import jwt from 'jsonwebtoken';
import { createError } from './errorHandler.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return next(createError(401, 'Access denied. No token provided.'));
    }

    try {
        // console.log('token', token);
        // console.log('Before verification....');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('decoded', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(createError(401, 'Token has expired.'));
        }
        return next(createError(400, 'Invalid token.'));
    }
};