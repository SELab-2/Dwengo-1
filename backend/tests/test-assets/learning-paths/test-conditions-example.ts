import { LearningPath } from '../../../src/entities/content/learning-path.entity';
import { Language } from '../../../src/entities/content/language';
import testMultipleChoiceExample from '../learning-objects/test-multiple-choice/test-multiple-choice-example';
import { dummyLearningObject } from '../learning-objects/dummy/dummy-learning-object-example';
import { createLearningPathNode, createLearningPathTransition } from './learning-path-utils';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';
import { envVars, getEnvVar } from '../../../src/util/envVars';

export interface ConditionTestLearningPathAndLearningObjects {
    branchingObject: LearningObject;
    extraExerciseObject: LearningObject;
    finalObject: LearningObject;
    learningPath: LearningPath;
}

export function createConditionTestLearningPathAndLearningObjects(): ConditionTestLearningPathAndLearningObjects {
    const learningPath = new LearningPath();
    learningPath.hruid = `${getEnvVar(envVars.UserContentPrefix)}test_conditions`;
    learningPath.language = Language.English;
    learningPath.title = 'Example learning path with conditional transitions';
    learningPath.description = 'This learning path was made for the purpose of testing conditional transitions';

    const branchingLearningObject = testMultipleChoiceExample.createLearningObject();
    const extraExerciseLearningObject = dummyLearningObject(
        'test_extra_exercise',
        Language.English,
        'Extra exercise (for students with difficulties)'
    ).createLearningObject();
    const finalLearningObject = dummyLearningObject(
        'test_final_learning_object',
        Language.English,
        'Final exercise (for everyone)'
    ).createLearningObject();

    const branchingNode = createLearningPathNode(
        learningPath,
        0,
        branchingLearningObject.hruid,
        branchingLearningObject.version,
        branchingLearningObject.language,
        true
    );
    const extraExerciseNode = createLearningPathNode(
        learningPath,
        1,
        extraExerciseLearningObject.hruid,
        extraExerciseLearningObject.version,
        extraExerciseLearningObject.language,
        false
    );
    const finalNode = createLearningPathNode(
        learningPath,
        2,
        finalLearningObject.hruid,
        finalLearningObject.version,
        finalLearningObject.language,
        false
    );

    const transitionToExtraExercise = createLearningPathTransition(
        branchingNode,
        0,
        '$[?(@[0] == 0)]', // The answer to the first question was the first one, which says that it is difficult for the student to follow along.
        extraExerciseNode
    );
    const directTransitionToFinal = createLearningPathTransition(branchingNode, 1, '$[?(@[0] == 1)]', finalNode);
    const transitionExtraExerciseToFinal = createLearningPathTransition(extraExerciseNode, 0, 'true', finalNode);

    branchingNode.transitions = [transitionToExtraExercise, directTransitionToFinal];
    extraExerciseNode.transitions = [transitionExtraExerciseToFinal];

    learningPath.nodes = [branchingNode, extraExerciseNode, finalNode];

    return {
        branchingObject: branchingLearningObject,
        finalObject: finalLearningObject,
        extraExerciseObject: extraExerciseLearningObject,
        learningPath: learningPath,
    };
}
