import express from 'express';
import {
    createStudentHandler,
    deleteStudentHandler,
    getAllStudentsHandler,
    getStudentAssignmentsHandler,
    getStudentClassesHandler,
    getStudentGroupsHandler,
    getStudentHandler,
    getStudentQuestionsHandler,
    getStudentSubmissionsHandler,
} from '../controllers/students.js';
import joinRequestRouter from './student-join-requests.js';
import { preventImpersonation } from '../middleware/auth/checks/user-auth-checks.js';
import { adminOnly } from '../middleware/auth/checks/auth-checks.js';

const router = express.Router();

// Root endpoint used to search objects
router.get('/', adminOnly, getAllStudentsHandler);

// Users will be created automatically when some resource is created for them. Therefore, this endpoint
// Can only be used by an administrator.
router.post('/', adminOnly, createStudentHandler);

router.delete('/:username', preventImpersonation, deleteStudentHandler);

// Information about a student's profile
router.get('/:username', preventImpersonation, getStudentHandler);

// The list of classes a student is in
router.get('/:username/classes', preventImpersonation, getStudentClassesHandler);

// The list of submissions a student has made
router.get('/:username/submissions', preventImpersonation, getStudentSubmissionsHandler);

// The list of assignments a student has
router.get('/:username/assignments', preventImpersonation, getStudentAssignmentsHandler);

// The list of groups a student is in
router.get('/:username/groups', preventImpersonation, getStudentGroupsHandler);

// A list of questions a user has created
router.get('/:username/questions', preventImpersonation, getStudentQuestionsHandler);

router.use('/:username/joinRequests', joinRequestRouter);

export default router;
