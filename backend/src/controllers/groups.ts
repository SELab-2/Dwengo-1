import { Request, Response } from 'express';
import { createGroup, getAllGroups, getGroup, getGroupSubmissions } from '../services/groups.js';
import { GroupDTO } from '@dwengo-1/common/interfaces/group';
import { requireFields } from './error-helper.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';

export async function getGroupHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    const assignmentId = parseInt(req.params.assignmentid);
    const groupId = parseInt(req.params.groupid);
    const full = req.query.full === 'true';
    requireFields({ classId, assignmentId, groupId });

    if (isNaN(assignmentId)) {
        throw new BadRequestException('Assignment id must be a number');
    }

    if (isNaN(groupId)) {
        throw new BadRequestException('Group id must be a number');
    }

    const group = await getGroup(classId, assignmentId, groupId, full);

    if (!group) {
        res.status(404).json({ error: 'Group not found' });
        return;
    }

    res.json({ group });
}

export async function getAllGroupsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    const assignmentId = Number(req.params.assignmentid);
    const full = req.query.full === 'true';
    requireFields({ classId, assignmentId });

    if (isNaN(assignmentId)) {
        throw new BadRequestException('Assignment id must be a number');
    }

    const groups = await getAllGroups(classId, assignmentId, full);

    res.json({ groups });
}

export async function createGroupHandler(req: Request, res: Response): Promise<void> {
    const classid = req.params.classid;
    const assignmentId = Number(req.params.assignmentid);

    requireFields({ classid, assignmentId });

    if (isNaN(assignmentId)) {
        throw new BadRequestException('Assignment id must be a number');
    }

    const groupData = req.body as GroupDTO;
    const group = await createGroup(groupData, classid, assignmentId);

    res.status(201).json({ group });
}

export async function getGroupSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    const assignmentId = Number(req.params.assignmentid);
    const groupId = Number(req.params.groupid);
    const full = req.query.full === 'true';
    
    requireFields({ classId, assignmentId, groupId });

    if (isNaN(assignmentId)) {
        throw new BadRequestException('Assignment id must be a number');
    }

    if (isNaN(groupId)) {
        throw new BadRequestException('Group id must be a number');
    }

    const submissions = await getGroupSubmissions(classId, assignmentId, groupId, full);

    res.json({ submissions });
}
