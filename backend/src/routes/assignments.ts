import express from 'express';
import {
    createAssignmentHandler,
    getAllAssignmentsHandler,
    getAssignmentHandler,
    getAssignmentsSubmissionsHandler,
} from '../controllers/assignments.js';
import groupRouter from './groups.js';

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllAssignmentsHandler);

router.post('/', createAssignmentHandler);

// Information about an assignment with id 'id'
router.get('/:id', getAssignmentHandler);

router.get('/:id/submissions', getAssignmentsSubmissionsHandler);

router.get('/:id/questions', (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

router.use('/:assignmentid/groups', groupRouter);

export default router;
