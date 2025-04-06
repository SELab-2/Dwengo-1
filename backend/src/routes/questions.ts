import express from 'express';
import {
    createQuestionHandler,
    deleteQuestionHandler,
    getAllQuestionsHandler,
    getQuestionAnswersHandler,
    getQuestionHandler,
} from '../controllers/questions.js';
const router = express.Router({ mergeParams: true });

// Query language

// Root endpoint used to search objects
router.get('/', getAllQuestionsHandler);

router.post('/', createQuestionHandler);

router.delete('/:classId/assignment/:assignmentId/group/:groupId/:seq', deleteQuestionHandler);

// Information about a question with id
router.get('/:classId/assignment/:assignmentId/group/:groupId/:seq', getQuestionHandler);

router.get('/:classId/assignment/:assignmentId/group/:groupId/answers/:seq', getQuestionAnswersHandler);

export default router;
