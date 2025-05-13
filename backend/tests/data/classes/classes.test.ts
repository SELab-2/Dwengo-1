import { beforeAll, describe, expect, it } from 'vitest';
import { ClassRepository } from '../../../src/data/classes/class-repository';
import { setupTestApp } from '../../setup-tests';
import { getClassRepository } from '../../../src/data/repositories';
import { getClass01, getClass04 } from '../../test_assets/classes/classes.testdata';

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
        const expected = getClass01();
        const classVar = await classRepository.findById(expected.classId!);

        expect(classVar).toBeTruthy();
        expect(classVar?.displayName).toBe(expected.displayName);
    });

    it('class should be gone after deletion', async () => {
        const deleted = getClass04();
        await classRepository.deleteById(deleted.classId!);

        const classVar = await classRepository.findById(deleted.classId!);

        expect(classVar).toBeNull();
    });
});
