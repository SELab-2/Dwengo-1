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
        const classVar = await classRepository.findById('id01');

        expect(classVar).toBeTruthy();
        expect(classVar?.displayName).toBe('class01');
    });

    it('class should be gone after deletion', async () => {
        await classRepository.deleteById('id04');

        const classVar = await classRepository.findById('id04');

        expect(classVar).toBeNull();
    });
});
