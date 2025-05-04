import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { SubmissionRepository } from '../../../src/data/assignments/submission-repository';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../../../src/data/repositories';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Language } from '@dwengo-1/common/util/language';
import { StudentRepository } from '../../../src/data/users/student-repository';
import { GroupRepository } from '../../../src/data/assignments/group-repository';
import { AssignmentRepository } from '../../../src/data/assignments/assignment-repository';
import { ClassRepository } from '../../../src/data/classes/class-repository';
import { Submission } from '../../../src/entities/assignments/submission.entity';
import { Class } from '../../../src/entities/classes/class.entity';
import { Assignment } from '../../../src/entities/assignments/assignment.entity';
import { testLearningObject01 } from '../../test_assets/content/learning-objects.testdata';
import {getClass01} from "../../test_assets/classes/classes.testdata";

describe('SubmissionRepository', () => {
    let submissionRepository: SubmissionRepository;
    let studentRepository: StudentRepository;
    let groupRepository: GroupRepository;
    let assignmentRepository: AssignmentRepository;
    let classRepository: ClassRepository;

    beforeAll(async () => {
        await setupTestApp();
        submissionRepository = getSubmissionRepository();
        studentRepository = getStudentRepository();
        groupRepository = getGroupRepository();
        assignmentRepository = getAssignmentRepository();
        classRepository = getClassRepository();
    });

    it('should find the requested submission', async () => {
        const id = new LearningObjectIdentifier('id03', Language.English, 1);
        const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(id, 1);

        expect(submission).toBeTruthy();
        expect(submission?.content).toBe('sub1');
    });

    it('should find the most recent submission for a student', async () => {
        const id = new LearningObjectIdentifier('id02', Language.English, 1);
        const student = await studentRepository.findByUsername('Noordkaap');
        const submission = await submissionRepository.findMostRecentSubmissionForStudent(id, student!);

        expect(submission).toBeTruthy();
        expect(submission?.submissionTime.getDate()).toBe(25);
    });

    it('should find the most recent submission for a group', async () => {
        const id = new LearningObjectIdentifier('id03', Language.English, 1);
        const class_ = await classRepository.findById(getClass01().classId);
        const assignment = await assignmentRepository.findByClassAndId(class_!, 21000);
        const group = await groupRepository.findByAssignmentAndGroupNumber(assignment!, 21001);
        const submission = await submissionRepository.findMostRecentSubmissionForGroup(id, group!);

        expect(submission).toBeTruthy();
        expect(submission?.submissionTime.getDate()).toBe(25);
    });

    let clazz: Class | null;
    let assignment: Assignment | null;
    let loId: LearningObjectIdentifier;
    it('should find all submissions for a certain learning object and assignment', async () => {
        clazz = await classRepository.findById(getClass01().classId);
        assignment = await assignmentRepository.findByClassAndId(clazz!, 21000);
        loId = {
            hruid: 'id02',
            language: Language.English,
            version: 1,
        };
        const result = await submissionRepository.findAllSubmissionsForLearningObjectAndAssignment(loId, assignment!);
        sortSubmissions(result);

        expect(result).toHaveLength(3);

        // Submission3 should be found (for learning object 'id02' by group #1 for Assignment #1 in class 'id01')
        expect(result[0].learningObjectHruid).toBe(loId.hruid);
        expect(result[0].submissionNumber).toBe(1);

        // Submission4 should be found (for learning object 'id02' by group #1 for Assignment #1 in class 'id01')
        expect(result[1].learningObjectHruid).toBe(loId.hruid);
        expect(result[1].submissionNumber).toBe(2);

        // Submission8 should be found (for learning object 'id02' by group #2 for Assignment #1 in class 'id01')
        expect(result[2].learningObjectHruid).toBe(loId.hruid);
        expect(result[2].submissionNumber).toBe(3);
    });

    it('should find only the submissions for a certain learning object and assignment made for the given group', async () => {
        const group = await groupRepository.findByAssignmentAndGroupNumber(assignment!, 21002);
        const result = await submissionRepository.findAllSubmissionsForLearningObjectAndGroup(loId, group!);

        expect(result).toHaveLength(1);

        // Submission8 should be found (for learning object 'id02' by group #2 for Assignment #1 in class 'id01')
        expect(result[0].learningObjectHruid).toBe(loId.hruid);
        expect(result[0].submissionNumber).toBe(3);

        // The other submissions found in the previous test case should not be found anymore as they were made on
        // Behalf of group #1 which Tool is no member of.
    });

    it('should not find a deleted submission', async () => {
        const id = new LearningObjectIdentifier(testLearningObject01.hruid, testLearningObject01.language, testLearningObject01.version);
        await submissionRepository.deleteSubmissionByLearningObjectAndSubmissionNumber(id, 1);

        const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(id, 1);

        expect(submission).toBeNull();
    });
});

function sortSubmissions(submissions: Submission[]): void {
    submissions.sort((a, b) => {
        if (a.learningObjectHruid < b.learningObjectHruid) {
            return -1;
        }
        if (a.learningObjectHruid > b.learningObjectHruid) {
            return 1;
        }
        return a.submissionNumber! - b.submissionNumber!;
    });
}
