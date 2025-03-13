import { Request, Response } from 'express';
import { createGroup, getAllGroups, getGroup, getGroupSubmissions } from '../services/groups.js';
import { GroupDTO } from '../interfaces/group.js';

// Typescript is annoywith with parameter forwarding from class.ts
interface GroupParams {
    classid: string;
    assignmentid: string;
    groupid?: string;
}

export async function getGroupHandler(req: Request<GroupParams>, res: Response): Promise<void> {
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

export async function getAllGroupsHandler(req: Request, res: Response): Promise<void> {
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

export async function createGroupHandler(req: Request, res: Response): Promise<void> {
    const classid = req.params.classid;
    const assignmentId = +req.params.assignmentid;

    if (isNaN(assignmentId)) {
        res.status(400).json({ error: 'Assignment id must be a number' });
        return;
    }

    const groupData = req.body as GroupDTO;
    const group = await createGroup(groupData, classid, assignmentId);

    if (!group) {
        res.status(500).json({ error: 'Something went wrong while creating group' });
        return;
    }

    res.status(201).json({ group: group });
}

export async function getGroupSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    // Const full = req.query.full === 'true';

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

    const submissions = await getGroupSubmissions(classId, assignmentId, groupId);

    res.json({
        submissions: submissions,
    });
}
