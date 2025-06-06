import express from 'express';
import {
    createInvitationHandler,
    deleteInvitationHandler,
    getAllInvitationsHandler,
    getInvitationHandler,
    updateInvitationHandler,
} from '../controllers/teacher-invitations.js';
import { preventImpersonation } from '../middleware/auth/checks/user-auth-checks.js';
import {
    onlyAllowReceiverBody,
    onlyAllowSender,
    onlyAllowSenderBody,
    onlyAllowSenderOrReceiver,
} from '../middleware/auth/checks/teacher-invitation-checks.js';

const router = express.Router({ mergeParams: true });

router.get('/:username', preventImpersonation, getAllInvitationsHandler);

router.get('/:sender/:receiver/:classId', onlyAllowSenderOrReceiver, getInvitationHandler);

router.post('/', onlyAllowSenderBody, createInvitationHandler);

router.put('/', onlyAllowReceiverBody, updateInvitationHandler);

router.delete('/:sender/:receiver/:classId', onlyAllowSender, deleteInvitationHandler);

export default router;
