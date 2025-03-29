import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { getSubmissionHandler, getAllSubmissionsHandler } from '../../src/controllers/submissions.js';
import { Request, Response } from 'express';
import { checkReturn404, checkReturnList } from './qol.js';
import { getSubmission } from '../../src/services/submissions.js';
import { Language } from '../../src/entities/content/language.js';


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

    it('should return a 404 and error if submission is not found', async () => {
		req = createRequestObject('id01', '1000000');

		await getSubmissionHandler(req as Request, res as Response);

		checkReturn404(jsonMock, statusMock);
	});

	it('should return a 404 and error if learningobject is not found', async () => {
		req = createRequestObject('doesnotexist', '1000000');

		await getSubmissionHandler(req as Request, res as Response);

		checkReturn404(jsonMock, statusMock);
	});

	it('should return an existing submission', async () => {
		req = createRequestObject('id01', '1');

		await getSubmissionHandler(req as Request, res as Response);

		const expectedResult = await getSubmission('id01', Language.English, 1, 1);

        expect(jsonMock.mock.lastCall![0]).toStrictEqual(expectedResult);
	});

	it('should return a list of submissions for a learning object', async () => {
		req = createRequestObject('id02', 'irrelevant');

		await getAllSubmissionsHandler(req as Request, res as Response);

		checkReturnList(jsonMock, 'submissions', 2);
	});
});

