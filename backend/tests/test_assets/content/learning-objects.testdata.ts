import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { LearningObject, ReturnValue } from '../../../src/entities/content/learning-object.entity';
import { Language } from '../../../src/entities/content/language';
import { DwengoContentType } from '../../../src/services/learning-objects/processing/content-type';

export function makeTestLearningObjects(
    em: EntityManager<IDatabaseDriver<Connection>>
): Array<LearningObject> {
    const returnValue: ReturnValue = new ReturnValue();
    returnValue.callbackSchema = '';
    returnValue.callbackUrl = '';

    const learningObject01 = em.create(LearningObject, {
        hruid: 'id01',
        language: Language.English,
        version: 1,
        admins: [],
        title: 'Undertow',
        description: 'debute',
        contentType: DwengoContentType.TEXT_MARKDOWN,
        keywords: [],
        teacherExclusive: false,
        skosConcepts: [],
        educationalGoals: [],
        copyright: '',
        license: '',
        estimatedTime: 45,
        returnValue: returnValue,
        available: true,
        contentLocation: '',
        attachments: [],
        content: Buffer.from(
            "there's a shadow just behind me, shrouding every step i take, making every promise empty pointing every finger at me"
        )
    });

    const learningObject02 = em.create(LearningObject, {
        hruid: 'id02',
        language: Language.English,
        version: 1,
        admins: [],
        title: 'Aenema',
        description: 'second album',
        contentType: DwengoContentType.TEXT_MARKDOWN,
        keywords: [],
        teacherExclusive: false,
        skosConcepts: [],
        educationalGoals: [],
        copyright: '',
        license: '',
        estimatedTime: 80,
        returnValue: returnValue,
        available: true,
        contentLocation: '',
        attachments: [],
        content: Buffer.from(
            "I've been crawling on my belly clearing out what could've been I've been wallowing in my own confused and insecure delusions"
        ),
    });

    const learningObject03 = em.create(LearningObject, {
        hruid: 'id03',
        language: Language.English,
        version: 1,
        admins: [],
        title: 'love over gold',
        description: 'third album',
        contentType: DwengoContentType.TEXT_MARKDOWN,
        keywords: [],
        teacherExclusive: false,
        skosConcepts: [],
        educationalGoals: [],
        copyright: '',
        license: '',
        estimatedTime: 55,
        returnValue: returnValue,
        available: true,
        contentLocation: '',
        attachments: [],
        content: Buffer.from(
            'he wrote me a prescription, he said you are depressed, \
                    but I am glad you came to see me to get this off your chest, \
                    come back and see me later next patient please \
                    send in another victim of industrial disease'
        ),
    });

    const learningObject04 = em.create(LearningObject, {
        hruid: 'id04',
        language: Language.English,
        version: 1,
        admins: [],
        title: 'making movies',
        description: 'fifth album',
        contentType: DwengoContentType.TEXT_MARKDOWN,
        keywords: [],
        teacherExclusive: false,
        skosConcepts: [],
        educationalGoals: [],
        copyright: '',
        license: '',
        estimatedTime: 55,
        returnValue: returnValue,
        available: true,
        contentLocation: '',
        attachments: [],
        content: Buffer.from(
            'I put my hand upon the lever \
                    Said let it rock and let it roll \
                    I had the one-arm bandit fever \
                    There was an arrow through my heart and my soul'
        ),
    });

    const learningObject05 = em.create(LearningObject, {
        hruid: 'id05',
        language: Language.English,
        version: 1,
        admins: [],
        title: 'on every street',
        description: 'sixth album',
        contentType: DwengoContentType.TEXT_MARKDOWN,
        keywords: [],
        teacherExclusive: false,
        skosConcepts: [],
        educationalGoals: [],
        copyright: '',
        license: '',
        estimatedTime: 55,
        returnValue: returnValue,
        available: true,
        contentLocation: '',
        attachments: [],
        content: Buffer.from(
            'calling Elvis, is anybody home, calling elvis, I am here all alone'
        ),
    });

    return [
        learningObject01,
        learningObject02,
        learningObject03,
        learningObject04,
        learningObject05,
    ];
}
