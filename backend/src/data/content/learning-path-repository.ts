import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningPath } from '../../entities/content/learning-path.entity.js';
import { Language } from 'dwengo-1-common/src/util/language.js';

export class LearningPathRepository extends DwengoEntityRepository<LearningPath> {
    public async findByHruidAndLanguage(hruid: string, language: Language): Promise<LearningPath | null> {
        return this.findOne({ hruid: hruid, language: language }, { populate: ['nodes', 'nodes.transitions'] });
    }

    /**
     * Returns all learning paths which have the given language and whose title OR description contains the
     * query string.
     *
     * @param query The query string we want to seach for in the title or description.
     * @param language The language of the learning paths we want to find.
     */
    public async findByQueryStringAndLanguage(query: string, language: Language): Promise<LearningPath[]> {
        return this.findAll({
            where: {
                language: language,
                $or: [{ title: { $like: `%${query}%` } }, { description: { $like: `%${query}%` } }],
            },
            populate: ['nodes', 'nodes.transitions'],
        });
    }
}
