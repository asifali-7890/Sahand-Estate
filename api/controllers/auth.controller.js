import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            next(createError(400, `Duplicate key error: ${field} already exists`));
        } else {
            next(createError(400, 'Error creating user'));
        }
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            return next(createError(400, 'Invalid email or password'));
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Password does not match');
            return next(createError(400, 'Invalid email or password'));
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set the token in an HTTP-only cookie
        res.cookie('auth_token', token, { httpOnly: true });

        // Send the user data without the password
        const { password: _, ...userData } = user._doc;
        res.status(200).json({ message: 'Sign in successful', user: userData });
    } catch (error) {
        console.error('Error during sign-in:', error);
        next(createError(500, 'Error signing in'));
    }
};

export const google = async (req, res, next) => {
    const { email, name, photo } = req.body;
    console.log('error checking....')
    try {
        // Find the user by email
        let user = await User.findOne({ email });
        console.log('user', user);
        console.log('process.env.JWT_SECRET', process.env.JWT_SECRET)

        if (!process.env.JWT_SECRET) {
            return;
        }

        if (user) {
            // User exists, generate a JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set the token in an HTTP-only cookie
            res.cookie('auth_token', token, { httpOnly: true });

            // Send the user data without the password
            const { password: _, ...userData } = user._doc;
            res.status(200).json({ message: 'Sign in successful', user: userData });
        } else {
            // User does not exist, create a new user
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email,
                password: hashedPassword,
                avatar: photo || 'https://th.bing.com/th/id/OIP.0CZd1ESLnyWIHdO38nyJDAHaGF?w=223&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7'
            });
            await newUser.save();

            // Generate a JWT token
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Set the token in an HTTP-only cookie
            res.cookie('auth_token', token, { httpOnly: true });

            // Send the user data without the password
            const { password: _, ...userData } = newUser._doc;
            res.status(201).json({ message: 'User created and signed in successfully', user: userData });
        }
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        next(createError(500, 'Error during Google sign-in'));
    }
};