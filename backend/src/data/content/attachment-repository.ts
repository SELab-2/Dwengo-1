import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { Attachment } from '../../entities/content/attachment.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier';
import { Language } from 'dwengo-1-common/src/util/language.js';

export class AttachmentRepository extends DwengoEntityRepository<Attachment> {
    public async findByLearningObjectIdAndName(learningObjectId: LearningObjectIdentifier, name: string): Promise<Attachment | null> {
        return this.findOne({
            learningObject: {
                hruid: learningObjectId.hruid,
                language: learningObjectId.language,
                version: learningObjectId.version,
            },
            name: name,
        });
    }

    public async findByMostRecentVersionOfLearningObjectAndName(
        hruid: string,
        language: Language,
        attachmentName: string
    ): Promise<Attachment | null> {
        return this.findOne(
            {
                learningObject: {
                    hruid: hruid,
                    language: language,
                },
                name: attachmentName,
            },
            {
                orderBy: {
                    learningObject: {
                        version: 'DESC',
                    },
                },
            }
        );
    }
    // This repository is read-only for now since creating own learning object is an extension feature.
}
