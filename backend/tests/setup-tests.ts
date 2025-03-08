import { Class } from '../src/entities/classes/class.entity.js';
import { Language } from '../src/entities/content/language.js';
import {
    ContentType,
    LearningObject,
    ReturnValue,
} from '../src/entities/content/learning-object.entity.js';
import {
    LearningPath,
    LearningPathNode,
    LearningPathTransition,
} from '../src/entities/content/learning-path.entity.js';
import { Student } from '../src/entities/users/student.entity.js';
import { Teacher } from '../src/entities/users/teacher.entity.js';
import { forkEntityManager, initORM } from '../src/orm.js';
import dotenv from 'dotenv';

export async function setupTestApp() {
    dotenv.config({ path: '.env.test' });
    await initORM(true);

    const em = forkEntityManager();

    const student01 = em.create(Student, {
        username: 'Noordkaap',
        firstName: 'Stijn',
        lastName: 'Meuris',
    });
    const student02 = em.create(Student, {
        username: 'DireStraits',
        firstName: 'Mark',
        lastName: 'Knopfler',
    });
    const student03 = em.create(Student, {
        username: 'SmashingPumpkins',
        firstName: 'Billy',
        lastName: 'Corgan',
    });

    await em.persistAndFlush([student01, student02, student03]);

    const teacher01 = em.create(Teacher, {
        username: 'Tool',
        firstName: 'Maynard',
        lastName: 'Keenan',
    });
    const teacher02 = em.create(Teacher, {
        username: 'Staind',
        firstName: 'Aaron',
        lastName: 'Lewis',
    });
    const teacher03 = em.create(Teacher, {
        username: 'TheDoors',
        firstName: 'Jim',
        lastName: 'Morrison',
    });

    await em.persistAndFlush([teacher01, teacher02, teacher03]);

    const admins01: Array<Teacher> = [teacher01];
    const returnValue: ReturnValue = new ReturnValue();
    returnValue.callbackSchema = '';
    returnValue.callbackUrl = '';
    const buffer01: Buffer = new Buffer(
        "there's a shadow just behind me, shrouding every step i take, making every promise empty pointing every finger at me"
    );
    const learningObject01 = em.create(LearningObject, {
        hruid: 'hruid_object01',
        language: Language.English,
        version: '1',
        admins: admins01,
        title: 'Undertow',
        description: 'debute',
        contentType: ContentType.Markdown,
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
        content: buffer01,
    });

    const buffer02 = new Buffer(
        "I've been crawling on my belly clearing out what could've been I've been wallowing in my own confused and insecure delusions"
    );
    const learningObject02 = em.create(LearningObject, {
        hruid: 'hruid_object02',
        language: Language.English,
        version: '1',
        admins: admins01,
        title: 'Aenema',
        description: 'second album',
        contentType: ContentType.Markdown,
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
        content: buffer02,
    });

    const admins03: Array<Teacher> = [teacher02];
    const buffer03 = new Buffer(
        "cause it's always raining in my head, forget all the things I should have had said so I speak to you in riddles, because my words get in my way"
    );
    const learningObject03 = em.create(LearningObject, {
        hruid: 'hruid_object03',
        language: Language.English,
        version: '1',
        admins: admins03,
        title: 'Break the cycle',
        description: 'second album',
        contentType: ContentType.Markdown,
        keywords: ['music'],
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
        content: buffer03,
    });

    await em.persistAndFlush([
        learningObject01,
        learningObject02,
        learningObject03,
    ]);

    const learningPathNode01: LearningPathNode = new LearningPathNode();
    const learningPathNode02: LearningPathNode = new LearningPathNode();

    const transitions01: LearningPathTransition = new LearningPathTransition();
    const transitions02: LearningPathTransition = new LearningPathTransition();

    transitions01.condition = 'true';
    transitions01.next = learningPathNode02;

    transitions02.condition = 'true';
    transitions02.next = learningPathNode01;

    learningPathNode01.instruction = '';
    learningPathNode01.language = Language.English;
    learningPathNode01.learningObjectHruid = 'hruid_object01';
    learningPathNode01.startNode = true;
    learningPathNode01.transitions = [transitions01];
    learningPathNode01.version = '1';

    learningPathNode02.instruction = '';
    learningPathNode02.language = Language.English;
    learningPathNode02.learningObjectHruid = 'hruid_object02';
    learningPathNode02.startNode = false;
    learningPathNode02.transitions = [transitions02];
    learningPathNode02.version = '1';

    const nodes: Array<LearningPathNode> = [];
    const learningPath01 = em.create(LearningPath, {
        hruid: 'hruid_path01',
        language: Language.English,
        admins: admins01,
        title: 'repertoire Tool',
        description: 'all about Tool',
        image: '',
        nodes: nodes,
    });

    await em.persistAndFlush([learningPath01]);

    const students: Array<Student> = [student01, student02];

    // gets deleted in test, do not use in other tests
    const class01 = em.create(Class, {
        classId: 'class_id01',
        displayName: 'class01',
        teachers: admins01,
        students: students,
    });

    const class02 = em.create(Class, {
        classId: 'class_id02',
        displayName: 'class02',
        teachers: admins01,
        students: students,
    });

    await em.persistAndFlush([class01, class02]);
}
