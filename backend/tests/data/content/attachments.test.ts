import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests';
import {
    getAttachmentRepository,
    getLearningObjectRepository,
} from '../../../src/data/repositories';
import { AttachmentRepository } from '../../../src/data/content/attachment-repository';
import { LearningObjectRepository } from '../../../src/data/content/learning-object-repository';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier';
import { Language } from '../../../src/entities/content/language';

describe('AttachmentRepository', () => {
    let attachmentRepository: AttachmentRepository;
    let learningObjectRepository: LearningObjectRepository;

    beforeAll(async () => {
        await setupTestApp();
        attachmentRepository = getAttachmentRepository();
        learningObjectRepository = getLearningObjectRepository();
    });

    it('should return the requested attachment', async () => {
        const id = new LearningObjectIdentifier('id02', Language.English, '1');
        const learningObject =
            await learningObjectRepository.findByIdentifier(id);

        const attachment =
            await attachmentRepository.findByLearningObjectAndNumber(
                learningObject!,
                1
            );

        expect(attachment).toBeTruthy();
    });
});
