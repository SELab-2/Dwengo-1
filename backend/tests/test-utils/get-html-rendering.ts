import { RequiredEntityData } from '@mikro-orm/core';
import { loadTestAsset } from './load-test-asset';
import { LearningObject } from '../../src/entities/content/learning-object.entity';
import { envVars, getEnvVar } from '../../src/util/envVars';

export function getHtmlRenderingForTestLearningObject(learningObject: RequiredEntityData<LearningObject>): string {
    const userPrefix = getEnvVar(envVars.UserContentPrefix);
    const cleanedHruid = learningObject.hruid.startsWith(userPrefix) ? learningObject.hruid.substring(userPrefix.length) : learningObject.hruid;
    return loadTestAsset(`/content/learning-object-resources/${cleanedHruid}/rendering.txt`).toString();
}
