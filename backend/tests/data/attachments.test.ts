import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../setup-tests';
import {
    getAttachmentRepository,
    getLearningObjectRepository,
} from '../../src/data/repositories';
import { AttachmentRepository } from '../../src/data/content/attachment-repository';
import { LearningObjectRepository } from '../../src/data/content/learning-object-repository';
import { LearningObjectIdentifier } from '../../src/entities/content/learning-object-identifier';
import { Language } from '../../src/entities/content/language';

describe('AttachmentRepository', () => {
    let AttachmentRepository: AttachmentRepository;
    let LearningObjectRepository: LearningObjectRepository;

    beforeAll(async () => {
        await setupTestApp();
        AttachmentRepository = getAttachmentRepository();
        LearningObjectRepository = getLearningObjectRepository();
    });

    it('should return the requested attachment', async () => {
        const id = new LearningObjectIdentifier('id02', Language.English, '1');
        const learningObject =
            await LearningObjectRepository.findByIdentifier(id);

        const attachment =
            await AttachmentRepository.findByLearningObjectAndNumber(
                learningObject!,
                1
            );

        expect(attachment).toBeTruthy();
    });
});
