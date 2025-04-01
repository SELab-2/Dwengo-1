import express from 'express';
import {
    createTeacherHandler,
    deleteTeacherHandler,
    getAllTeachersHandler,
    getTeacherClassHandler,
    getTeacherHandler,
    getTeacherQuestionHandler,
    getTeacherStudentHandler,
} from '../controllers/teachers.js';
const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllTeachersHandler);

router.post('/', createTeacherHandler);

router.delete('/', deleteTeacherHandler);

router.get('/:username', getTeacherHandler);

router.delete('/:username', deleteTeacherHandler);

router.get('/:username/classes', getTeacherClassHandler);

router.get('/:username/students', getTeacherStudentHandler);

router.get('/:username/questions', getTeacherQuestionHandler);

// Invitations to other classes a teacher received
router.get('/:id/invitations', (_req, res) => {
    res.json({
        invitations: ['0'],
    });
});

export default router;
