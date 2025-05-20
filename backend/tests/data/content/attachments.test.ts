import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests.js';
import { getAttachmentRepository } from '../../../src/data/repositories.js';
import { AttachmentRepository } from '../../../src/data/content/attachment-repository.js';
import { getAttachment01 } from '../../test_assets/content/attachments.testdata.js';

describe('AttachmentRepository', () => {
    let attachmentRepository: AttachmentRepository;

    beforeAll(async () => {
        await setupTestApp();
        attachmentRepository = getAttachmentRepository();
    });

    it('should return the requested attachment', async () => {
        const usedAttachment = getAttachment01();
        const attachment = await attachmentRepository.findByMostRecentVersionOfLearningObjectAndName(
            usedAttachment.learningObject.hruid,
            usedAttachment.learningObject.language,
            usedAttachment.name
        );

        expect(attachment).toBeTruthy();
    });
});
