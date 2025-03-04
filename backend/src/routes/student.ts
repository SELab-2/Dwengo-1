import express from 'express'
import { getStudentById } from '../services/students';
import { getStudent } from '../controllers/students';
const router = express.Router();

// root endpoint used to search objects
router.get('/', (req, res) => {
    res.json({
        students: [
            '0',
            '1',
        ]
    });
});

// information about a student's profile
router.get('/:id', getStudent);

// the list of classes a student is in
router.get('/:id/classes', (req, res) => {
    res.json({
        classes: [ '0' ],
    });
})

// the list of submissions a student has made
router.get('/:id/submissions', (req, res) => {
    res.json({
        submissions: [ '0' ],
    });
})

  
// the list of assignments a student has
router.get('/:id/assignments', (req, res) => {
    res.json({
        assignments: [ '0' ],
    });
})
  
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