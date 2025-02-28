import express from 'express';
import { getAllLearningObjects } from '../controllers/learningObjects.js';

const router = express.Router();

// Arg: hruid learningPath
// Query: language
// Route to fetch list of learning objects based on hruid of learning path
router.get('/:hruid', getAllLearningObjects);

export default router;
