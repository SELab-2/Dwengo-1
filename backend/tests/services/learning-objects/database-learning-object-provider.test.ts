import {beforeAll, describe, expect, it} from "vitest";
import {setupTestApp} from "../../setup-tests";
import {getLearningObjectRepository} from "../../../src/data/repositories";
import example from "../../test-assets/learning-objects/pn_werkingnotebooks/pn-werkingnotebooks-example";
import {LearningObject} from "../../../src/entities/content/learning-object.entity";
import databaseLearningObjectProvider from "../../../src/services/learning-objects/database-learning-object-provider";
import {
    createExampleLearningObjectWithAttachments
} from "../../test-assets/learning-objects/create-example-learning-object-with-attachments";
import {expectToBeCorrectFilteredLearningObject} from "../../test-utils/expectations";
import {FilteredLearningObject} from "../../../src/interfaces/learning-content";
import {Language} from "../../../src/entities/content/language";

async function initExampleData(): Promise<LearningObject> {
    let learningObjectRepo = getLearningObjectRepository();
    let exampleLearningObject = createExampleLearningObjectWithAttachments(example);
    await learningObjectRepo.insert(exampleLearningObject);
    return exampleLearningObject;
}

describe("DatabaseLearningObjectProvider", () => {
    let exampleLearningObject: LearningObject;

    beforeAll(async () => {
        await setupTestApp();
        exampleLearningObject = await initExampleData();
    });
    describe("getLearningObjectById", () => {
        it("should return the learning object when it is queried by its id", async () => {
            const result: FilteredLearningObject | null = await databaseLearningObjectProvider.getLearningObjectById(exampleLearningObject);
            expect(result).toBeTruthy();
            expectToBeCorrectFilteredLearningObject(result!, exampleLearningObject);
        });

        it("should return the learning object when it is queried by only hruid and language (but not version)", async () => {
            const result: FilteredLearningObject | null = await databaseLearningObjectProvider.getLearningObjectById({
                hruid: exampleLearningObject.hruid,
                language: exampleLearningObject.language
            });
            expect(result).toBeTruthy();
            expectToBeCorrectFilteredLearningObject(result!, exampleLearningObject);
        });

        it("should return null when queried with an id that does not exist", async () => {
            const result: FilteredLearningObject | null = await databaseLearningObjectProvider.getLearningObjectById({
                hruid: "non_existing_hruid",
                language: Language.Dutch
            });
            expect(result).toBeNull();
        });
    });
    describe("getLearningObjectHTML", () => {
        it("should return the correct rendering of the learning object", async () => {
            const result = await databaseLearningObjectProvider.getLearningObjectHTML(exampleLearningObject);
            expect(result).toEqual(example.getHTMLRendering());
        });
    });
});
