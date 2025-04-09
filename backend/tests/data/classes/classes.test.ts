import { beforeAll, describe, expect, it } from 'vitest';
import { ClassRepository } from '../../../src/data/classes/class-repository';
import { setupTestApp } from '../../setup-tests';
import { getClassRepository } from '../../../src/data/repositories';

describe('ClassRepository', () => {
    let classRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        classRepository = getClassRepository();
    });

    it('should return nothing because id does not exist', async () => {
        const classVar = await classRepository.findById('test_id');

        expect(classVar).toBeNull();
    });

    it('should return requested class', async () => {
        const classVar = await classRepository.findById('8764b861-90a6-42e5-9732-c0d9eb2f55f9');

        expect(classVar).toBeTruthy();
        expect(classVar?.displayName).toBe('class01');
    });

    it('class should be gone after deletion', async () => {
        await classRepository.deleteById('33d03536-83b8-4880-9982-9bbf2f908ddf');

        const classVar = await classRepository.findById('33d03536-83b8-4880-9982-9bbf2f908ddf');

        expect(classVar).toBeNull();
    });
});
