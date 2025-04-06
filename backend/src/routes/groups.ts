import express from 'express';
import { createGroupHandler, deleteGroupHandler, getAllGroupsHandler, getGroupHandler, getGroupSubmissionsHandler, putGroupHandler } from '../controllers/groups.js';

const router = express.Router({ mergeParams: true });

// Root endpoint used to search objects
router.get('/', getAllGroupsHandler);

router.post('/', createGroupHandler);

router.get('/:groupid', getGroupHandler);

router.put('/:groupid', putGroupHandler);

router.delete('/:groupid', deleteGroupHandler);

router.get('/:groupid/submissions', getGroupSubmissionsHandler);

export default router;
