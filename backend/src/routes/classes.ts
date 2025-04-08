import express from 'express';
import {
    createClassHandler,
    getAllClassesHandler,
    getClassHandler,
    getClassStudentsHandler,
    getTeacherInvitationsHandler,
} from '../controllers/classes.js';
import assignmentRouter from './assignments.js';
import {adminOnly, teachersOnly} from "../middleware/auth/checks/auth-checks";
import {onlyAllowIfInClass} from "../middleware/auth/checks/class-auth-checks";

const router = express.Router();

// Root endpoint used to search objects
router.get('/', adminOnly, getAllClassesHandler);

router.post('/', teachersOnly, createClassHandler);

// Information about an class with id 'id'
router.get('/:id', onlyAllowIfInClass, getClassHandler);

router.get('/:id/teacher-invitations', teachersOnly, onlyAllowIfInClass, getTeacherInvitationsHandler);

router.get('/:id/students', onlyAllowIfInClass, getClassStudentsHandler);

router.use('/:classid/assignments', assignmentRouter);

export default router;
