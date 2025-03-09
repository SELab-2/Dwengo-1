import express from 'express'
import {
    createStudentHandler, deleteStudentHandler,
    getAllStudentsHandler,
    getStudentAssignmentsHandler,
    getStudentClassesHandler,
    getStudentHandler
} from '../controllers/students.js';
const router = express.Router();

// root endpoint used to search objects
router.get('/', getAllStudentsHandler);

router.post('/', createStudentHandler);

router.delete('/:username', deleteStudentHandler);

// information about a student's profile
router.get('/:username', getStudentHandler);



// the list of classes a student is in
router.get('/:id/classes', getStudentClassesHandler);

// the list of submissions a student has made
router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: [ '0' ],
    });
})


// the list of assignments a student has
router.get('/:id/assignments', getStudentAssignmentsHandler);

// the list of groups a student is in
router.get('/:id/groups', (req, res) => {
    res.json({
        groups: [ '0' ],
    });
})

// a list of questions a user has created
router.get('/:id/questions', (req, res) => {
    res.json({
        questions: [ '0' ],
    });
})

export default router
