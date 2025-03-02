import express from 'express';
import { getLearningPaths } from '../controllers/learningPaths.js';

const router = express.Router();

// DWENGO learning paths

// Route 1: no query
// Fetch all learning paths
// Example 1: http://localhost:3000/learningPath

// Unified route for fetching learning paths
// Route 2: Query: hruid (list), language
// Fetch learning paths based on hruid list
// Example 2: http://localhost:3000/learningPath?hruid=pn_werking&hruid=art1

// Query: search, language
// Route to fetch learning paths based on a searchterm
// Example 3: http://localhost:3000/learningPath?search=robot

// Query: theme, anguage
// Route to fetch learning paths based on a theme
// Example: http://localhost:3000/learningPath?theme=kiks

router.get('/', getLearningPaths);

export default router;
