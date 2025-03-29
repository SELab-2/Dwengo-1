import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { Request, Response } from 'express';
import {
    getAllStudentsHandler,
    getStudentHandler,
    createStudentHandler,
    deleteStudentHandler,
    getStudentClassesHandler,
    getStudentGroupsHandler,
    getStudentSubmissionsHandler,
    getStudentQuestionsHandler,
    createStudentRequestHandler,
    getStudentRequestHandler,
    updateClassJoinRequestHandler,
    deleteClassJoinRequestHandler
} from '../../src/controllers/students.js';
import {TEST_STUDENTS} from "../test_assets/users/students.testdata";
import {BadRequestException, NotFoundException} from "../../src/exceptions";

describe('Student controllers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    let jsonMock: Mock;
    let statusMock: Mock;

    beforeAll(async () => {
        await setupTestApp();
    });

    beforeEach(() => {
        jsonMock = vi.fn();
        statusMock = vi.fn().mockReturnThis();
        res = {
            json: jsonMock,
            status: statusMock,
        };
    });

    it('Student not found', async () => {
        req = { params: { username: 'doesnotexist' } };

        await expect(() => deleteStudentHandler(req as Request, res as Response))
            .rejects
            .toThrow(NotFoundException);
    });

    it('No username', async () => {
        req = { params: {} };

        await expect(() => getStudentHandler(req as Request, res as Response))
            .rejects
            .toThrowError(BadRequestException);
    });

    it('Create student', async () => {
        req = {
            body: {
                username: 'coolstudent',
                firstName: 'Cool',
                lastName: 'Student'
            }
        };

        await createStudentHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalled();
    });

    // TODO create duplicate student id

    it('Create student no body 400', async () => {
        req = { body: {} };

        await expect(() => createStudentHandler(req as Request, res as Response))
            .rejects
            .toThrowError(BadRequestException);
    });

    it('Student list', async () => {
        req = { query: { full: 'true' } };

        await getAllStudentsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ students: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];

        // check is DireStraits is part of the student list
        const studentUsernames = result.students.map((s: any) => s.username);
        expect(studentUsernames).toContain('DireStraits');

        // check length, +1 because of create
        expect(result.students).toHaveLength(TEST_STUDENTS.length + 1);
    });

    it('Student classes', async () => {
        req = { params: { username: 'DireStraits' }, query: {} };

        await getStudentClassesHandler(req as Request, res as Response);


        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ classes: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.classes).to.have.length.greaterThan(0);
    });

    it('Student groups', async () => {
        req = { params: { username: 'DireStraits' }, query: {} };

        await getStudentGroupsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ groups: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.groups).to.have.length.greaterThan(0);
    });

    it('Student submissions', async () => {
        req = { params: { username: 'DireStraits' } };

        await getStudentSubmissionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ submissions: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.submissions).to.have.length.greaterThan(0);
    });

    it('Student questions', async () => {
        req = { params: { username: 'DireStraits' }, query: { full: 'true' } };

        await getStudentQuestionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ questions: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.questions).to.have.length.greaterThan(0);
    });

    it('Delete student', async () => {
        req = { params: { username: 'coolstudent' } };

        await deleteStudentHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalled();
    });

    it('Deleting non-existent student', async () => {
        req = { params: { username: 'doesnotexist' } };

        await expect(() => deleteStudentHandler(req as Request, res as Response))
            .rejects
            .toThrow(NotFoundException);
    });

    it('Get join requests by student', async () => {
        req = {
            params: { username: 'PinkFloyd' },
        };

        await getStudentRequestHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                requests: expect.anything(),
            })
        );

        const result = jsonMock.mock.lastCall?.[0];
        // console.log('[JOIN REQUESTS]', result.requests);
        expect(result.requests.length).toBeGreaterThan(0);
    });

    it('Create join request', async () => {
        req = {
            params: { username: 'DireStraits', classId: '' },
        };

        await createStudentRequestHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalled();
    });

    /*

    it('Update join request status (accept)', async () => {
        req = {
            params: { classId },
            query: { username },
        };

        await updateClassJoinRequestHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalled();
        const result = jsonMock.mock.lastCall?.[0];
        console.log('[UPDATED REQUEST]', result);
    });

    it('Delete join request', async () => {
        req = {
            params: { classId },
            query: { username },
        };

        await deleteClassJoinRequestHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(204);
        expect(sendMock).toHaveBeenCalled();
    });

     */


});
