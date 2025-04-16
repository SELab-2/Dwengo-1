import { forkEntityManager, initORM } from '../src/orm.js';
import dotenv from 'dotenv';
import { makeTestStudents } from './test_assets/users/students.testdata.js';
import { makeTestTeachers } from './test_assets/users/teachers.testdata.js';
import { makeTestLearningObjects } from './test_assets/content/learning-objects.testdata.js';
import { makeTestLearningPaths } from './test_assets/content/learning-paths.testdata.js';
import { makeTestClasses } from './test_assets/classes/classes.testdata.js';
import { makeTestAssignemnts } from './test_assets/assignments/assignments.testdata.js';
import { makeTestGroups } from './test_assets/assignments/groups.testdata.js';
import { makeTestTeacherInvitations } from './test_assets/classes/teacher-invitations.testdata.js';
import { makeTestClassJoinRequests } from './test_assets/classes/class-join-requests.testdata.js';
import { makeTestAttachments } from './test_assets/content/attachments.testdata.js';
import { makeTestQuestions } from './test_assets/questions/questions.testdata.js';
import { makeTestAnswers } from './test_assets/questions/answers.testdata.js';
import { makeTestSubmissions } from './test_assets/assignments/submission.testdata.js';
import {Collection} from "@mikro-orm/core";
import {Group} from "../src/entities/assignments/group.entity";

export async function setupTestApp(): Promise<void> {
    dotenv.config({ path: '.env.test' });
    await initORM(true);

    const em = forkEntityManager();

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
}
