import {beforeAll, describe, expect, it} from "vitest";
import {setupTestApp} from "../../setup-tests";
import {LearningObject} from "../../../src/entities/content/learning-object.entity";
import {getLearningObjectRepository} from "../../../src/data/repositories";
import learningObjectExample from "../../test-assets/learning-objects/pn-werkingnotebooks/pn-werkingnotebooks-example";
import learningObjectService from "../../../src/services/learning-objects/learning-object-service";
import {LearningObjectIdentifier} from "../../../src/interfaces/learning-content";
import {Language} from "../../../src/entities/content/language";
import {EnvVars, getEnvVar} from "../../../src/util/envvars";

const TEST_LEARNING_OBJECT_TITLE = "Test title";
const EXPECTED_DWENGO_LEARNING_OBJECT_TITLE = "Werken met notebooks";
const DWENGO_TEST_LEARNING_OBJECT_ID: LearningObjectIdentifier = {
    hruid: "pn-werkingnotebooks",
    language: Language.Dutch,
    version: 3
};

async function initExampleData(): Promise<LearningObject> {
    const learningObjectRepo = getLearningObjectRepository();
    let learningObject = learningObjectExample.createLearningObject();
    learningObject.title = TEST_LEARNING_OBJECT_TITLE
    await learningObjectRepo.save(learningObject);
    return learningObject;
}

describe("LearningObjectService", () => {
    let exampleLearningObject: LearningObject;

    beforeAll(async () => {
        await setupTestApp();
        exampleLearningObject = await initExampleData();
    });

    describe("getLearningObjectById", () => {
        it("returns the learning object from the Dwengo API if it does not have the user content prefix", async () => {
            const result = await learningObjectService.getLearningObjectById(DWENGO_TEST_LEARNING_OBJECT_ID);
            expect(result).not.toBeNull();
            expect(result?.title).toBe(EXPECTED_DWENGO_LEARNING_OBJECT_TITLE);
        });
        it("returns the learning object from the database if it does have the user content prefix", async () => {
            const result = await learningObjectService.getLearningObjectById(exampleLearningObject);
            expect(result).not.toBeNull();
            expect(result?.title).toBe(exampleLearningObject.title);
        });
        it("returns null if the hruid does not have the user content prefix and does not exist in the Dwengo repo", async () => {
            const result = await learningObjectService.getLearningObjectById({
                hruid: "non-existing",
                language: Language.Dutch
            });
            expect(result).toBeNull();
        });
    });

    describe("getLearningObjectHTML", () => {
        it("returns the expected HTML when queried with the identifier of a learning object saved in the database", async () => {
            const result = await learningObjectService.getLearningObjectHTML(exampleLearningObject);
            expect(result).not.toBeNull();
            expect(result).toEqual(learningObjectExample.getHTMLRendering());
        });
        it("returns the same HTML as the Dwengo API when queried with the identifier of a learning object that does " +
            "not start with the user content prefix", async () => {
            const result = await learningObjectService.getLearningObjectHTML(DWENGO_TEST_LEARNING_OBJECT_ID);
            expect(result).not.toBeNull();

            const htmlFromDwengoApi = await fetch(
                getEnvVar(EnvVars.LearningContentRepoApiBaseUrl)
                + `/learningObject/getRaw?hruid=${DWENGO_TEST_LEARNING_OBJECT_ID.hruid}&language=${DWENGO_TEST_LEARNING_OBJECT_ID.language}&version=${DWENGO_TEST_LEARNING_OBJECT_ID.version}`
            ).then(it => it.text());
            expect(result).toEqual(htmlFromDwengoApi);
        });
        it("returns null when queried with a non-existing identifier", async () => {
            const result = await learningObjectService.getLearningObjectHTML({
                hruid: "non_existing_hruid",
                language: Language.Dutch
            });
            expect(result).toBeNull();
        });
    });
});
