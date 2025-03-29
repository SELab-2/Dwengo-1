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
import joinRequestRouter from './student-join-requests.js'

const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllStudentsHandler);

router.post('/', createStudentHandler);

router.delete('/:username', deleteStudentHandler);

// Information about a student's profile
router.get('/:username', getStudentHandler);

// The list of classes a student is in
router.get('/:username/classes', getStudentClassesHandler);

// The list of submissions a student has made
router.get('/:username/submissions', getStudentSubmissionsHandler);

// The list of assignments a student has
router.get('/:username/assignments', getStudentAssignmentsHandler);

// The list of groups a student is in
router.get('/:username/groups', getStudentGroupsHandler);

// A list of questions a user has created
router.get('/:username/questions', getStudentQuestionsHandler);

router.use('/:username/joinRequests', joinRequestRouter)

export default router;
