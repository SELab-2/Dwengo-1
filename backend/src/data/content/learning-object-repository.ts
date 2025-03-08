import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningObject } from '../../entities/content/learning-object.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import {Teacher} from "../../entities/users/teacher.entity";

export class LearningObjectRepository extends DwengoEntityRepository<LearningObject> {
    public findByIdentifier(
        identifier: LearningObjectIdentifier
    ): Promise<LearningObject | null> {
        return this.findOne({
            hruid: identifier.hruid,
            language: identifier.language,
            version: identifier.version,
        });
    }
    // This repository is read-only for now since creating own learning object is an extension feature.

    public findAllByTeacher(teacher: Teacher): Promise<LearningObject[]> {
        return this.find(
            { admins: teacher },
            { populate: ['admins'] } // Make sure to load admin relations
        );
    }
}
