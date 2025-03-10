import {beforeAll, describe, expect, it} from "vitest";
import {LearningObject} from "../../../src/entities/content/learning-object.entity";
import {setupTestApp} from "../../setup-tests";
import {LearningPath} from "../../../src/entities/content/learning-path.entity";
import {getLearningObjectRepository, getLearningPathRepository} from "../../../src/data/repositories";
import learningObjectExample from "../../test-assets/learning-objects/pn_werkingnotebooks/pn-werkingnotebooks-example";
import learningPathExample from "../../test-assets/learning-paths/pn-werking-example"
import databaseLearningPathProvider from "../../../src/services/learning-paths/database-learning-path-provider";
import {expectToBeCorrectLearningPath} from "../../test-utils/expectations";
import {LearningObjectRepository} from "../../../src/data/content/learning-object-repository";
import learningObjectService from "../../../src/services/learning-objects/learning-object-service";
import {Language} from "../../../src/entities/content/language";

async function initExampleData(): Promise<{ learningObject: LearningObject, learningPath: LearningPath }> {
    const learningObjectRepo = getLearningObjectRepository();
    const learningPathRepo = getLearningPathRepository();
    let learningObject = learningObjectExample.createLearningObject();
    let learningPath = learningPathExample.createLearningPath();
    await learningObjectRepo.save(learningObject);
    await learningPathRepo.save(learningPath);
    return { learningObject, learningPath };
}

describe("DatabaseLearningPathProvider", () => {
    let learningObjectRepo: LearningObjectRepository;
    let example: {learningObject: LearningObject, learningPath: LearningPath};

    beforeAll(async () => {
        await setupTestApp();
        example = await initExampleData();
        learningObjectRepo = getLearningObjectRepository();
    });

    describe("fetchLearningPaths", () => {
        it("returns the learning path correctly", async () => {
            const result = await databaseLearningPathProvider.fetchLearningPaths(
                [example.learningPath.hruid],
                example.learningPath.language,
                "the source"
            );
            expect(result.success).toBe(true);
            expect(result.data?.length).toBe(1);

            const learningObjectsOnPath = (await Promise.all(
                example.learningPath.nodes.map(node =>
                    learningObjectService.getLearningObjectById({
                        hruid: node.learningObjectHruid,
                        version: node.version,
                        language: node.language
                    }))
            )).filter(it => it !== null);

            expectToBeCorrectLearningPath(result.data![0], example.learningPath, learningObjectsOnPath)
        });
        it("returns a non-successful response if a non-existing learning path is queried", async () => {
            const result = await databaseLearningPathProvider.fetchLearningPaths(
                [example.learningPath.hruid],
                Language.Abkhazian, // wrong language
                "the source"
            );

            expect(result.success).toBe(false);
        });
    });

    describe("searchLearningPaths", () => {
        it("returns the correct learning path when queried with a substring of its title", async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                example.learningPath.title.substring(2, 6),
                example.learningPath.language
            );
            expect(result.length).toBe(1);
            expect(result[0].title).toBe(example.learningPath.title);
            expect(result[0].description).toBe(example.learningPath.description);
        });
        it("returns the correct learning path when queried with a substring of the description", async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                example.learningPath.description.substring(5, 12),
                example.learningPath.language
            );
            expect(result.length).toBe(1);
            expect(result[0].title).toBe(example.learningPath.title);
            expect(result[0].description).toBe(example.learningPath.description);
        });
        it("returns an empty result when queried with a text which is not a substring of the title or the description of a learning path", async () => {
            const result = await databaseLearningPathProvider.searchLearningPaths(
                "substring which does not occur in the title or the description of a learning object",
                example.learningPath.language
            );
            expect(result.length).toBe(0);
        });
    });
});
