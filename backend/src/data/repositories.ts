import {
    AnyEntity,
    EntityManager,
    EntityName,
    EntityRepository,
} from '@mikro-orm/core';
import { forkEntityManager } from '../orm.js';
import { StudentRepository } from './users/student-repository.js';
import { Student } from '../entities/users/student.entity.js';
import { User } from '../entities/users/user.entity.js';
import { UserRepository } from './users/user-repository.js';
import { Teacher } from '../entities/users/teacher.entity.js';
import { TeacherRepository } from './users/teacher-repository.js';
import { Class } from '../entities/classes/class.entity.js';
import { ClassRepository } from './classes/class-repository.js';
import { ClassJoinRequest } from '../entities/classes/class-join-request.entity.js';
import { ClassJoinRequestRepository } from './classes/class-join-request-repository.js';
import { TeacherInvitationRepository } from './classes/teacher-invitation-repository.js';
import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity.js';
import { Assignment } from '../entities/assignments/assignment.entity.js';
import { AssignmentRepository } from './assignments/assignment-repository.js';
import { GroupRepository } from './assignments/group-repository.js';
import { Group } from '../entities/assignments/group.entity.js';
import { Submission } from '../entities/assignments/submission.entity.js';
import { SubmissionRepository } from './assignments/submission-repository.js';
import { Question } from '../entities/questions/question.entity.js';
import { QuestionRepository } from './questions/question-repository.js';
import { Answer } from '../entities/questions/answer.entity.js';
import { AnswerRepository } from './questions/answer-repository.js';
import { LearningObject } from '../entities/content/learning-object.entity.js';
import { LearningObjectRepository } from './content/learning-object-repository.js';
import { LearningPath } from '../entities/content/learning-path.entity.js';
import { LearningPathRepository } from './content/learning-path-repository.js';
import { AttachmentRepository } from './content/attachment-repository.js';
import { Attachment } from '../entities/content/attachment.entity.js';

let entityManager: EntityManager | undefined;

/**
 * Execute all the database operations within the function f in a single transaction.
 */
export function transactional<T>(f: () => Promise<T>) {
    entityManager?.transactional(f);
}

function repositoryGetter<T extends AnyEntity, R extends EntityRepository<T>>(
    entity: EntityName<T>
): () => R {
    let cachedRepo: R | undefined;
    return (): R => {
        if (!cachedRepo) {
            if (!entityManager) {
                entityManager = forkEntityManager();
            }
            cachedRepo = entityManager.getRepository(entity) as R;
        }
        return cachedRepo;
    };
}

/* Users */
export const getUserRepository = repositoryGetter<User, UserRepository<User>>(User);
export const getStudentRepository = repositoryGetter<
    Student,
    StudentRepository
>(Student);
export const getTeacherRepository = repositoryGetter<
    Teacher,
    TeacherRepository
>(Teacher);

/* Classes */
export const getClassRepository = repositoryGetter<Class, ClassRepository>(
    Class
);
export const getClassJoinRequestRepository = repositoryGetter<
    ClassJoinRequest,
    ClassJoinRequestRepository
>(ClassJoinRequest);
export const getTeacherInvitationRepository = repositoryGetter<
    TeacherInvitation,
    TeacherInvitationRepository
>(TeacherInvitation);

/* Assignments */
export const getAssignmentRepository = repositoryGetter<
    Assignment,
    AssignmentRepository
>(Assignment);
export const getGroupRepository = repositoryGetter<Group, GroupRepository>(
    Group
);
export const getSubmissionRepository = repositoryGetter<
    Submission,
    SubmissionRepository
>(Submission);

/* Questions and answers */
export const getQuestionRepository = repositoryGetter<
    Question,
    QuestionRepository
>(Question);
export const getAnswerRepository = repositoryGetter<Answer, AnswerRepository>(
    Answer
);

/* Learning content */
export const getLearningObjectRepository = repositoryGetter<
    LearningObject,
    LearningObjectRepository
>(LearningObject);
export const getLearningPathRepository = repositoryGetter<
    LearningPath,
    LearningPathRepository
>(LearningPath);
export const getAttachmentRepository = repositoryGetter<
    Attachment,
    AttachmentRepository
>(Assignment);
