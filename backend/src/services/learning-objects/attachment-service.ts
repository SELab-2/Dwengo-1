import {getAttachmentRepository} from "../../data/repositories";
import {Attachment} from "../../entities/content/attachment.entity";
import {LearningObjectIdentifier} from "../../interfaces/learning-content";

const attachmentService = {
    getAttachment(learningObjectId: LearningObjectIdentifier, attachmentName: string): Promise<Attachment | null> {
        const attachmentRepo = getAttachmentRepository();

        if (learningObjectId.version) {
            return attachmentRepo.findByLearningObjectIdAndName({
                hruid: learningObjectId.hruid,
                language: learningObjectId.language,
                version: learningObjectId.version,
            }, attachmentName);
        } else {
            return attachmentRepo.findByMostRecentVersionOfLearningObjectAndName(learningObjectId.hruid, learningObjectId.language, attachmentName);
        }
    }
}

export default attachmentService;
