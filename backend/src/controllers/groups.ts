import { Request, Response } from 'express';
import { getAllGroups, getGroup } from '../services/groups.js';

// Typescript is annoywith with parameter forwarding from class.ts
interface GroupParams {
    classid: string;
    assignmentid: string;
    groupid?: string;
}

export async function getGroupHandler(
    req: Request<GroupParams>,
    res: Response
): Promise<void> {
    const classId = req.params.classid;
    const full = req.query.full === 'true';
    const assignmentId = +req.params.assignmentid;

    if (isNaN(assignmentId)) {
        res.status(400).json({ error: 'Assignment id must be a number' });
        return;
    }

    const groupId = +req.params.groupid!; // Can't be undefined

    if (isNaN(groupId)) {
        res.status(400).json({ error: 'Group id must be a number' });
        return;
    }

    const group = await getGroup(classId, assignmentId, groupId, full);

    res.json(group);
}

export async function getAllGroupsHandler(
    req: Request,
    res: Response
): Promise<void> {
    const classId = req.params.classid;
    const full = req.query.full === 'true';

    const assignmentId = +req.params.assignmentid;

    if (isNaN(assignmentId)) {
        res.status(400).json({ error: 'Assignment id must be a number' });
        return;
    }

    const groups = await getAllGroups(classId, assignmentId, full);

    res.json({
        groups: groups,
    });
}
