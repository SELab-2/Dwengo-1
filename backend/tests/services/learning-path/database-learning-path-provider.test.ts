import { beforeAll, describe, expect, it } from 'vitest';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';
import { setupTestApp } from '../../setup-tests';
import { LearningPath } from '../../../src/entities/content/learning-path.entity';
import {
    getLearningObjectRepository,
    getLearningPathRepository,
    getStudentRepository, getSubmissionRepository
} from '../../../src/data/repositories';
import learningObjectExample from '../../test-assets/learning-objects/pn-werkingnotebooks/pn-werkingnotebooks-example';
import learningPathExample from '../../test-assets/learning-paths/pn-werking-example';
import databaseLearningPathProvider from '../../../src/services/learning-paths/database-learning-path-provider';
import { expectToBeCorrectLearningPath } from '../../test-utils/expectations';
import { LearningObjectRepository } from '../../../src/data/content/learning-object-repository';
import learningObjectService from '../../../src/services/learning-objects/learning-object-service';
import { Language } from '../../../src/entities/content/language';
import {
    ConditionTestLearningPathAndLearningObjects,
    createConditionTestLearningPathAndLearningObjects
} from "../../test-assets/learning-paths/test-conditions-example";
import {Student} from "../../../src/entities/users/student.entity";
import {LearningObjectNode, LearningPathResponse} from "../../../src/interfaces/learning-content";

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
    learningContent: ConditionTestLearningPathAndLearningObjects,
    studentA: Student,
    studentB: Student
}> {
    const studentRepo = getStudentRepository();
    const submissionRepo = getSubmissionRepository();
    const learningPathRepo = getLearningPathRepository();
    const learningObjectRepo = getLearningObjectRepository();
    const learningContent = createConditionTestLearningPathAndLearningObjects();
    await learningObjectRepo.save(learningContent.branchingObject);
    await learningObjectRepo.save(learningContent.finalObject);
    await learningObjectRepo.save(learningContent.extraExerciseObject);
    await learningPathRepo.save(learningContent.learningPath);

    console.log(await getSubmissionRepository().findAll({}));

    const studentA = studentRepo.create({
        username: "student_a",
        firstName: "Aron",
        lastName: "Student"
    });
    await studentRepo.save(studentA);
    const submissionA = submissionRepo.create({
        learningObjectHruid: learningContent.branchingObject.hruid,
        learningObjectLanguage: learningContent.branchingObject.language,
        learningObjectVersion: learningContent.branchingObject.version,
        submissionNumber: 0,
        submitter: studentA,
        submissionTime: new Date(),
        content: '[0]'
    });
    await submissionRepo.save(submissionA);

    const studentB = studentRepo.create({
        username: "student_b",
        firstName: "Bill",
        lastName: "Student"
    });
    await studentRepo.save(studentB);
    const submissionB = submissionRepo.create({
        learningObjectHruid: learningContent.branchingObject.hruid,
        learningObjectLanguage: learningContent.branchingObject.language,
        learningObjectVersion: learningContent.branchingObject.version,
        submissionNumber: 1,
        submitter: studentB,
        submissionTime: new Date(),
        content: '[1]'
    });
    await submissionRepo.save(submissionB);

    return {
        learningContent: learningContent,
        studentA: studentA,
        studentB: studentB,
    }
}

function expectBranchingObjectNode(result: LearningPathResponse, persTestData: {
    learningContent: ConditionTestLearningPathAndLearningObjects;
    studentA: Student;
    studentB: Student
}): LearningObjectNode {
    let branchingObjectMatches = result.data![0].nodes.filter(
        it => it.learningobject_hruid === persTestData.learningContent.branchingObject.hruid
    );
    expect(branchingObjectMatches.length).toBe(1);
    return branchingObjectMatches[0];
}

describe('DatabaseLearningPathProvider', () => {
    let learningObjectRepo: LearningObjectRepository;
    let example: { learningObject: LearningObject; learningPath: LearningPath };
    let persTestData: { learningContent: ConditionTestLearningPathAndLearningObjects, studentA: Student, studentB: Student }

    beforeAll(async () => {
        await setupTestApp();
        example = await initExampleData();
        persTestData = await initPersonalizationTestData();
        learningObjectRepo = getLearningObjectRepository();
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
                    example.learningPath.nodes.map((node) =>
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
        it("returns the correct personalized learning path", async () => {
            // For student A:
            let result = await databaseLearningPathProvider.fetchLearningPaths(
                [persTestData.learningContent.learningPath.hruid],
                persTestData.learningContent.learningPath.language,
                'the source',
                {type: 'student', student: persTestData.studentA}
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // There should be exactly one branching object
            let branchingObject = expectBranchingObjectNode(result, persTestData);

            expect(
                branchingObject
                    .transitions
                    .filter(it => it.next.hruid === persTestData.learningContent.finalObject.hruid)
                    .length
            ).toBe(0); // studentA picked the first option, therefore, there should be no direct path to the final object.
            expect(
                branchingObject
                    .transitions
                    .filter(it => it.next.hruid === persTestData.learningContent.extraExerciseObject.hruid)
                    .length
            ).toBe(1); // There should however be a path to the extra exercise object.

            // For student B:
            result = await databaseLearningPathProvider.fetchLearningPaths(
                [persTestData.learningContent.learningPath.hruid],
                persTestData.learningContent.learningPath.language,
                'the source',
                {type: 'student', student: persTestData.studentB}
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // There should still be exactly one branching object
            branchingObject = expectBranchingObjectNode(result, persTestData);

            // However, now the student picks the other option.
            expect(
                branchingObject
                    .transitions
                    .filter(it => it.next.hruid === persTestData.learningContent.finalObject.hruid)
                    .length
            ).toBe(1); // studentB picked the second option, therefore, there should be a direct path to the final object.
            expect(
                branchingObject
                    .transitions
                    .filter(it => it.next.hruid === persTestData.learningContent.extraExerciseObject.hruid)
                    .length
            ).toBe(0); // There should not be a path anymore to the extra exercise object.
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
