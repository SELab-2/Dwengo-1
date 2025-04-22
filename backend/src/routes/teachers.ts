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
import invitationRouter from './teacher-invitations.js';

import {adminOnly} from "../middleware/auth/checks/auth-checks";
import {onlyAllowUserHimself} from "../middleware/auth/checks/user-auth-checks";
import {onlyAllowTeacherOfClass} from "../middleware/auth/checks/class-auth-checks";
const router = express.Router();

// Root endpoint used to search objects
router.get('/', adminOnly, getAllTeachersHandler);

router.post('/', adminOnly, createTeacherHandler);

router.get('/:username', onlyAllowUserHimself, getTeacherHandler);

router.delete('/:username', onlyAllowUserHimself, deleteTeacherHandler);

router.get('/:username/classes', onlyAllowUserHimself, getTeacherClassHandler);

router.get('/:username/students', onlyAllowUserHimself, getTeacherStudentHandler);

router.get('/:username/questions', onlyAllowUserHimself, getTeacherQuestionHandler);

router.get('/:username/joinRequests/:classId', onlyAllowTeacherOfClass, getStudentJoinRequestHandler);

router.put('/:username/joinRequests/:classId/:studentUsername', onlyAllowTeacherOfClass, updateStudentJoinRequestHandler);

// Invitations to other classes a teacher received
router.use('/invitations', invitationRouter);

export default router;
