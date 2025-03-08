import { beforeAll, describe, expect, it } from 'vitest';
import { getLearningPathRepository } from '../../src/data/repositories';
import { LearningPathRepository } from '../../src/data/content/learning-path-repository';
import { setupTestApp } from '../setup-tests';
import { Language } from '../../src/entities/content/language';

describe('LearningPathRepository', () => {
    let LearningPathRepository: LearningPathRepository;

    beforeAll(async () => {
        await setupTestApp();
        LearningPathRepository = getLearningPathRepository();
    });

    it('should return nothing because no match for hruid and language', async () => {
        const learningPath =
            await LearningPathRepository.findByHruidAndLanguage(
                'test_id',
                Language.Dutch
            );

        expect(learningPath).toBeNull();
    });

    it('should return requested learning path', async () => {
        const learningPath =
            await LearningPathRepository.findByHruidAndLanguage(
                'id01',
                Language.English
            );

        expect(learningPath).toBeTruthy();
        expect(learningPath?.title).toBe('repertoire Tool');
        expect(learningPath?.description).toBe('all about Tool');
    });
});
