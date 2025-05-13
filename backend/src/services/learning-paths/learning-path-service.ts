import dwengoApiLearningPathProvider from './dwengo-api-learning-path-provider.js';
import databaseLearningPathProvider from './database-learning-path-provider.js';
import { envVars, getEnvVar } from '../../util/envVars.js';
import { LearningObjectNode, LearningPath, LearningPathIdentifier, LearningPathResponse } from '@dwengo-1/common/interfaces/learning-content';
import { Language } from '@dwengo-1/common/util/language';
import { Group } from '../../entities/assignments/group.entity.js';
import { LearningPath as LearningPathEntity } from '../../entities/content/learning-path.entity.js';
import { getLearningPathRepository } from '../../data/repositories.js';
import { LearningPathNode } from '../../entities/content/learning-path-node.entity.js';
import { LearningPathTransition } from '../../entities/content/learning-path-transition.entity.js';
import { base64ToArrayBuffer } from '../../util/base64-buffer-conversion.js';
import { TeacherDTO } from '@dwengo-1/common/interfaces/teacher';
import { mapToTeacher } from '../../interfaces/teacher.js';
import { Collection } from '@mikro-orm/core';
import { NotFoundException } from '../../exceptions/not-found-exception.js';

const userContentPrefix = getEnvVar(envVars.UserContentPrefix);
const allProviders = [dwengoApiLearningPathProvider, databaseLearningPathProvider];

export function mapToLearningPath(dto: LearningPath, adminsDto: TeacherDTO[]): LearningPathEntity {
    const admins = adminsDto.map((admin) => mapToTeacher(admin));
    const repo = getLearningPathRepository();
    const path = repo.create({
        hruid: dto.hruid,
        language: dto.language as Language,
        description: dto.description,
        title: dto.title,
        admins,
        image: dto.image ? Buffer.from(base64ToArrayBuffer(dto.image)) : null,
    });
    const nodes = dto.nodes.map((nodeDto: LearningObjectNode, i: number) =>
        repo.createNode({
            learningPath: path,
            learningObjectHruid: nodeDto.learningobject_hruid,
            nodeNumber: i,
            language: nodeDto.language,
            version: nodeDto.version,
            startNode: nodeDto.start_node ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
    );
    dto.nodes.forEach((nodeDto) => {
        const fromNode = nodes.find(
            (it) => it.learningObjectHruid === nodeDto.learningobject_hruid && it.language === nodeDto.language && it.version === nodeDto.version
        )!;
        const transitions = nodeDto.transitions
            .map((transDto, i) => {
                const toNode = nodes.find(
                    (it) =>
                        it.learningObjectHruid === transDto.next.hruid &&
                        it.language === transDto.next.language &&
                        it.version === transDto.next.version
                );

                if (toNode) {
                    return repo.createTransition({
                        transitionNumber: i,
                        node: fromNode,
                        next: toNode,
                        condition: transDto.condition ?? 'true',
                    });
                }
                return undefined;
            })
            .filter((it) => it)
            .map((it) => it!);

        fromNode.transitions = new Collection<LearningPathTransition>(fromNode, transitions);
    });

    path.nodes = new Collection<LearningPathNode>(path, nodes);

    return path;
}

/**
 * Service providing access to data about learning paths from the appropriate data source (database or Dwengo-api)
 */
const learningPathService = {
    /**
     * Fetch the learning paths with the given hruids from the data source.
     * @param hruids For each of the hruids, the learning path will be fetched.
     * @param language This is the language each of the learning paths will use.
     * @param source
     * @param personalizedFor If this is set, a learning path personalized for the given group or student will be returned.
     */
    async fetchLearningPaths(hruids: string[], language: Language, source: string, personalizedFor?: Group): Promise<LearningPathResponse> {
        const userContentHruids = hruids.filter((hruid) => hruid.startsWith(userContentPrefix));
        const nonUserContentHruids = hruids.filter((hruid) => !hruid.startsWith(userContentPrefix));

        const userContentLearningPaths = await databaseLearningPathProvider.fetchLearningPaths(userContentHruids, language, source, personalizedFor);
        const nonUserContentLearningPaths = await dwengoApiLearningPathProvider.fetchLearningPaths(
            nonUserContentHruids,
            language,
            source,
            personalizedFor
        );

        const result = (userContentLearningPaths.data || []).concat(nonUserContentLearningPaths.data || []);

        return {
            data: result,
            source: source,
            success: userContentLearningPaths.success || nonUserContentLearningPaths.success,
        };
    },

    /**
     * Fetch the learning paths administrated by the teacher with the given username.
     */
    async getLearningPathsAdministratedBy(adminUsername: string): Promise<LearningPath[]> {
        const providerResponses = await Promise.all(allProviders.map(async (provider) => provider.getLearningPathsAdministratedBy(adminUsername)));
        return providerResponses.flat();
    },

    /**
     * Search learning paths in the data source using the given search string.
     */
    async searchLearningPaths(query: string, language: Language, personalizedFor?: Group): Promise<LearningPath[]> {
        const providerResponses = await Promise.all(
            allProviders.map(async (provider) => provider.searchLearningPaths(query, language, personalizedFor))
        );
        return providerResponses.flat();
    },

    /**
     * Add a new learning path to the database.
     * @param dto Learning path DTO from which the learning path will be created.
     * @param admins Teachers who should become an admin of the learning path.
     * @returns the created learning path.
     */
    async createNewLearningPath(dto: LearningPath, admins: TeacherDTO[]): Promise<LearningPathEntity> {
        const repo = getLearningPathRepository();

        const path = mapToLearningPath(dto, admins);
        try {
            await repo.save(path, { preventOverwrite: true });
        } catch (e: unknown) {
            repo.getEntityManager().clear();
            throw e;
        }
        return path;
    },

    /**
     * Deletes the learning path with the given identifier from the database.
     * @param id Identifier of the learning path to delete.
     * @returns the deleted learning path.
     */
    async deleteLearningPath(id: LearningPathIdentifier): Promise<LearningPathEntity> {
        const repo = getLearningPathRepository();

        const deletedPath = await repo.deleteByHruidAndLanguage(id.hruid, id.language);
        if (deletedPath) {
            return deletedPath;
        }
        throw new NotFoundException('No learning path with the given identifier found.');
    },

    /**
     * Returns a list of the usernames of the administrators of the learning path with the given identifier.
     * @param id The identifier of the learning path whose admins should be fetched.
     */
    async getAdmins(id: LearningPathIdentifier): Promise<string[]> {
        const repo = getLearningPathRepository();
        const path = await repo.findByHruidAndLanguage(id.hruid, id.language);
        if (!path) {
            throw new NotFoundException('No learning path with the given identifier found.');
        }
        return path.admins.map((admin) => admin.username);
    },
};

export default learningPathService;
