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
    getStudentAssignmentsHandler,
} from '../../src/controllers/students.js';
import { getDireStraits, getNoordkaap, getTheDoors, TEST_STUDENTS } from '../test_assets/users/students.testdata.js';
import { NotFoundException } from '../../src/exceptions/not-found-exception.js';
import { BadRequestException } from '../../src/exceptions/bad-request-exception.js';
import { ConflictException } from '../../src/exceptions/conflict-exception.js';
import { EntityAlreadyExistsException } from '../../src/exceptions/entity-already-exists-exception.js';
import { StudentDTO } from '@dwengo-1/common/interfaces/student';
import { getClass02 } from '../test_assets/classes/classes.testdata.js';
import { getClassJoinRequest02 } from '../test_assets/classes/class-join-requests.testdata.js';
import { getTestGroup01 } from '../test_assets/assignments/groups.testdata.js';
import { getSubmission01 } from '../test_assets/assignments/submission.testdata.js';
import { getQuestion01 } from '../test_assets/questions/questions.testdata.js';

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
        const student = getDireStraits();
        req = { params: { username: student.username } };

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
        const student = getDireStraits();
        req = {
            body: {
                username: student.username,
                firstName: student.firstName,
                lastName: student.lastName,
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

        expect(studentUsernames).toContain(TEST_STUDENTS[0].username);

        // Check length, +1 because of create
        expect(result.students).toHaveLength(TEST_STUDENTS.length);
    });

    it('Student classes', async () => {
        const class_ = getClass02();
        const member = class_.students[0];
        req = { params: { username: member.username }, query: {} };

        await getStudentClassesHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ classes: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.classes).to.have.length.greaterThan(0);
    });

    it('Student groups', async () => {
        const group = getTestGroup01();
        const member = group.members[0];
        req = { params: { username: member.username }, query: {} };

        await getStudentGroupsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ groups: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.groups).to.have.length.greaterThan(0);
    });

    it('Student assignments', async () => {
        const group = getTestGroup01();
        const member = group.members[0];
        req = { params: { username: member.username }, query: {} };

        await getStudentAssignmentsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ assignments: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.assignments).to.have.length.greaterThan(0);
    });

    it('Student submissions', async () => {
        const submission = getSubmission01();
        req = { params: { username: submission.submitter.username }, query: { full: 'true' } };

        await getStudentSubmissionsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ submissions: expect.anything() }));

        const result = jsonMock.mock.lastCall?.[0];
        expect(result.submissions).to.have.length.greaterThan(0);
    });

    it('Student questions', async () => {
        const question = getQuestion01();
        req = { params: { username: question.author.username }, query: { full: 'true' } };

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
        const jr = getClassJoinRequest02();
        req = {
            params: { username: jr.requester.username },
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
        const jr = getClassJoinRequest02();
        req = {
            params: { username: jr.requester.username, classId: jr.class.classId! },
        };

        await getStudentRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                request: expect.anything(),
            })
        );
    });

    it('Create and delete join request', async () => {
        const student = getTheDoors();
        const class_ = getClass02();
        req = {
            params: { username: student.username },
            body: { classId: class_.classId! },
        };

        await createStudentRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ request: expect.anything() }));

        req = {
            params: { username: student.username, classId: class_.classId! },
        };

        await deleteClassJoinRequestHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ request: expect.anything() }));

        await expect(async () => deleteClassJoinRequestHandler(req as Request, res as Response)).rejects.toThrow(NotFoundException);
    });

    it('Create join request student already in class error', async () => {
        const student = getNoordkaap();
        const class_ = getClass02();
        req = {
            params: { username: student.username },
            body: { classId: class_.classId! },
        };

        await expect(async () => createStudentRequestHandler(req as Request, res as Response)).rejects.toThrow(ConflictException);
    });

    it('Create join request duplicate', async () => {
        const jr = getClassJoinRequest02();
        req = {
            params: { username: jr.requester.username },
            body: { classId: jr.class.classId! },
        };

        await expect(async () => createStudentRequestHandler(req as Request, res as Response)).rejects.toThrow(ConflictException);
    });
});
