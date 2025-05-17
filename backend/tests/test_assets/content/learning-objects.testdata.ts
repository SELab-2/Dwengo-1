import { EntityManager, RequiredEntityData } from '@mikro-orm/core';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';
import { Language } from '@dwengo-1/common/util/language';
import { DwengoContentType } from '../../../src/services/learning-objects/processing/content-type';
import { ReturnValue } from '../../../src/entities/content/return-value.entity';
import { envVars, getEnvVar } from '../../../src/util/envVars';
import { loadTestAsset } from '../../test-utils/load-test-asset';
import { v4 } from 'uuid';

export function makeTestLearningObjects(em: EntityManager): LearningObject[] {
    const returnValue: ReturnValue = new ReturnValue();
    returnValue.callbackSchema = '';
    returnValue.callbackUrl = '';

    const learningObject01 = em.create(LearningObject, testLearningObject01);
    const learningObject02 = em.create(LearningObject, testLearningObject02);
    const learningObject03 = em.create(LearningObject, testLearningObject03);
    const learningObject04 = em.create(LearningObject, testLearningObject04);
    const learningObject05 = em.create(LearningObject, testLearningObject05);

    const learningObjectMultipleChoice = em.create(LearningObject, testLearningObjectMultipleChoice);
    const learningObjectEssayQuestion = em.create(LearningObject, testLearningObjectEssayQuestion);

    const learningObjectPnNotebooks = em.create(LearningObject, testLearningObjectPnNotebooks);

    return [
        learningObject01,
        learningObject02,
        learningObject03,
        learningObject04,
        learningObject05,
        learningObjectMultipleChoice,
        learningObjectEssayQuestion,
        learningObjectPnNotebooks,
    ];
}

export function createReturnValue(): ReturnValue {
    const returnValue: ReturnValue = new ReturnValue();
    returnValue.callbackSchema = '[]';
    returnValue.callbackUrl = '%SUBMISSION%';
    return returnValue;
}

export const testLearningObject01: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}id01`,
    language: Language.English,
    version: 1,
    admins: [],
    title: 'Undertow',
    description: 'debute',
    contentType: DwengoContentType.TEXT_MARKDOWN,
    keywords: [],
    uuid: v4(),
    targetAges: [16, 17, 18],
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: [],
    copyright: '',
    license: '',
    estimatedTime: 45,
    returnValue: createReturnValue(),
    available: true,
    contentLocation: '',
    attachments: [],
    content: Buffer.from("there's a shadow just behind me, shrouding every step i take, making every promise empty pointing every finger at me"),
};

export const testLearningObject02: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}id02`,
    language: Language.English,
    version: 1,
    admins: [],
    title: 'Aenema',
    description: 'second album',
    contentType: DwengoContentType.TEXT_MARKDOWN,
    keywords: [],
    uuid: v4(),
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: [],
    copyright: '',
    license: '',
    estimatedTime: 80,
    returnValue: createReturnValue(),
    available: true,
    contentLocation: '',
    attachments: [],
    content: Buffer.from(
        "I've been crawling on my belly clearing out what could've been I've been wallowing in my own confused and insecure delusions"
    ),
};

export const testLearningObject03: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}id03`,
    language: Language.English,
    version: 1,
    admins: [],
    title: 'love over gold',
    description: 'third album',
    contentType: DwengoContentType.TEXT_MARKDOWN,
    keywords: [],
    uuid: v4(),
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: [],
    copyright: '',
    license: '',
    estimatedTime: 55,
    returnValue: createReturnValue(),
    available: true,
    contentLocation: '',
    attachments: [],
    content: Buffer.from(
        'he wrote me a prescription, he said you are depressed, \
         but I am glad you came to see me to get this off your chest, \
         come back and see me later next patient please \
         send in another victim of industrial disease'
    ),
};

export const testLearningObject04: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}id04`,
    language: Language.English,
    version: 1,
    admins: [],
    title: 'making movies',
    description: 'fifth album',
    contentType: DwengoContentType.TEXT_MARKDOWN,
    keywords: [],
    uuid: v4(),
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: [],
    copyright: '',
    license: '',
    estimatedTime: 55,
    returnValue: createReturnValue(),
    available: true,
    contentLocation: '',
    attachments: [],
    content: Buffer.from(
        'I put my hand upon the lever \
         Said let it rock and let it roll \
         I had the one-arm bandit fever \
         There was an arrow through my heart and my soul'
    ),
};

export const testLearningObject05: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}id05`,
    language: Language.English,
    version: 1,
    admins: [],
    title: 'on every street',
    description: 'sixth album',
    contentType: DwengoContentType.TEXT_MARKDOWN,
    keywords: [],
    uuid: v4(),
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: [],
    copyright: '',
    license: '',
    estimatedTime: 55,
    returnValue: createReturnValue(),
    available: true,
    contentLocation: '',
    attachments: [],
    content: Buffer.from('calling Elvis, is anybody home, calling elvis, I am here all alone'),
};

export const testLearningObjectMultipleChoice: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}test_multiple_choice`,
    language: Language.English,
    version: 1,
    title: 'Self-evaluation',
    description: "Time to evaluate how well you understand what you've learned so far.",
    keywords: ['test'],
    uuid: v4(),
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: [],
    copyright: 'Groep 1 SEL-2 2025',
    license: 'CC0',
    difficulty: 1,
    estimatedTime: 1,
    attachments: [],
    available: true,
    targetAges: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    admins: [],
    contentType: DwengoContentType.GIFT,
    content: loadTestAsset('content/learning-object-resources/test_multiple_choice/content.txt'),
    returnValue: {
        callbackUrl: `%SUBMISSION%`,
        callbackSchema: '["antwoord vraag 1"]',
    },
};

export const testLearningObjectEssayQuestion: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}test_essay_question`,
    language: Language.English,
    version: 1,
    title: 'Reflection',
    description: 'Reflect on your learning progress.',
    keywords: ['test'],
    uuid: v4(),
    teacherExclusive: false,
    skosConcepts: [],
    educationalGoals: [],
    copyright: 'Groep 1 SEL-2 2025',
    license: 'CC0',
    difficulty: 1,
    estimatedTime: 1,
    attachments: [],
    available: true,
    targetAges: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    admins: [],
    contentType: DwengoContentType.GIFT,
    content: loadTestAsset('content/learning-object-resources/test_essay_question/content.txt'),
    returnValue: {
        callbackUrl: `%SUBMISSION%`,
        callbackSchema: '["antwoord vraag 1"]',
    },
};

export const testLearningObjectPnNotebooks: RequiredEntityData<LearningObject> = {
    hruid: `${getEnvVar(envVars.UserContentPrefix)}pn_werkingnotebooks`,
    version: 3,
    language: Language.Dutch,
    title: 'Werken met notebooks',
    description: 'Leren werken met notebooks',
    keywords: ['Python', 'KIKS', 'Wiskunde', 'STEM', 'AI'],
    targetAges: [14, 15, 16, 17, 18],
    admins: [],
    copyright: 'dwengo',
    educationalGoals: [],
    license: 'dwengo',
    contentType: DwengoContentType.TEXT_MARKDOWN,
    difficulty: 3,
    estimatedTime: 10,
    uuid: '2adf9929-b424-4650-bf60-186f730d38ab',
    teacherExclusive: false,
    skosConcepts: [
        'http://ilearn.ilabt.imec.be/vocab/curr1/s-vaktaal',
        'http://ilearn.ilabt.imec.be/vocab/curr1/s-digitale-media-en-toepassingen',
        'http://ilearn.ilabt.imec.be/vocab/curr1/s-computers-en-systemen',
    ],
    attachments: [
        {
            name: 'dwengo.png',
            mimeType: 'image/png',
            content: loadTestAsset('/content/learning-object-resources/pn_werkingnotebooks/dwengo.png'),
        },
        {
            name: 'Knop.png',
            mimeType: 'image/png',
            content: loadTestAsset('/content/learning-object-resources/pn_werkingnotebooks/Knop.png'),
        },
    ],
    available: false,
    content: loadTestAsset('/content/learning-object-resources/pn_werkingnotebooks/content.md'),
    returnValue: {
        callbackUrl: '%SUBMISSION%',
        callbackSchema: '[]',
    },
};
