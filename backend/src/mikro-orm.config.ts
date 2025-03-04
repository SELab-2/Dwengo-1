import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EnvVars, getEnvVar, getNumericEnvVar } from './util/envvars.js';
import { SqliteDriver } from '@mikro-orm/sqlite';

// Import alle entity-bestanden handmatig
import { User } from './entities/users/user.entity.js';
import { Student } from './entities/users/student.entity.js';
import { Teacher } from './entities/users/teacher.entity.js';

import { Assignment } from './entities/assignments/assignment.entity.js';
import { Group } from './entities/assignments/group.entity.js';
import { Submission } from './entities/assignments/submission.entity.js';

import { Class } from './entities/classes/class.entity.js';
import { ClassJoinRequest } from './entities/classes/class-join-request.entity.js';
import { TeacherInvitation } from './entities/classes/teacher-invitation.entity.js';

import { Attachment } from './entities/content/attachment.entity.js';
import { LearningObject } from './entities/content/learning-object.entity.js';
import { LearningPath } from './entities/content/learning-path.entity.js';

import { Answer } from './entities/questions/answer.entity.js';
import { Question } from './entities/questions/question.entity.js';

const entities = [
    User, Student, Teacher,
    Assignment, Group, Submission,
    Class, ClassJoinRequest, TeacherInvitation,
    Attachment, LearningObject, LearningPath,
    Answer, Question
];

function config(testingMode: boolean = false): Options {
    if (testingMode) {
        return {
            driver: SqliteDriver,
            dbName: getEnvVar(EnvVars.DbName),
            entities: entities,
            // entitiesTs: entitiesTs,

            // Workaround: vitest: `TypeError: Unknown file extension ".ts"` (ERR_UNKNOWN_FILE_EXTENSION)
            // (see https://mikro-orm.io/docs/guide/project-setup#testing-the-endpoint)
            dynamicImportProvider: (id) => import(id),
        };
    }
    return {
        driver: PostgreSqlDriver,
        host: getEnvVar(EnvVars.DbHost),
        port: getNumericEnvVar(EnvVars.DbPort),
        dbName: getEnvVar(EnvVars.DbName),
        user: getEnvVar(EnvVars.DbUsername),
        password: getEnvVar(EnvVars.DbPassword),
        entities: entities,
        //entitiesTs: entitiesTs,
        debug: true,
    };
}

export default config;
