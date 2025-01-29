import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { createError } from "../utils/errorHandler.js";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { signinStart, signinSuccess, signinFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            next(
                createError(400, `Duplicate key error: ${field} already exists`)
            );
        } else {
            next(createError(400, "Error creating user"));
        }
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found");
            return next(createError(400, "Invalid email or password"));
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("Password does not match");
            return next(createError(400, "Invalid email or password"));
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Set the token in an HTTP-only cookie
        res.cookie("auth_token", token, { httpOnly: true });

        // Send the user data without the password
        const { password: _, ...userData } = user._doc;
        res.status(200).json({ message: "Sign in successful", user: userData });
    } catch (error) {
        console.error("Error during sign-in:", error);
        next(createError(500, "Error signing in"));
    }
};

export const google = async (req, res, next) => {
    const { email, name, photo } = req.body;
    console.log("error checking....");
    try {
        // Find the user by email
        let user = await User.findOne({ email });
        console.log("user", user);

        if (user) {
            // User exists, generate a JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            // Set the token in an HTTP-only cookie
            res.cookie("auth_token", token, { httpOnly: true });

            // Send the user data without the password
            const { password: _, ...userData } = user._doc;
            res.status(200).json({
                message: "Sign in successful",
                user: userData,
            });
        } else {
            // User does not exist, create a new user
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    name.split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-4),
                email,
                password: hashedPassword,
                avatar:
                    photo ||
                    "https://th.bing.com/th/id/OIP.0CZd1ESLnyWIHdO38nyJDAHaGF?w=223&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7",
            });
            await newUser.save();

            // Generate a JWT token
            const token = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Set the token in an HTTP-only cookie
            res.cookie("auth_token", token, { httpOnly: true });

            // Send the user data without the password
            const { password: _, ...userData } = newUser._doc;
            res.status(201).json({
                message: "User created and signed in successfully",
                user: userData,
            });
        }
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        next(createError(500, "Error during Google sign-in"));
    }
};

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const { isFetching, error } = useSelector((state) => state.user);

    const handleChange = (e) => {
        const { value, id } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signinStart());
        try {
            const response = await axios.post('/api/auth/signin', formData);
            dispatch(signinSuccess(response.data.user));
            console.log('Successfully signed in:', response.data);
            // Handle successful sign-in (e.g., redirect to dashboard)
        } catch (error) {
            dispatch(signinFailure(error.message));
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-full mb-4"
                    disabled={isFetching}
                >
                    Sign In
                </button>
                {error && <p className="mt-4 text-center text-red-500">Sign in failed. Please try again.</p>}
                <OAuth />
                <p className="mt-4 text-center">Don't have an account? <Link to='/signup' className="text-blue-500 hover:underline">Sign Up</Link></p>
            </form>
        </div>
    );
};

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { value, id } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/signup', formData);
            console.log('Successfully signed up:', response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-full mb-4"
                >
                    Sign Up
                </button>
                <OAuth />
                <p className="mt-4 text-center">Have an Account? <Link to='/signin' className="text-blue-500 hover:underline">Sign In</Link></p>
            </form>
        </div>
    );
};

export default SignUp;
