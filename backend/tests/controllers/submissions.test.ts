import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import {
    getSubmissionHandler,
    getAllSubmissionsHandler,
    deleteSubmissionHandler, createSubmissionHandler
} from '../../src/controllers/submissions.js';
import { Request, Response } from 'express';
import {NotFoundException} from "../../src/exceptions/not-found-exception";
import {getClass01, getClass02} from "../test_assets/classes/classes.testdata";


function createRequestObject(hruid: string, submissionNumber: string) {
	return {
		params: {
			hruid: hruid,
			id: submissionNumber,
		},
		query: {
			language: 'en',
			version: '1',
		},
	}
}

describe('Submission controllers', () => {
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

    it('error submission is not found', async () => {
		req = createRequestObject('id01', '1000000');

        await expect(async () => getSubmissionHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
	});

	it('should return a list of submissions for a learning object', async () => {
		req = createRequestObject(getClass02().classId as string, 'irrelevant');

		await getAllSubmissionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ submissions: expect.anything() }));
    });
});

