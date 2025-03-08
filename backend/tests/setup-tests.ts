import { Assignment } from '../src/entities/assignments/assignment.entity.js';
import { Group } from '../src/entities/assignments/group.entity.js';
import { Submission } from '../src/entities/assignments/submission.entity.js';
import {
    ClassJoinRequest,
    ClassJoinRequestStatus,
} from '../src/entities/classes/class-join-request.entity.js';
import { Class } from '../src/entities/classes/class.entity.js';
import { TeacherInvitation } from '../src/entities/classes/teacher-invitation.entity.js';
import { Attachment } from '../src/entities/content/attachment.entity.js';
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
import { Answer } from '../src/entities/questions/answer.entity.js';
import { Question } from '../src/entities/questions/question.entity.js';
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
        username: 'Tool',
        firstName: 'Maynard',
        lastName: 'Keenan',
    });

    const student04 = em.create(Student, {
        username: 'SmashingPumpkins',
        firstName: 'Billy',
        lastName: 'Corgan',
    });

    const student05 = em.create(Student, {
        username: 'PinkFloyd',
        firstName: 'David',
        lastName: 'Gilmoure',
    });

    const student06 = em.create(Student, {
        username: 'TheDoors',
        firstName: 'Jim',
        lastName: 'Morisson',
    });

    const student07 = em.create(Student, {
        username: 'Nirvana',
        firstName: 'Kurt',
        lastName: 'Cobain',
    });

    const teacher01 = em.create(Teacher, {
        username: 'FooFighters',
        firstName: 'Dave',
        lastName: 'Grohl',
    });

    const teacher02 = em.create(Teacher, {
        username: 'LimpBizkit',
        firstName: 'Fred',
        lastName: 'Durst',
    });

    const teacher03 = em.create(Teacher, {
        username: 'Staind',
        firstName: 'Aaron',
        lastName: 'Lewis',
    });

    const teacher04 = em.create(Teacher, {
        username: 'ZesdeMetaal',
        firstName: 'Wannes',
        lastName: 'Cappelle',
    });

    const returnValue: ReturnValue = new ReturnValue();
    returnValue.callbackSchema = '';
    returnValue.callbackUrl = '';
    const learningObject01 = em.create(LearningObject, {
        hruid: 'id01',
        language: Language.English,
        version: '1',
        admins: [],
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
        content: Buffer.from(
            "there's a shadow just behind me, shrouding every step i take, making every promise empty pointing every finger at me"
        ),
    });

    const learningObject02 = em.create(LearningObject, {
        hruid: 'id02',
        language: Language.English,
        version: '1',
        admins: [],
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
        content: Buffer.from(
            "I've been crawling on my belly clearing out what could've been I've been wallowing in my own confused and insecure delusions"
        ),
    });

    const learningObject03 = em.create(LearningObject, {
        hruid: 'id03',
        language: Language.English,
        version: '1',
        admins: [],
        title: 'love over gold',
        description: 'third album',
        contentType: ContentType.Markdown,
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
        version: '1',
        admins: [],
        title: 'making movies',
        description: 'fifth album',
        contentType: ContentType.Markdown,
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
        version: '1',
        admins: [],
        title: 'on every street',
        description: 'sixth album',
        contentType: ContentType.Markdown,
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

    const learningPathNode01: LearningPathNode = new LearningPathNode();
    const learningPathNode02: LearningPathNode = new LearningPathNode();
    const learningPathNode03: LearningPathNode = new LearningPathNode();
    const learningPathNode04: LearningPathNode = new LearningPathNode();
    const learningPathNode05: LearningPathNode = new LearningPathNode();

    const transitions01: LearningPathTransition = new LearningPathTransition();
    const transitions02: LearningPathTransition = new LearningPathTransition();
    const transitions03: LearningPathTransition = new LearningPathTransition();
    const transitions04: LearningPathTransition = new LearningPathTransition();
    const transitions05: LearningPathTransition = new LearningPathTransition();

    transitions01.condition = 'true';
    transitions01.next = learningPathNode02;

    transitions02.condition = 'true';
    transitions02.next = learningPathNode02;

    transitions03.condition = 'true';
    transitions03.next = learningPathNode04;

    transitions04.condition = 'true';
    transitions04.next = learningPathNode05;

    transitions05.condition = 'true';
    transitions05.next = learningPathNode05;

    learningPathNode01.instruction = '';
    learningPathNode01.language = Language.English;
    learningPathNode01.learningObjectHruid = 'id01';
    learningPathNode01.startNode = true;
    learningPathNode01.transitions = [transitions01];
    learningPathNode01.version = '1';

    learningPathNode02.instruction = '';
    learningPathNode02.language = Language.English;
    learningPathNode02.learningObjectHruid = 'id02';
    learningPathNode02.startNode = false;
    learningPathNode02.transitions = [transitions02];
    learningPathNode02.version = '1';

    learningPathNode03.instruction = '';
    learningPathNode03.language = Language.English;
    learningPathNode03.learningObjectHruid = 'id03';
    learningPathNode03.startNode = true;
    learningPathNode03.transitions = [transitions03];
    learningPathNode03.version = '1';

    learningPathNode04.instruction = '';
    learningPathNode04.language = Language.English;
    learningPathNode04.learningObjectHruid = 'id04';
    learningPathNode04.startNode = false;
    learningPathNode04.transitions = [transitions04];
    learningPathNode04.version = '1';

    learningPathNode05.instruction = '';
    learningPathNode05.language = Language.English;
    learningPathNode05.learningObjectHruid = 'id05';
    learningPathNode05.startNode = false;
    learningPathNode05.transitions = [transitions05];
    learningPathNode05.version = '1';

    const nodes01: Array<LearningPathNode> = [
        // learningPathNode01,
        // learningPathNode02,
    ];
    const learningPath01 = em.create(LearningPath, {
        hruid: 'id01',
        language: Language.English,
        admins: [],
        title: 'repertoire Tool',
        description: 'all about Tool',
        image: '',
        nodes: nodes01,
    });

    const nodes02: Array<LearningPathNode> = [
        // learningPathNode03,
        // learningPathNode04,
        // learningPathNode05,
    ];
    const learningPath02 = em.create(LearningPath, {
        hruid: 'id02',
        language: Language.English,
        admins: [],
        title: 'repertoire Dire Straits',
        description: 'all about Dire Straits',
        image: '',
        nodes: nodes02,
    });

    const studentsClass01: Array<Student> = [
        student01,
        student02,
        student03,
        student04,
        student05,
        student06,
    ];
    const teacherClass01: Array<Teacher> = [teacher01];

    const class01 = em.create(Class, {
        classId: 'id01',
        displayName: 'class01',
        teachers: teacherClass01,
        students: studentsClass01,
    });

    const studentsClass02: Array<Student> = [student01, student02, student04];
    const teacherClass02: Array<Teacher> = [teacher02];
    const class02 = em.create(Class, {
        classId: 'id02',
        displayName: 'class02',
        teachers: teacherClass02,
        students: studentsClass02,
    });

    const studentsClass03: Array<Student> = [student02, student03, student04];
    const teacherClass03: Array<Teacher> = [teacher03];
    const class03 = em.create(Class, {
        classId: 'id03',
        displayName: 'class03',
        teachers: teacherClass03,
        students: studentsClass03,
    });

    const studentsClass04: Array<Student> = [student01, student02];
    const teacherClass04: Array<Teacher> = [teacher03];
    const class04 = em.create(Class, {
        classId: 'id04',
        displayName: 'class04',
        teachers: teacherClass04,
        students: studentsClass04,
    });

    // const assignment01 = em.create(Assignment, {
    //     within: class01,
    //     id: 1,
    //     title: 'dire straits',
    //     description: 'reading',
    //     learningPathHruid: 'id02',
    //     learningPathLanguage: Language.English,
    //     groups: [],
    // });

    // const assignment02 = em.create(Assignment, {
    //     within: class02,
    //     id: 2,
    //     title: 'tool',
    //     description: 'reading',
    //     learningPathHruid: 'id01',
    //     learningPathLanguage: Language.English,
    //     groups: [],
    // });

    // const assignment03 = em.create(Assignment, {
    //     within: class01,
    //     id: 3,
    //     title: 'delete',
    //     description: 'will be deleted',
    //     learningPathHruid: 'id02',
    //     learningPathLanguage: Language.English,
    //     groups: [],
    // });

    // const group01 = em.create(Group, {
    //     assignment: assignment01,
    //     groupNumber: 1,
    //     members: [student01, student02],
    // });

    // const group02 = em.create(Group, {
    //     assignment: assignment01,
    //     groupNumber: 2,
    //     members: [student03, student04],
    // });

    // const group03 = em.create(Group, {
    //     assignment: assignment01,
    //     groupNumber: 3,
    //     members: [student05, student06],
    // });

    // const group04 = em.create(Group, {
    //     assignment: assignment02,
    //     groupNumber: 1,
    //     members: [student04],
    // });

    // assignment01.groups.push(group01);
    // assignment01.groups.push(group02);
    // assignment01.groups.push(group03);
    // assignment02.groups.push(group04);

    const teacherInvitation01 = em.create(TeacherInvitation, {
        sender: teacher02,
        receiver: teacher01,
        class: class02,
    });

    const teacherInvitation02 = em.create(TeacherInvitation, {
        sender: teacher02,
        receiver: teacher03,
        class: class02,
    });

    const teacherInvitation03 = em.create(TeacherInvitation, {
        sender: teacher03,
        receiver: teacher01,
        class: class03,
    });

    const teacherInvitation04 = em.create(TeacherInvitation, {
        sender: teacher01,
        receiver: teacher02,
        class: class01,
    });

    const classJoinRequest01 = em.create(ClassJoinRequest, {
        requester: student05,
        class: class02,
        status: ClassJoinRequestStatus.Open,
    });

    const classJoinRequest02 = em.create(ClassJoinRequest, {
        requester: student03,
        class: class02,
        status: ClassJoinRequestStatus.Open,
    });

    const classJoinRequest03 = em.create(ClassJoinRequest, {
        requester: student05,
        class: class03,
        status: ClassJoinRequestStatus.Open,
    });

    const classJoinRequest04 = em.create(ClassJoinRequest, {
        requester: student04,
        class: class03,
        status: ClassJoinRequestStatus.Open,
    });

    const attachment01 = em.create(Attachment, {
        learningObject: learningObject02,
        sequenceNumber: 1,
        mimeType: '',
        content: Buffer.from(''),
    });

    learningObject02.attachments = [attachment01];

    // const question01 = em.create(Question, {
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     learningObjectHruid: 'id05',
    //     sequenceNumber: 1,
    //     author: student01,
    //     timestamp: new Date(),
    //     content: 'question',
    // });

    // const question02 = em.create(Question, {
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     learningObjectHruid: 'id05',
    //     sequenceNumber: 2,
    //     author: student03,
    //     timestamp: new Date(),
    //     content: 'question',
    // });

    // const question03 = em.create(Question, {
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     learningObjectHruid: 'id04',
    //     sequenceNumber: 1,
    //     author: student01,
    //     timestamp: new Date(),
    //     content: 'question',
    // });

    // const question04 = em.create(Question, {
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     learningObjectHruid: 'id01',
    //     sequenceNumber: 1,
    //     author: student02,
    //     timestamp: new Date(),
    //     content: 'question',
    // });

    // const answer01 = em.create(Answer, {
    //     author: teacher01,
    //     toQuestion: question02,
    //     sequenceNumber: 1,
    //     timestamp: new Date(),
    //     content: 'answer',
    // });

    // const answer02 = em.create(Answer, {
    //     author: teacher01,
    //     toQuestion: question02,
    //     sequenceNumber: 2,
    //     timestamp: new Date(),
    //     content: 'answer2',
    // });

    // const answer03 = em.create(Answer, {
    //     author: teacher02,
    //     toQuestion: question04,
    //     sequenceNumber: 1,
    //     timestamp: new Date(),
    //     content: 'answer',
    // });

    // const submission01 = em.create(Submission, {
    //     learningObjectHruid: 'id03',
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     submissionNumber: 1,
    //     submitter: student01,
    //     submissionTime: new Date(2025, 2, 20),
    //     onBehalfOf: group01,
    //     content: '',
    // });

    // const submission02 = em.create(Submission, {
    //     learningObjectHruid: 'id03',
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     submissionNumber: 1,
    //     submitter: student01,
    //     submissionTime: new Date(2025, 2, 25),
    //     onBehalfOf: group01,
    //     content: '',
    // });

    // const submission03 = em.create(Submission, {
    //     learningObjectHruid: 'id02',
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     submissionNumber: 1,
    //     submitter: student01,
    //     submissionTime: new Date(2025, 2, 20),
    //     content: '',
    // });

    // const submission04 = em.create(Submission, {
    //     learningObjectHruid: 'id02',
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     submissionNumber: 1,
    //     submitter: student01,
    //     submissionTime: new Date(2025, 2, 25),
    //     content: '',
    // });

    // const submission05 = em.create(Submission, {
    //     learningObjectHruid: 'id01',
    //     learningObjectLanguage: Language.English,
    //     learningObjectVersion: '1',
    //     submissionNumber: 1,
    //     submitter: student02,
    //     submissionTime: new Date(2025, 2, 20),
    //     content: '',
    // });

    await em.persistAndFlush([
        student01,
        student02,
        student03,
        student04,
        student05,
        student06,
        student07,
        teacher01,
        teacher02,
        teacher03,
        teacher04,
        class01,
        class02,
        class03,
        class04,
        learningObject01,
        learningObject02,
        learningObject03,
        learningObject04,
        learningObject05,
        learningPath01,
        learningPath02,
        attachment01,
        classJoinRequest01,
        classJoinRequest02,
        classJoinRequest03,
        classJoinRequest04,
        teacherInvitation01,
        teacherInvitation02,
        teacherInvitation03,
        teacherInvitation04,
    ]);
}
