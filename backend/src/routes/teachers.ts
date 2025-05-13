import express from 'express';
import {
    createTeacherHandler,
    deleteTeacherHandler,
    getAllTeachersHandler,
    getStudentJoinRequestHandler,
    getTeacherClassHandler,
    getTeacherHandler,
    getTeacherStudentHandler,
    updateStudentJoinRequestHandler,
} from '../controllers/teachers.js';
import invitationRouter from './teacher-invitations.js';

const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllTeachersHandler);

router.post('/', createTeacherHandler);

router.get('/:username', getTeacherHandler);

router.delete('/:username', deleteTeacherHandler);

router.get('/:username/classes', getTeacherClassHandler);

router.get('/:username/students', getTeacherStudentHandler);

router.get('/:username/joinRequests/:classId', getStudentJoinRequestHandler);

router.put('/:username/joinRequests/:classId/:studentUsername', updateStudentJoinRequestHandler);

// Invitations to other classes a teacher received
router.use('/invitations', invitationRouter);

export default router;
