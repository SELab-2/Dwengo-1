import express from 'express';
import {
    createStudentRequestHandler,
    deleteClassJoinRequestHandler,
    getStudentRequestHandler,
    getStudentRequestsHandler,
} from '../controllers/students.js';
import {onlyAllowUserHimself} from "../middleware/auth/checks/user-auth-checks";
import {onlyAllowStudentHimselfAndTeachersOfClass} from "../middleware/auth/checks/class-auth-checks";

// Under /:username/joinRequests/

const router = express.Router({ mergeParams: true });

router.get('/', onlyAllowUserHimself, getStudentRequestsHandler);

router.post('/', onlyAllowUserHimself, createStudentRequestHandler);

router.get('/:classId', onlyAllowStudentHimselfAndTeachersOfClass, getStudentRequestHandler);

router.delete('/:classId', onlyAllowStudentHimselfAndTeachersOfClass, deleteClassJoinRequestHandler);

export default router;
