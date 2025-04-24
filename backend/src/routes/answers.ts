import express from 'express';
import { createAnswerHandler, deleteAnswerHandler, getAnswerHandler, getAllAnswersHandler, updateAnswerHandler } from '../controllers/answers.js';
import { adminOnly, teachersOnly } from '../middleware/auth/checks/auth-checks.js';
import { onlyAllowAuthor, onlyAllowAuthorRequestAnswer, onlyAllowIfHasAccessToQuestion } from '../middleware/auth/checks/question-checks.js';

const router = express.Router({ mergeParams: true });

router.get('/', adminOnly, getAllAnswersHandler);

router.post('/', teachersOnly, onlyAllowAuthor, createAnswerHandler);

router.get('/:seqAnswer', onlyAllowIfHasAccessToQuestion, getAnswerHandler);

router.delete('/:seqAnswer', teachersOnly, onlyAllowAuthorRequestAnswer, deleteAnswerHandler);

router.put('/:seqAnswer', teachersOnly, onlyAllowAuthorRequestAnswer, updateAnswerHandler);

export default router;
