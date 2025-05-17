import { Request, Response } from 'express';
import { requireFields } from './error-helper.js';
import { createInvitation, deleteInvitation, getAllInvitations, getInvitation, updateInvitation } from '../services/teacher-invitations.js';
import { TeacherInvitationData } from '@dwengo-1/common/interfaces/teacher-invitation';
import { ConflictException } from '../exceptions/conflict-exception.js';

export async function getAllInvitationsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const by = req.query.sent === 'true';
    requireFields({ username });

    const invitations = await getAllInvitations(username, by);

    res.json({ invitations });
}

export async function getInvitationHandler(req: Request, res: Response): Promise<void> {
    const sender = req.params.sender;
    const receiver = req.params.receiver;
    const classId = req.params.classId;
    requireFields({ sender, receiver, classId });

    const invitation = await getInvitation(sender, receiver, classId);

    res.json({ invitation });
}

export async function createInvitationHandler(req: Request, res: Response): Promise<void> {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const classId = req.body.class;
    requireFields({ sender, receiver, classId });

    if (sender === receiver) {
        throw new ConflictException('Cannot send an invitation to yourself');
    }

    const data = req.body as TeacherInvitationData;
    const invitation = await createInvitation(data);

    res.json({ invitation });
}

export async function updateInvitationHandler(req: Request, res: Response): Promise<void> {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const classId = req.body.class;
    req.body.accepted = req.body.accepted !== false;
    requireFields({ sender, receiver, classId });

    const data = req.body as TeacherInvitationData;
    const invitation = await updateInvitation(data);

    res.json({ invitation });
}

export async function deleteInvitationHandler(req: Request, res: Response): Promise<void> {
    const sender = req.params.sender;
    const receiver = req.params.receiver;
    const classId = req.params.classId;
    requireFields({ sender, receiver, classId });

    const data: TeacherInvitationData = {
        sender,
        receiver,
        class: classId,
    };
    const invitation = await deleteInvitation(data);

    res.json({ invitation });
}
