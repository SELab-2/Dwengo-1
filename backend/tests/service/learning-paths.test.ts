import { describe, it, expect, vi } from 'vitest';
import { fetchLearningPaths, searchLearningPaths } from '../../src/services/learningPaths';
import { fetchWithLogging } from '../../src/util/apiHelper';
import { LearningPathResponse } from '../../src/interfaces/learningPath';

// Mock the fetchWithLogging module using vi
vi.mock('../../src/util/apiHelper', () => ({
    fetchWithLogging: vi.fn(),
}));

describe('fetchLearningPaths', () => {
    // Mock data and response
    const mockHruids = ['pn_werking', 'art1'];
    const language = 'en';
    const source = 'Test Source';
    const mockResponse = [{ title: 'Test Path', hruids: mockHruids }];

    it('✅ Should return a successful response when HRUIDs are provided', async () => {
        // Mock the function to return mockResponse
        vi.mocked(fetchWithLogging).mockResolvedValue(mockResponse);

        const result: LearningPathResponse = await fetchLearningPaths(mockHruids, language, source);

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockResponse);
        expect(result.source).toBe(source);
    });

    it('⚠️ Should return an error when no HRUIDs are provided', async () => {
        vi.mocked(fetchWithLogging).mockResolvedValue(mockResponse);

        const result: LearningPathResponse = await fetchLearningPaths([], language, source);

        expect(result.success).toBe(false);
        expect(result.data).toBeNull();
        expect(result.message).toBe(`No HRUIDs provided for ${source}.`);
    });

    it('⚠️ Should return a failure response when no learning paths are found', async () => {
        // Mock fetchWithLogging to return an empty array
        vi.mocked(fetchWithLogging).mockResolvedValue([]);

        const result: LearningPathResponse = await fetchLearningPaths(mockHruids, language, source);

        expect(result.success).toBe(false);
        expect(result.data).toEqual([]);
        expect(result.message).toBe(`No learning paths found for ${source}.`);
    });
});

describe('searchLearningPaths', () => {
    const query =
        'https://dwengo.org/backend/api/learningPath/getPathsFromIdList?pathIdList=%7B%22hruids%22:%5B%22pn_werking%22,%22un_artificiele_intelligentie%22%5D%7D&language=nl';
    const language = 'nl';

    it('✅ Should return search results when API responds with data', async () => {
        const mockResults = [
            {
                _id: '67b4488c9dadb305c4104618',
                language: 'nl',
                hruid: 'pn_werking',
                title: 'Werken met notebooks',
                description: 'Een korte inleiding tot Python notebooks. Hoe ga je gemakkelijk en efficiënt met de notebooks aan de slag?',
                num_nodes: 0,
                num_nodes_left: 0,
                nodes: [],
                keywords: 'Python KIKS Wiskunde STEM AI',
                target_ages: [14, 15, 16, 17, 18],
                min_age: 14,
                max_age: 18,
                __order: 0,
            },
        ];

        // Mock fetchWithLogging to return search results
        vi.mocked(fetchWithLogging).mockResolvedValue(mockResults);

        const result = await searchLearningPaths(query, language);

        expect(result).toEqual(mockResults);
    });

    it('⚠️ Should return an empty array when API returns no results', async () => {
        vi.mocked(fetchWithLogging).mockResolvedValue([]);

        const result = await searchLearningPaths(query, language);

        expect(result).toEqual([]);
    });
});
