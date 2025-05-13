import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { SubmissionRepository } from '../../../src/data/assignments/submission-repository';
import {
    getSubmissionRepository,
} from '../../../src/data/repositories';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Submission } from '../../../src/entities/assignments/submission.entity';
import { testLearningObject01 } from '../../test_assets/content/learning-objects.testdata';
import { getSubmission01, getSubmission02, getSubmission07, getSubmission08 } from '../../test_assets/assignments/submission.testdata';
import { getAssignment01 } from '../../test_assets/assignments/assignments.testdata';
import { getTestGroup02 } from '../../test_assets/assignments/groups.testdata';

describe('SubmissionRepository', () => {
    let submissionRepository: SubmissionRepository;

    beforeAll(async () => {
        await setupTestApp();
        submissionRepository = getSubmissionRepository();
    });

    it('should find the requested submission', async () => {
        const usedSubmission = getSubmission01();
        const id = new LearningObjectIdentifier(
            usedSubmission.learningObjectHruid,
            usedSubmission.learningObjectLanguage,
            usedSubmission.learningObjectVersion
        );
        const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(id, usedSubmission.submissionNumber!);

        expect(submission).toBeTruthy();
        expect(submission?.content).toBe(usedSubmission.content);
        expect(submission?.submissionNumber).toBe(usedSubmission.submissionNumber);
        expect(submission?.submitter.username).toBe(usedSubmission.submitter.username);
    });

    it('should find the most recent submission for a student', async () => {
        const usedSubmission = getSubmission02();
        const id = new LearningObjectIdentifier(usedSubmission.learningObjectHruid, usedSubmission.learningObjectLanguage, usedSubmission.learningObjectVersion);
        
        const submission = await submissionRepository.findMostRecentSubmissionForStudent(id, usedSubmission.submitter);

        expect(submission).toBeTruthy();
        expect(submission?.submissionTime).toStrictEqual(usedSubmission.submissionTime);
    });

    it('should find the most recent submission for a group', async () => {
        const usedSubmission = getSubmission02();
        const id = new LearningObjectIdentifier(
            usedSubmission.learningObjectHruid,
            usedSubmission.learningObjectLanguage,
            usedSubmission.learningObjectVersion
        );

        const submission = await submissionRepository.findMostRecentSubmissionForGroup(id, usedSubmission.onBehalfOf);

        expect(submission).toBeTruthy();
        expect(submission?.submissionTime).toStrictEqual(usedSubmission.submissionTime);
    });

    it('should find all submissions for a certain learning object and assignment', async () => {
        const usedSubmission = getSubmission08();
        const assignment = getAssignment01();

        const loId = {
            hruid: usedSubmission.learningObjectHruid,
            language: usedSubmission.learningObjectLanguage,
            version: usedSubmission.learningObjectVersion,
        };
        const result = await submissionRepository.findAllSubmissionsForLearningObjectAndAssignment(loId, assignment);
        const result = await submissionRepository.findAllSubmissionsForLearningObjectAndAssignment(loId, assignment);
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
        const group = getTestGroup02();
        const usedSubmission = getSubmission08();
        const loId = {
            hruid: usedSubmission.learningObjectHruid,
            language: usedSubmission.learningObjectLanguage,
            version: usedSubmission.learningObjectVersion,
        };

        const result = await submissionRepository.findAllSubmissionsForLearningObjectAndGroup(loId, group);
        const result = await submissionRepository.findAllSubmissionsForLearningObjectAndGroup(loId, group);

        expect(result).toHaveLength(1);

        // Submission8 should be found (for learning object 'id02' by group #2 for Assignment #1 in class 'id01')
        expect(result[0].learningObjectHruid).toBe(loId.hruid);
        expect(result[0].submissionNumber).toBe(3);

        // The other submissions found in the previous test case should not be found anymore as they were made on
        // Behalf of group #1 which Tool is no member of.
    });

    it('should not find a deleted submission', async () => {
        const usedSubmission = getSubmission07();
        const id = new LearningObjectIdentifier(testLearningObject01.hruid, testLearningObject01.language, testLearningObject01.version);
        await submissionRepository.deleteSubmissionByLearningObjectAndSubmissionNumber(id, usedSubmission.submissionNumber!);

        const submission = await submissionRepository.findSubmissionByLearningObjectAndSubmissionNumber(id, usedSubmission.submissionNumber!);

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
