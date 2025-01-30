import jwt from 'jsonwebtoken';
import { createError } from './errorHandler.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;
    console.log('token', token);
    if (!token) {
        return next(createError(401, 'Access denied. No token provided.'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(createError(400, 'Invalid token.'));
    }
};