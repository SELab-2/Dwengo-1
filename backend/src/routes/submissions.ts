import express from 'express';
import {createSubmissionHandler, deleteSubmissionHandler, getSubmissionHandler} from '../controllers/submissions.js';
const router = express.Router({ mergeParams: true });



// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        submissions: ['0', '1'],
    });
});

router.post('/:id', createSubmissionHandler);

// Information about an submission with id 'id'
router.get('/:id', getSubmissionHandler);

router.delete('/:id', deleteSubmissionHandler);

export default router;
