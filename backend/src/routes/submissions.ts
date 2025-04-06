import express from 'express';
import { createSubmissionHandler, deleteSubmissionHandler, getAllSubmissionsHandler, getSubmissionHandler } from '../controllers/submissions.js';
const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
<<<<<<< HEAD
router.get('/', getAllSubmissionsHandler);
=======
router.get('/', (_req, res) => {
    res.json({
        submissions: ['0', '1'],
    });
});
>>>>>>> 6c3dbc99bb1afb79fa867505e52656c49bada1b6

router.post('/:id', createSubmissionHandler);

// Information about an submission with id 'id'
router.get('/:id', getSubmissionHandler);

router.delete('/:id', deleteSubmissionHandler);

export default router;
