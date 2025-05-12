import express from 'express';
import {
    getAllLearningObjects,
    getAttachment,
    getLearningObject,
    getLearningObjectHTML,
    handleDeleteLearningObject,
    handlePostLearningObject
} from '../controllers/learning-objects.js';

import submissionRoutes from './submissions.js';
import questionRoutes from './questions.js';
import fileUpload from "express-fileupload";
import { teachersOnly } from '../middleware/auth/auth.js';
import { onlyAdminsForLearningObject } from '../middleware/auth/checks/learning-object-auth-checks.js';

const router = express.Router();

// DWENGO learning objects

// Queries: hruid(path), full, language
// Route to fetch list of learning objects based on hruid of learning path

// Route 1: list of object hruids
// Example 1: http://localhost:3000/learningObject?hruid=un_artificiele_intelligentie

// Route 2: list of object data
// Example 2: http://localhost:3000/learningObject?full=true&hruid=un_artificiele_intelligentie
router.get('/', getAllLearningObjects);

router.post('/', teachersOnly, fileUpload({useTempFiles: true}), handlePostLearningObject)

// Parameter: hruid of learning object
// Query: language
// Route to fetch data of one learning object based on its hruid
// Example: http://localhost:3000/learningObject/un_ai7
router.get('/:hruid', getLearningObject);

// Parameter: hruid of learning object
// Query: language
// Route to delete a learning object based on its hruid.
// Example: http://localhost:3000/learningObject/un_ai7?language=nl&version=1
router.delete('/:hruid', onlyAdminsForLearningObject, handleDeleteLearningObject)

router.use('/:hruid/submissions', submissionRoutes);

router.use('/:hruid/:version/questions', questionRoutes);

// Parameter: hruid of learning object
// Query: language, version (optional)
// Route to fetch the HTML rendering of one learning object based on its hruid.
// Example: http://localhost:3000/learningObject/un_ai7/html
router.get('/:hruid/html', getLearningObjectHTML);

// Parameter: hruid of learning object, name of attachment.
// Query: language, version (optional).
// Route to get the raw data of the attachment for one learning object based on its hruid.
// Example: http://localhost:3000/learningObject/u_test/attachment/testimage.png
router.get('/:hruid/html/:attachmentName', getAttachment);

export default router;
