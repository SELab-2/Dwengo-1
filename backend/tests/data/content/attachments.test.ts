import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests.js';
import { getAttachmentRepository } from '../../../src/data/repositories.js';
import { AttachmentRepository } from '../../../src/data/content/attachment-repository.js';
import { testLearningObject02 } from "../../test_assets/content/learning-objects.testdata";

describe('AttachmentRepository', () => {
    let attachmentRepository: AttachmentRepository;

    beforeAll(async () => {
        await setupTestApp();
        attachmentRepository = getAttachmentRepository();
    });

    it('should return the requested attachment', async () => {
        const attachment = await attachmentRepository.findByMostRecentVersionOfLearningObjectAndName(
            testLearningObject02.hruid,
            testLearningObject02.language,
            'attachment01'
        );

        expect(attachment).toBeTruthy();
    });
});
