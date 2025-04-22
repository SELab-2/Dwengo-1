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

router.get('/', adminOnly, getAllClassesHandler);

router.post('/', teachersOnly, createClassHandler);

router.get('/:id', onlyAllowIfInClass, getClassHandler);

router.put('/:id', teachersOnly, onlyAllowIfInClass, putClassHandler);

router.delete('/:id', teachersOnly, onlyAllowIfInClass, deleteClassHandler);

router.get('/:id/teacher-invitations', teachersOnly, onlyAllowIfInClass, getTeacherInvitationsHandler);

router.get('/:id/students', onlyAllowIfInClass, getClassStudentsHandler);

router.post('/:id/students', teachersOnly, onlyAllowIfInClass, addClassStudentHandler);

router.delete('/:id/students/:username', teachersOnly, onlyAllowIfInClass, deleteClassStudentHandler);

router.get('/:id/teachers', onlyAllowIfInClass, getClassTeachersHandler);

// De combinatie van deze POST en DELETE endpoints kan lethal zijn
router.post('/:id/teachers', teachersOnly, onlyAllowIfInClass, addClassTeacherHandler);

router.delete('/:id/teachers/:username', teachersOnly, onlyAllowIfInClass, deleteClassTeacherHandler);

router.use('/:classid/assignments', assignmentRouter);

export default router;
