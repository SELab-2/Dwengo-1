import {
    AnyEntity,
    EntityManager,
    EntityName,
    EntityRepository,
} from '@mikro-orm/core';
import { forkEntityManager } from '../orm';
import { StudentRepository } from './users/student-repository';
import { Student } from '../entities/users/student.entity';
import { User } from '../entities/users/user.entity';
import { UserRepository } from './users/user-repository';
import { Teacher } from '../entities/users/teacher.entity';
import { TeacherRepository } from './users/teacher-repository';
import { Class } from '../entities/classes/class.entity';
import { ClassRepository } from './classes/class-repository';
import { ClassJoinRequest } from '../entities/classes/class-join-request.entity';
import { ClassJoinRequestRepository } from './classes/class-join-request-repository';
import { TeacherInvitationRepository } from './classes/teacher-invitation-repository';
import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity';
import { Assignment } from '../entities/assignments/assignment.entity';
import { AssignmentRepository } from './assignments/assignment-repository';
import { GroupRepository } from './assignments/group-repository';
import { Group } from '../entities/assignments/group.entity';
import { Submission } from '../entities/assignments/submission.entity';
import { SubmissionRepository } from './assignments/submission-repository';
import { Question } from '../entities/questions/question.entity';
import { QuestionRepository } from './questions/question-repository';
import { Answer } from '../entities/questions/answer.entity';
import { AnswerRepository } from './questions/answer-repository';
import { LearningObject } from '../entities/content/learning-object.entity';
import { LearningObjectRepository } from './content/learning-object-repository';
import { LearningPath } from '../entities/content/learning-path.entity';
import { LearningPathRepository } from './content/learning-path-repository';
import { AttachmentRepository } from './content/attachment-repository';
import { Attachment } from '../entities/content/attachment.entity';

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
export const getUserRepository = repositoryGetter<User, UserRepository>(User);
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
>(TeacherInvitationRepository);

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
