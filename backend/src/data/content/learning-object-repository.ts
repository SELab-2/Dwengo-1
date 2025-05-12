import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningObject } from '../../entities/content/learning-object.entity.js';
import { LearningObjectIdentifier } from '../../entities/content/learning-object-identifier.js';
import { Language } from '@dwengo-1/common/util/language';

export class LearningObjectRepository extends DwengoEntityRepository<LearningObject> {
    public async findByIdentifier(identifier: LearningObjectIdentifier): Promise<LearningObject | null> {
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

    public async findLatestByHruidAndLanguage(hruid: string, language: Language): Promise<LearningObject | null> {
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

    public async findAllByAdmin(adminUsername: string): Promise<LearningObject[]> {
        return this.find(
            {
                admins: {
                    username: adminUsername
                }
            },
            { populate: ['admins'] } // Make sure to load admin relations
        );
    }

    public async removeByIdentifier(identifier: LearningObjectIdentifier): Promise<LearningObject | null> {
        const learningObject = await this.findByIdentifier(identifier);
        if (learningObject) {
            await this.em.removeAndFlush(learningObject);
        }
        return learningObject;
    }

}
