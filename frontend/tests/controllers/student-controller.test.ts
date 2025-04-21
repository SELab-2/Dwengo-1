import { StudentController } from "../../src/controllers/students";
import { expect, it, describe, afterAll, beforeAll } from 'vitest';
import { setup, teardown } from '../setup-backend.js';

describe('Test controller students', () => {
    beforeAll(async () => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    it("Get students", async () => {
        const controller = new StudentController();
        const data = await controller.getAll(true);
        expect(data.students).to.have.length.greaterThan(0);
    });
});
