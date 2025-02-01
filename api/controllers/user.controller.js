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

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Ensure the authenticated user is deleting their own profile
        if (req.user.id !== id) {
            return next(createError(403, 'Access denied. You can only delete your own profile.'));
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next(createError(404, 'User not found'));
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        next(createError(500, 'Error deleting user'));
    }
};

export const getUserById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(createError(404, 'User not found'));
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        next(createError(500, 'Error fetching user'));
    }
};