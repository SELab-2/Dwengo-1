import { describe, it, expect, beforeAll } from 'vitest';
import {StudentController} from "../../src/controllers/students";

const controller = new StudentController();

describe('StudentController', () => {
    const newStudent = {
        username: 'teststudent1',
        firstName: 'Testy',
        lastName: 'McTestface',
    };

    beforeAll(() => {
        // Start backend
    });

    it('creates a student and fetches it by username', async () => {
        // Create student
        await controller.createStudent(newStudent);

        // Fetch same student
        const fetched = await controller.getByUsername(newStudent.username);

        expect(fetched).toBeDefined();
        expect(fetched.student).toBeDefined();

        const student = fetched.student;
        expect(student.username).toBe(newStudent.username);
        expect(student.firstName).toBe(newStudent.firstName);
        expect(student.lastName).toBe(newStudent.lastName);


        await controller.deleteStudent(newStudent.username);
    });
});
