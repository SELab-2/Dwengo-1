import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { Request, Response } from 'express';
import {createClassHandler, deleteClassHandler} from "../../src/controllers/classes";

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
        console.log('class', result.class);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ class: expect.anything() }));

        req = {
            params: { id: result.class.id },
        };

        await deleteClassHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ class: expect.anything() }));
    });


});
