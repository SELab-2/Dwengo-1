import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import learningPathService from '../../../src/services/learning-paths/learning-path-service';
import { Language } from '@dwengo-1/common/util/language';
import { testPartiallyDatabaseAndPartiallyDwengoApiLearningPath } from '../../test_assets/content/learning-paths.testdata';
import { LearningPath as LearningPathDTO } from '@dwengo-1/common/interfaces/learning-content';

const TEST_DWENGO_LEARNING_PATH_HRUID = 'pn_werking';
const TEST_DWENGO_LEARNING_PATH_TITLE = 'Werken met notebooks';
const TEST_DWENGO_EXCLUSIVE_LEARNING_PATH_SEARCH_QUERY = 'Microscopie';
const TEST_SEARCH_QUERY_EXPECTING_NO_MATCHES = 'su$m8f9usf89ud<p9<U8SDP8UP9';

describe('LearningPathService', () => {
    let testLearningPath: LearningPathDTO;
    beforeAll(async () => {
        await setupTestApp();
        testLearningPath = testPartiallyDatabaseAndPartiallyDwengoApiLearningPath;
    });
    describe('fetchLearningPaths', () => {
        it('should return learning paths both from the database and from the Dwengo API', async () => {
            const result = await learningPathService.fetchLearningPaths(
                [testLearningPath.hruid, TEST_DWENGO_LEARNING_PATH_HRUID],
                testLearningPath.language as Language,
                'the source'
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.filter((it) => it.hruid === TEST_DWENGO_LEARNING_PATH_HRUID).length).not.toBe(0);
            expect(result.data?.filter((it) => it.hruid === testLearningPath.hruid).length).not.toBe(0);
            expect(result.data?.find((it) => it.hruid === TEST_DWENGO_LEARNING_PATH_HRUID)?.title).toEqual(TEST_DWENGO_LEARNING_PATH_TITLE);
            expect(result.data?.find((it) => it.hruid === testLearningPath.hruid)?.title).toEqual(testLearningPath.title);
        });
        it('should include both the learning objects from the Dwengo API and learning objects from the database in its response', async () => {
            const result = await learningPathService.fetchLearningPaths(
                [testLearningPath.hruid],
                testLearningPath.language as Language,
                'the source'
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // Should include all the nodes, even those pointing to foreign learning objects.
            expect([...result.data![0].nodes.map((it) => it.learningobject_hruid)].sort((a, b) => a.localeCompare(b))).toEqual(
                testLearningPath.nodes.map((it) => it.learningobject_hruid).sort((a, b) => a.localeCompare(b))
            );
        });
    });
    describe('searchLearningPath', () => {
        it('should include both the learning paths from the Dwengo API and those from the database in its response', async () => {
            // This matches the learning object in the database, but definitely also some learning objects in the Dwengo API.
            const result = await learningPathService.searchLearningPaths(
                testLearningPath.title.substring(2, 3),
                testLearningPath.language as Language
            );

            // Should find the one from the database
            expect(result.filter((it) => it.hruid === testLearningPath.hruid && it.title === testLearningPath.title).length).toBe(1);

            // But should not only find that one.
            expect(result.length).not.toBeLessThan(2);
        });
        it('should still return results from the Dwengo API even though there are no matches in the database', async () => {
            const result = await learningPathService.searchLearningPaths(TEST_DWENGO_EXCLUSIVE_LEARNING_PATH_SEARCH_QUERY, Language.Dutch);

            // Should find something...
            expect(result.length).not.toBe(0);

            // But not the example learning path.
            expect(result.filter((it) => it.hruid === testLearningPath.hruid && it.title === testLearningPath.title).length).toBe(0);
        });
        it('should return an empty list if neither the Dwengo API nor the database contains matches', async () => {
            const result = await learningPathService.searchLearningPaths(TEST_SEARCH_QUERY_EXPECTING_NO_MATCHES, Language.Dutch);
            expect(result.length).toBe(0);
        });
    });
});
