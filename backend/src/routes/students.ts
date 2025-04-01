import express from 'express';
import {
    createStudentHandler,
    deleteStudentHandler,
    getAllStudentsHandler,
    getStudentAssignmentsHandler,
    getStudentClassesHandler,
    getStudentGroupsHandler,
    getStudentHandler,
    getStudentSubmissionsHandler,
} from '../controllers/students.js';

const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllStudentsHandler);

router.post('/', createStudentHandler);

router.delete('/', deleteStudentHandler);

router.delete('/:username', deleteStudentHandler);

// Information about a student's profile
router.get('/:username', getStudentHandler);

// The list of classes a student is in
router.get('/:id/classes', getStudentClassesHandler);

// The list of submissions a student has made
router.get('/:id/submissions', getStudentSubmissionsHandler);

// The list of assignments a student has
router.get('/:id/assignments', getStudentAssignmentsHandler);

// The list of groups a student is in
router.get('/:id/groups', getStudentGroupsHandler);

// A list of questions a user has created
router.get('/:id/questions', (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

export default router;
