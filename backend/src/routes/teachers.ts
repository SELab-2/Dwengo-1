import express from 'express'
import {
    createTeacherHandler,
    deleteTeacherHandler,
    getTeacherClassHandler,
    getTeacherHandler, getTeacherQuestionHandler, getTeacherStudentHandler
} from "../controllers/teachers.js";
const router = express.Router();

// root endpoint used to search objects
router.get('/', getTeacherHandler);

router.post('/', createTeacherHandler);

router.delete('/:username', deleteTeacherHandler);

router.get('/:username/classes', getTeacherClassHandler);

router.get('/:username/students', getTeacherStudentHandler);

router.get('/:username/questions', getTeacherQuestionHandler);

// invitations to other classes a teacher received
router.get('/:id/invitations', (req, res) => {
    res.json({
        invitations: [
            '0'
        ],
    });
});



export default router
