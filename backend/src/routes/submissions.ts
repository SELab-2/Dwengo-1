import express from 'express';
import { createSubmissionHandler, deleteSubmissionHandler, getSubmissionHandler, getSubmissionsHandler } from '../controllers/submissions.js';
import { onlyAllowIfHasAccessToSubmission, onlyAllowSubmitter } from '../middleware/auth/checks/submission-checks.js';
import { adminOnly, studentsOnly } from '../middleware/auth/checks/auth-checks.js';
const router = express.Router({ mergeParams: true });

router.get('/', adminOnly, getSubmissionsHandler);

router.post('/', studentsOnly, onlyAllowSubmitter, createSubmissionHandler);

router.get('/:id', onlyAllowIfHasAccessToSubmission, getSubmissionHandler);

router.delete('/:id', onlyAllowIfHasAccessToSubmission, deleteSubmissionHandler);

export default router;
