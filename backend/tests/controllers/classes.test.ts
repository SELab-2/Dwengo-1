import { setupTestApp } from '../setup-tests.js';
import { describe, it, expect, beforeAll, beforeEach, vi, Mock } from 'vitest';
import { createClassHandler, getAllClassesHandler, getClassHandler, getClassStudentsHandler, getTeacherInvitationsHandler } from '../../src/controllers/classes.js';
import { Request, Response } from 'express';
import { getAllClasses } from '../../src/services/class.js';

describe('Class controllers', () => {
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

    it('should return 404 and error if class is not found', async () => {
        req = {
            params: { id: 'doesnotexist'},
        }

        await getClassHandler(req as Request, res as Response);
    
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Class not found' });
    });

    it('should return 200 if class is not found', async () => {
        req = {
            params: { id: 'id01'},
        }

        await getClassHandler(req as Request, res as Response);
    
        // status can either not be called or called with code 200
        expect(
            statusMock.mock.calls.length === 0 || statusMock.mock.calls.some(([arg]) => arg === 200)
        ).toBe(true);
    });

    it('should return 201 for creating a new class', async () => {
        req = {
            body: { displayName: 'coolenieuweklas' },
        };
        
        await createClassHandler(req as Request, res as Response);
        
        expect(statusMock).toHaveBeenCalledWith(201);
        // TODO: return json should be a classDTO and not named (fixed in #130)
        //expect(jsonMock).toHaveBeenCalledWith();
        
        // TODO: check if class is actually added to db
    });
    it.todo('return json should be a classDTO and not named (fixed in #130)')
    it.todo('check if class is actually added to db');

    it('should return 400 for trying to create a class without name', async () => {
        req = {
            body: {},
        };

        await createClassHandler(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Missing one or more required fields: displayName' });
    });

    it('should return a list of students when calling getClassStudentsHandler', async () => {
        req = {
            params: { id: 'id01' },
            query: {},
        };

        await getClassStudentsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith({ students: [
            'DireStraits',
            'Nirvana',
            'Noordkaap',
            'PinkFloyd',
            'SmashingPumpkins',
            'TheDoors',
            'Tool'
        ]});
    });

    it('should return 404 not found when calling getClassStudentsHandler on a non-existent class', async () => {
        req = {
            params: { id: 'doesnotexist' },
            query: {},
        };

        await getClassStudentsHandler(req as Request, res as Response);
        
        // will fail until code is fixed
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Class not found' });
    });

    it('should return 200 and a list of teacher-invitations', async () => {
        req = {
            params: { id: 'id01' },
            query: {},
        };

        await getTeacherInvitationsHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith({"invitations": [
            {
            "class": "id01",
            "receiver": "LimpBizkit",
            "sender": "FooFighters",
            }
        ]});
    });

    it('should return 404 not found when calling teacher-invitations on a non-existent class', async () => {
        req = {
            params: { id: 'doesnotexist' },
            query: {},
        };

        await getTeacherInvitationsHandler(req as Request, res as Response);

        // will fail until code is fixed
        expect(statusMock).toHaveBeenCalledWith(404);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Class not found' });
    });

    it('should return a list of classes', async () => {
        req = {
            query: {},
        };

        await getAllClassesHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalled();

        const result = jsonMock.mock.lastCall![0];

        expect("classes" in result).toBeTruthy();
    })
})
