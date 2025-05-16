import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import {
    createClassHandler,
    deleteClassHandler,
    getAllClassesHandler,
    getClassHandler,
    getClassStudentsHandler,
    getTeacherInvitationsHandler,
} from '../../src/controllers/classes.js';
import { Request, Response } from 'express';
import { NotFoundException } from '../../src/exceptions/not-found-exception';
import { BadRequestException } from '../../src/exceptions/bad-request-exception';
import { getClass01 } from '../test_assets/classes/classes.testdata';
describe('Class controllers', () => {
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

    it('create and delete class', async () => {
        req = {
            body: { displayName: 'coole_nieuwe_klas' },
        };

        await createClassHandler(req as Request, res as Response);

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('class', result.class);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ class: expect.anything() }));

        req = {
            params: { id: result.class.id },
        };

        await deleteClassHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ class: expect.anything() }));
    });

    it('Error class not found', async () => {
        req = {
            params: { id: 'doesnotexist' },
        };

        await expect(async () => getClassHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Error create a class without name', async () => {
        req = {
            body: {},
        };

        await expect(async () => createClassHandler(req as Request, res as Response)).rejects.toThrow(BadRequestException);
    });

    it('return list of students', async () => {
        req = {
            params: { id: getClass01().classId as string },
            query: {},
        };

        await getClassStudentsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ students: expect.anything() }));
    });

    it('Error students on a non-existent class', async () => {
        req = {
            params: { id: 'doesnotexist' },
            query: {},
        };

        await expect(async () => getClassStudentsHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('should return 200 and a list of teacher-invitations', async () => {
        const classId = getClass01().classId as string;
        req = {
            params: { id: classId },
            query: {},
        };

        await getTeacherInvitationsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ invitations: expect.anything() }));
    });

    it('Error teacher-invitations on a non-existent class', async () => {
        req = {
            params: { id: 'doesnotexist' },
            query: {},
        };

        await expect(async () => getTeacherInvitationsHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('should return a list of classes', async () => {
        req = {
            query: {},
        };

        await getAllClassesHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ classes: expect.anything() }));
    });
});
