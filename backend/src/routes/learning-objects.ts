import express from 'express';
import {
    getAllLearningObjects,
    getLearningObject, getLearningObjectHTML,
} from '../controllers/learning-objects.js';

const router = express.Router();

// DWENGO learning objects

// Queries: hruid(path), full, language
// Route to fetch list of learning objects based on hruid of learning path

// Route 1: list of object hruids
// Example 1: http://localhost:3000/learningObject?hruid=un_artificiele_intelligentie

// Route 2: list of object data
// Example 2: http://localhost:3000/learningObject?full=true&hruid=un_artificiele_intelligentie
router.get('/', getAllLearningObjects);

// Parameter: hruid of learning object
// Query: language
// Route to fetch data of one learning object based on its hruid
// Example: http://localhost:3000/learningObject/un_ai7
router.get('/:hruid', getLearningObject);

// Parameter: hruid of learning object
// Query: language, version (optional)
// Route to fetch the HTML rendering of one learning object based on its hruid.
// Example: http://localhost:3000/learningObject/un_ai7/html
router.get('/:hruid/html', getLearningObjectHTML);

export default router;
