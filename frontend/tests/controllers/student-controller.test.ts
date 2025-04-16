import { StudentController } from '../../src/controllers/students';
import { expect, it } from 'vitest';

it('Get students', async () => {
    const controller = new StudentController();
    const data = await controller.getAll(true);
    expect(data.students).to.have.length.greaterThan(0);
});
