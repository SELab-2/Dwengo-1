import express from 'express';
import {
    createStudentRequestHandler,
    deleteClassJoinRequestHandler,
    getStudentRequestHandler,
    getStudentRequestsHandler,
} from '../controllers/students.js';
import { preventImpersonation } from '../middleware/auth/checks/user-auth-checks.js';
import { onlyAllowStudentHimselfAndTeachersOfClass } from '../middleware/auth/checks/class-auth-checks.js';

// Under /:username/joinRequests/

const router = express.Router({ mergeParams: true });

router.get('/', preventImpersonation, getStudentRequestsHandler);

router.post('/', preventImpersonation, createStudentRequestHandler);

router.get('/:classId', onlyAllowStudentHimselfAndTeachersOfClass, getStudentRequestHandler);

router.delete('/:classId', onlyAllowStudentHimselfAndTeachersOfClass, deleteClassJoinRequestHandler);

export default router;
