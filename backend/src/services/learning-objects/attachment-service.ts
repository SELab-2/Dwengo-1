import { getAttachmentRepository } from '../../data/repositories.js';
import { Attachment } from '../../entities/content/attachment.entity.js';
import { LearningObjectIdentifier } from '../../interfaces/learning-content.js';

const attachmentService = {
    getAttachment(learningObjectId: LearningObjectIdentifier, attachmentName: string): Promise<Attachment | null> {
        const attachmentRepo = getAttachmentRepository();

        if (learningObjectId.version) {
            return attachmentRepo.findByLearningObjectIdAndName(
                {
                    hruid: learningObjectId.hruid,
                    language: learningObjectId.language,
                    version: learningObjectId.version,
                },
                attachmentName
            );
        }
        return attachmentRepo.findByMostRecentVersionOfLearningObjectAndName(learningObjectId.hruid, learningObjectId.language, attachmentName);
    },
};

export default attachmentService;
