import express from 'express';
import {
    createTeacherHandler,
    deleteTeacherHandler,
    getAllTeachersHandler,
    getStudentJoinRequestHandler,
    getTeacherClassHandler,
    getTeacherHandler,
    getTeacherQuestionHandler,
    getTeacherStudentHandler,
    updateStudentJoinRequestHandler,
} from '../controllers/teachers.js';
const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllTeachersHandler);

router.post('/', createTeacherHandler);

router.get('/:username', getTeacherHandler);

router.delete('/:username', deleteTeacherHandler);

router.get('/:username/classes', getTeacherClassHandler);

router.get('/:username/students', getTeacherStudentHandler);

router.get('/:username/questions', getTeacherQuestionHandler);

router.get('/:username/joinRequests/:classId', getStudentJoinRequestHandler);

router.put('/:username/joinRequests/:classId/:studentUsername', updateStudentJoinRequestHandler);

// Invitations to other classes a teacher received
router.get('/:id/invitations', (_req, res) => {
    res.json({
        invitations: ['0'],
    });
});

export default router;
