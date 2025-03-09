import {beforeAll, describe, it, expect} from "vitest";
import {LearningObjectRepository} from "../../../src/data/content/learning-object-repository";
import {setupTestApp} from "../../setup-tests";
import {getLearningObjectRepository} from "../../../src/data/repositories";
import example from "../../test-assets/learning-objects/pn_werkingnotebooks/pn-werkingnotebooks-example.js"
import {LearningObject} from "../../../src/entities/content/learning-object.entity";
import {expectToBeCorrectEntity} from "../../test-utils/expect-to-be-correct-entity";

describe("LearningObjectRepository", () => {
    let learningObjectRepository: LearningObjectRepository;

    let exampleLearningObject: LearningObject;

    beforeAll(async () => {
        await setupTestApp();
        learningObjectRepository = getLearningObjectRepository();
    });

    it("should be able to add a learning object to it without an error", async () => {
        exampleLearningObject = example.createLearningObject();
        await learningObjectRepository.insert(exampleLearningObject);
    });

    it("should return the learning object when queried by id", async () => {
        const result = await learningObjectRepository.findByIdentifier({
            hruid: exampleLearningObject.hruid,
            language: exampleLearningObject.language,
            version: exampleLearningObject.version
        });
        expect(result).toBeInstanceOf(LearningObject);
        console.log(result);
        expectToBeCorrectEntity({
            name: "actual",
            entity: result!
        }, {
            name: "expected",
            entity: exampleLearningObject
        });
    });

    it("should return null when non-existing version is queried", async () => {
        const result = await learningObjectRepository.findByIdentifier({
            hruid: exampleLearningObject.hruid,
            language: exampleLearningObject.language,
            version: 100
        });
        expect(result).toBe(null);
    });

    let newerExample: LearningObject;

    it("should allow a learning object with the same id except a different version to be added", async () => {
        newerExample = example.createLearningObject();
        newerExample.version = 10;
        newerExample.title += " (nieuw)";
        await learningObjectRepository.save(newerExample);
    });

    it("should return the newest version of the learning object when queried by only hruid and language", async () => {
        const result = await learningObjectRepository.findLatestByHruidAndLanguage(newerExample.hruid, newerExample.language);
        expect(result).toBeInstanceOf(LearningObject);
        expect(result?.version).toBe(10);
        expect(result?.title).toContain("(nieuw)");
    });

    it("should return null when queried by non-existing hruid or language", async () => {
        const result = await learningObjectRepository.findLatestByHruidAndLanguage("something_that_does_not_exist", exampleLearningObject.language);
        expect(result).toBe(null);
    });

});
