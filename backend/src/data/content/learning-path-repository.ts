import { DwengoEntityRepository } from '../dwengo-entity-repository.js';
import { LearningPath } from '../../entities/content/learning-path.entity.js';
import { Language } from '@dwengo-1/common/util/language';
import { MatchMode } from '@dwengo-1/common/util/match-mode';
import { LearningPathNode } from '../../entities/content/learning-path-node.entity.js';
import { RequiredEntityData } from '@mikro-orm/core';
import { LearningPathTransition } from '../../entities/content/learning-path-transition.entity.js';
import { EntityAlreadyExistsException } from '../../exceptions/entity-already-exists-exception.js';
import { Teacher } from '../../entities/users/teacher.entity';

export class LearningPathRepository extends DwengoEntityRepository<LearningPath> {
    public async findByHruidAndLanguage(hruid: string, language: Language): Promise<LearningPath | null> {
        return this.findOne({ hruid: hruid, language: language }, { populate: ['nodes', 'nodes.transitions'] });
    }

    public async findByAdmins(admins: Teacher[], language: Language, _matchMode?: MatchMode): Promise<LearningPath[]> {
        return this.findAll({
            where: {
                language: language,
                admins: {
                    $in: admins,
                },
            },
            populate: ['nodes', 'nodes.transitions'],
        });
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
            populate: ['nodes', 'nodes.transitions'],
        });
    }

    public createNode(nodeData: RequiredEntityData<LearningPathNode>): LearningPathNode {
        return this.em.create(LearningPathNode, nodeData);
    }

    public createTransition(transitionData: RequiredEntityData<LearningPathTransition>): LearningPathTransition {
        return this.em.create(LearningPathTransition, transitionData);
    }

    public async saveLearningPathNodesAndTransitions(
        path: LearningPath,
        nodes: LearningPathNode[],
        transitions: LearningPathTransition[],
        options?: { preventOverwrite?: boolean }
    ): Promise<void> {
        if (options?.preventOverwrite && (await this.findOne(path))) {
            throw new EntityAlreadyExistsException('A learning path with this hruid/language combination already exists.');
        }
        const em = this.getEntityManager();
        await em.persistAndFlush(path);
        await Promise.all(nodes.map(async (it) => em.persistAndFlush(it)));
        await Promise.all(transitions.map(async (it) => em.persistAndFlush(it)));
    }
}
