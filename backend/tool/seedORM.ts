import { assign, Collection, MikroORM } from '@mikro-orm/core';
import { forkEntityManager } from '../src/orm';
import { makeTestStudents } from '../tests/test_assets/users/students.testdata';
import { makeTestTeachers } from '../tests/test_assets/users/teachers.testdata';
import { makeTestLearningObjects } from '../tests/test_assets/content/learning-objects.testdata';
import { makeTestLearningPaths } from '../tests/test_assets/content/learning-paths.testdata';
import { makeTestClasses } from '../tests/test_assets/classes/classes.testdata';
import {
    getAssignment01,
    getAssignment02,
    getAssignment04,
    getConditionalPathAssignment,
    makeTestAssignemnts,
} from '../tests/test_assets/assignments/assignments.testdata';
import {
    getGroup1ConditionalLearningPath,
    getTestGroup01,
    getTestGroup02,
    getTestGroup03,
    getTestGroup04,
    getTestGroup05,
    makeTestGroups,
} from '../tests/test_assets/assignments/groups.testdata';
import { Group } from '../src/entities/assignments/group.entity';
import { makeTestTeacherInvitations } from '../tests/test_assets/classes/teacher-invitations.testdata';
import { makeTestClassJoinRequests } from '../tests/test_assets/classes/class-join-requests.testdata';
import { makeTestAttachments } from '../tests/test_assets/content/attachments.testdata';
import { makeTestQuestions } from '../tests/test_assets/questions/questions.testdata';
import { makeTestAnswers } from '../tests/test_assets/questions/answers.testdata';
import { makeTestSubmissions } from '../tests/test_assets/assignments/submission.testdata';
import { getLogger } from '../src/logging/initalize';

export async function seedORM(orm: MikroORM): Promise<void> {
    const logger = getLogger();

    logger.debug('Clearing database...');
    await orm.schema.clearDatabase();

    logger.debug('Forking entity manager...');
    const em = forkEntityManager();

    logger.debug('Seeding database...');

    const students = makeTestStudents(em);
    const teachers = makeTestTeachers(em);
    const learningObjects = makeTestLearningObjects(em);
    const learningPaths = makeTestLearningPaths(em);
    const classes = makeTestClasses(em);
    const assignments = makeTestAssignemnts(em);

    const groups = makeTestGroups(em);

    let assignment = getAssignment01();
    assignment.groups = new Collection<Group>([getTestGroup01(), getTestGroup02(), getTestGroup03()]);
    assignment = getAssignment02();
    assignment.groups = new Collection<Group>([getTestGroup04()]);
    assignment = getAssignment04();
    assignment.groups = new Collection<Group>([getTestGroup05()]);
    assignment = getConditionalPathAssignment();
    assignment.groups = new Collection<Group>([getGroup1ConditionalLearningPath()]);

    const teacherInvitations = makeTestTeacherInvitations(em);
    const classJoinRequests = makeTestClassJoinRequests(em);
    const attachments = makeTestAttachments(em);

    learningObjects[1].attachments = attachments;

    const questions = makeTestQuestions(em);
    const answers = makeTestAnswers(em);
    const submissions = makeTestSubmissions(em);

    // Persist all entities
    await em.persistAndFlush([
        ...students,
        ...teachers,
        ...learningObjects,
        ...learningPaths,
        ...classes,
        ...assignments,
        ...groups,
        ...teacherInvitations,
        ...classJoinRequests,
        ...attachments,
        ...questions,
        ...answers,
        ...submissions,
    ]);

    logger.info('Development database seeded successfully!');
}
