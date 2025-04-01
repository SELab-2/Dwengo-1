import express from 'express';
import { createGroupHandler, getAllGroupsHandler, getGroupHandler, getGroupSubmissionsHandler } from '../controllers/groups.js';

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllGroupsHandler);

router.post('/', createGroupHandler);

// Information about a group (members, ... [TODO DOC])
router.get('/:groupid', getGroupHandler);

router.get('/:groupid', getGroupSubmissionsHandler);

// The list of questions a group has made
router.get('/:id/questions', (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

export default router;
