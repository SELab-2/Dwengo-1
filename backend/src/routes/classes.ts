import express from 'express';
import {
    addClassStudentHandler,
    addClassTeacherHandler,
    createClassHandler,
    deleteClassHandler,
    deleteClassStudentHandler,
    deleteClassTeacherHandler,
    getAllClassesHandler,
    getClassHandler,
    getClassStudentsHandler,
    getClassTeachersHandler,
    getTeacherInvitationsHandler,
    putClassHandler,
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

router.put('/:id', putClassHandler);

router.delete('/:id', deleteClassHandler);

router.get('/:id/teacher-invitations', teachersOnly, onlyAllowIfInClass, getTeacherInvitationsHandler);

router.get('/:id/students', onlyAllowIfInClass, getClassStudentsHandler);

router.post('/:id/students', addClassStudentHandler);

router.delete('/:id/students/:username', deleteClassStudentHandler);

router.get('/:id/teachers', getClassTeachersHandler);

router.post('/:id/teachers', addClassTeacherHandler);

router.delete('/:id/teachers/:username', deleteClassTeacherHandler);

router.use('/:classid/assignments', assignmentRouter);

export default router;
