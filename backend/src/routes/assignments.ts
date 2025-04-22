import express from 'express';
import {
    createAssignmentHandler,
    deleteAssignmentHandler,
    getAllAssignmentsHandler,
    getAssignmentHandler,
    getAssignmentsSubmissionsHandler,
    putAssignmentHandler,
} from '../controllers/assignments.js';
import groupRouter from './groups.js';
import {teachersOnly} from "../middleware/auth/checks/auth-checks";
import {onlyAllowIfInClass} from "../middleware/auth/checks/class-auth-checks";
import {onlyAllowIfHasAccessToAssignment} from "../middleware/auth/checks/assignment-auth-checks";

const router = express.Router({ mergeParams: true });

router.get('/', teachersOnly, onlyAllowIfInClass, getAllAssignmentsHandler);

router.post('/', teachersOnly, onlyAllowIfInClass, createAssignmentHandler);

router.get('/:id', onlyAllowIfHasAccessToAssignment, getAssignmentHandler);

router.put('/:id', teachersOnly, onlyAllowIfHasAccessToAssignment, putAssignmentHandler);

router.delete('/:id', teachersOnly, onlyAllowIfHasAccessToAssignment, deleteAssignmentHandler);

router.get('/:id/submissions', teachersOnly, onlyAllowIfHasAccessToAssignment, getAssignmentsSubmissionsHandler);

router.get('/:id/questions', teachersOnly, onlyAllowIfHasAccessToAssignment, (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

router.use('/:assignmentid/groups', groupRouter);

export default router;
