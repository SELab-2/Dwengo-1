import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';
import learningObjectService from '../../../src/services/learning-objects/learning-object-service';
import { envVars, getEnvVar } from '../../../src/util/envVars';
import {
    LearningObjectIdentifierDTO,
    LearningPath as LearningPathDTO,
    LearningPathIdentifier
} from '@dwengo-1/common/interfaces/learning-content';
import { Language } from '@dwengo-1/common/util/language';
import {testLearningObjectPnNotebooks} from "../../test_assets/content/learning-objects.testdata";
import {
    testPartiallyDatabaseAndPartiallyDwengoApiLearningPath
} from "../../test_assets/content/learning-paths.testdata";
import {RequiredEntityData} from "@mikro-orm/core";
import {getHtmlRenderingForTestLearningObject} from "../../test-utils/get-html-rendering";

const EXPECTED_DWENGO_LEARNING_OBJECT_TITLE = 'Werken met notebooks';
const DWENGO_TEST_LEARNING_OBJECT_ID: LearningObjectIdentifierDTO = {
    hruid: 'pn_werkingnotebooks',
    language: Language.Dutch,
    version: 3,
};

const DWENGO_TEST_LEARNING_PATH_ID: LearningPathIdentifier = {
    hruid: 'pn_werking',
    language: Language.Dutch,
};
const DWENGO_TEST_LEARNING_PATH_HRUIDS = new Set(['pn_werkingnotebooks', 'pn_werkingnotebooks2', 'pn_werkingnotebooks3']);

describe('LearningObjectService', () => {
    let exampleLearningObject: RequiredEntityData<LearningObject>;
    let exampleLearningPath: LearningPathDTO;
    let exampleLearningPathId: LearningPathIdentifier;

    beforeAll(async () => {
        await setupTestApp();
        exampleLearningObject = testLearningObjectPnNotebooks;
        exampleLearningPath = testPartiallyDatabaseAndPartiallyDwengoApiLearningPath;

        exampleLearningPathId = {
            hruid: exampleLearningPath.hruid,
            language: exampleLearningPath.language as Language
        }
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
            // Set newlines so your tests are platform-independent.
            expect(result).toEqual(getHtmlRenderingForTestLearningObject(exampleLearningObject).replace(/\r\n/g, '\n'));
        });
        it(
            'returns the same HTML as the Dwengo API when queried with the identifier of a learning object that does ' +
                'not start with the user content prefix',
            async () => {
                const result = await learningObjectService.getLearningObjectHTML(DWENGO_TEST_LEARNING_OBJECT_ID);
                expect(result).not.toBeNull();

                const responseFromDwengoApi = await fetch(
                    getEnvVar(envVars.LearningContentRepoApiBaseUrl) +
                        `/learningObject/getRaw?hruid=${DWENGO_TEST_LEARNING_OBJECT_ID.hruid}&language=${DWENGO_TEST_LEARNING_OBJECT_ID.language}&version=${DWENGO_TEST_LEARNING_OBJECT_ID.version}`
                );
                const responseHtml = await responseFromDwengoApi.text();
                expect(result).toEqual(responseHtml);
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
        it('returns all learning objects when a learning path in the database is queried', async () => {
            const result = await learningObjectService.getLearningObjectsFromPath(exampleLearningPathId);
            expect(result.map(it=> it.key)).toEqual(
                exampleLearningPath.nodes.map(it => it.learningobject_hruid)
            );
        });
        it('also returns all learning objects when a learning path from the Dwengo API is queried', async () => {
            const result = await learningObjectService.getLearningObjectsFromPath(DWENGO_TEST_LEARNING_PATH_ID);
            expect(new Set(result.map((it) => it.key))).toEqual(DWENGO_TEST_LEARNING_PATH_HRUIDS);
        });
        it('returns an empty list when queried with a non-existing learning path id', async () => {
            const result = await learningObjectService.getLearningObjectsFromPath({
                hruid: 'non_existing',
                language: Language.Dutch,
            });
            expect(result).toStrictEqual([]);
        });
    });

    describe('getLearningObjectIdsFromPath', () => {
        it('returns all learning objects when a learning path in the database is queried', async () => {
            const result = await learningObjectService.getLearningObjectIdsFromPath(exampleLearningPathId);
            expect(result).toEqual(exampleLearningPath.nodes.map(it => it.learningobject_hruid));
        });
        it('also returns all learning object hruids when a learning path from the Dwengo API is queried', async () => {
            const result = await learningObjectService.getLearningObjectIdsFromPath(DWENGO_TEST_LEARNING_PATH_ID);
            expect(new Set(result)).toEqual(DWENGO_TEST_LEARNING_PATH_HRUIDS);
        });
        it('returns an empty list when queried with a non-existing learning path id', async () => {
            const result = await learningObjectService.getLearningObjectIdsFromPath({
                hruid: 'non_existing',
                language: Language.Dutch,
            });
            expect(result).toStrictEqual([]);
        });
    });
});
