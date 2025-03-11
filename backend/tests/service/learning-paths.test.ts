import { describe, it, expect, vi } from 'vitest';
import { fetchLearningPaths } from '../../src/services/learningPaths';
import { fetchWithLogging } from '../../src/util/apiHelper';
import { LearningPathResponse } from '../../src/interfaces/learningPath';


describe('fetchLearningPaths', () => {
    const mockHruids = ['pn_werking', 'art1'];
    const language = 'en';
    const source = 'Test Source';

    it('✅ Moet een succesvolle response retourneren wanneer hruids zijn opgegeven', async () => {
        // Mock response van fetchWithLogging
        //const mockResponse = [{ title: 'Test Path', hruids: mockHruids }];

        const result: LearningPathResponse = await fetchLearningPaths(mockHruids, language, source);

        expect(result.success).toBe(true);
        //expect(result.data).toEqual(mockResponse);
        expect(result.source).toBe(source);
    });

    it('⚠️ Moet een foutmelding teruggeven als er geen hruids zijn opgegeven', async () => {
        const result: LearningPathResponse = await fetchLearningPaths([], language, source);

        expect(result.success).toBe(false);
        expect(result.data).toBeNull();
        expect(result.message).toBe(`No HRUIDs provided for ${source}.`);
    });


});
