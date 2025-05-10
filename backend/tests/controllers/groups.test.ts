import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { Request, Response } from 'express';
import {
    createGroupHandler,
    deleteGroupHandler,
    getAllGroupsHandler,
    getGroupHandler,
    getGroupSubmissionsHandler,
} from '../../src/controllers/groups.js';
import { NotFoundException } from '../../src/exceptions/not-found-exception';
import { getClass01 } from '../test_assets/classes/classes.testdata';
import { getAssignment01, getAssignment02 } from '../test_assets/assignments/assignments.testdata';
import { getTestGroup01 } from '../test_assets/assignments/groups.testdata';

function createRequestObject(classid: string, assignmentid: string, groupNumber: string) {
    return {
        params: {
            classid: classid,
            assignmentid: assignmentid,
            groupid: groupNumber,
        },
        query: {},
    };
}

describe('Group controllers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    let jsonMock: Mock;
    let statusMock: Mock;

    beforeAll(async () => {
        await setupTestApp();
    });

    beforeEach(async () => {
        jsonMock = vi.fn();
        statusMock = vi.fn().mockReturnThis();

        res = {
            json: jsonMock,
            status: statusMock,
        };
    });

    it('Error not found on a non-existing group', async () => {
        req = {
            params: {
                classid: 'id01',
                assignmentid: '1',
                groupid: '154981', // Should not exist
            },
            query: {},
        };

        await expect(async () => getGroupHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('should return 404 not found on a non-existing assignment', async () => {
        req = {
            params: {
                classid: 'id01',
                assignmentid: '1000', // Should not exist
                groupid: '42000', // Should not exist
            },
            query: {},
        };

        await expect(async () => getGroupHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('should return 404 not found ont a non-existing class', async () => {
        req = {
            params: {
                classid: 'doesnotexist', // Should not exist
                assignmentid: '1000', // Should not exist
                groupid: '42000', // Should not exist
            },
            query: {},
        };

        await expect(async () => getGroupHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('should return an existing group', async () => {
        const group = getTestGroup01();
        const classId = getClass01().classId as string;
        req = createRequestObject(classId, (group.assignment.id ?? 1).toString(), (group.groupNumber ?? 1).toString());

        await getGroupHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ group: expect.anything() }));
    });

    it('Create and delete', async () => {
        const assignment = getAssignment02();
        const classId = assignment.within.classId as string;
        req = createRequestObject(classId, (assignment.id ?? 1).toString(), '1');
        req.body = {
            members: ['Noordkaap', 'DireStraits'],
        };

        await createGroupHandler(req as Request, res as Response);

        await deleteGroupHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ group: expect.anything() }));
    });

    it('should return the submissions for a group', async () => {
        const group = getTestGroup01();
        const classId = getClass01().classId as string;
        req = createRequestObject(classId, (group.assignment.id ?? 1).toString(), (group.groupNumber ?? 1).toString());

        await getGroupSubmissionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ submissions: expect.anything() }));
    });

    it('should return a list of groups for an assignment', async () => {
        const assignment = getAssignment01();
        const classId = assignment.within.classId as string;
        req = createRequestObject(classId, (assignment.id ?? 1).toString(), '1');

        await getAllGroupsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ groups: expect.anything() }));
    });
});
