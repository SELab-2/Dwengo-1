import express from 'express';
import {
    getLearningPaths,
    getLearningPathsByTheme,
    searchLearningPaths,
} from '../controllers/learningPaths.js';

const router = express.Router();

// DWENGO learning paths

// Unified route for fetching learning paths
// Route 1: Query: hruid (list), language
// Fetch learning paths based on hruid list
// Example 1: http://localhost:3000/learningPath?hruids=pn_werking&hruids=art1

// Route 2: no query
// Fetch all learning paths
// Example 2: http://localhost:3000/learningPath (
router.get('/', getLearningPaths);

// Query: language
// Route to fetch learning paths based on a searchterm
// Example: http://localhost:3000/learningPath/search?query=robot
router.get('/search', searchLearningPaths);

// Arg: theme id
// Query: language
// Route to fetch learning paths based on a theme
// Example: http://localhost:3000/learningPath/theme/kiks
router.get('/theme/:theme', getLearningPathsByTheme);

export default router;
