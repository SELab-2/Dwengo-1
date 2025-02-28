import express from 'express';
import {
    getLearningPathsFromIds,
    getLearningPathsByTheme,
    getAllLearningPaths,
    searchLearningPaths,
} from '../controllers/learningPaths.js';

const router = express.Router();

// Query: hruids(list), language
// Route to fetch learning paths based on a list of HRUIDs
// Example: http://localhost:3000/learningPath?hruids=pn_werking&hruids=art1
router.get('/', getLearningPathsFromIds);

// Query: language
// Route to fetch all possible learning paths
router.get('/all', getAllLearningPaths);

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
