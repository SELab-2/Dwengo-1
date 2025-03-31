import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningObject } from '../../entities/content/learning-object.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { Teacher } from '../../entities/users/teacher.entity.js';

export class LearningObjectRepository extends DwengoEntityRepository<LearningObject> {
    public findByIdentifier(identifier: LearningObjectIdentifier): Promise<LearningObject | null> {
        return this.findOne(
            {
                hruid: identifier.hruid,
                language: identifier.language,
                version: identifier.version,
            },
            {
                populate: ['keywords'],
            }
        );
    }

    public findLatestByHruidAndLanguage(hruid: string, language: Language) {
        return this.findOne(
            {
                hruid: hruid,
                language: language,
            },
            {
                populate: ['keywords'],
                orderBy: {
                    version: 'DESC',
                },
            }
        );
    }

    public findAllByTeacher(teacher: Teacher): Promise<LearningObject[]> {
        return this.find(
            { admins: teacher },
            { populate: ['admins'] } // Make sure to load admin relations
        );
    }
}
