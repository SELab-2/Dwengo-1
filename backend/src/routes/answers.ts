import express from "express";
import {
    createAnswerHandler,
    deleteAnswerHandler,
    getAnswerHandler,
    getAnswersHandler,
    updateAnswerHandler
} from "../controllers/answers";

const router = express.Router({ mergeParams: true });

router.get('/', getAnswersHandler);

router.post('/', createAnswerHandler)

router.get('/:seqAnswer', getAnswerHandler)

router.delete('/:seqAnswer', deleteAnswerHandler);

router.put('/:seqAnswer', updateAnswerHandler);

export default router;
