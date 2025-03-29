import express from "express";
import {
    createStudentRequestHandler, deleteClassJoinRequestHandler,
    getStudentRequestHandler,
    updateClassJoinRequestHandler
} from "../controllers/students";

const router = express.Router({ mergeParams: true });

router.get('/', getStudentRequestHandler);

router.post('/:classId', createStudentRequestHandler);

router.put('/:classId', updateClassJoinRequestHandler);

router.delete('/:classId', deleteClassJoinRequestHandler);

export default router;
