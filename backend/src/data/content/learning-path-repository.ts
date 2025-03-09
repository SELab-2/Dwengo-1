import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningPath } from '../../entities/content/learning-path.entity.js';
import { Language } from '../../entities/content/language.js';

export class LearningPathRepository extends DwengoEntityRepository<LearningPath> {
    public findByHruidAndLanguage(hruid: string, language: Language): Promise<LearningPath | null> {
        return this.findOne({ hruid: hruid, language: language });
    }
    // This repository is read-only for now since creating own learning object is an extension feature.
}
