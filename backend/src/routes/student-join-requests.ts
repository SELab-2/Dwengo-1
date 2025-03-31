import express from 'express';
import { createStudentRequestHandler, deleteClassJoinRequestHandler, getStudentRequestHandler } from '../controllers/students.js';

const router = express.Router({ mergeParams: true });

router.get('/', getStudentRequestHandler);

router.post('/', createStudentRequestHandler);

router.delete('/:classId', deleteClassJoinRequestHandler);

export default router;
