import express from 'express';
import {
    createInvitationHandler,
    deleteInvitationHandler,
    getAllInvitationsHandler,
    getInvitationHandler,
    updateInvitationHandler,
} from '../controllers/teacher-invitations';
import { onlyAllowUserHimself } from '../middleware/auth/checks/user-auth-checks';
import {
    onlyAllowReceiverBody,
    onlyAllowSender,
    onlyAllowSenderBody,
    onlyAllowSenderOrReceiver,
} from '../middleware/auth/checks/teacher-invitation-checks';

const router = express.Router({ mergeParams: true });

router.get('/:username', onlyAllowUserHimself, getAllInvitationsHandler);

router.get('/:sender/:receiver/:classId', onlyAllowSenderOrReceiver, getInvitationHandler);

router.post('/', onlyAllowSenderBody, createInvitationHandler);

router.put('/', onlyAllowReceiverBody, updateInvitationHandler);

router.delete('/:sender/:receiver/:classId', onlyAllowSender, deleteInvitationHandler);

export default router;
