import {beforeAll, describe, expect, it} from 'vitest';
import {setupTestApp} from '../../setup-tests';
import {LearningObject} from '../../../src/entities/content/learning-object.entity';
import {getLearningObjectRepository, getLearningPathRepository} from '../../../src/data/repositories';
import learningObjectExample from '../../test-assets/learning-objects/pn-werkingnotebooks/pn-werkingnotebooks-example';
import learningObjectService from '../../../src/services/learning-objects/learning-object-service';
import {LearningObjectIdentifier, LearningPathIdentifier} from '../../../src/interfaces/learning-content';
import {Language} from '../../../src/entities/content/language';
import {EnvVars, getEnvVar} from '../../../src/util/envvars';
import {LearningPath} from "../../../src/entities/content/learning-path.entity";
import learningPathExample from "../../test-assets/learning-paths/pn-werking-example";

const TEST_LEARNING_OBJECT_TITLE = 'Test title';
const EXPECTED_DWENGO_LEARNING_OBJECT_TITLE = 'Werken met notebooks';
const DWENGO_TEST_LEARNING_OBJECT_ID: LearningObjectIdentifier = {
    hruid: 'pn_werkingnotebooks',
    language: Language.Dutch,
    version: 3,
};

const DWENGO_TEST_LEARNING_PATH_ID: LearningPathIdentifier = {
    hruid: 'pn_werking',
    language: Language.Dutch
};
const DWENGO_TEST_LEARNING_PATH_HRUIDS = new Set(["pn_werkingnotebooks", "pn_werkingnotebooks2", "pn_werkingnotebooks3"]);

async function initExampleData(): Promise<{ learningObject: LearningObject; learningPath: LearningPath }> {
    const learningObjectRepo = getLearningObjectRepository();
    const learningPathRepo = getLearningPathRepository();
    const learningObject = learningObjectExample.createLearningObject();
    const learningPath = learningPathExample.createLearningPath();
    await learningObjectRepo.save(learningObject);
    await learningPathRepo.save(learningPath);
    return { learningObject, learningPath };
}

describe('LearningObjectService', () => {
    let exampleLearningObject: LearningObject;
    let exampleLearningPath: LearningPath;

    beforeAll(async () => {
        await setupTestApp();
        const exampleData = await initExampleData();
        exampleLearningObject = exampleData.learningObject;
        exampleLearningPath = exampleData.learningPath;
    });

    describe('getLearningObjectById', () => {
        it('returns the learning object from the Dwengo API if it does not have the user content prefix', async () => {
            const result = await learningObjectService.getLearningObjectById(DWENGO_TEST_LEARNING_OBJECT_ID);
            expect(result).not.toBeNull();
            expect(result?.title).toBe(EXPECTED_DWENGO_LEARNING_OBJECT_TITLE);
        });
        it('returns the learning object from the database if it does have the user content prefix', async () => {
            const result = await learningObjectService.getLearningObjectById(exampleLearningObject);
            expect(result).not.toBeNull();
            expect(result?.title).toBe(exampleLearningObject.title);
        });
        it('returns null if the hruid does not have the user content prefix and does not exist in the Dwengo repo', async () => {
            const result = await learningObjectService.getLearningObjectById({
                hruid: 'non-existing',
                language: Language.Dutch,
            });
            expect(result).toBeNull();
        });
    });

    describe('getLearningObjectHTML', () => {
        it('returns the expected HTML when queried with the identifier of a learning object saved in the database', async () => {
            const result = await learningObjectService.getLearningObjectHTML(exampleLearningObject);
            expect(result).not.toBeNull();
            expect(result).toEqual(learningObjectExample.getHTMLRendering());
        });
        it(
            'returns the same HTML as the Dwengo API when queried with the identifier of a learning object that does ' +
                'not start with the user content prefix',
            async () => {
                const result = await learningObjectService.getLearningObjectHTML(DWENGO_TEST_LEARNING_OBJECT_ID);
                expect(result).not.toBeNull();

                const htmlFromDwengoApi = await fetch(
                    getEnvVar(EnvVars.LearningContentRepoApiBaseUrl) +
                        `/learningObject/getRaw?hruid=${DWENGO_TEST_LEARNING_OBJECT_ID.hruid}&language=${DWENGO_TEST_LEARNING_OBJECT_ID.language}&version=${DWENGO_TEST_LEARNING_OBJECT_ID.version}`
                ).then((it) => it.text());
                expect(result).toEqual(htmlFromDwengoApi);
            }
        );
        it('returns null when queried with a non-existing identifier', async () => {
            const result = await learningObjectService.getLearningObjectHTML({
                hruid: 'non_existing_hruid',
                language: Language.Dutch,
            });
            expect(result).toBeNull();
        });
    });

    describe('getLearningObjectsFromPath', () => {
        it("returns all learning objects when a learning path in the database is queried", async () => {
            const result = await learningObjectService.getLearningObjectsFromPath(exampleLearningPath);
            expect(result.map(it => it.key)).toEqual(exampleLearningPath.nodes.map(it => it.learningObjectHruid));
        });
        it("also returns all learning objects when a learning path from the Dwengo API is queried", async () => {
            const result = await learningObjectService.getLearningObjectsFromPath(DWENGO_TEST_LEARNING_PATH_ID);
            expect(new Set(result.map(it => it.key))).toEqual(DWENGO_TEST_LEARNING_PATH_HRUIDS);
        });
        it("returns an empty list when queried with a non-existing learning path id", async () => {
            const result = await learningObjectService.getLearningObjectsFromPath({hruid: "non_existing", language: Language.Dutch});
            expect(result).toEqual([]);
        });
    });

    describe('getLearningObjectIdsFromPath', () => {
        it("returns all learning objects when a learning path in the database is queried", async () => {
            const result = await learningObjectService.getLearningObjectIdsFromPath(exampleLearningPath);
            expect(result).toEqual(exampleLearningPath.nodes.map(it => it.learningObjectHruid));
        });
        it("also returns all learning object hruids when a learning path from the Dwengo API is queried", async () => {
            const result = await learningObjectService.getLearningObjectIdsFromPath(DWENGO_TEST_LEARNING_PATH_ID);
            expect(new Set(result)).toEqual(DWENGO_TEST_LEARNING_PATH_HRUIDS);
        });
        it("returns an empty list when queried with a non-existing learning path id", async () => {
            const result = await learningObjectService.getLearningObjectIdsFromPath({hruid: "non_existing", language: Language.Dutch});
            expect(result).toEqual([]);
        });
    });
});
