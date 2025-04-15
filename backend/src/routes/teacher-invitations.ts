import express from 'express';
import {
    createInvitationHandler,
    deleteInvitationHandler,
    getAllInvitationsHandler,
    getInvitationHandler,
    updateInvitationHandler,
} from '../controllers/teacher-invitations';

const router = express.Router({ mergeParams: true });

router.get('/:username', getAllInvitationsHandler);

router.get('/:sender/:receiver/:classId', getInvitationHandler);

router.post('/', createInvitationHandler);

router.put('/', updateInvitationHandler);

router.delete('/:sender/:receiver/:classId', deleteInvitationHandler);

export default router;
