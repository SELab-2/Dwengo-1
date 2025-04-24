import { StudentController } from '../../src/controllers/students';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Test controller students', () => {
    let controller: StudentController;

    beforeEach(async () => {
        controller = new StudentController();
    });

    it('Get students', async () => {
        const data = await controller.getAll(true);
        expect(data.students).to.have.length.greaterThan(0);
    });

    it('Get student by username', async () => {
        const username = 'testleerling1';
        const data = await controller.getByUsername(username);
        expect(data.student.username).to.equal(username);
    });

    it('Get classes of student', async () => {
        const students = await controller.getAll(true);

        for (const student of students.students) {
            const data = await controller.getClasses(student.username, true);
            expect(data.classes).to.have.length.greaterThan(0);
        }
    });
});
