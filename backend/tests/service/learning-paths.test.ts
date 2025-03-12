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
    const query = 'robotics';
    const language = 'en';

    it('✅ Should return search results when API responds with data', async () => {
        const mockResults = [
            { title: 'Robotics Basics', hruids: ['robotics_101'] },
            { title: 'Advanced Robotics', hruids: ['robotics_advanced'] },
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
