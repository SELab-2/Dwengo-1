import {beforeAll, describe, expect, it} from "vitest";
import {LearningObject} from "../../../src/entities/content/learning-object.entity";
import {setupTestApp} from "../../setup-tests";
import {LearningPath} from "../../../src/entities/content/learning-path.entity";
import {getLearningObjectRepository, getLearningPathRepository} from "../../../src/data/repositories";
import learningObjectExample from "../../test-assets/learning-objects/pn_werkingnotebooks/pn-werkingnotebooks-example";
import learningPathExample from "../../test-assets/learning-paths/pn-werking-example"
import databaseLearningPathProvider from "../../../src/services/learning-paths/database-learning-path-provider";

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
    let example: {learningObject: LearningObject, learningPath: LearningPath};

    beforeAll(async () => {
        await setupTestApp();
        example = await initExampleData();
    });

    describe("fetchLearningPaths", () => {
        it("returns the learning path correctly", () => {
            const result = await databaseLearningPathProvider.fetchLearningPaths(
                [example.learningPath.hruid],
                example.learningPath.language,
                "the source"
            );
            expect(result.success).toBe(true);
            expect(result.data?.length).toBe(1);
            expect(result.data)
        })
    });
});
