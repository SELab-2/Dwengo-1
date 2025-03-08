import express from 'express'
import { getAllClassesHandler, getClassHandler, getClassStudentsHandler, getTeacherInvitationsHandler } from '../controllers/classes';
import assignmentRouter from './assignment.js';

const router = express.Router();

// root endpoint used to search objects
router.get('/', getAllClassesHandler);

// information about an class with id 'id'
router.get('/:id', getClassHandler);

router.get('/:id/teacher-invitations', getTeacherInvitationsHandler);

router.get('/:id/students', getClassStudentsHandler);

router.use('/:classid/assignments', assignmentRouter);

export default router