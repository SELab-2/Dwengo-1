import express from 'express';
import {
    getAllClassesHandler,
    getClassHandler,
    getClassStudentsHandler,
    getTeacherInvitationsHandler,
} from '../controllers/classes.js';
import assignmentRouter from './assignments.js';

const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllClassesHandler);

// Information about an class with id 'id'
router.get('/:id', getClassHandler);

router.get('/:id/teacher-invitations', getTeacherInvitationsHandler);

router.get('/:id/students', getClassStudentsHandler);

router.use('/:classid/assignments', assignmentRouter);

export default router;
