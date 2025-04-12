import { Request, Response } from 'express';
import {requireFields} from "./error-helper";
import {createInvitation, deleteInvitationFor, getAllInvitations} from "../services/teacher-invitations";
import {TeacherInvitationData} from "@dwengo-1/common/interfaces/teacher-invitation";

export async function getAllInvitationsHandler(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const by = req.query.by === 'true';
    requireFields({ username });

    const invitations = getAllInvitations(username, by);

    res.json({ invitations });
}

export async function createInvitationHandler(req: Request, res: Response): Promise<void> {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const classId = req.body.class;
    requireFields({ sender, receiver, classId });

    const data = req.body as TeacherInvitationData;
    const invitation = await createInvitation(data);

    res.json({ invitation });
}

export async function deleteInvitationForHandler(req: Request, res: Response): Promise<void> {
    const sender = req.params.sender;
    const receiver = req.params.receiver;
    const classId = req.params.class;
    const accepted = req.body.accepted !== 'false';
    requireFields({ sender, receiver, classId });

    const invitation = deleteInvitationFor(sender, receiver, classId, accepted);

    res.json({ invitation });
}
