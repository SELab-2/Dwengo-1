import {Student} from "../../entities/users/student.entity";
import {getSubmissionRepository} from "../../data/repositories";
import {Group} from "../../entities/assignments/group.entity";
import {Submission} from "../../entities/assignments/submission.entity";
import {LearningObjectIdentifier} from "../../entities/content/learning-object-identifier";
import {LearningPathNode} from "../../entities/content/learning-path-node.entity";
import {LearningPathTransition} from "../../entities/content/learning-path-transition.entity";
import {JSONPath} from 'jsonpath-plus';

/**
 * Returns the last submission for the learning object associated with the given node and for the student or group
 */
async function getLastRelevantSubmission(node: LearningPathNode, pathFor: {student?: Student, group?: Group}): Promise<Submission | null> {
    const submissionRepo = getSubmissionRepository();
    const learningObjectId: LearningObjectIdentifier = {
        hruid: node.learningObjectHruid,
        language: node.language,
        version: node.version
    };
    let lastSubmission: Submission | null;
    if (pathFor.group) {
        lastSubmission = await submissionRepo.findMostRecentSubmissionForGroup(learningObjectId, pathFor.group);
    } else if (pathFor.student) {
        lastSubmission = await submissionRepo.findMostRecentSubmissionForStudent(learningObjectId, pathFor.student);
    } else {
        throw new Error("The path must either be created for a certain group or for a certain student!");
    }
    return lastSubmission;
}

function transitionPossible(transition: LearningPathTransition, submitted: object | null): boolean {
    if (transition.condition === "true" || !transition.condition) {
        return true; // If the transition is unconditional, we can go on.
    }
    if (submitted === null) {
        return false; // If the transition is not unconditional and there was no submission, the transition is not possible.
    }
    return JSONPath({path: transition.condition, json: submitted}).length === 0;
}

/**
 * Service to create individual trajectories from learning paths based on the submissions of the student or group.
 */
const learningPathPersonalizingService = {
    async calculatePersonalizedTrajectory(nodes: LearningPathNode[], pathFor: {student?: Student, group?: Group}): Promise<LearningPathNode[]> {
        const trajectory: LearningPathNode[] = [];

        // Always start with the start node.
        let currentNode = nodes.filter(it => it.startNode)[0];
        trajectory.push(currentNode);

        while (true) {
            // At every node, calculate all the possible next transitions.
            const lastSubmission = await getLastRelevantSubmission(currentNode, pathFor);
            const submitted = lastSubmission === null ? null : JSON.parse(lastSubmission.content);
            const possibleTransitions = currentNode.transitions
                .filter(it => transitionPossible(it, submitted));

            if (possibleTransitions.length === 0) { // If there are none, the trajectory has ended.
                return trajectory;
            }  // Otherwise, take the first possible transition.
                currentNode = possibleTransitions[0].node;
                trajectory.push(currentNode);
            
        }
    }
};

export default learningPathPersonalizingService;
