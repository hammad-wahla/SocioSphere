// routes/songRouter.js
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authMiddleware = require('../middleware/authMiddleware');

// Example: Route to handle song uploads
router.post('/upload', authMiddleware, songController.uploadSong);

// Add more routes as needed (e.g., get songs, delete songs, etc.)

module.exports = router;
