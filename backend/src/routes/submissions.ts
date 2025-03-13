import express from 'express';
import { getSubmissionHandler } from '../controllers/submissions.js';
const router = express.Router({ mergeParams: true });



// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        submissions: ['0', '1'],
    });
});

// Information about an submission with id 'id'
router.get('/:id', getSubmissionHandler);

export default router;
