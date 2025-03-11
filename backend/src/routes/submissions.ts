import express from 'express';
import { getSubmissionHandler } from '../controllers/submissions';
const router = express.Router();



// Root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        submissions: ['0', '1'],
    });
});

// Information about an submission with id 'id'
router.get('/:id', getSubmissionHandler);

export default router;
