import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../setup-tests';
import { AssignmentRepository } from '../../src/data/assignments/assignment-repository';
import {
    getAssignmentRepository,
    getClassRepository,
} from '../../src/data/repositories';
import { ClassRepository } from '../../src/data/classes/class-repository';

describe('AssignmentRepository', () => {
    let AssignmentRepository: AssignmentRepository;
    let ClassRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        AssignmentRepository = getAssignmentRepository();
        ClassRepository = getClassRepository();
    });

    it('should return the requested assignment', async () => {
        const class_ = await ClassRepository.findById('id02');
        const assignment = await AssignmentRepository.findByClassAndId(
            class_!,
            2
        );

        expect(assignment).toBeTruthy();
        expect(assignment!.title).toBe('tool');
    });

    it('should return all assignments for a class', async () => {
        const class_ = await ClassRepository.findById('id02');
        const assignments =
            await AssignmentRepository.findAllAssignmentsInClass(class_!);

        expect(assignments).toBeTruthy();
        expect(assignments).toHaveLength(1);
    });

    it('should not find removed assignment', async () => {
        const class_ = await ClassRepository.findById('id01');
        await AssignmentRepository.deleteByClassAndId(class_!, 3);

        const assignment = await AssignmentRepository.findByClassAndId(
            class_!,
            3
        );

        expect(assignment).toBeNull();
    });
});
