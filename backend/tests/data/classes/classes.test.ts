import { beforeAll, describe, expect, it } from 'vitest';
import { ClassRepository } from '../../../src/data/classes/class-repository';
import { setupTestApp } from '../../setup-tests';
import { getClassRepository } from '../../../src/data/repositories';
import {TEST_CLASS_LIST} from "../../test_assets/classes/classes.testdata";

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
        const cls = TEST_CLASS_LIST[0];
        const classVar = await classRepository.findById(cls.classId!);

        expect(classVar).toBeTruthy();
        expect(classVar?.displayName).toBe(cls.displayName);
    });

    it('class should be gone after deletion', async () => {
        const cls = TEST_CLASS_LIST[3];
        await classRepository.deleteById(cls.classId!);

        const classVar = await classRepository.findById('33d03536-83b8-4880-9982-9bbf2f908ddf');

        expect(classVar).toBeNull();
    });
});
