import express from 'express';
import { getAllLearningObjects } from '../controllers/learningObjects.js';

const router = express.Router();

// DWENGO learning objects

// Arg: hruid learningPath
// Query: language
// Route to fetch list of learning objects based on hruid of learning path
// Example: http://localhost:3000/learningObject/un_artificiele_intelligentie
router.get('/:hruid', getAllLearningObjects);

export default router;
