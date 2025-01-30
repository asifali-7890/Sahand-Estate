import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { createError } from '../utils/errorHandler.js';

export const getApiStatus = (req, res) => {
    res.json({ message: 'Api connected' });
};

export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, email, password, avatar } = req.body;

    try {
        // Ensure the authenticated user is updating their own profile
        if (req.user.id !== id) {
            return next(createError(403, 'Access denied. You can only update your own profile.'));
        }

        const user = await User.findById(id);
        if (!user) {
            return next(createError(404, 'User not found'));
        }

        user.username = username || user.username;
        user.email = email || user.email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        user.avatar = avatar || user.avatar;

        await user.save();

        const { password: _, ...userData } = user._doc;
        res.status(200).json({ message: 'Profile updated successfully', user: userData });
    } catch (error) {
        console.error('Error updating profile:', error);
        next(createError(500, 'Error updating profile'));
    }
};