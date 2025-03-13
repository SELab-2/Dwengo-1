import express from 'express';
import {
    createQuestionHandler, deleteQuestionHandler,
    getAllQuestionsHandler,
    getQuestionAnswersHandler,
    getQuestionHandler
} from "../controllers/questions.js";
const router = express.Router({ mergeParams: true });

// Query language

// Root endpoint used to search objects
router.get('/', getAllQuestionsHandler);

router.post('/', createQuestionHandler);

router.delete('/:seq', deleteQuestionHandler);

// Information about a question with id
router.get('/:seq', getQuestionHandler);

router.get('/answers/:seq', getQuestionAnswersHandler);

export default router;
