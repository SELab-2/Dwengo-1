import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningPath } from '../../entities/content/learning-path.entity.js';
import { Language } from '@dwengo-1/common/util/language';
import { LearningPathNode } from '../../entities/content/learning-path-node.entity.js';
import { RequiredEntityData } from '@mikro-orm/core';
import { LearningPathTransition } from '../../entities/content/learning-path-transition.entity.js';

export class LearningPathRepository extends DwengoEntityRepository<LearningPath> {
    public async findByHruidAndLanguage(hruid: string, language: Language): Promise<LearningPath | null> {
        return this.findOne(
            {
                hruid: hruid,
                language: language,
            },
            { populate: ['nodes', 'nodes.transitions', 'admins'] }
        );
    }

    /**
     * Returns all learning paths which have the given language and whose title OR description contains the
     * query string.
     *
     * @param query The query string we want to search for in the title or description.
     * @param language The language of the learning paths we want to find.
     */
    public async findByQueryStringAndLanguage(query: string, language: Language): Promise<LearningPath[]> {
        return this.findAll({
            where: {
                language: language,
                $or: [{ title: { $like: `%${query}%` } }, { description: { $like: `%${query}%` } }],
            },
            populate: ['nodes', 'nodes.transitions', 'admins'],
        });
    }

    /**
     * Returns all learning paths which have the user with the given username as an administrator.
     */
    public async findAllByAdminUsername(adminUsername: string): Promise<LearningPath[]> {
        return this.findAll({
            where: {
                admins: {
                    username: adminUsername,
                },
            },
            populate: ['nodes', 'nodes.transitions', 'admins'],
        });
    }

    public createNode(nodeData: RequiredEntityData<LearningPathNode>): LearningPathNode {
        return this.em.create(LearningPathNode, nodeData);
    }

    public createTransition(transitionData: RequiredEntityData<LearningPathTransition>): LearningPathTransition {
        return this.em.create(LearningPathTransition, transitionData);
    }

    /**
     * Deletes the learning path with the given hruid and language.
     * @returns the deleted learning path or null if it was not found.
     */
    public async deleteByHruidAndLanguage(hruid: string, language: Language): Promise<LearningPath | null> {
        const path = await this.findByHruidAndLanguage(hruid, language);
        if (path) {
            await this.em.removeAndFlush(path);
        }
        return path;
    }
}
