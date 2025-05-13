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
import { getFooFighters, getTestleerkracht1 } from '../test_assets/users/teachers.testdata.js';
import { getClass02 } from '../test_assets/classes/classes.testdata.js';
import { getClassJoinRequest01 } from '../test_assets/classes/class-join-requests.testdata.js';

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
        const teacher = getFooFighters();
        req = { params: { username: teacher.username } };

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

    it('Create duplicate teacher', async () => {
        const teacher = getFooFighters();
        req = {
            body: {
                username: teacher.username,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
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

        const teacher = getTestleerkracht1();
        expect(teacherUsernames).toContain(teacher.username);

        expect(result.teachers).toHaveLength(5);
    });

    it('Deleting non-existent teacher', async () => {
        req = { params: { username: 'doesnotexist' } };

        await expect(async () => deleteTeacherHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Get teacher classes', async () => {
        const class_ = getClass02();
        req = {
            params: { username: class_.teachers[0].username },
            query: { full: 'true' },
        };

        await getTeacherClassHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ classes: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('[TEACHER CLASSES]', result);
        expect(result.classes.length).toBeGreaterThan(0);
    });

    it('Get teacher teachers', async () => {
        const teacher = getTestleerkracht1();
        req = {
            params: { username: teacher.username },
            query: { full: 'true' },
        };

        await getTeacherStudentHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ students: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('[TEACHER STUDENTS]', result.students);
        expect(result.students.length).toBeGreaterThan(0);
    });

    it('Get join requests by class', async () => {
        const jr = getClassJoinRequest01();
        req = {
            params: { classId: jr.class.classId! },
        };

        await getStudentJoinRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ joinRequests: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        // Console.log('[JOIN REQUESTS FOR CLASS]', result.joinRequests);
        expect(result.joinRequests.length).toBeGreaterThan(0);
    });

    it('Update join request status', async () => {
        const jr = getClassJoinRequest01();
        req = {
            params: { classId: jr.class.classId!, studentUsername: jr.requester.username },
            body: { accepted: 'true' },
        };

        await updateStudentJoinRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ request: expect.anything() }));

        req = {
            params: { username: jr.requester.username },
        };

        await getStudentRequestsHandler(req as Request, res as Response);

        const status: boolean = jsonMock.mock.lastCall?.[0].requests[0].status;
        expect(status).toBeTruthy();

        req = {
            params: { id: jr.class.classId! },
        };

        await getClassHandler(req as Request, res as Response);
        const students: string[] = jsonMock.mock.lastCall?.[0].class.students;
        expect(students).contains(jr.requester.username);
    });
});
