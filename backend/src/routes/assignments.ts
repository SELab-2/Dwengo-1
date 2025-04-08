import express from 'express';
import {
    createAssignmentHandler,
    getAllAssignmentsHandler,
    getAssignmentHandler,
    getAssignmentsSubmissionsHandler,
} from '../controllers/assignments.js';
import groupRouter from './groups.js';
import {adminOnly, teachersOnly} from "../middleware/auth/checks/auth-checks";
import {onlyAllowOwnClassInBody} from "../middleware/auth/checks/class-auth-checks";
import {onlyAllowIfHasAccessToAssignment} from "../middleware/auth/checks/assignment-auth-checks";

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', adminOnly, getAllAssignmentsHandler);

router.post('/', teachersOnly, onlyAllowOwnClassInBody, createAssignmentHandler);

// Information about an assignment with id 'id'
router.get('/:id', onlyAllowIfHasAccessToAssignment, getAssignmentHandler);

router.get('/:id/submissions', onlyAllowIfHasAccessToAssignment, getAssignmentsSubmissionsHandler);

router.get('/:id/questions', onlyAllowIfHasAccessToAssignment, (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

router.use('/:assignmentid/groups', groupRouter);

export default router;
