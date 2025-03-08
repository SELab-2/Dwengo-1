import { beforeAll, describe, expect, it } from 'vitest';
import { ClassRepository } from '../../src/data/classes/class-repository';
import { setupTestApp } from '../setup-tests';
import { getClassRepository } from '../../src/data/repositories';

describe('ClassRepository', () => {
    let ClassRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        ClassRepository = getClassRepository();
    });

    it('should return nothing because id does not exist', async () => {
        const classVar = await ClassRepository.findById('id');

        expect(classVar).toBeNull();
    });

    it('should return requested class', async () => {
        const classVar = await ClassRepository.findById('class_id01');

        expect(classVar).toBeTruthy();
        expect(classVar?.displayName).toBe('class01');
    });

    it('class should be gone after deletion', async () => {
        await ClassRepository.deleteById('class_id01');

        const classVar = await ClassRepository.findById('class_id01');

        expect(classVar).toBeNull();
    });
});
