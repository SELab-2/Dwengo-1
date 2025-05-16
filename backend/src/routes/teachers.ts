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
import { adminOnly } from '../middleware/auth/checks/auth-checks.js';
import { preventImpersonation } from '../middleware/auth/checks/user-auth-checks.js';
import { onlyAllowTeacherOfClass } from '../middleware/auth/checks/class-auth-checks.js';
const router = express.Router();

// Root endpoint used to search objects
router.get('/', adminOnly, getAllTeachersHandler);

router.post('/', adminOnly, createTeacherHandler);

router.get('/:username', preventImpersonation, getTeacherHandler);

router.delete('/:username', preventImpersonation, deleteTeacherHandler);

router.get('/:username/classes', preventImpersonation, getTeacherClassHandler);

router.get('/:username/students', preventImpersonation, getTeacherStudentHandler);

router.get('/:username/joinRequests/:classId', onlyAllowTeacherOfClass, getStudentJoinRequestHandler);

router.put('/:username/joinRequests/:classId/:studentUsername', onlyAllowTeacherOfClass, updateStudentJoinRequestHandler);

// Invitations to other classes a teacher received
router.use('/invitations', invitationRouter);

export default router;
