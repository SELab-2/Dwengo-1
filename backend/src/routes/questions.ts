import express from 'express';
import { createQuestionHandler, deleteQuestionHandler, getAllQuestionsHandler, getQuestionHandler } from '../controllers/questions.js';
import answerRoutes from './answers.js';
import {adminOnly, authenticatedOnly, studentsOnly} from "../middleware/auth/checks/auth-checks";
import {updateAnswerHandler} from "../controllers/answers";
import {
    onlyAllowAuthor,
    onlyAllowAuthorRequest,
    onlyAllowIfHasAccessToQuestion
} from "../middleware/auth/checks/question-checks";

const router = express.Router({ mergeParams: true });

// Query language

// Root endpoint used to search objects
router.get('/', adminOnly, getAllQuestionsHandler);

router.post('/', studentsOnly, onlyAllowAuthor, createQuestionHandler);

// Information about a question with id
router.get('/:seq', onlyAllowIfHasAccessToQuestion, getQuestionHandler);

router.delete('/:seq', studentsOnly, onlyAllowAuthorRequest, deleteQuestionHandler);

router.put("/:seq", studentsOnly, onlyAllowAuthorRequest, updateAnswerHandler);

router.use('/:seq/answers', answerRoutes);

export default router;
