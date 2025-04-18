import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import { LearningObject } from '../../../src/entities/content/learning-object.entity';
import databaseLearningObjectProvider from '../../../src/services/learning-objects/database-learning-object-provider';
import { expectToBeCorrectFilteredLearningObject } from '../../test-utils/expectations';
import { Language } from '@dwengo-1/common/util/language';
import {
    FilteredLearningObject,
    LearningObjectNode,
    LearningPathIdentifier
} from '@dwengo-1/common/interfaces/learning-content';
import {
    testPartiallyDatabaseAndPartiallyDwengoApiLearningPath
} from "../../test_assets/content/learning-paths.testdata";
import {testLearningObjectPnNotebooks} from "../../test_assets/content/learning-objects.testdata";
import { LearningPath } from '@dwengo-1/common/dist/interfaces/learning-content';
import {RequiredEntityData} from "@mikro-orm/core";
import {getHtmlRenderingForTestLearningObject} from "../../test-utils/get-html-rendering";

const EXPECTED_TITLE_FROM_DWENGO_LEARNING_OBJECT = 'Notebook opslaan';

describe('DatabaseLearningObjectProvider', () => {
    let exampleLearningObject: RequiredEntityData<LearningObject>;
    let exampleLearningPath: LearningPath;
    let exampleLearningPathId: LearningPathIdentifier;

    beforeAll(async () => {
        await setupTestApp();
        exampleLearningObject = testLearningObjectPnNotebooks;
        exampleLearningPath = testPartiallyDatabaseAndPartiallyDwengoApiLearningPath;

        exampleLearningPathId = {
            hruid: exampleLearningPath.hruid,
            language: exampleLearningPath.language as Language
        };
    });
    describe('getLearningObjectById', () => {
        it('should return the learning object when it is queried by its id', async () => {
            const result: FilteredLearningObject | null = await databaseLearningObjectProvider.getLearningObjectById(exampleLearningObject);
            expect(result).toBeTruthy();
            expectToBeCorrectFilteredLearningObject(result, exampleLearningObject);
        });

        it('should return the learning object when it is queried by only hruid and language (but not version)', async () => {
            const result: FilteredLearningObject | null = await databaseLearningObjectProvider.getLearningObjectById({
                hruid: exampleLearningObject.hruid,
                language: exampleLearningObject.language,
            });
            expect(result).toBeTruthy();
            expectToBeCorrectFilteredLearningObject(result, exampleLearningObject);
        });

        it('should return null when queried with an id that does not exist', async () => {
            const result: FilteredLearningObject | null = await databaseLearningObjectProvider.getLearningObjectById({
                hruid: 'non_existing_hruid',
                language: Language.Dutch,
            });
            expect(result).toBeNull();
        });
    });
    describe('getLearningObjectHTML', () => {
        it('should return the correct rendering of the learning object', async () => {
            const result = await databaseLearningObjectProvider.getLearningObjectHTML(exampleLearningObject);
            // Set newlines so your tests are platform-independent.
            expect(result).toEqual(getHtmlRenderingForTestLearningObject(exampleLearningObject).replace(/\r\n/g, '\n'));
        });
        it('should return null for a non-existing learning object', async () => {
            const result = await databaseLearningObjectProvider.getLearningObjectHTML({
                hruid: 'non_existing_hruid',
                language: Language.Dutch,
            });
            expect(result).toBeNull();
        });
    });
    describe('getLearningObjectIdsFromPath', () => {
        it('should return all learning object IDs from a path', async () => {
            const result = await databaseLearningObjectProvider.getLearningObjectIdsFromPath(exampleLearningPathId);
            expect(new Set(result)).toEqual(
                new Set(exampleLearningPath.nodes.map((it: LearningObjectNode) => it.learningobject_hruid))
            );
        });
        it('should throw an error if queried with a path identifier for which there is no learning path', async () => {
            await expect(
                (async (): Promise<void> => {
                    await databaseLearningObjectProvider.getLearningObjectIdsFromPath({
                        hruid: 'non_existing_hruid',
                        language: Language.Dutch,
                    });
                })()
            ).rejects.toThrowError();
        });
    });
    describe('getLearningObjectsFromPath', () => {
        it('should correctly return all learning objects which are on the path, even those who are not in the database', async () => {
            const result = await databaseLearningObjectProvider.getLearningObjectsFromPath(exampleLearningPathId);
            expect(result.length).toBe(exampleLearningPath.nodes.length);
            expect(new Set(result.map((it) => it.key))).toEqual(
                new Set(exampleLearningPath.nodes.map((it: LearningObjectNode) => it.learningobject_hruid))
            );

            expect(result.map((it) => it.title)).toContainEqual(EXPECTED_TITLE_FROM_DWENGO_LEARNING_OBJECT);
        });
        it('should throw an error if queried with a path identifier for which there is no learning path', async () => {
            await expect(
                (async (): Promise<void> => {
                    await databaseLearningObjectProvider.getLearningObjectsFromPath({
                        hruid: 'non_existing_hruid',
                        language: Language.Dutch,
                    });
                })()
            ).rejects.toThrowError();
        });
    });
});
