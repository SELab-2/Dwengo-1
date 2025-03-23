import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { Request, Response } from 'express';
import { createGroupHandler, getAllGroupsHandler, getGroupHandler, getGroupSubmissionsHandler } from '../../src/controllers/groups.js';
import { G } from 'vitest/dist/chunks/reporters.66aFHiyX.js';

async function test404<T>(
    req: Partial<Request<T>> , 
    res: Partial<Response>, 
    handler: (req: Request<T>, res: Response) => Promise<void>, 
    expectedMessage: string
) {
    await handler(req as Request<T>, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: expectedMessage });
}

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
  
    beforeEach(async () =>  {
        jsonMock = vi.fn();
        statusMock = vi.fn().mockReturnThis();

        res = {
            json: jsonMock,
            status: statusMock,
        };
    });

    it('should return 404 not found on a non-existing group', async () => {
        req = {
            params: { 
                classid: 'id01',
                assignmentid: '1',
                groupid: '42000', // should not exist
            },
            query: {},
        };

        await getGroupHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Group not found' });
    });

    it('should return 404 not found on a non-existing assignment', async () => {
        req = {
            params: { 
                classid: 'id01',
                assignmentid: '1000', // should not exist
                groupid: '42000', // should not exist
            },
            query: {},
        };

        await getGroupHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Assignment not found' });
    });

    it('should return 404 not found ont a non-existing class', async () => {
        req = {
            params: { 
                classid: 'doesnotexist', // should not exist
                assignmentid: '1000', // should not exist
                groupid: '42000', // should not exist
            },
            query: {},
        };

        await getGroupHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Class not found' });
    });

    it('should return an existing group', async () => {
        req = createRequestObject('id01', '1', '1');

        await getGroupHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith({
            assignment: 1,
            groupNumber: 1,
            members: [ 'DireStraits', 'Noordkaap' ]
        });
    });

    
    it('should return a 201 when creating a group', async () => {
        req = createRequestObject('id01', '1', 'irrelevant');
        req.body = {
            members: [
                'NoordKaap',
                'DireStraits',
            ]
        };

        await createGroupHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalled();

        const result = jsonMock.mock.lastCall![0];

        expect("assignment" in result).toBeTruthy();
        expect("groupNumber" in result).toBeTruthy();
        expect("members" in result).toBeTruthy();
    });

    it('should return the submissions for a group', async () => {
        req = createRequestObject('id01', '1', '1');

        await getGroupSubmissionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalled();

        const result = jsonMock.mock.lastCall![0];

        expect("submissions" in result).toBeTruthy();
        expect(typeof(result.submissions)).toBe(typeof([]));
    });

    it('should return a list of groups for an assignment', async () => {
        req = createRequestObject('id01', '1', '1');

        await getAllGroupsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalled();

        const result = jsonMock.mock.lastCall![0];

        expect("groups" in result).toBeTruthy();
    });
});
