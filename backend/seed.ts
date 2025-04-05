import { forkEntityManager, initORM } from "./src/orm.js";
import dotenv from 'dotenv';
import { makeTestAssignemnts } from "./tests/test_assets/assignments/assignments.testdata.js";
import { makeTestGroups } from "./tests/test_assets/assignments/groups.testdata.js";
import { makeTestSubmissions } from "./tests/test_assets/assignments/submission.testdata.js";
import { makeTestClassJoinRequests } from "./tests/test_assets/classes/class-join-requests.testdata.js";
import { makeTestClasses } from "./tests/test_assets/classes/classes.testdata.js";
import { makeTestTeacherInvitations } from "./tests/test_assets/classes/teacher-invitations.testdata.js";
import { makeTestAttachments } from "./tests/test_assets/content/attachments.testdata.js";
import { makeTestLearningObjects } from "./tests/test_assets/content/learning-objects.testdata.js";
import { makeTestLearningPaths } from "./tests/test_assets/content/learning-paths.testdata.js";
import { makeTestAnswers } from "./tests/test_assets/questions/answers.testdata.js";
import { makeTestQuestions } from "./tests/test_assets/questions/questions.testdata.js";
import { makeTestStudents } from "./tests/test_assets/users/students.testdata.js";
import { makeTestTeachers } from "./tests/test_assets/users/teachers.testdata.js";
import { getLogger, Logger } from './src/logging/initalize.js';

const logger: Logger = getLogger();

export async function seedDatabase() : Promise<void> {
    dotenv.config({ path: '.env.development.local' });
    const orm = await initORM();
    await orm.schema.clearDatabase();

    const em = forkEntityManager();

    logger.info("seeding database...")

    const students = makeTestStudents(em);
    const teachers = makeTestTeachers(em);
    const learningObjects = makeTestLearningObjects(em);
    const learningPaths = makeTestLearningPaths(em);
    const classes = makeTestClasses(em, students, teachers);
    const assignments = makeTestAssignemnts(em, classes);
    const groups = makeTestGroups(em, students, assignments);

    assignments[0].groups = groups.slice(0, 3);
    assignments[1].groups = groups.slice(3, 4);

    const teacherInvitations = makeTestTeacherInvitations(em, teachers, classes);
    const classJoinRequests = makeTestClassJoinRequests(em, students, classes);
    const attachments = makeTestAttachments(em, learningObjects);

    learningObjects[1].attachments = attachments;

    const questions = makeTestQuestions(em, students);
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

    await orm.close();
}

seedDatabase().catch(logger.error);