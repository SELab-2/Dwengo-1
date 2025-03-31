import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests.js';
import { getAttachmentRepository, getLearningObjectRepository } from '../../../src/data/repositories.js';
import { AttachmentRepository } from '../../../src/data/content/attachment-repository.js';
import { LearningObjectRepository } from '../../../src/data/content/learning-object-repository.js';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier.js';
import { Language } from 'dwengo-1-common/src/util/language.js';

describe('AttachmentRepository', () => {
    let attachmentRepository: AttachmentRepository;
    let learningObjectRepository: LearningObjectRepository;

    beforeAll(async () => {
        await setupTestApp();
        attachmentRepository = getAttachmentRepository();
        learningObjectRepository = getLearningObjectRepository();
    });

    it('should return the requested attachment', async () => {
        const id = new LearningObjectIdentifier('id02', Language.English, 1);
        const learningObject = await learningObjectRepository.findByIdentifier(id);

        const attachment = await attachmentRepository.findByMostRecentVersionOfLearningObjectAndName(
            learningObject!.hruid,
            Language.English,
            'attachment01'
        );

        expect(attachment).toBeTruthy();
    });
});
