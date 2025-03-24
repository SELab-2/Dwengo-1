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
    getStudentQuestionsHandler
} from '../../src/controllers/students.js';
import {TEST_STUDENTS} from "../test_assets/users/students.testdata";

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

    it('Student not found 404', async () => {
        req = { params: { username: 'doesnotexist' } };

        await getStudentHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalled();
    });

    it('No username 400', async () => {
        req = { params: {} };

        await getStudentHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalled();
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

    it('Create student no body 400', async () => {
        req = { body: {} };

        await createStudentHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalled();
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
    });

    it('Student groups', async () => {
        req = { params: { username: 'DireStraits' }, query: {} };

        await getStudentGroupsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ groups: expect.anything() }));
    });

    it('Student submissions', async () => {
        req = { params: { username: 'DireStraits' } };

        await getStudentSubmissionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ submissions: expect.anything() }));
    });

    it('Student questions', async () => {
        req = { params: { username: 'DireStraits' }, query: { full: 'true' } };

        await getStudentQuestionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ questions: expect.anything() }));
    });

    it('Delete student', async () => {
        req = { params: { username: 'coolstudent' } };

        await deleteStudentHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalled();
    });

    it('Deleting non-existent student 404', async () => {
        req = { params: { username: 'doesnotexist' } };

        await deleteStudentHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalled();
    });
});
