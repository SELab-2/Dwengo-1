import { Language } from '../src/entities/content/language.js';
import { ContentType, LearningObject, ReturnValue } from '../src/entities/content/learning-object.entity.js';
import { Student } from '../src/entities/users/student.entity.js';
import { Teacher } from '../src/entities/users/teacher.entity.js';
import { forkEntityManager, initORM } from '../src/orm.js';
import dotenv from 'dotenv';

export async function setupTestApp() {
    dotenv.config({ path: '.env.test' });
    await initORM(true);

    const em = forkEntityManager();

    const student01 = em.create(Student, {username: 'Noordkaap', firstName: 'Stijn', lastName: 'Meuris'});
    const student02 = em.create(Student, {username: 'DireStraits', firstName: 'Mark', lastName: 'Knopfler'});
    const student03 = em.create(Student, {username: 'SmashingPumpkins', firstName: 'Billy', lastName: 'Corgan'});

    await em.persistAndFlush([student01, student02, student03]);

    const teacher01 = em.create(Teacher, {username: 'Tool', firstName: 'Maynard', lastName: 'Keenan'});
    const teacher02 = em.create(Teacher, { username: 'Staind', firstName: 'Aaron', lastName: 'Lewis'});
    const teacher03 = em.create(Teacher, { username: 'TheDoors', firstName: 'Jim', lastName: 'Morrison'});

    await em.persistAndFlush([teacher01, teacher02, teacher03]);

    const admins01 = [teacher01];
    const returnValue = new ReturnValue();
    returnValue.callbackSchema = '';
    returnValue.callbackUrl = '';
    const buffer01 = new Buffer("there's a shadow just behind me, shrouding every step i take, making every promise empty pointing every finger at me");
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
        content: buffer01
    });

    const admins02 = [teacher02];
    const buffer02 = new Buffer("cause it's always raining in my head, forget all the things I should have had said so I speak to you in riddles, because my words get in my way")
    const learningObject02 = em.create(LearningObject, {
        hruid: 'hruid_object02',
        language: Language.English,
        version: '1',
        admins: admins02,
        title: 'Break the cycle',
        description: 'second album',
        contentType: ContentType.Markdown,
        keywords: ["music"],
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
        content: buffer02
    });

    await em.persistAndFlush([learningObject01, learningObject02]);

}
