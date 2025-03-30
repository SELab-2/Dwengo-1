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
    deleteClassJoinRequestHandler
} from '../../src/controllers/students.js';
import {TEST_STUDENTS} from "../test_assets/users/students.testdata.js";
import {NotFoundException} from "../../src/exceptions/not-found-exception.js";
import {BadRequestException} from "../../src/exceptions/bad-request-exception.js";
import {ConflictException} from "../../src/exceptions/conflict-exception.js";
import {EntityAlreadyExistsException} from "../../src/exceptions/entity-already-exists-exception.js";
import {StudentDTO} from "../../src/interfaces/student.js";

describe('Student controllers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    let jsonMock: Mock;
    let statusMock: Mock;
    let sendStatusMock: Mock;

    beforeAll(async () => {
        await setupTestApp();
    });

    beforeEach(() => {
        jsonMock = vi.fn();
        statusMock = vi.fn().mockReturnThis();
        sendStatusMock = vi.fn().mockReturnThis();
        res = {
            json: jsonMock,
            status: statusMock,
            sendStatus: sendStatusMock,
        };
    });

    it('Get student', async () => {
        req = { params: { username: 'DireStraits' }};

        await getStudentHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ student: expect.anything() }));
    });

    it('Student not found', async () => {
        req = { params: { username: 'doesnotexist' } };

        await expect(() => getStudentHandler(req as Request, res as Response))
            .rejects
            .toThrow(NotFoundException);
    });

    it('No username', async () => {
        req = { params: {} };

        await expect(() => getStudentHandler(req as Request, res as Response))
            .rejects
            .toThrowError(BadRequestException);
    });

    it('Create and delete student', async () => {
        req = {
            body: {
                username: 'coolstudent',
                firstName: 'New',
                lastName: 'Student'
            }
        };

        await createStudentHandler(req as Request, res as Response);

        expect(sendStatusMock).toHaveBeenCalledWith(201);

        req = { params: { username: 'coolstudent' } };

        await deleteStudentHandler(req as Request, res as Response);

        expect(sendStatusMock).toHaveBeenCalledWith(200);
    });


    it('Create duplicate student', async () => {
        req = {
            body: {
                username: 'DireStraits',
                firstName: 'dupe',
                lastName: 'dupe'
            }
        };

        await expect(() => createStudentHandler(req as Request, res as Response))
            .rejects
            .toThrowError(EntityAlreadyExistsException);
    });

    it('Create student no body', async () => {
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

        // Check is DireStraits is part of the student list
        const studentUsernames = result.students.map((s: StudentDTO) => s.username);
        expect(studentUsernames).toContain('DireStraits');

        // Check length, +1 because of create
        expect(result.students).toHaveLength(TEST_STUDENTS.length);
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
        req = { params: { username: 'DireStraits' }, query: { full: 'true' } };

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
        // Console.log('[JOIN REQUESTS]', result.requests);
        expect(result.requests.length).toBeGreaterThan(0);
    });

    it('Create join request', async () => {
        req = {
            params: { username: 'Noordkaap' },
            body: { classId: 'id02' }
        };

        await createStudentRequestHandler(req as Request, res as Response);

        expect(sendStatusMock).toHaveBeenCalledWith(201);
    });

    it('Create join request duplicate', async () => {
        req = {
            params: { username: 'Tool' },
            body: { classId: 'id02' }
        };

        await expect(() => createStudentRequestHandler(req as Request, res as Response))
            .rejects
            .toThrow(ConflictException);
    });


    it('Delete join request', async () => {
        req = {
            params: { username: 'Noordkaap', classId: 'id02' },
        };

        await deleteClassJoinRequestHandler(req as Request, res as Response);

        expect(sendStatusMock).toHaveBeenCalledWith(204);

        await expect(() => deleteClassJoinRequestHandler(req as Request, res as Response))
            .rejects
            .toThrow(NotFoundException);
    });

});
