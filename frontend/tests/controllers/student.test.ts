import { describe, it, expect, beforeAll } from 'vitest';
import {getStudentController} from "../../src/controllers/controllers";

const controller = getStudentController();

describe('StudentController', () => {
    const newStudent = {
        username: 'TestStudent',
        firstName: 'Testy',
        lastName: 'McTestface',
    };

    beforeAll(() => {
        // Zet eventueel mock server op hier als je dat gebruikt
    });

    it('creates a student and fetches it by username', async () => {
        // Create student
        const created = await controller.createStudent(newStudent);

        expect(created).toBeDefined();
        expect(created.username).toBe(newStudent.username);


        // Fetch same student
        const fetched = await controller.getByUsername(newStudent.username);

        expect(fetched).toBeDefined();
        expect(fetched.student).toBeDefined();

        const student = fetched.student;
        expect(student.username).toBe(newStudent.username);
        expect(student.firstName).toBe(newStudent.firstName);
        expect(student.lastName).toBe(newStudent.lastName);

        await controller.deleteStudent(newStudent.username);

        await expect(controller.getByUsername(newStudent.username)).rejects.toThrow();

    });
});
