import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Request, Response } from 'express';
import { setupTestApp } from '../setup-tests.js';
import {
    createInvitationHandler,
    deleteInvitationForHandler,
    getAllInvitationsHandler
} from "../../src/controllers/teacher-invitations";
import {TeacherInvitationData} from "@dwengo-1/common/interfaces/teacher-invitation";
import {getClassHandler} from "../../src/controllers/classes";

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
        req = {params: {username: 'LimpBizkit'}, query: {by: 'true' }};

        await getAllInvitationsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({invitations: expect.anything()}));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.invitations).to.have.length.greaterThan(0);
    });

    it('Get teacher invitations for', async () => {
        req = {params: {username: 'FooFighters'}, query: {by: 'false' }};

        await getAllInvitationsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({invitations: expect.anything()}));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.invitations).to.have.length.greaterThan(0);
    });

    it('Create and delete invitation', async () => {
        const body = {
            sender: 'LimpBizkit', receiver: 'testleerkracht1',
            class: '34d484a1-295f-4e9f-bfdc-3e7a23d86a89'
        } as TeacherInvitationData;
        req = { body };

        await createInvitationHandler(req as Request, res as Response);

        req = {
            params: {
            sender: 'LimpBizkit', receiver: 'testleerkracht1',
                classId: '34d484a1-295f-4e9f-bfdc-3e7a23d86a89'
            }, body: { accepted: 'false' }
        };

        await deleteInvitationForHandler(req as Request, res as Response);
    });

    it('Create and accept invitation', async () => {
        const body = {
            sender: 'LimpBizkit', receiver: 'testleerkracht1',
            class: '34d484a1-295f-4e9f-bfdc-3e7a23d86a89'
        } as TeacherInvitationData;
        req = { body };

        await createInvitationHandler(req as Request, res as Response);

        req = {
            params: {
                sender: 'LimpBizkit', receiver: 'testleerkracht1',
                classId: '34d484a1-295f-4e9f-bfdc-3e7a23d86a89'
            }, body: { accepted: 'true' }
        };

        await deleteInvitationForHandler(req as Request, res as Response);

        req = {params: {
            id: '34d484a1-295f-4e9f-bfdc-3e7a23d86a89'
        }};

        await getClassHandler(req as Request, res as Response);

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.class.teachers).toContain('testleerkracht1');
    });
});
