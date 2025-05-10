import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { Request, Response } from 'express';
import { getAssignmentHandler, getAllAssignmentsHandler, getAssignmentsSubmissionsHandler } from '../../src/controllers/assignments.js';
import { NotFoundException } from '../../src/exceptions/not-found-exception';
import { getClass01 } from '../test_assets/classes/classes.testdata';
import { getAssignment01 } from '../test_assets/assignments/assignments.testdata';

function createRequestObject(
    classid: string,
    assignmentid: string
): {
    params: { classid: string; id: string };
} {
    return {
        params: {
            classid: classid,
            id: assignmentid,
        },
    };
}

describe('Assignment controllers', () => {
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

    it('return error non-existing assignment', async () => {
        req = createRequestObject('doesnotexist', '43000'); // Should not exist

        await expect(async () => getAssignmentHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('should return an assignment', async () => {
        const assignment = getAssignment01();
        req = createRequestObject(assignment.within.classId as string, (assignment.id ?? 1).toString());

        await getAssignmentHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ assignment: expect.anything() }));
    });

    it('should return a list of assignments', async () => {
        req = createRequestObject(getClass01().classId as string, 'irrelevant');

        await getAllAssignmentsHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ assignments: expect.anything() }));
    });

    it('should return a list of submissions for an assignment', async () => {
        const assignment = getAssignment01();
        req = createRequestObject(assignment.within.classId as string, (assignment.id ?? 1).toString());

        await getAssignmentsSubmissionsHandler(req as Request, res as Response);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ submissions: expect.anything() }));
    });
});
