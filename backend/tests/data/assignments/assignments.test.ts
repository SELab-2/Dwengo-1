import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { AssignmentRepository } from '../../../src/data/assignments/assignment-repository';
import { getAssignmentRepository } from '../../../src/data/repositories';
import { getClass01, getClass02 } from '../../test_assets/classes/classes.testdata';
import { getAssignment02, getAssignment03 } from '../../test_assets/assignments/assignments.testdata';
import { getTestleerkracht1 } from '../../test_assets/users/teachers.testdata';

describe('AssignmentRepository', () => {
    let assignmentRepository: AssignmentRepository;

    beforeAll(async () => {
        await setupTestApp();
        assignmentRepository = getAssignmentRepository();
    });

    it('should return the requested assignment', async () => {
        const class_ = getClass02();
        const usedAssignment = getAssignment02();
        const assignment = await assignmentRepository.findByClassAndId(class_, 21001);

        expect(assignment).toBeTruthy();
        expect(assignment!.description).toBe(usedAssignment.description);
        expect(assignment!.id).toBe(usedAssignment.id);
        expect(assignment!.learningPathHruid).toBe(usedAssignment.learningPathHruid);
        expect(assignment!.within.classId).toBe(usedAssignment.within.classId);
        expect(assignment!.title).toBe(usedAssignment.title);
    });

    it('should return all assignments for a class', async () => {
        const class_ = getClass02();
        const usedAssignment = getAssignment02();
        const assignments = await assignmentRepository.findAllAssignmentsInClass(class_);

        expect(assignments).toBeTruthy();
        expect(assignments).toHaveLength(1);
        const assignment = assignments[0];
        expect(assignment.description).toBe(usedAssignment.description);
        expect(assignment.id).toBe(usedAssignment.id);
        expect(assignment.learningPathHruid).toBe(usedAssignment.learningPathHruid);
        expect(assignment.within.classId).toBe(usedAssignment.within.classId);
        expect(assignment.title).toBe(usedAssignment.title);
    });

    it('should find all by username of the responsible teacher', async () => {
        const teacher = getTestleerkracht1();
        const result = await assignmentRepository.findAllByResponsibleTeacher(teacher.username);
        const resultIds = result.map((it) => it.id).sort((a, b) => (a ?? 0) - (b ?? 0));

        expect(resultIds).toEqual([21000, 21002, 21003, 21004]);
    });

    it('should not find removed assignment', async () => {
        const deleted = getAssignment03();
        await assignmentRepository.deleteByClassAndId(deleted.within, deleted.id!);

        const assignment = await assignmentRepository.findByClassAndId(deleted.within, deleted.id!);

        expect(assignment).toBeNull();
    });
});
