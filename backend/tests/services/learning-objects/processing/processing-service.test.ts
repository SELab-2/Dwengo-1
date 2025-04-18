import { beforeAll, describe, expect, it } from 'vitest';
import processingService from '../../../../src/services/learning-objects/processing/processing-service';
import {
    testLearningObjectEssayQuestion,
    testLearningObjectMultipleChoice,
    testLearningObjectPnNotebooks,
} from '../../../test_assets/content/learning-objects.testdata';
import { getHtmlRenderingForTestLearningObject } from '../../../test-utils/get-html-rendering';
import { getLearningObjectRepository } from '../../../../src/data/repositories';
import { setupTestApp } from '../../../setup-tests';

describe('ProcessingService', () => {
    beforeAll(async () => {
        await setupTestApp();
    });

    it('renders a markdown learning object correctly', async () => {
        const markdownLearningObject = getLearningObjectRepository().create(testLearningObjectPnNotebooks);
        const result = await processingService.render(markdownLearningObject);
        // Set newlines so your tests are platform-independent.
        expect(result).toEqual(getHtmlRenderingForTestLearningObject(markdownLearningObject).replace(/\r\n/g, '\n'));
    });

    it('renders a multiple choice question correctly', async () => {
        const testLearningObject = getLearningObjectRepository().create(testLearningObjectMultipleChoice);
        const result = await processingService.render(testLearningObject);
        expect(result).toEqual(getHtmlRenderingForTestLearningObject(testLearningObjectMultipleChoice).replace(/\r\n/g, '\n'));
    });

    it('renders an essay question correctly', async () => {
        const essayLearningObject = getLearningObjectRepository().create(testLearningObjectEssayQuestion);
        const result = await processingService.render(essayLearningObject);
        expect(result).toEqual(getHtmlRenderingForTestLearningObject(essayLearningObject).replace(/\r\n/g, '\n'));
    });
});
