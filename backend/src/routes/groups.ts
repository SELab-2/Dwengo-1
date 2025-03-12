import express from 'express';
import { getAllGroupsHandler, getGroupHandler, getGroupSubmissionsHandler } from '../controllers/groups.js';

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllGroupsHandler);

// Information about a group (members, ... [TODO DOC])
router.get('/:groupid', getGroupHandler);

router.get('/:groupid', getGroupSubmissionsHandler);

// The list of questions a group has made
router.get('/:id/question', (req, res) => {
    res.json({
        questions: ['0'],
    });
});

export default router;
