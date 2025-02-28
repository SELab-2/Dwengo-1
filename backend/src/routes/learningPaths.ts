import express from 'express';
import {
    getLearningPathsFromIds,
    getLearningPathsByTheme,
    getAllLearningPaths,
    searchLearningPaths,
} from '../controllers/learningPaths.js';

const router = express.Router();

// Query: language
// Route to fetch learning paths based on a list of HRUIDs
router.get('/', getLearningPathsFromIds);

// Query: language
// Route to fetch all possible learning paths
router.get('/all', getAllLearningPaths);

// Query: language
// Route to fetch learning paths based on a searchterm
router.get('/search', searchLearningPaths);

// Arg: theme id
// Query: language
// Route to fetch learning paths based on a theme
router.get('/theme/:theme', getLearningPathsByTheme);

export default router;
