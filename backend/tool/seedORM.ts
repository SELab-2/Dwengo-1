import { Collection, MikroORM } from '@mikro-orm/core';
import { forkEntityManager } from '../src/orm';
import { makeTestStudents } from '../tests/test_assets/users/students.testdata';
import { makeTestTeachers } from '../tests/test_assets/users/teachers.testdata';
import { makeTestLearningObjects } from '../tests/test_assets/content/learning-objects.testdata';
import { makeTestLearningPaths } from '../tests/test_assets/content/learning-paths.testdata';
import { makeTestClasses } from '../tests/test_assets/classes/classes.testdata';
import { makeTestAssignemnts } from '../tests/test_assets/assignments/assignments.testdata';
import { makeTestGroups } from '../tests/test_assets/assignments/groups.testdata';
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
    const classes = makeTestClasses(em, students, teachers);
    const assignments = makeTestAssignemnts(em, classes);

    const groups = makeTestGroups(em, students, assignments);

    assignments[0].groups = new Collection<Group>(groups.slice(0, 3));
    assignments[1].groups = new Collection<Group>(groups.slice(3, 4));

    const teacherInvitations = makeTestTeacherInvitations(em, teachers, classes);
    const classJoinRequests = makeTestClassJoinRequests(em, students, classes);
    const attachments = makeTestAttachments(em, learningObjects);

    learningObjects[1].attachments = attachments;

    const questions = makeTestQuestions(em, students, groups);
    const answers = makeTestAnswers(em, teachers, questions);
    const submissions = makeTestSubmissions(em, students, groups);

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
