import express from 'express';
import {
    getAllAssignmentsHandler,
    getAssignmentHandler,
} from '../controllers/assignments.js';
import groupRouter from './groups.js';

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllAssignmentsHandler);

// Information about an assignment with id 'id'
router.get('/:id', getAssignmentHandler);

router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: ['0'],
    });
});

router.get('/:id/questions', (req, res) => {
    res.json({
        questions: ['0'],
    });
});

router.use('/:assignmentid/groups', groupRouter);

export default router;
