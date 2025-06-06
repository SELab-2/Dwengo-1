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
import { teachersOnly } from '../middleware/auth/checks/auth-checks.js';
import { onlyAllowIfInClass } from '../middleware/auth/checks/class-auth-checks.js';
import { onlyAllowIfHasAccessToAssignment } from '../middleware/auth/checks/assignment-auth-checks.js';

const router = express.Router({ mergeParams: true });

router.get('/', teachersOnly, onlyAllowIfInClass, getAllAssignmentsHandler);

router.post('/', teachersOnly, onlyAllowIfInClass, createAssignmentHandler);

router.get('/:id', onlyAllowIfHasAccessToAssignment, getAssignmentHandler);

router.put('/:id', teachersOnly, onlyAllowIfHasAccessToAssignment, putAssignmentHandler);

router.delete('/:id', teachersOnly, onlyAllowIfHasAccessToAssignment, deleteAssignmentHandler);

router.get('/:id/submissions', teachersOnly, onlyAllowIfHasAccessToAssignment, getAssignmentsSubmissionsHandler);

router.get('/:id/questions', teachersOnly, onlyAllowIfHasAccessToAssignment, getAssignmentQuestionsHandler);

router.use('/:assignmentid/groups', groupRouter);

export default router;
