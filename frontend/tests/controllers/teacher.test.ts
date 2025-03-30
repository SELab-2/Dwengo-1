import { describe, it, expect, beforeAll } from 'vitest';
import {TeacherController} from "../../src/controllers/teachers";

const controller = new TeacherController();

describe('TeacherController', () => {
    const newTeacher = {
        username: 'testteacher3',
        firstName: 'Testy',
        lastName: 'McTestface',
    };

    beforeAll(() => {
        // Start backend
    });

    it('creates a student and fetches it by username', async () => {
        // Create student
        await controller.createTeacher(newTeacher);

        // Fetch same student
        const fetched = await controller.getByUsername(newTeacher.username);

        expect(fetched).toBeDefined();
        expect(fetched.teacher).toBeDefined();

        const teacher = fetched.teacher;
        expect(teacher.username).toBe(newTeacher.username);
        expect(teacher.firstName).toBe(newTeacher.firstName);
        expect(teacher.lastName).toBe(newTeacher.lastName);


        await controller.deleteTeacher(newTeacher.username);
    });
});
