import { describe, expect, it } from 'vitest';
import { GroupController } from '../../src/controllers/groups';

describe('Test controller groups', () => {
    it('Get groups', async () => {
        const classId = '8764b861-90a6-42e5-9732-c0d9eb2f55f9';
        const assignmentNumber = 21000;

        const controller = new GroupController(classId, assignmentNumber);
        const data = await controller.getAll(true);
        expect(data.groups).to.have.length.greaterThan(0);
    });
});
