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
import { onlyAllowIfHasAccessToGroup } from '../middleware/auth/checks/group-auth-checker.js';
import { teachersOnly } from '../middleware/auth/checks/auth-checks.js';
import { onlyAllowIfHasAccessToAssignment } from '../middleware/auth/checks/assignment-auth-checks.js';

const router = express.Router({ mergeParams: true });

router.get('/', onlyAllowIfHasAccessToAssignment, getAllGroupsHandler);

router.post('/', teachersOnly, onlyAllowIfHasAccessToAssignment, createGroupHandler);

router.get('/:groupid', onlyAllowIfHasAccessToAssignment, getGroupHandler);

router.put('/:groupid', teachersOnly, onlyAllowIfHasAccessToAssignment, putGroupHandler);

router.delete('/:groupid', teachersOnly, onlyAllowIfHasAccessToAssignment, deleteGroupHandler);

router.get('/:groupid/submissions', onlyAllowIfHasAccessToGroup, getGroupSubmissionsHandler);

router.get('/:groupid/questions', onlyAllowIfHasAccessToGroup, getGroupQuestionsHandler);

export default router;
