import express from 'express';
import { createSubmissionHandler, deleteSubmissionHandler, getAllSubmissionsHandler, getSubmissionHandler } from '../controllers/submissions.js';
const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllSubmissionsHandler);

router.post('/:id', createSubmissionHandler);

// Information about an submission with id 'id'
router.get('/:id', getSubmissionHandler);

router.delete('/:id', deleteSubmissionHandler);

export default router;
