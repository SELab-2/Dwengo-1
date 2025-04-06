import express from 'express';
import { createQuestionHandler, deleteQuestionHandler, getAllQuestionsHandler, getQuestionHandler } from '../controllers/questions.js';
import answerRoutes from './answers.js';

const router = express.Router({ mergeParams: true });

// Query language

// Root endpoint used to search objects
router.get('/', getAllQuestionsHandler);

router.post('/', createQuestionHandler);

router.delete('/:seq', deleteQuestionHandler);

// Information about a question with id
router.get('/:seq', getQuestionHandler);

router.use('/:seq/answer', answerRoutes);

export default router;
