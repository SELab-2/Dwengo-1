import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests.js';
import { getLearningPathRepository } from '../../../src/data/repositories.js';
import { LearningPathRepository } from '../../../src/data/content/learning-path-repository.js';
import example from '../../test-assets/learning-paths/pn-werking-example.js';
import { LearningPath } from '../../../src/entities/content/learning-path.entity.js';
import { expectToBeCorrectEntity } from '../../test-utils/expectations.js';
import { Language } from '@dwengo-1/common/util/language';

function expectToHaveFoundPrecisely(expected: LearningPath, result: LearningPath[]): void {
    expect(result).toHaveProperty('length');
    expect(result.length).toBe(1);
    expectToBeCorrectEntity({ entity: result[0] }, { entity: expected });
}

function expectToHaveFoundNothing(result: LearningPath[]): void {
    expect(result).toHaveProperty('length');
    expect(result.length).toBe(0);
}

describe('LearningPathRepository', () => {
    let learningPathRepo: LearningPathRepository;

    beforeAll(async () => {
        await setupTestApp();
        learningPathRepo = getLearningPathRepository();
    });

    let examplePath: LearningPath;

    it('should be able to add a learning path without throwing an error', async () => {
        examplePath = example.createLearningPath();
        await learningPathRepo.insert(examplePath);
    });

    it('should return the added path when it is queried by hruid and language', async () => {
        const result = await learningPathRepo.findByHruidAndLanguage(examplePath.hruid, examplePath.language);
        expect(result).toBeInstanceOf(LearningPath);
        expectToBeCorrectEntity({ entity: result! }, { entity: examplePath });
    });

    it('should return null to a query on a non-existing hruid or language', async () => {
        const result = await learningPathRepo.findByHruidAndLanguage('not_existing_hruid', examplePath.language);
        expect(result).toBe(null);
    });

    it('should return the learning path when we search for a search term occurring in its title', async () => {
        const result = await learningPathRepo.findByQueryStringAndLanguage(examplePath.title.slice(4, 9), examplePath.language);
        expectToHaveFoundPrecisely(examplePath, result);
    });

    it('should return the learning path when we search for a search term occurring in its description', async () => {
        const result = await learningPathRepo.findByQueryStringAndLanguage(examplePath.description.slice(8, 15), examplePath.language);
        expectToHaveFoundPrecisely(examplePath, result);
    });

    it('should return null when we search for something not occurring in its title or description', async () => {
        const result = await learningPathRepo.findByQueryStringAndLanguage('something not occurring in the path', examplePath.language);
        expectToHaveFoundNothing(result);
    });

    it('should return null when we search for something occurring in its title, but another language', async () => {
        const result = await learningPathRepo.findByQueryStringAndLanguage(examplePath.description.slice(1, 3), Language.Kalaallisut);
        expectToHaveFoundNothing(result);
    });
});
