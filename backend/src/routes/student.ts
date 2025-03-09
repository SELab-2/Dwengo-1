import express from 'express'
import { getAllStudentsHandler, getStudentAssignmentsHandler, getStudentClassesHandler, getStudentHandler } from '../controllers/students';
const router = express.Router();

// root endpoint used to search objects
router.get('/', getAllStudentsHandler);

// information about a student's profile
router.get('/:id', getStudentHandler);

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