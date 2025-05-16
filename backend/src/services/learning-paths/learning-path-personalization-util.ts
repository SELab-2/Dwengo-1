import { LearningPathNode } from '../../entities/content/learning-path-node.entity.js';
import { Group } from '../../entities/assignments/group.entity.js';
import { Submission } from '../../entities/assignments/submission.entity.js';
import { getSubmissionRepository } from '../../data/repositories.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { LearningPathTransition } from '../../entities/content/learning-path-transition.entity.js';
import { JSONPath } from 'jsonpath-plus';
import { LearningObjectNode } from '@dwengo-1/common/interfaces/learning-content';

/**
 * Returns the last submission for the learning object associated with the given node and for the group
 */
export async function getLastSubmissionForGroup(learningObjectId: LearningObjectIdentifier, pathFor: Group): Promise<Submission | null> {
    const submissionRepo = getSubmissionRepository();
    return await submissionRepo.findMostRecentSubmissionForGroup(learningObjectId, pathFor);
}

/**
 * Creates a LearningObjectIdentifier describing the specified node.
 */
export function idFromLearningObjectNode(node: LearningObjectNode): LearningObjectIdentifier {
    return {
        hruid: node.learningobject_hruid,
        language: node.language,
        version: node.version,
    };
}

/**
 * Creates a LearningObjectIdentifier describing the specified node.
 */
export function idFromLearningPathNode(node: LearningPathNode): LearningObjectIdentifier {
    return {
        hruid: node.learningObjectHruid,
        language: node.language,
        version: node.version,
    };
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
