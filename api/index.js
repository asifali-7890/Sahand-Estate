import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import listingRoutes from './routes/listing.route.js'; // Import the listing routes
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Set COOP and CORP headers
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    next();
});

// Enable CORS
app.use(cors());

// Use helmet for security
// Use helmet for 
// app.use(
//     helmet({
//         contentSecurityPolicy: {
//             useDefaults: true,
//             directives: {
//                 "script-src": ["'self'", "https://apis.google.com"],
//                 "img-src": ["'self'", "https:", "data:"]
//             }
//         }
//     })
// );

// MongoDB connection string
const dbURI = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server only after successful connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

// Use routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRoutes); // Use the listing routes

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the MERN Estate API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err); // Add this line
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    res.status(statusCode).json({ message, error: err.message });
});