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
import {adminOnly, teachersOnly} from "../middleware/auth/checks/auth-checks";
import {onlyAllowOwnClassInBody} from "../middleware/auth/checks/class-auth-checks";
import {onlyAllowIfHasAccessToAssignment} from "../middleware/auth/checks/assignment-auth-checks";

const router = express.Router({ mergeParams: true });

router.get('/', getAllAssignmentsHandler);
// Root endpoint used to search objects
router.get('/', adminOnly, getAllAssignmentsHandler);

router.post('/', teachersOnly, onlyAllowOwnClassInBody, createAssignmentHandler);

router.get('/:id', getAssignmentHandler);
// Information about an assignment with id 'id'
router.get('/:id', onlyAllowIfHasAccessToAssignment, getAssignmentHandler);

router.put('/:id', putAssignmentHandler);

router.delete('/:id', deleteAssignmentHandler);

router.get('/:id/submissions', onlyAllowIfHasAccessToAssignment, getAssignmentsSubmissionsHandler);

router.get('/:id/questions', onlyAllowIfHasAccessToAssignment, (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

router.use('/:assignmentid/groups', groupRouter);

export default router;
