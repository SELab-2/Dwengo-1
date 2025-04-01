import express from 'express';
import {
    createStudentRequestHandler,
    deleteClassJoinRequestHandler,
    getStudentRequestHandler,
    getStudentRequestsHandler
} from '../controllers/students.js';

const router = express.Router({ mergeParams: true });

router.get('/', getStudentRequestsHandler);

router.post('/', createStudentRequestHandler);

router.get('/:classId', getStudentRequestHandler);

router.delete('/:classId', deleteClassJoinRequestHandler);

export default router;
