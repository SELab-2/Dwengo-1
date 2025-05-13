import express from 'express';
import { deleteLearningPath, getLearningPaths, postLearningPath, putLearningPath } from '../controllers/learning-paths.js';
import { teachersOnly } from '../middleware/auth/auth.js';
import { onlyAdminsForLearningPath } from '../middleware/auth/checks/learning-path-auth-checks.js';

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
router.post('/', teachersOnly, postLearningPath);

router.put('/:hruid/:language', onlyAdminsForLearningPath, putLearningPath);
router.delete('/:hruid/:language', onlyAdminsForLearningPath, deleteLearningPath);

export default router;
