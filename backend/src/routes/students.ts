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
import {onlyAllowUserHimself} from "../middleware/auth/checks/user-auth-checks";
import {adminOnly} from "../middleware/auth/checks/auth-checks";

const router = express.Router();

// Root endpoint used to search objects
router.get('/', adminOnly, getAllStudentsHandler);

// Users will be created automatically when some resource is created for them. Therefore, this endpoint
// can only be used by an administrator.
router.post('/', adminOnly, createStudentHandler);

router.delete('/:username', onlyAllowUserHimself, deleteStudentHandler);

// Information about a student's profile
router.get('/:username', onlyAllowUserHimself, getStudentHandler);

// The list of classes a student is in
router.get('/:username/classes', onlyAllowUserHimself, getStudentClassesHandler);

// The list of submissions a student has made
router.get('/:username/submissions', onlyAllowUserHimself, getStudentSubmissionsHandler);

// The list of assignments a student has
router.get('/:username/assignments', onlyAllowUserHimself, getStudentAssignmentsHandler);

// The list of groups a student is in
router.get('/:username/groups', onlyAllowUserHimself, getStudentGroupsHandler);

// A list of questions a user has created
router.get('/:username/questions', onlyAllowUserHimself, getStudentQuestionsHandler);

router.use('/:username/joinRequests', joinRequestRouter);

export default router;
