import express from 'express';
import { createSubmissionHandler, deleteSubmissionHandler, getSubmissionHandler, getSubmissionsHandler } from '../controllers/submissions.js';
const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getSubmissionsHandler);

router.post('/', createSubmissionHandler);

// Information about an submission with id 'id'
router.get('/:id', getSubmissionHandler);

router.delete('/:id', deleteSubmissionHandler);

export default router;
