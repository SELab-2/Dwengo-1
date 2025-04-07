import {beforeAll, describe, expect, it} from 'vitest';
import {setupTestApp} from '../../setup-tests';
import {SubmissionRepository} from '../../../src/data/assignments/submission-repository';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../../../src/data/repositories';
import {LearningObjectIdentifier} from '../../../src/entities/content/learning-object-identifier';
import {Language} from '@dwengo-1/common/util/language';
import {StudentRepository} from '../../../src/data/users/student-repository';
import {GroupRepository} from '../../../src/data/assignments/group-repository';
import {AssignmentRepository} from '../../../src/data/assignments/assignment-repository';
import {ClassRepository} from '../../../src/data/classes/class-repository';
import {Submission} from "../../../src/entities/assignments/submission.entity";

export function checkSubmissionsForStudentNoordkaap(result: Submission[]) {
    sortSubmissions(result);

    expect(result[0].learningObjectHruid).toBe("id01");
    expect(result[0].submissionNumber).toBe(2);

    expect(result[1].learningObjectHruid).toBe("id02");
    expect(result[1].submissionNumber).toBe(1);

    expect(result[2].learningObjectHruid).toBe("id02");
    expect(result[2].submissionNumber).toBe(2);

    expect(result[3].learningObjectHruid).toBe("id03");
    expect(result[3].submissionNumber).toBe(1);

    expect(result[4].learningObjectHruid).toBe("id03");
    expect(result[4].submissionNumber).toBe(2);
}

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
        const class_ = await classRepository.findById('id01');
        const assignment = await assignmentRepository.findByClassAndId(class_!, 1);
        const group = await groupRepository.findByAssignmentAndGroupNumber(assignment!, 1);
        const submission = await submissionRepository.findMostRecentSubmissionForGroup(id, group!);

        expect(submission).toBeTruthy();
        expect(submission?.submissionTime.getDate()).toBe(25);
    });

    it('should find all submissions for all groups of a student', async () => {
        const result = await submissionRepository.findAllSubmissionsForAllGroupsOfStudent("Noordkaap");
        expect(result.length).toBe(5);

        checkSubmissionsForStudentNoordkaap(result);
    });

    it('should find all submissions for a certain assignment', async () => {
        const clazz = await classRepository.findById('id01');
        const assignment = await assignmentRepository.findByClassAndId(clazz!, 1);
        const result = await submissionRepository.findAllSubmissionsForAssignment(assignment!);

        sortSubmissions(result);

        expect(result).toHaveLength(5);

        expect(result[0].learningObjectHruid).toBe("id01");
        expect(result[0].submissionNumber).toBe(1);

        expect(result[1].learningObjectHruid).toBe("id02");
        expect(result[1].submissionNumber).toBe(1);

        expect(result[2].learningObjectHruid).toBe("id02");
        expect(result[2].submissionNumber).toBe(2);

        expect(result[3].learningObjectHruid).toBe("id03");
        expect(result[3].submissionNumber).toBe(1);

        expect(result[4].learningObjectHruid).toBe("id03");
        expect(result[4].submissionNumber).toBe(2);

        // But not submission7 (id01, submission number: 3), since it was submitted for an assignment

        sortSubmissions(result);
    });

    it('should not find a deleted submission', async () => {
        const id = new LearningObjectIdentifier('id01', Language.English, 1);
        await submissionRepository.deleteSubmissionByLearningObjectAndSubmissionNumber(id, 1);

        const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(id, 1);

        expect(submission).toBeNull();
    });
});

function sortSubmissions(submissions: Submission[]) {
    submissions.sort((a, b) => {
        if (a.learningObjectHruid < b.learningObjectHruid) return -1;
        if (a.learningObjectHruid > b.learningObjectHruid) return 1;
        return a.submissionNumber! - b.submissionNumber!;
    });
}
