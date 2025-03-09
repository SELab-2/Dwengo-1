import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../setup-tests';
import { SubmissionRepository } from '../../src/data/assignments/submission-repository';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../../src/data/repositories';
import { LearningObject } from '../../src/entities/content/learning-object.entity';
import { LearningObjectIdentifier } from '../../src/entities/content/learning-object-identifier';
import { Language } from '../../src/entities/content/language';
import { subscribe } from 'diagnostics_channel';
import { Student } from '../../src/entities/users/student.entity';
import { StudentRepository } from '../../src/data/users/student-repository';
import { GroupRepository } from '../../src/data/assignments/group-repository';
import { AssignmentRepository } from '../../src/data/assignments/assignment-repository';
import { ClassRepository } from '../../src/data/classes/class-repository';

describe('SubmissionRepository', () => {
    let SubmissionRepository: SubmissionRepository;
    let StudentRepository: StudentRepository;
    let GroupRepository: GroupRepository;
    let AssignmentRepository: AssignmentRepository;
    let ClassRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        SubmissionRepository = getSubmissionRepository();
        StudentRepository = getStudentRepository();
        GroupRepository = getGroupRepository();
        AssignmentRepository = getAssignmentRepository();
        ClassRepository = getClassRepository();
    });

    it('should find the requested submission', async () => {
        const id = new LearningObjectIdentifier('id03', Language.English, '1');
        const submission =
            await SubmissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(
                id,
                1
            );

        expect(submission).toBeTruthy();
        expect(submission?.content).toBe('sub1');
    });

    it('should find the most recent submission for a student', async () => {
        const id = new LearningObjectIdentifier('id02', Language.English, '1');
        const student = await StudentRepository.findByUsername('Noordkaap');
        const submission =
            await SubmissionRepository.findMostRecentSubmissionForStudent(
                id,
                student!
            );

        expect(submission).toBeTruthy();
        expect(submission?.submissionTime.getDate()).toBe(25);
    });

    it('should find the most recent submission for a group', async () => {
        const id = new LearningObjectIdentifier('id03', Language.English, '1');
        const class_ = await ClassRepository.findById('id01');
        const assignment = await AssignmentRepository.findByClassAndId(
            class_!,
            1
        );
        const group = await GroupRepository.findByAssignmentAndGroupNumber(
            assignment!,
            1
        );
        const submission =
            await SubmissionRepository.findMostRecentSubmissionForGroup(
                id,
                group!
            );

        expect(submission).toBeTruthy();
        expect(submission?.submissionTime.getDate()).toBe(25);
    });

    it('should not find a deleted submission', async () => {
        const id = new LearningObjectIdentifier('id01', Language.English, '1');
        await SubmissionRepository.deleteSubmissionByLearningObjectAndSubmissionNumber(
            id,
            1
        );

        const submission =
            await SubmissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(
                id,
                1
            );

        expect(submission).toBeNull();
    });
});
