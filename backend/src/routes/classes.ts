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
    getClassStudentsHandler, getClassTeachersHandler,
    getTeacherInvitationsHandler,
} from '../controllers/classes.js';
import assignmentRouter from './assignments.js';

const router = express.Router();

// Root endpoint used to search objects
router.get('/', getAllClassesHandler);

router.post('/', createClassHandler);

router.get('/:id', getClassHandler);

router.delete('/:id', deleteClassHandler);

router.get('/:id/teacher-invitations', getTeacherInvitationsHandler);

router.get('/:id/students', getClassStudentsHandler);

router.post('/:id/students', addClassStudentHandler);

router.delete('/:id/students/:username', deleteClassStudentHandler);

router.get('/:id/teachers', getClassTeachersHandler);

router.post('/:id/teachers', addClassTeacherHandler);

router.delete('/:id/teachers/:username', deleteClassTeacherHandler);

router.use('/:classid/assignments', assignmentRouter);

export default router;
