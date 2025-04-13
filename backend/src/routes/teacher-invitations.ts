import express from 'express';
import { createInvitationHandler, deleteInvitationForHandler, getAllInvitationsHandler } from '../controllers/teacher-invitations';

const router = express.Router({ mergeParams: true });

router.get('/:username', getAllInvitationsHandler);

router.post('/', createInvitationHandler);

router.delete('/:sender/:receiver/:classId', deleteInvitationForHandler);

export default router;
