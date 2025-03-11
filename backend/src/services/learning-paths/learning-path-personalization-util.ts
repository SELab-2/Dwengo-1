import { LearningPathNode } from '../../entities/content/learning-path-node.entity';
import { Student } from '../../entities/users/student.entity';
import { Group } from '../../entities/assignments/group.entity';
import { Submission } from '../../entities/assignments/submission.entity';
import { getSubmissionRepository } from '../../data/repositories';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier';
import { LearningPathTransition } from '../../entities/content/learning-path-transition.entity';
import { JSONPath } from 'jsonpath-plus';

export type PersonalizationTarget = { type: 'student'; student: Student } | { type: 'group'; group: Group };
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
    const match = JSONPath({ path: transition.condition, json: {submission: submitted} })
    return match.length === 1;
}
