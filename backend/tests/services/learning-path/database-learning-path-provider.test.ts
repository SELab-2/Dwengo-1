import { beforeAll, describe, expect, it } from 'vitest';
import { LearningObject } from '../../../src/entities/content/learning-object.entity.js';
import { setupTestApp } from '../../setup-tests.js';
import { LearningPath } from '../../../src/entities/content/learning-path.entity.js';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getLearningObjectRepository,
    getLearningPathRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../../../src/data/repositories.js';
import learningObjectExample from '../../test-assets/learning-objects/pn-werkingnotebooks/pn-werkingnotebooks-example.js';
import learningPathExample from '../../test-assets/learning-paths/pn-werking-example.js';
import databaseLearningPathProvider from '../../../src/services/learning-paths/database-learning-path-provider.js';
import { expectToBeCorrectLearningPath } from '../../test-utils/expectations.js';
import learningObjectService from '../../../src/services/learning-objects/learning-object-service.js';
import { Language } from '@dwengo-1/common/util/language';
import {
    ConditionTestLearningPathAndLearningObjects,
    createConditionTestLearningPathAndLearningObjects,
} from '../../test-assets/learning-paths/test-conditions-example.js';
import { Student } from '../../../src/entities/users/student.entity.js';

import { LearningObjectNode, LearningPathResponse } from '@dwengo-1/common/interfaces/learning-content';

const STUDENT_A_USERNAME = "student_a";
const STUDENT_B_USERNAME = "student_b";
const CLASS_NAME = "test_class"

async function initExampleData(): Promise<{ learningObject: LearningObject; learningPath: LearningPath }> {
    const learningObjectRepo = getLearningObjectRepository();
    const learningPathRepo = getLearningPathRepository();
    const learningObject = learningObjectExample.createLearningObject();
    const learningPath = learningPathExample.createLearningPath();
    await learningObjectRepo.save(learningObject);
    await learningPathRepo.save(learningPath);
    return { learningObject, learningPath };
}

async function initPersonalizationTestData(): Promise<{
    learningContent: ConditionTestLearningPathAndLearningObjects;
    studentA: Student;
    studentB: Student;
}> {
    const studentRepo = getStudentRepository()
    const classRepo = getClassRepository();
    const assignmentRepo = getAssignmentRepository();
    const groupRepo = getGroupRepository();
    const submissionRepo = getSubmissionRepository();
    const learningPathRepo = getLearningPathRepository();
    const learningObjectRepo = getLearningObjectRepository();
    const learningContent = createConditionTestLearningPathAndLearningObjects();
    await learningObjectRepo.save(learningContent.branchingObject);
    await learningObjectRepo.save(learningContent.finalObject);
    await learningObjectRepo.save(learningContent.extraExerciseObject);
    await learningPathRepo.save(learningContent.learningPath);

    // Create students
    const studentA = studentRepo.create({
        username: STUDENT_A_USERNAME,
        firstName: 'Aron',
        lastName: 'Student',
    });
    await studentRepo.save(studentA);

    const studentB = studentRepo.create({
        username: STUDENT_B_USERNAME,
        firstName: 'Bill',
        lastName: 'Student',
    });
    await studentRepo.save(studentB);

    // Create class for students
    const testClass = classRepo.create({
        classId: CLASS_NAME,
        displayName: "Test class"
    });
    await classRepo.save(testClass);

    // Create assignment for students and assign them to different groups
    const assignment = assignmentRepo.create({
        id: 0,
        title: "Test assignment",
        description: "Test description",
        learningPathHruid: learningContent.learningPath.hruid,
        learningPathLanguage: learningContent.learningPath.language,
        within: testClass
    })

    const groupA = groupRepo.create({
        groupNumber: 0,
        members: [studentA],
        assignment
    });
    await groupRepo.save(groupA);

    const groupB = groupRepo.create({
        groupNumber: 1,
        members: [studentB],
        assignment
    });
    await groupRepo.save(groupB);

    // Let each of the students make a submission in his own group.
    const submissionA = submissionRepo.create({
        learningObjectHruid: learningContent.branchingObject.hruid,
        learningObjectLanguage: learningContent.branchingObject.language,
        learningObjectVersion: learningContent.branchingObject.version,
        onBehalfOf: groupA,
        submitter: studentA,
        submissionTime: new Date(),
        content: '[0]',
    });
    await submissionRepo.save(submissionA);

    const submissionB = submissionRepo.create({
        learningObjectHruid: learningContent.branchingObject.hruid,
        learningObjectLanguage: learningContent.branchingObject.language,
        learningObjectVersion: learningContent.branchingObject.version,
        onBehalfOf: groupA,
        submitter: studentB,
        submissionTime: new Date(),
        content: '[1]',
    });
    await submissionRepo.save(submissionB);

    return {
        learningContent: learningContent,
        studentA: studentA,
        studentB: studentB,
    };
}

function expectBranchingObjectNode(
    result: LearningPathResponse,
    persTestData: {
        learningContent: ConditionTestLearningPathAndLearningObjects;
        studentA: Student;
        studentB: Student;
    }
): LearningObjectNode {
    const branchingObjectMatches = result.data![0].nodes.filter(
        (it) => it.learningobject_hruid === persTestData.learningContent.branchingObject.hruid
    );
    expect(branchingObjectMatches.length).toBe(1);
    return branchingObjectMatches[0];
}

describe('DatabaseLearningPathProvider', () => {
    let example: { learningObject: LearningObject; learningPath: LearningPath };
    let persTestData: { learningContent: ConditionTestLearningPathAndLearningObjects; studentA: Student; studentB: Student };

    beforeAll(async () => {
        await setupTestApp();
        example = await initExampleData();
        persTestData = await initPersonalizationTestData();
    });

    describe('fetchLearningPaths', () => {
        it('returns the learning path correctly', async () => {
            const result = await databaseLearningPathProvider.fetchLearningPaths(
                [example.learningPath.hruid],
                example.learningPath.language,
                'the source'
            );
            expect(result.success).toBe(true);
            expect(result.data?.length).toBe(1);

            const learningObjectsOnPath = (
                await Promise.all(
                    example.learningPath.nodes.map(async (node) =>
                        learningObjectService.getLearningObjectById({
                            hruid: node.learningObjectHruid,
                            version: node.version,
                            language: node.language,
                        })
                    )
                )
            ).filter((it) => it !== null);

            expectToBeCorrectLearningPath(result.data![0], example.learningPath, learningObjectsOnPath);
        });
        it('returns the correct personalized learning path', async () => {
            // For student A:
            let result = await databaseLearningPathProvider.fetchLearningPaths(
                [persTestData.learningContent.learningPath.hruid],
                persTestData.learningContent.learningPath.language,
                'the source',
                { type: 'student', student: persTestData.studentA }
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // There should be exactly one branching object
            let branchingObject = expectBranchingObjectNode(result, persTestData);

            expect(branchingObject.transitions.filter((it) => it.next.hruid === persTestData.learningContent.finalObject.hruid).length).toBe(0); // StudentA picked the first option, therefore, there should be no direct path to the final object.
            expect(branchingObject.transitions.filter((it) => it.next.hruid === persTestData.learningContent.extraExerciseObject.hruid).length).toBe(
                1
            ); // There should however be a path to the extra exercise object.

            // For student B:
            result = await databaseLearningPathProvider.fetchLearningPaths(
                [persTestData.learningContent.learningPath.hruid],
                persTestData.learningContent.learningPath.language,
                'the source',
                { type: 'student', student: persTestData.studentB }
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // There should still be exactly one branching object
            branchingObject = expectBranchingObjectNode(result, persTestData);

            // However, now the student picks the other option.
            expect(branchingObject.transitions.filter((it) => it.next.hruid === persTestData.learningContent.finalObject.hruid).length).toBe(1); // StudentB picked the second option, therefore, there should be a direct path to the final object.
            expect(branchingObject.transitions.filter((it) => it.next.hruid === persTestData.learningContent.extraExerciseObject.hruid).length).toBe(
                0
            ); // There should not be a path anymore to the extra exercise object.
        });
        it('returns a non-successful response if a non-existing learning path is queried', async () => {
            const result = await databaseLearningPathProvider.fetchLearningPaths(
                [example.learningPath.hruid],
                Language.Abkhazian, // Wrong language
                'the source'
            );

            expect(result.success).toBe(false);
        });
    });

    describe('searchLearningPaths', () => {
        it('returns the correct learning path when queried with a substring of its title', async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                example.learningPath.title.substring(2, 6),
                example.learningPath.language
            );
            expect(result.length).toBe(1);
            expect(result[0].title).toBe(example.learningPath.title);
            expect(result[0].description).toBe(example.learningPath.description);
        });
        it('returns the correct learning path when queried with a substring of the description', async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                example.learningPath.description.substring(5, 12),
                example.learningPath.language
            );
            expect(result.length).toBe(1);
            expect(result[0].title).toBe(example.learningPath.title);
            expect(result[0].description).toBe(example.learningPath.description);
        });
        it('returns an empty result when queried with a text which is not a substring of the title or the description of a learning path', async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                'substring which does not occur in the title or the description of a learning object',
                example.learningPath.language
            );
            expect(result.length).toBe(0);
        });
    });
});
