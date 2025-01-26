import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { createError } from '../utils/errorHandler.js';


export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        // res.status(400).json({ message: 'Error creating user', error });
        next(createError(400, 'Error creating user'));
    }
};