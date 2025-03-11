import { LearningPathNode } from '../../entities/content/learning-path-node.entity';
import { Student } from '../../entities/users/student.entity';
import { Group } from '../../entities/assignments/group.entity';
import { Submission } from '../../entities/assignments/submission.entity';
import { getClassRepository, getGroupRepository, getStudentRepository, getSubmissionRepository } from '../../data/repositories';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier';
import { LearningPathTransition } from '../../entities/content/learning-path-transition.entity';
import { JSONPath } from 'jsonpath-plus';

export type PersonalizationTarget = { type: 'student'; student: Student } | { type: 'group'; group: Group };

/**
 * Shortcut function to easily create a PersonalizationTarget object for a student by his/her username.
 * @param username Username of the student we want to generate a personalized learning path for.
 *                 If there is no student with this username, return undefined.
 */
export async function personalizedForStudent(username: string): Promise<PersonalizationTarget | undefined> {
    const student = await getStudentRepository().findByUsername(username);
    if (student) {
        return {
            type: 'student',
            student: student,
        };
    }
    return undefined;
}

/**
 * Shortcut function to easily create a PersonalizationTarget object for a group by class name, assignment number and
 * group number.
 * @param classId Id of the class in which this group was created
 * @param assignmentNumber Number of the assignment for which this group was created
 * @param groupNumber Number of the group for which we want to personalize the learning path.
 */
export async function personalizedForGroup(
    classId: string,
    assignmentNumber: number,
    groupNumber: number
): Promise<PersonalizationTarget | undefined> {
    const clazz = await getClassRepository().findById(classId);
    if (!clazz) {
        return undefined;
    }
    const group = await getGroupRepository().findOne({
        assignment: {
            within: clazz,
            id: assignmentNumber,
        },
        groupNumber: groupNumber,
    });
    if (group) {
        return {
            type: 'group',
            group: group,
        };
    }
    return undefined;
}

/**
 * Returns the last submission for the learning object associated with the given node and for the student or group
 */
export async function getLastSubmissionForCustomizationTarget(node: LearningPathNode, pathFor: PersonalizationTarget): Promise<Submission | null> {
    const submissionRepo = getSubmissionRepository();
    const learningObjectId: LearningObjectIdentifier = {
        hruid: node.learningObjectHruid,
        language: node.language,
        version: node.version,
    };
    if (pathFor.type === 'group') {
        return await submissionRepo.findMostRecentSubmissionForGroup(learningObjectId, pathFor.group);
    }
    return await submissionRepo.findMostRecentSubmissionForStudent(learningObjectId, pathFor.student);
}

/**
 * Checks whether the condition of the given transaction is fulfilled by the given submission.
 * @param transition
 * @param submitted
 */
export function isTransitionPossible(transition: LearningPathTransition, submitted: object | null): boolean {
    if (transition.condition === 'true' || !transition.condition) {
        return true; // If the transition is unconditional, we can go on.
    }
    if (submitted === null) {
        return false; // If the transition is not unconditional and there was no submission, the transition is not possible.
    }
    const match = JSONPath({ path: transition.condition, json: { submission: submitted } });
    return match.length === 1;
}
