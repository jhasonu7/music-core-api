// music-core-api/server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware

// --- Imports for Music/Albums ---
// Make sure this path is correct relative to this server.js file
const albumRoutes = require('./routes/albumRoutes');

// Create an Express app
const app = express();

// --- Middleware ---
app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json()); // Allows Express to parse incoming JSON data (for request bodies)

// --- Database Connection ---
// Connect to MongoDB using the URI from environment variables
// Removed deprecated options: useNewUrlParser and useUnifiedTopology as Mongoose handles them internally now.
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('MongoDB connected for Core API');
})
.catch(err => {
    console.error('MongoDB connection error for Core API:', err);
    // It's critical to exit if the database connection fails, as the app cannot function without it.
    process.exit(1);
});

// --- API Routes ---
// All routes defined in albumRoutes.js will be prefixed with /api/albums
app.use('/api/albums', albumRoutes);

// --- Health Check Endpoint (Optional but Recommended for Deployment Platforms) ---
// This endpoint can be used by Koyeb to check if your service is running correctly.
app.get('/health', (req, res) => {
    // Check MongoDB connection status
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({ status: 'Core API is healthy', database: dbStatus });
});

// --- Start the server ---
// Use the PORT environment variable provided by the hosting platform, or default to 5000
const port = process.env.PORT || 5000;
// Listen on '0.0.0.0' to make the server accessible from outside the container/environment
app.listen(port, '0.0.0.0', () => {
    console.log(`Core API Server running on http://0.0.0.0:${port}`);
    console.log(`Attempting to connect to MongoDB: ${process.env.MONGODB_URI ? 'URI provided' : 'No URI provided'}`);
});