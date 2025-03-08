import { beforeAll, describe, expect, it } from "vitest";
import { LearningPathRepository } from "../../src/data/content/learning-path-repository";
import { getLearningPathRepository } from "../../src/data/repositories";
import { setupTestApp } from "../setup-tests";
import { Language } from "../../src/entities/content/language";

describe('LearningPathRepository', () => {
    let LearningPathRepository : LearningPathRepository;

    beforeAll(async () => {
        await setupTestApp();
        LearningPathRepository = getLearningPathRepository();
    });

    it('should return nothing because no match for hruid and language', async() => {
        const learningPath = await LearningPathRepository.findByHruidAndLanguage('hruid_path01', Language.Dutch);

        expect(learningPath).toBeNull();
    });

    it('should return requested learning path', async() => {
        const learningPath = await LearningPathRepository.findByHruidAndLanguage('hruid_path01', Language.English);

        expect(learningPath).toBeTruthy();
        expect(learningPath?.title).toBe('repertoire Tool');
        expect(learningPath?.description).toBe('all about Tool');
    });

});