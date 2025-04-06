import express from 'express';
import {
    createClassHandler,
    getAllClassesHandler,
    getClassHandler,
    getClassStudentsHandler, getClassTeachersHandler,
    getTeacherInvitationsHandler,
} from '../controllers/classes.js';
import assignmentRouter from './assignments.js';

const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllClassesHandler);

router.post('/', createClassHandler);

// Information about an class with id 'id'
router.get('/:id', getClassHandler);

router.get('/:id/teacher-invitations', getTeacherInvitationsHandler);

router.get('/:id/students', getClassStudentsHandler);

router.get('/:id/teachers', getClassTeachersHandler);

router.use('/:classid/assignments', assignmentRouter);

export default router;
