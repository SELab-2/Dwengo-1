import {describe, it, expect, vi} from 'vitest';
import {
    LearningObjectMetadata,
} from "../../src/interfaces/learningPath";
import {fetchWithLogging} from "../../src/util/apiHelper";
import {getLearningObjectById, getLearningObjectsFromPath} from "../../src/services/learningObjects";
import {fetchLearningPaths} from "../../src/services/learningPaths";

// Mock API functions
vi.mock('../../src/util/apiHelper', () => ({
    fetchWithLogging: vi.fn(),
}));

vi.mock('../../src/services/learningPaths', () => ({
    fetchLearningPaths: vi.fn(),
}));


describe('getLearningObjectById', () => {
    const hruid = 'test-object';
    const language = 'en';
    const mockMetadata: LearningObjectMetadata = {
        hruid,
        _id: '123',
        uuid: 'uuid-123',
        version: 1,
        title: 'Test Object',
        language,
        difficulty: 5,
        estimated_time: 120,
        available: true,
        teacher_exclusive: false,
        educational_goals: [{source: 'source', id: 'id'}],
        keywords: ['robotics'],
        description: 'A test object',
        target_ages: [10, 12],
        content_type: 'markdown',
        content_location: '',
        skos_concepts: [],
        return_value: undefined,
    };

    it('✅ Should return a filtered learning object when API provides data', async () => {
        vi.mocked(fetchWithLogging).mockResolvedValueOnce(mockMetadata);

        const result = await getLearningObjectById(hruid, language);

        expect(result).toEqual({
            key: hruid,
            _id: '123',
            uuid: 'uuid-123',
            version: 1,
            title: 'Test Object',
            htmlUrl: expect.stringContaining('/learningObject/getRaw?hruid=test-object&language=en'),
            language,
            difficulty: 5,
            estimatedTime: 120,
            available: true,
            teacherExclusive: false,
            educationalGoals: [{source: 'source', id: 'id'}],
            keywords: ['robotics'],
            description: 'A test object',
            targetAges: [10, 12],
            contentType: 'markdown',
            contentLocation: '',
            skosConcepts: [],
            returnValue: undefined,
        });
    });

    it('⚠️ Should return null if API returns no metadata', async () => {
        vi.mocked(fetchWithLogging).mockResolvedValueOnce(null);
        const result = await getLearningObjectById(hruid, language);
        expect(result).toBeNull();
    });
});


describe('getLearningObjectsFromPath', () => {
    const hruid = 'test-path';
    const language = 'en';

    it('⚠️ Should return an empty array if API returns an empty path response', async () => {
        vi.mocked(fetchLearningPaths).mockResolvedValueOnce({success: false, source: 'Test Source', data: []});

        const result = await getLearningObjectsFromPath(hruid, language);

        expect(result).toEqual([]);
    });

    it('❌ Should return an empty array and log an error if fetchLearningPaths fails', async () => {
        vi.mocked(fetchLearningPaths).mockRejectedValueOnce(new Error('API Error'));

        const result = await getLearningObjectsFromPath(hruid, language);

        expect(result).toEqual([]);
    });
});
