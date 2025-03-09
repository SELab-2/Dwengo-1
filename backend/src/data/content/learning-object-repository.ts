import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningObject } from '../../entities/content/learning-object.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';

export class LearningObjectRepository extends DwengoEntityRepository<LearningObject> {
    public findByIdentifier(identifier: LearningObjectIdentifier): Promise<LearningObject | null> {
        return this.findOne({
            hruid: identifier.hruid,
            language: identifier.language,
            version: identifier.version,
        });
    }
    // This repository is read-only for now since creating own learning object is an extension feature.
}
