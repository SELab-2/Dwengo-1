import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Request, Response } from 'express';
import { setupTestApp } from '../setup-tests.js';
import {
    createInvitationHandler,
    deleteInvitationHandler,
    getAllInvitationsHandler,
    getInvitationHandler,
    updateInvitationHandler,
} from '../../src/controllers/teacher-invitations';
import { TeacherInvitationData } from '@dwengo-1/common/interfaces/teacher-invitation';
import { getClassHandler } from '../../src/controllers/classes';
import { BadRequestException } from '../../src/exceptions/bad-request-exception';
import { ClassStatus } from '@dwengo-1/common/util/class-join-request';
import { getClass02 } from '../test_assets/classes/classes.testdata';

describe('Teacher controllers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    let jsonMock: Mock;

    beforeAll(async () => {
        await setupTestApp();
    });

    beforeEach(() => {
        jsonMock = vi.fn();
        res = {
            json: jsonMock,
        };
    });

    it('Get teacher invitations by', async () => {
        req = { params: { username: 'LimpBizkit' }, query: { sent: 'true' } };

        await getAllInvitationsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ invitations: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log(result.invitations);
        expect(result.invitations).to.have.length.greaterThan(0);
    });

    it('Get teacher invitations for', async () => {
        req = { params: { username: 'FooFighters' }, query: { by: 'false' } };

        await getAllInvitationsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ invitations: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.invitations).to.have.length.greaterThan(0);
    });

    it('Create and delete invitation', async () => {
        const body = {
            sender: 'LimpBizkit',
            receiver: 'testleerkracht1',
            class: getClass02().classId,
        } as TeacherInvitationData;
        req = { body };

        await createInvitationHandler(req as Request, res as Response);

        req = {
            params: {
                sender: 'LimpBizkit',
                receiver: 'testleerkracht1',
                classId: getClass02().classId,
            },
            body: { accepted: 'false' },
        };

        await deleteInvitationHandler(req as Request, res as Response);
    });

    it('Get invitation', async () => {
        req = {
            params: {
                sender: 'LimpBizkit',
                receiver: 'FooFighters',
                classId: getClass02().classId,
            },
        };
        await getInvitationHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ invitation: expect.anything() }));
    });

    it('Get invitation error', async () => {
        req = {
            params: { no: 'no params' },
        };

        await expect(async () => getInvitationHandler(req as Request, res as Response)).rejects.toThrowError(BadRequestException);
    });

    it('Accept invitation', async () => {
        const body = {
            sender: 'LimpBizkit',
            receiver: 'FooFighters',
            class: getClass02().classId,
        } as TeacherInvitationData;
        req = { body };

        await updateInvitationHandler(req as Request, res as Response);

        const result1 = jsonMock.mock.lastCall?.[0];
        expect(result1.invitation.status).toEqual(ClassStatus.Accepted);

        req = {
            params: {
                id: getClass02().classId,
            },
        };

        await getClassHandler(req as Request, res as Response);

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.class.teachers).toContain('FooFighters');
    });
});
