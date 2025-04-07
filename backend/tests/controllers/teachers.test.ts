import { beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Request, Response } from 'express';
import { setupTestApp } from '../setup-tests.js';
import { NotFoundException } from '../../src/exceptions/not-found-exception.js';
import {
    createTeacherHandler,
    deleteTeacherHandler,
    getAllTeachersHandler,
    getStudentJoinRequestHandler,
    getTeacherClassHandler,
    getTeacherHandler,
    getTeacherStudentHandler,
    updateStudentJoinRequestHandler,
} from '../../src/controllers/teachers.js';
import { BadRequestException } from '../../src/exceptions/bad-request-exception.js';
import { EntityAlreadyExistsException } from '../../src/exceptions/entity-already-exists-exception.js';
import { getStudentRequestsHandler } from '../../src/controllers/students.js';
import { TeacherDTO } from '@dwengo-1/common/interfaces/teacher';
import { getClassHandler } from '../../src/controllers/classes';

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

    it('Get teacher', async () => {
        req = { params: { username: 'FooFighters' } };

        await getTeacherHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ teacher: expect.anything() }));
    });

    it('Teacher not found', async () => {
        req = { params: { username: 'doesnotexist' } };

        await expect(async () => getTeacherHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('No username', async () => {
        req = { params: {} };

        await expect(async () => getTeacherHandler(req as Request, res as Response)).rejects.toThrowError(BadRequestException);
    });

    it('Create and delete teacher', async () => {
        const teacher = {
            id: 'coolteacher',
            username: 'coolteacher',
            firstName: 'New',
            lastName: 'Teacher',
        };
        req = {
            body: teacher,
        };

        await createTeacherHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ teacher: expect.objectContaining(teacher) }));

        req = { params: { username: 'coolteacher' } };

        await deleteTeacherHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ teacher: expect.objectContaining(teacher) }));
    });

    it('Create duplicate student', async () => {
        req = {
            body: {
                username: 'FooFighters',
                firstName: 'Dave',
                lastName: 'Grohl',
            },
        };

        await expect(async () => createTeacherHandler(req as Request, res as Response)).rejects.toThrowError(EntityAlreadyExistsException);
    });

    it('Create teacher no body', async () => {
        req = { body: {} };

        await expect(async () => createTeacherHandler(req as Request, res as Response)).rejects.toThrowError(BadRequestException);
    });

    it('Teacher list', async () => {
        req = { query: { full: 'true' } };

        await getAllTeachersHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ teachers: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];

        const teacherUsernames = result.teachers.map((s: TeacherDTO) => s.username);
        expect(teacherUsernames).toContain('FooFighters');

        expect(result.teachers).toHaveLength(4);
    });

    it('Deleting non-existent student', async () => {
        req = { params: { username: 'doesnotexist' } };

        await expect(async () => deleteTeacherHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Get teacher classes', async () => {
        req = {
            params: { username: 'FooFighters' },
            query: { full: 'true' },
        };

        await getTeacherClassHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ classes: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('[TEACHER CLASSES]', result);
        expect(result.classes.length).toBeGreaterThan(0);
    });

    it('Get teacher students', async () => {
        req = {
            params: { username: 'FooFighters' },
            query: { full: 'true' },
        };

        await getTeacherStudentHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ students: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('[TEACHER STUDENTS]', result.students);
        expect(result.students.length).toBeGreaterThan(0);
    });

    /*

    It('Get teacher questions', async () => {
        req = {
            params: { username: 'FooFighters' },
            query: { full: 'true' },
        };

        await getTeacherQuestionHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ questions: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // console.log('[TEACHER QUESTIONS]', result.questions);
        expect(result.questions.length).toBeGreaterThan(0);

        // TODO fix
    });

     */

    it('Get join requests by class', async () => {
        req = {
            params: { classId: 'id02' },
        };

        await getStudentJoinRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ joinRequests: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('[JOIN REQUESTS FOR CLASS]', result.joinRequests);
        expect(result.joinRequests.length).toBeGreaterThan(0);
    });

    it('Update join request status', async () => {
        req = {
            params: { classId: 'id02', studentUsername: 'PinkFloyd' },
            body: { accepted: 'true' },
        };

        await updateStudentJoinRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ request: expect.anything() }));

        req = {
            params: { username: 'PinkFloyd' },
        };

        await getStudentRequestsHandler(req as Request, res as Response);

        const status: boolean = jsonMock.mock.lastCall?.[0].requests[0].status;
        expect(status).toBeTruthy();

        req = {
            params: { id: 'id02' },
        };

        await getClassHandler(req as Request, res as Response);
        const students: string[] = jsonMock.mock.lastCall?.[0].class.students;
        expect(students).contains('PinkFloyd');
    });
});
