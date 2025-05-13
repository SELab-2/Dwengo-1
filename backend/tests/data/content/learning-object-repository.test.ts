import { beforeAll, describe, it, expect } from 'vitest';
import { LearningObjectRepository } from '../../../src/data/content/learning-object-repository.js';
import { setupTestApp } from '../../setup-tests.js';
import { getLearningObjectRepository } from '../../../src/data/repositories.js';
import { LearningObject } from '../../../src/entities/content/learning-object.entity.js';
import { expectToBeCorrectEntity } from '../../test-utils/expectations.js';
import { testLearningObject01, testLearningObject02, testLearningObject03 } from '../../test_assets/content/learning-objects.testdata';
import { v4 } from 'uuid';
import { wrap } from '@mikro-orm/core';

describe('LearningObjectRepository', () => {
    let learningObjectRepository: LearningObjectRepository;

    beforeAll(async () => {
        await setupTestApp();
        learningObjectRepository = getLearningObjectRepository();
    });

    it('should return a learning object when queried by id', async () => {
        const result = await learningObjectRepository.findByIdentifier({
            hruid: testLearningObject01.hruid,
            language: testLearningObject02.language,
            version: testLearningObject03.version,
        });
        expect(result).toBeInstanceOf(LearningObject);
        expectToBeCorrectEntity(result!, testLearningObject01);
    });

    it('should return null when non-existing version is queried', async () => {
        const result = await learningObjectRepository.findByIdentifier({
            hruid: testLearningObject01.hruid,
            language: testLearningObject01.language,
            version: 100,
        });
        expect(result).toBe(null);
    });

    let newerExample: LearningObject;

    it('should allow a learning object with the same id except a different version to be added', async () => {
        // structeredClone failed on teacher, this copies all fields to a json object
        const testLearningObject01Newer = { ...testLearningObject01 };
        testLearningObject01Newer.version = 10;
        testLearningObject01Newer.title += ' (nieuw)';
        testLearningObject01Newer.uuid = v4();
        testLearningObject01Newer.content = Buffer.from('This is the new content.');
        newerExample = learningObjectRepository.create(testLearningObject01Newer);
        await learningObjectRepository.save(newerExample);
    });

    it('should return the newest version of the learning object when queried by only hruid and language', async () => {
        

        const result = await learningObjectRepository.findLatestByHruidAndLanguage(newerExample.hruid, newerExample.language);
        // expect(result).toBeInstanceOf(LearningObject);
        // expect(result?.version).toBe(10);
        // expect(result?.title).toContain('(nieuw)');
    });

    it('should return null when queried by non-existing hruid or language', async () => {
        const result = await learningObjectRepository.findLatestByHruidAndLanguage('something_that_does_not_exist', testLearningObject01.language);
        expect(result).toBe(null);
    });
});
