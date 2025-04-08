import express from 'express';
import { createGroupHandler, getAllGroupsHandler, getGroupHandler, getGroupSubmissionsHandler } from '../controllers/groups.js';
import {onlyAllowIfHasAccessToGroup} from "../middleware/auth/checks/group-auth-checker";

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllGroupsHandler);

router.post('/', createGroupHandler);

// Information about a group (members, ... [TODO DOC])
router.get('/:groupid', onlyAllowIfHasAccessToGroup, getGroupHandler);

router.get('/:groupid/submissions', onlyAllowIfHasAccessToGroup, getGroupSubmissionsHandler);

// The list of questions a group has made
router.get('/:groupid/questions', onlyAllowIfHasAccessToGroup, (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

export default router;
