import express from 'express';
import {
    createAssignmentHandler,
    deleteAssignmentHandler,
    getAllAssignmentsHandler,
    getAssignmentHandler,
    getAssignmentQuestionsHandler,
    getAssignmentsSubmissionsHandler,
    putAssignmentHandler,
} from '../controllers/assignments.js';
import groupRouter from './groups.js';

const router = express.Router({ mergeParams: true });

router.get('/', getAllAssignmentsHandler);

router.post('/', createAssignmentHandler);

router.get('/:id', getAssignmentHandler);

router.put('/:id', putAssignmentHandler);

router.delete('/:id', deleteAssignmentHandler);

router.get('/:id/submissions', getAssignmentsSubmissionsHandler);

router.get('/:id/questions', getAssignmentQuestionsHandler);

router.use('/:assignmentid/groups', groupRouter);

export default router;
