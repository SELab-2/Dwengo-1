import express from 'express'
import {
    createTeacherHandler,
    deleteTeacherHandler,
    getTeacherClassHandler,
    getTeacherHandler, getTeacherStudentHandler
} from "../controllers/teachers.js";
const router = express.Router();

// root endpoint used to search objects
router.get('/', getTeacherHandler);

router.post('/', createTeacherHandler);

router.delete('/:username', deleteTeacherHandler);

router.get('/:username/classes', getTeacherClassHandler);

router.get('/:username/students', getTeacherStudentHandler);

// the questions students asked a teacher
router.get('/:id/questions', (req, res) => {
    res.json({
        questions: [
            '0'
        ],
    });
});

// invitations to other classes a teacher received
router.get('/:id/invitations', (req, res) => {
    res.json({
        invitations: [
            '0'
        ],
    });
});

// a list with ids of classes a teacher is in
router.get('/:id/classes', (req, res) => {
    res.json({
        classes: [
            '0'
        ],
    });
});


export default router
