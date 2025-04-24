import { beforeAll, describe, expect, it } from 'vitest';
import { setupTestApp } from '../../setup-tests.js';
import { getAttachmentRepository, getLearningObjectRepository } from '../../../src/data/repositories.js';
import { AttachmentRepository } from '../../../src/data/content/attachment-repository.js';
import { LearningObject } from '../../../src/entities/content/learning-object.entity.js';
import { Attachment } from '../../../src/entities/content/attachment.entity.js';
import { LearningObjectIdentifier } from '../../../src/entities/content/learning-object-identifier.js';
import { testLearningObjectPnNotebooks } from '../../test_assets/content/learning-objects.testdata';
import { v4 as uuidV4 } from 'uuid';

describe('AttachmentRepository', () => {
    let attachmentRepo: AttachmentRepository;
    let newLearningObject: LearningObject;
    let attachmentsOlderLearningObject: Attachment[];

    beforeAll(async () => {
        await setupTestApp();

        attachmentsOlderLearningObject = testLearningObjectPnNotebooks.attachments as Attachment[];

        attachmentRepo = getAttachmentRepository();
        const learningObjectRepo = getLearningObjectRepository();

        const newLearningObjectData = structuredClone(testLearningObjectPnNotebooks);
        newLearningObjectData.title = 'Newer example';
        newLearningObjectData.version = 101;
        newLearningObjectData.attachments = [];
        newLearningObjectData.uuid = uuidV4();
        newLearningObjectData.content = Buffer.from('Content of the newer example');

        newLearningObject = learningObjectRepo.create(newLearningObjectData);
        await learningObjectRepo.save(newLearningObject);
    });

    let attachmentOnlyNewer: Attachment;
    it('allows us to add attachments with the same name to a different learning object without throwing an error', async () => {
        attachmentOnlyNewer = structuredClone(attachmentsOlderLearningObject[0]);
        attachmentOnlyNewer.learningObject = newLearningObject;
        attachmentOnlyNewer.content = Buffer.from('New attachment content');

        await attachmentRepo.save(attachmentRepo.create(attachmentOnlyNewer));
    });

    let olderLearningObjectId: LearningObjectIdentifier;
    it('returns the correct attachment when queried by learningObjectId and attachment name', async () => {
        olderLearningObjectId = {
            hruid: testLearningObjectPnNotebooks.hruid,
            language: testLearningObjectPnNotebooks.language,
            version: testLearningObjectPnNotebooks.version,
        };

        const result = await attachmentRepo.findByLearningObjectIdAndName(olderLearningObjectId, attachmentsOlderLearningObject[0].name);
        expect(result).not.toBeNull();
        expect(result!.name).toEqual(attachmentsOlderLearningObject[0].name);
        expect(result!.content).toEqual(attachmentsOlderLearningObject[0].content);
    });

    it('returns null when queried by learningObjectId and non-existing attachment name', async () => {
        const result = await attachmentRepo.findByLearningObjectIdAndName(olderLearningObjectId, 'non-existing name');
        expect(result).toBe(null);
    });

    it('returns the newer version of the attachment when only queried by hruid, language and attachment name (but not version)', async () => {
        const result = await attachmentRepo.findByMostRecentVersionOfLearningObjectAndName(
            testLearningObjectPnNotebooks.hruid,
            testLearningObjectPnNotebooks.language,
            attachmentOnlyNewer.name
        );
        expect(result).not.toBeNull();
        expect(result!.name).toEqual(attachmentOnlyNewer.name);
        expect(result!.content).toEqual(attachmentOnlyNewer.content);
    });
});
