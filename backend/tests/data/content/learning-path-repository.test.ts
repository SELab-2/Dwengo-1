import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests.js';
import { getLearningPathRepository } from '../../../src/data/repositories.js';
import { LearningPathRepository } from '../../../src/data/content/learning-path-repository.js';
import { LearningPath } from '../../../src/entities/content/learning-path.entity.js';
import {
    expectToBeCorrectEntity,
    expectToHaveFoundNothing,
    expectToHaveFoundPrecisely
} from '../../test-utils/expectations.js';
import { Language } from '@dwengo-1/common/util/language';
import {testLearningPath01} from "../../test_assets/content/learning-paths.testdata";
import {mapToLearningPath} from "../../../src/services/learning-paths/learning-path-service";

describe('LearningPathRepository', () => {
    let learningPathRepo: LearningPathRepository;
    let examplePath: LearningPath;

    beforeAll(async () => {
        await setupTestApp();
        learningPathRepo = getLearningPathRepository();

        examplePath = mapToLearningPath(testLearningPath01, []);
    });

    it('should return a learning path when it is queried by hruid and language', async () => {
        const result = await learningPathRepo.findByHruidAndLanguage(
            testLearningPath01.hruid,
            testLearningPath01.language as Language
        );
        expect(result).toBeInstanceOf(LearningPath);
        expectToBeCorrectEntity(result!, examplePath);
    });

    it('should return null to a query on a non-existing hruid or language', async () => {
        const result = await learningPathRepo.findByHruidAndLanguage('not_existing_hruid', examplePath.language);
        expect(result).toBe(null);
    });

    it('should return the learning path when we search for a search term occurring in its title', async () => {
        const result = await learningPathRepo.findByQueryStringAndLanguage(examplePath.title.slice(9, 13), examplePath.language);
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
