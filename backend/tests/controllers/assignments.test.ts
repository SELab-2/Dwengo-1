import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { Request, Response } from 'express';
import { getAssignmentHandler, getAllAssignmentsHandler, getAssignmentsSubmissionsHandler } from '../../src/controllers/assignments.js';

function createRequestObject(classid: string, assignmentid: string) {
    return {
        params: { 
            classid: classid,
            id: assignmentid,
        },
        query: {},
    };
}

function checkReturnList(jsonMock: Mock, listName: string) {
	expect(jsonMock).toHaveBeenCalled();

	const result = jsonMock.mock.lastCall![0];
		
	expect(listName in result).toBeTruthy();
}

function checkReturn404(jsonMock: Mock, statusMock: Mock) {
		expect(statusMock).toHaveBeenCalledWith(404);
		expect(jsonMock).toHaveBeenCalled();
}

describe('Assignment controllers', () => {
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

    it('should return a 404 when trying to find a non-existent assignment', async () => {
        req = createRequestObject('id01', '43000'); // should not exist

		await getAssignmentHandler(req as Request, res as Response);

		checkReturn404(jsonMock, statusMock);
    });

	it('should return a 404 when trying to find an assignment on a non-existing class', async () => {
        req = createRequestObject('doesnotexist', '1'); // should not exist

		await getAssignmentHandler(req as Request, res as Response);

		checkReturn404(jsonMock, statusMock);
	});
	
	it('should return an assignment', async () => {
		req = createRequestObject('id01', '1');

		await getAssignmentHandler(req as Request, res as Response);

		expect(jsonMock).toHaveBeenCalledWith({
			id: 1,
			class: 'id01',
			title: 'dire straits',
			description: 'reading',
			learningPath: 'id02',
			language: 'en'
		});
	});

	it('should return a list of assignments', async () => {
		req = createRequestObject('id01', 'irrelevant');

		await getAllAssignmentsHandler(req as Request, res as Response);

		checkReturnList(jsonMock, "assignments");
	});

	it('should return a list of submissions for an assignment', async () => {
		req = createRequestObject('id01', '1');

		await getAssignmentsSubmissionsHandler(req as Request, res as Response);

		checkReturnList(jsonMock, "submissions");
	})
})
