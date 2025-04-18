import express from 'express';
import {
    createGroupHandler,
    deleteGroupHandler,
    getAllGroupsHandler,
    getGroupHandler,
    getGroupSubmissionsHandler,
    putGroupHandler,
} from '../controllers/groups.js';
import {onlyAllowIfHasAccessToGroup} from "../middleware/auth/checks/group-auth-checker";
import {teachersOnly} from "../middleware/auth/checks/auth-checks";
import {onlyAllowIfHasAccessToAssignment} from "../middleware/auth/checks/assignment-auth-checks";

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', onlyAllowIfHasAccessToAssignment, getAllGroupsHandler);

router.post('/', teachersOnly, onlyAllowIfHasAccessToAssignment, createGroupHandler);

// Information about a group (members, ... [TODO DOC])
router.get('/:groupid', onlyAllowIfHasAccessToGroup, getGroupHandler);

router.put('/:groupid', putGroupHandler);

router.delete('/:groupid', deleteGroupHandler);

router.get('/:groupid/submissions', onlyAllowIfHasAccessToGroup, getGroupSubmissionsHandler);

// The list of questions a group has made
router.get('/:groupid/questions', onlyAllowIfHasAccessToGroup, (_req, res) => {
    res.json({
        questions: ['0'],
    });
});

export default router;
