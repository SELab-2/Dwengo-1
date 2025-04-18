import { EntityManager } from '@mikro-orm/core';
import { LearningPath } from '../../../src/entities/content/learning-path.entity';
import { Language } from '@dwengo-1/common/util/language';
import { mapToLearningPath } from '../../../src/services/learning-paths/learning-path-service';
import { envVars, getEnvVar } from '../../../src/util/envVars';
import { LearningPath as LearningPathDTO } from '@dwengo-1/common/interfaces/learning-content';
import {
    testLearningObject01,
    testLearningObject02,
    testLearningObject03,
    testLearningObject04,
    testLearningObject05,
    testLearningObjectEssayQuestion,
    testLearningObjectMultipleChoice,
    testLearningObjectPnNotebooks,
} from './learning-objects.testdata';

export function makeTestLearningPaths(_em: EntityManager): LearningPath[] {
    const learningPath01 = mapToLearningPath(testLearningPath01, []);
    const learningPath02 = mapToLearningPath(testLearningPath02, []);

    const partiallyDatabasePartiallyDwengoApiLearningPath = mapToLearningPath(testPartiallyDatabaseAndPartiallyDwengoApiLearningPath, []);
    const learningPathWithConditions = mapToLearningPath(testLearningPathWithConditions, []);

    return [learningPath01, learningPath02, partiallyDatabasePartiallyDwengoApiLearningPath, learningPathWithConditions];
}

const nowString = new Date().toString();

export const testLearningPath01: LearningPathDTO = {
    keywords: 'test',
    target_ages: [16, 17, 18],
    hruid: `${getEnvVar(envVars.UserContentPrefix)}id01`,
    language: Language.English,
    title: 'repertoire Tool',
    description: 'all about Tool',
    nodes: [
        {
            learningobject_hruid: testLearningObject01.hruid,
            language: testLearningObject01.language,
            version: testLearningObject01.version,
            start_node: true,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [
                {
                    next: {
                        hruid: testLearningObject02.hruid,
                        language: testLearningObject02.language,
                        version: testLearningObject02.version,
                    },
                },
            ],
        },
        {
            learningobject_hruid: testLearningObject02.hruid,
            language: testLearningObject02.language,
            version: testLearningObject02.version,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [],
        },
    ],
};

export const testLearningPath02: LearningPathDTO = {
    keywords: 'test',
    target_ages: [16, 17, 18],
    hruid: `${getEnvVar(envVars.UserContentPrefix)}id02`,
    language: Language.English,
    title: 'repertoire Dire Straits',
    description: 'all about Dire Straits',
    nodes: [
        {
            learningobject_hruid: testLearningObject03.hruid,
            language: testLearningObject03.language,
            version: testLearningObject03.version,
            start_node: true,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [
                {
                    next: {
                        hruid: testLearningObject04.hruid,
                        language: testLearningObject04.language,
                        version: testLearningObject04.version,
                    },
                },
            ],
        },
        {
            learningobject_hruid: testLearningObject04.hruid,
            language: testLearningObject04.language,
            version: testLearningObject04.version,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [
                {
                    next: {
                        hruid: testLearningObject05.hruid,
                        language: testLearningObject05.language,
                        version: testLearningObject05.version,
                    },
                },
            ],
        },
        {
            learningobject_hruid: testLearningObject05.hruid,
            language: testLearningObject05.language,
            version: testLearningObject05.version,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [],
        },
    ],
};

export const testPartiallyDatabaseAndPartiallyDwengoApiLearningPath: LearningPathDTO = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}pn_werking`,
    title: 'Werken met notebooks',
    language: Language.Dutch,
    description: 'Een korte inleiding tot Python notebooks. Hoe ga je gemakkelijk en efficiënt met de notebooks aan de slag?',
    keywords: 'Python KIKS Wiskunde STEM AI',
    target_ages: [14, 15, 16, 17, 18],
    nodes: [
        {
            learningobject_hruid: testLearningObjectPnNotebooks.hruid,
            language: testLearningObjectPnNotebooks.language,
            version: testLearningObjectPnNotebooks.version,
            start_node: true,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [
                {
                    default: true,
                    next: {
                        hruid: 'pn_werkingnotebooks2',
                        language: Language.Dutch,
                        version: 3,
                    },
                },
            ],
        },
        {
            learningobject_hruid: 'pn_werkingnotebooks2',
            language: Language.Dutch,
            version: 3,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [
                {
                    default: true,
                    next: {
                        hruid: 'pn_werkingnotebooks3',
                        language: Language.Dutch,
                        version: 3,
                    },
                },
            ],
        },
        {
            learningobject_hruid: 'pn_werkingnotebooks3',
            language: Language.Dutch,
            version: 3,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [],
        },
    ],
};

export const testLearningPathWithConditions: LearningPathDTO = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}test_conditions`,
    language: Language.English,
    title: 'Example learning path with conditional transitions',
    description: 'This learning path was made for the purpose of testing conditional transitions',
    keywords: 'test',
    target_ages: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    nodes: [
        {
            learningobject_hruid: testLearningObjectMultipleChoice.hruid,
            language: testLearningObjectMultipleChoice.language,
            version: testLearningObjectMultipleChoice.version,
            start_node: true,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [
                {
                    // If the answer to the first question was the first one (It's difficult to follow along):
                    condition: '$[?(@[0] == 0)]',
                    next: {
                        //... we let the student do an extra exercise.
                        hruid: testLearningObject01.hruid,
                        language: testLearningObject01.language,
                        version: testLearningObject01.version,
                    },
                },
                {
                    // If the answer to the first question was the second one (I can follow along):
                    condition: '$[?(@[0] == 1)]',
                    next: {
                        //... we let the student right through to the final question.
                        hruid: testLearningObjectEssayQuestion.hruid,
                        language: testLearningObjectEssayQuestion.language,
                        version: testLearningObjectEssayQuestion.version,
                    },
                },
            ],
        },
        {
            learningobject_hruid: testLearningObject01.hruid,
            language: testLearningObject01.language,
            version: testLearningObject01.version,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [
                {
                    default: true,
                    next: {
                        hruid: testLearningObjectEssayQuestion.hruid,
                        language: testLearningObjectEssayQuestion.language,
                        version: testLearningObjectEssayQuestion.version,
                    },
                },
            ],
        },
        {
            learningobject_hruid: testLearningObjectEssayQuestion.hruid,
            language: testLearningObjectEssayQuestion.language,
            version: testLearningObjectEssayQuestion.version,
            created_at: nowString,
            updatedAt: nowString,
            transitions: [],
        },
    ],
};
