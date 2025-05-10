import { beforeAll, describe, expect, it } from 'vitest';
import { LearningObject } from '../../../src/entities/content/learning-object.entity.js';
import { setupTestApp } from '../../setup-tests.js';
import { LearningPath } from '../../../src/entities/content/learning-path.entity.js';
import { getSubmissionRepository } from '../../../src/data/repositories.js';

import databaseLearningPathProvider from '../../../src/services/learning-paths/database-learning-path-provider.js';
import { expectToBeCorrectLearningPath } from '../../test-utils/expectations.js';
import { Language } from '@dwengo-1/common/util/language';

import { LearningObjectNode, LearningPathResponse } from '@dwengo-1/common/interfaces/learning-content';
import {
    testLearningObject01,
    testLearningObjectEssayQuestion,
    testLearningObjectMultipleChoice,
} from '../../test_assets/content/learning-objects.testdata';
import { testLearningPathWithConditions } from '../../test_assets/content/learning-paths.testdata';
import { mapToLearningPath } from '../../../src/services/learning-paths/learning-path-service';
import { getTestGroup01, getTestGroup02 } from '../../test_assets/assignments/groups.testdata';
import { Group } from '../../../src/entities/assignments/group.entity.js';
import { RequiredEntityData } from '@mikro-orm/core';

function expectBranchingObjectNode(result: LearningPathResponse): LearningObjectNode {
    const branchingObjectMatches = result.data![0].nodes.filter((it) => it.learningobject_hruid === testLearningObjectMultipleChoice.hruid);
    expect(branchingObjectMatches.length).toBe(1);
    return branchingObjectMatches[0];
}

describe('DatabaseLearningPathProvider', () => {
    let testLearningPath: LearningPath;
    let branchingLearningObject: RequiredEntityData<LearningObject>;
    let extraExerciseLearningObject: RequiredEntityData<LearningObject>;
    let finalLearningObject: RequiredEntityData<LearningObject>;
    let groupA: Group;
    let groupB: Group;

    beforeAll(async () => {
        await setupTestApp();
        testLearningPath = mapToLearningPath(testLearningPathWithConditions, []);
        branchingLearningObject = testLearningObjectMultipleChoice;
        extraExerciseLearningObject = testLearningObject01;
        finalLearningObject = testLearningObjectEssayQuestion;
        groupA = getTestGroup01();
        groupB = getTestGroup02();

        // Place different submissions for group A and B.
        const submissionRepo = getSubmissionRepository();
        const submissionA = submissionRepo.create({
            learningObjectHruid: branchingLearningObject.hruid,
            learningObjectLanguage: branchingLearningObject.language,
            learningObjectVersion: branchingLearningObject.version,
            content: '[0]',
            onBehalfOf: groupA,
            submissionTime: new Date(),
            submitter: groupA.members[0],
        });
        await submissionRepo.save(submissionA);

        const submissionB = submissionRepo.create({
            learningObjectHruid: branchingLearningObject.hruid,
            learningObjectLanguage: branchingLearningObject.language,
            learningObjectVersion: branchingLearningObject.version,
            content: '[1]',
            onBehalfOf: groupB,
            submissionTime: new Date(),
            submitter: groupB.members[0],
        });
        await submissionRepo.save(submissionB);
    });

    describe('fetchLearningPaths', () => {
        it('returns the learning path correctly', async () => {
            const result = await databaseLearningPathProvider.fetchLearningPaths([testLearningPath.hruid], testLearningPath.language, 'the source');
            expect(result.success).toBe(true);
            expect(result.data?.length).toBe(1);

            expectToBeCorrectLearningPath(result.data![0], testLearningPathWithConditions);
        });
        it('returns the correct personalized learning path', async () => {
            // For student A:
            let result = await databaseLearningPathProvider.fetchLearningPaths(
                [testLearningPath.hruid],
                testLearningPath.language,
                'the source',
                groupA
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // There should be exactly one branching object
            let branchingObject = expectBranchingObjectNode(result);

            expect(branchingObject.transitions.filter((it) => it.next.hruid === finalLearningObject.hruid).length).toBe(0); // StudentA picked the first option, therefore, there should be no direct path to the final object.
            expect(branchingObject.transitions.filter((it) => it.next.hruid === extraExerciseLearningObject.hruid).length).toBe(1); // There should however be a path to the extra exercise object.

            // For student B:
            result = await databaseLearningPathProvider.fetchLearningPaths([testLearningPath.hruid], testLearningPath.language, 'the source', groupB);
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // There should still be exactly one branching object
            branchingObject = expectBranchingObjectNode(result);

            // However, now the student picks the other option.
            expect(branchingObject.transitions.filter((it) => it.next.hruid === finalLearningObject.hruid).length).toBe(1); // StudentB picked the second option, therefore, there should be a direct path to the final object.
            expect(branchingObject.transitions.filter((it) => it.next.hruid === extraExerciseLearningObject.hruid).length).toBe(0); // There should not be a path anymore to the extra exercise object.
        });
        it('returns a non-successful response if a non-existing learning path is queried', async () => {
            const result = await databaseLearningPathProvider.fetchLearningPaths(
                [testLearningPath.hruid],
                Language.Abkhazian, // Wrong language
                'the source'
            );

            expect(result.success).toBe(false);
        });
    });

    describe('searchLearningPaths', () => {
        it('returns the correct learning path when queried with a substring of its title', async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(testLearningPath.title.substring(2, 6), testLearningPath.language);
            expect(result.length).toBe(1);
            expect(result[0].title).toBe(testLearningPath.title);
            expect(result[0].description).toBe(testLearningPath.description);
        });
        it('returns the correct learning path when queried with a substring of the description', async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                testLearningPath.description.substring(5, 12),
                testLearningPath.language
            );
            expect(result.length).toBe(1);
            expect(result[0].title).toBe(testLearningPath.title);
            expect(result[0].description).toBe(testLearningPath.description);
        });
        it('returns an empty result when queried with a text which is not a substring of the title or the description of a learning path', async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                'substring which does not occur in the title or the description of a learning object',
                testLearningPath.language
            );
            expect(result.length).toBe(0);
        });
    });
});
