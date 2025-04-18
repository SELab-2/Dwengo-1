import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { AssignmentRepository } from '../../../src/data/assignments/assignment-repository';
import { getAssignmentRepository, getClassRepository } from '../../../src/data/repositories';
import { ClassRepository } from '../../../src/data/classes/class-repository';

describe('AssignmentRepository', () => {
    let assignmentRepository: AssignmentRepository;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        assignmentRepository = getAssignmentRepository();
        classRepository = getClassRepository();
    });

    it('should return the requested assignment', async () => {
        const class_ = await classRepository.findById('34d484a1-295f-4e9f-bfdc-3e7a23d86a89');
        const assignment = await assignmentRepository.findByClassAndId(class_!, 21001);

        expect(assignment).toBeTruthy();
        expect(assignment!.title).toBe('tool');
    });

    it('should return all assignments for a class', async () => {
        const class_ = await classRepository.findById('34d484a1-295f-4e9f-bfdc-3e7a23d86a89');
        const assignments = await assignmentRepository.findAllAssignmentsInClass(class_!);

        expect(assignments).toBeTruthy();
        expect(assignments).toHaveLength(1);
        expect(assignments[0].title).toBe('tool');
    });

    it('should find all by username of the responsible teacher', async () => {
        const result = await assignmentRepository.findAllByResponsibleTeacher('testleerkracht1');
        const resultIds = result.map((it) => it.id).sort((a, b) => (a ?? 0) - (b ?? 0));

        expect(resultIds).toEqual([ 21000, 21002, 21003 ]);
    });

    it('should not find removed assignment', async () => {
        const class_ = await classRepository.findById('id01');
        await assignmentRepository.deleteByClassAndId(class_!, 3);

        const assignment = await assignmentRepository.findByClassAndId(class_!, 3);

        expect(assignment).toBeNull();
    });
});
