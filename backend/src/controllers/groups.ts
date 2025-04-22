import { Request, Response } from 'express';
import { createGroup, deleteGroup, getAllGroups, getGroup, getGroupSubmissions, putGroup } from '../services/groups.js';
import { GroupDTO } from '@dwengo-1/common/interfaces/group';
import { requireFields } from './error-helper.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';

function checkGroupFields(classId: string, assignmentId: number, groupId: number): void {
    requireFields({ classId, assignmentId, groupId });

    if (isNaN(assignmentId)) {
        throw new BadRequestException('Assignment id must be a number');
    }

    if (isNaN(groupId)) {
        throw new BadRequestException('Group id must be a number');
    }
}

export async function getGroupHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    const assignmentId = parseInt(req.params.assignmentid);
    const groupId = parseInt(req.params.groupid);
    checkGroupFields(classId, assignmentId, groupId);

    const group = await getGroup(classId, assignmentId, groupId);

    res.json({ group });
}

export async function putGroupHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    const assignmentId = parseInt(req.params.assignmentid);
    const groupId = parseInt(req.params.groupid);
    checkGroupFields(classId, assignmentId, groupId);

    // Only members field can be changed
    const members = req.body.members;
    requireFields({ members });

    const group = await putGroup(classId, assignmentId, groupId, { members } as Partial<GroupDTO>);

    res.json({ group });
}

export async function deleteGroupHandler(req: Request, res: Response): Promise<void> {
    const classId = req.params.classid;
    const assignmentId = parseInt(req.params.assignmentid);
    const groupId = parseInt(req.params.groupid);
    checkGroupFields(classId, assignmentId, groupId);

    const group = await deleteGroup(classId, assignmentId, groupId);

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
    const members = req.body.members;
    requireFields({ classid, assignmentId, members });

    if (isNaN(assignmentId)) {
        throw new BadRequestException('Assignment id must be a number');
    }

    const groupData = req.body as GroupDTO;
    const group = await createGroup(groupData, classid, assignmentId);

    res.status(201).json({ group });
}

function getGroupParams(req: Request) {
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

    return { classId, assignmentId, groupId, full };
}

export async function getGroupSubmissionsHandler(req: Request, res: Response): Promise<void> {
    const { classId, assignmentId, groupId, full } = getGroupParams(req);

    const submissions = await getGroupSubmissions(classId, assignmentId, groupId, full);

    res.json({ submissions });
}

export async function getGroupQuestionsHandler(req: Request, res: Response): Promise<void> {
    const { classId, assignmentId, groupId, full } = getGroupParams(req);

    const questions = await getGroupQuestions(classId, assignmentId, groupId, full);

    res.json({ questions });
}
