import express from 'express';
import {
    createGroupHandler,
    deleteGroupHandler,
    getAllGroupsHandler,
    getGroupHandler,
    getGroupQuestionsHandler,
    getGroupSubmissionsHandler,
    putGroupHandler,
} from '../controllers/groups.js';

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllGroupsHandler);

router.post('/', createGroupHandler);

router.get('/:groupid', getGroupHandler);

router.put('/:groupid', putGroupHandler);

router.delete('/:groupid', deleteGroupHandler);

router.get('/:groupid/submissions', getGroupSubmissionsHandler);

router.get('/:groupid/questions', getGroupQuestionsHandler);

export default router;
