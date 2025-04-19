import { beforeAll, describe, expect, it } from 'vitest';
import { LearningObjectRepository } from '../../../src/data/content/learning-object-repository';
import { getLearningObjectRepository } from '../../../src/data/repositories';
import { setupTestApp } from '../../setup-tests';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Language } from '@dwengo-1/common/util/language';
import { testLearningObject01 } from '../../test_assets/content/learning-objects.testdata';

describe('LearningObjectRepository', () => {
    let learningObjectRepository: LearningObjectRepository;

    beforeAll(async () => {
        await setupTestApp();
        learningObjectRepository = getLearningObjectRepository();
    });

    const id01 = new LearningObjectIdentifier(testLearningObject01.hruid, testLearningObject01.language, testLearningObject01.version);
    const id02 = new LearningObjectIdentifier('non_existing_id', Language.English, 1);

    it('should return the learning object that matches identifier 1', async () => {
        const learningObject = await learningObjectRepository.findByIdentifier(id01);

        expect(learningObject).toBeTruthy();
        expect(learningObject?.title).toBe('Undertow');
        expect(learningObject?.description).toBe('debute');
    });

    it('should return nothing because the identifier does not exist in the database', async () => {
        const learningObject = await learningObjectRepository.findByIdentifier(id02);

        expect(learningObject).toBeNull();
    });
});
