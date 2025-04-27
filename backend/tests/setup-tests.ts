import { forkEntityManager, initORM } from '../src/orm.js';
import dotenv from 'dotenv';
import { makeTestStudents } from './test_assets/users/students.testdata.js';
import { makeTestTeachers } from './test_assets/users/teachers.testdata.js';
import { makeTestLearningObjects, testLearningObject01 } from './test_assets/content/learning-objects.testdata.js';
import { makeTestLearningPaths } from './test_assets/content/learning-paths.testdata.js';
import { makeTestClasses } from './test_assets/classes/classes.testdata.js';
import { getAssignment01, getAssignment02, makeTestAssignemnts } from './test_assets/assignments/assignments.testdata.js';
import { getTestGroup01, getTestGroup02, getTestGroup03, getTestGroup04, makeTestGroups } from './test_assets/assignments/groups.testdata.js';
import { makeTestTeacherInvitations } from './test_assets/classes/teacher-invitations.testdata.js';
import { makeTestClassJoinRequests } from './test_assets/classes/class-join-requests.testdata.js';
import { makeTestAttachments } from './test_assets/content/attachments.testdata.js';
import { makeTestQuestions } from './test_assets/questions/questions.testdata.js';
import { makeTestAnswers } from './test_assets/questions/answers.testdata.js';
import { makeTestSubmissions } from './test_assets/assignments/submission.testdata.js';
import { Collection } from '@mikro-orm/core';
import { Group } from '../src/entities/assignments/group.entity';

export async function setupTestApp(): Promise<void> {
    dotenv.config({ path: '.env.test' });
    await initORM(true);

    const em = forkEntityManager();

    const students = makeTestStudents(em);
    const teachers = makeTestTeachers(em);
    const learningObjects = makeTestLearningObjects(em);
    const learningPaths = makeTestLearningPaths(em);
    const classes = makeTestClasses(em);
    const assignments = makeTestAssignemnts(em);
    const groups = makeTestGroups(em);

    const groups1 = [getTestGroup01(), getTestGroup02(), getTestGroup03()];
    const groups2 = [getTestGroup04()];
    const assignment1 = getAssignment01();
    const assignment2 = getAssignment02();
    assignment1.groups = new Collection<Group>(groups1);
    assignment2.groups = new Collection<Group>(groups2);

    const teacherInvitations = makeTestTeacherInvitations(em);
    const classJoinRequests = makeTestClassJoinRequests(em);
    const attachments = makeTestAttachments(em);

    testLearningObject01.attachments = attachments;

    const questions = makeTestQuestions(em);
    const answers = makeTestAnswers(em);
    const submissions = makeTestSubmissions(em);

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
