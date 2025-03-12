import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';
import { LearningPath } from '../../../src/entities/content/learning-path.entity';
import { getLearningObjectRepository, getLearningPathRepository } from '../../../src/data/repositories';
import learningObjectExample from '../../test-assets/learning-objects/pn-werkingnotebooks/pn-werkingnotebooks-example';
import learningPathExample from '../../test-assets/learning-paths/pn-werking-example';
import { Language } from '../../../src/entities/content/language';
import learningPathService from '../../../src/services/learning-paths/learning-path-service';

async function initExampleData(): Promise<{ learningObject: LearningObject; learningPath: LearningPath }> {
    const learningObjectRepo = getLearningObjectRepository();
    const learningPathRepo = getLearningPathRepository();
    const learningObject = learningObjectExample.createLearningObject();
    const learningPath = learningPathExample.createLearningPath();
    await learningObjectRepo.save(learningObject);
    await learningPathRepo.save(learningPath);
    return { learningObject, learningPath };
}

const TEST_DWENGO_LEARNING_PATH_HRUID = 'pn_werking';
const TEST_DWENGO_LEARNING_PATH_TITLE = 'Werken met notebooks';
const TEST_DWENGO_EXCLUSIVE_LEARNING_PATH_SEARCH_QUERY = 'Microscopie';
const TEST_SEARCH_QUERY_EXPECTING_NO_MATCHES = 'su$m8f9usf89ud<p9<U8SDP8UP9';

describe('LearningPathService', () => {
    let example: { learningObject: LearningObject; learningPath: LearningPath };
    beforeAll(async () => {
        await setupTestApp();
        example = await initExampleData();
    });
    describe('fetchLearningPaths', () => {
        it('should return learning paths both from the database and from the Dwengo API', async () => {
            const result = await learningPathService.fetchLearningPaths(
                [example.learningPath.hruid, TEST_DWENGO_LEARNING_PATH_HRUID],
                example.learningPath.language,
                'the source'
            );
            expect(result.success).toBeTruthy();
            expect(result.data?.filter((it) => it.hruid === TEST_DWENGO_LEARNING_PATH_HRUID).length).not.toBe(0);
            expect(result.data?.filter((it) => it.hruid === example.learningPath.hruid).length).not.toBe(0);
            expect(result.data?.filter((it) => it.hruid === TEST_DWENGO_LEARNING_PATH_HRUID)[0].title).toEqual(TEST_DWENGO_LEARNING_PATH_TITLE);
            expect(result.data?.filter((it) => it.hruid === example.learningPath.hruid)[0].title).toEqual(example.learningPath.title);
        });
        it('should include both the learning objects from the Dwengo API and learning objects from the database in its response', async () => {
            const result = await learningPathService.fetchLearningPaths([example.learningPath.hruid], example.learningPath.language, 'the source');
            expect(result.success).toBeTruthy();
            expect(result.data?.length).toBe(1);

            // Should include all the nodes, even those pointing to foreign learning objects.
            expect([...result.data![0].nodes.map((it) => it.learningobject_hruid)].sort()).toEqual(
                example.learningPath.nodes.map((it) => it.learningObjectHruid).sort()
            );
        });
    });
    describe('searchLearningPath', () => {
        it('should include both the learning paths from the Dwengo API and those from the database in its response', async () => {
            // This matches the learning object in the database, but definitely also some learning objects in the Dwengo API.
            const result = await learningPathService.searchLearningPaths(example.learningPath.title.substring(2, 3), example.learningPath.language);

            // Should find the one from the database
            expect(result.filter((it) => it.hruid === example.learningPath.hruid && it.title === example.learningPath.title).length).toBe(1);

            // But should not only find that one.
            expect(result.length).not.toBeLessThan(2);
        });
        it('should still return results from the Dwengo API even though there are no matches in the database', async () => {
            const result = await learningPathService.searchLearningPaths(TEST_DWENGO_EXCLUSIVE_LEARNING_PATH_SEARCH_QUERY, Language.Dutch);

            // Should find something...
            expect(result.length).not.toBe(0);

            // But not the example learning path.
            expect(result.filter((it) => it.hruid === example.learningPath.hruid && it.title === example.learningPath.title).length).toBe(0);
        });
        it('should return an empty list if neither the Dwengo API nor the database contains matches', async () => {
            const result = await learningPathService.searchLearningPaths(TEST_SEARCH_QUERY_EXPECTING_NO_MATCHES, Language.Dutch);
            expect(result.length).toBe(0);
        });
    });
});
