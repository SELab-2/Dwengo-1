import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Attachment } from '../../entities/content/attachment.entity.js';
import { LearningObject } from '../../entities/content/learning-object.entity.js';

export class AttachmentRepository extends DwengoEntityRepository<Attachment> {
    public findByLearningObjectAndNumber(learningObject: LearningObject, sequenceNumber: number) {
        return this.findOne({
            learningObject: learningObject,
            sequenceNumber: sequenceNumber,
        });
    }
    // This repository is read-only for now since creating own learning object is an extension feature.
}
