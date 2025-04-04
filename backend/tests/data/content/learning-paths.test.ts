import { beforeAll, describe, expect, it } from 'vitest';
import { getLearningPathRepository } from '../../../src/data/repositories';
import { LearningPathRepository } from '../../../src/data/content/learning-path-repository';
import { setupTestApp } from '../../setup-tests';
import { Language } from '@dwengo-1/common/util/language';

describe('LearningPathRepository', () => {
    let learningPathRepository: LearningPathRepository;

    beforeAll(async () => {
        await setupTestApp();
        learningPathRepository = getLearningPathRepository();
    });

    it('should return nothing because no match for hruid and language', async () => {
        const learningPath = await learningPathRepository.findByHruidAndLanguage('test_id', Language.Dutch);

        expect(learningPath).toBeNull();
    });

    it('should return requested learning path', async () => {
        const learningPath = await learningPathRepository.findByHruidAndLanguage('id01', Language.English);

        expect(learningPath).toBeTruthy();
        expect(learningPath?.title).toBe('repertoire Tool');
        expect(learningPath?.description).toBe('all about Tool');
    });
});
