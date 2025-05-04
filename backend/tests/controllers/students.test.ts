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
    getStudentRequestsHandler,
    deleteClassJoinRequestHandler,
    getStudentRequestHandler,
} from '../../src/controllers/students.js';
import { TEST_STUDENTS } from '../test_assets/users/students.testdata.js';
import { NotFoundException } from '../../src/exceptions/not-found-exception.js';
import { BadRequestException } from '../../src/exceptions/bad-request-exception.js';
import { ConflictException } from '../../src/exceptions/conflict-exception.js';
import { EntityAlreadyExistsException } from '../../src/exceptions/entity-already-exists-exception.js';
import { StudentDTO } from '@dwengo-1/common/interfaces/student';
import {getClass02} from "../test_assets/classes/classes.testdata";

describe('Student controllers', () => {
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

    it('Get student', async () => {
        req = { params: { username: 'DireStraits' } };

        await getStudentHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ student: expect.anything() }));
    });

    it('Student not found', async () => {
        req = { params: { username: 'doesnotexist' } };

        await expect(async () => getStudentHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('No username', async () => {
        req = { params: {} };

        await expect(async () => getStudentHandler(req as Request, res as Response)).rejects.toThrowError(BadRequestException);
    });

    it('Create and delete student', async () => {
        const student = {
            id: 'coolstudent',
            username: 'coolstudent',
            firstName: 'New',
            lastName: 'Student',
        } as StudentDTO;
        req = {
            body: student,
        };

        await createStudentHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ student: expect.objectContaining(student) }));

        req = { params: { username: 'coolstudent' } };

        await deleteStudentHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ student: expect.objectContaining(student) }));
    });

    it('Create duplicate student', async () => {
        req = {
            body: {
                username: 'DireStraits',
                firstName: 'dupe',
                lastName: 'dupe',
            },
        };

        await expect(async () => createStudentHandler(req as Request, res as Response)).rejects.toThrowError(EntityAlreadyExistsException);
    });

    it('Create student no body', async () => {
        req = { body: {} };

        await expect(async () => createStudentHandler(req as Request, res as Response)).rejects.toThrowError(BadRequestException);
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

        await expect(async () => deleteStudentHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Get join requests by student', async () => {
        req = {
            params: { username: 'PinkFloyd' },
        };

        await getStudentRequestsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                requests: expect.anything(),
            })
        );

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('[JOIN REQUESTS]', result.requests);
        expect(result.requests.length).toBeGreaterThan(0);
    });

    it('Get join request by student and class', async () => {
        req = {
            params: { username: 'PinkFloyd', classId: getClass02().classId },
        };

        await getStudentRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                request: expect.anything(),
            })
        );
    });

    it('Create and delete join request', async () => {
        req = {
            params: { username: 'TheDoors' },
            body: { classId: getClass02().classId },
        };

        await createStudentRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ request: expect.anything() }));

        req = {
            params: { username: 'TheDoors', classId: getClass02().classId },
        };

        await deleteClassJoinRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ request: expect.anything() }));

        await expect(async () => deleteClassJoinRequestHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Create join request student already in class error', async () => {
        req = {
            params: { username: 'Noordkaap' },
            body: { classId: getClass02().classId },
        };

        await expect(async () => createStudentRequestHandler(req as Request, res as Response)).rejects.toThrow(ConflictException);
    });

    it('Create join request duplicate', async () => {
        req = {
            params: { username: 'Tool' },
            body: { classId: getClass02().classId },
        };

        await expect(async () => createStudentRequestHandler(req as Request, res as Response)).rejects.toThrow(ConflictException);
    });
});
