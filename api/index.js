import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string
const dbURI = process.env.MONGO_URL;

// Connect to MongoDB
mongoose.connect(dbURI)
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

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send({ name: 'Hello, World!' });
});