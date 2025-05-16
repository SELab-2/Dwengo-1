import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { FALLBACK_LANG } from '../config.js';
import learningPathService from '../services/learning-paths/learning-path-service.js';
import { Language } from '@dwengo-1/common/util/language';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { Group } from '../entities/assignments/group.entity.js';
import { getAssignmentRepository, getGroupRepository } from '../data/repositories.js';
import { AuthenticatedRequest } from '../middleware/auth/authenticated-request.js';
import { LearningPath, LearningPathIdentifier } from '@dwengo-1/common/interfaces/learning-content';
import { getTeacher } from '../services/teachers.js';
import { requireFields } from './error-helper.js';

/**
 * Fetch learning paths based on query parameters.
 */
export async function getLearningPaths(req: Request, res: Response): Promise<void> {
    const admin = req.query.admin;
    if (admin) {
        const paths = await learningPathService.getLearningPathsAdministratedBy(admin as string);
        res.json(paths);
    } else {
        const hruids = req.query.hruid;
        const themeKey = req.query.theme as string;
        const searchQuery = req.query.search as string;
        const language = (req.query.language as string) || FALLBACK_LANG;

        const forGroupNo = req.query.forGroup as string;
        const assignmentNo = req.query.assignmentNo as string;
        const classId = req.query.classId as string;

        let forGroup: Group | undefined;

        if (forGroupNo) {
            if (!assignmentNo || !classId) {
                throw new BadRequestException('If forGroupNo is specified, assignmentNo and classId must also be specified.');
            }
            const assignment = await getAssignmentRepository().findByClassIdAndAssignmentId(classId, parseInt(assignmentNo));
            if (assignment) {
                forGroup = (await getGroupRepository().findByAssignmentAndGroupNumber(assignment, parseInt(forGroupNo))) ?? undefined;
            }
        }

        let hruidList;

        if (hruids) {
            hruidList = Array.isArray(hruids) ? hruids.map(String) : [String(hruids)];
        } else if (themeKey) {
            const theme = themes.find((t) => t.title === themeKey);
            if (theme) {
                hruidList = theme.hruids;
            } else {
                throw new NotFoundException(`Theme "${themeKey}" not found.`);
            }
        } else if (searchQuery) {
            const searchResults = await learningPathService.searchLearningPaths(searchQuery, language as Language, forGroup);
            res.json(searchResults);
            return;
        } else {
            hruidList = themes.flatMap((theme) => theme.hruids);
        }

        const learningPaths = await learningPathService.fetchLearningPaths(
            hruidList,
            language as Language,
            `HRUIDs: ${hruidList.join(', ')}`,
            forGroup
        );
        res.json(learningPaths.data);
    }
}

function postOrPutLearningPath(isPut: boolean): (req: AuthenticatedRequest, res: Response) => Promise<void> {
    return async (req, res) => {
        const path = req.body as LearningPath;
        const { hruid: hruidParam, language: languageParam } = req.params;

        if (isPut) {
            requireFields({ hruidParam, languageParam, path });
        }

        const teacher = await getTeacher(req.auth!.username);
        if (isPut) {
            if (req.params.hruid !== path.hruid || req.params.language !== path.language) {
                throw new BadRequestException('id_not_matching_query_params');
            }
            await learningPathService.deleteLearningPath({ hruid: path.hruid, language: path.language as Language });
        }
        res.json(await learningPathService.createNewLearningPath(path, [teacher]));
    };
}

export const postLearningPath = postOrPutLearningPath(false);
export const putLearningPath = postOrPutLearningPath(true);

export async function deleteLearningPath(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { hruid, language } = req.params;

    requireFields({ hruid, language });

    const id: LearningPathIdentifier = { hruid, language: language as Language };
    const deletedPath = await learningPathService.deleteLearningPath(id);
    if (deletedPath) {
        res.json(deletedPath);
    } else {
        throw new NotFoundException('The learning path could not be found.');
    }
}
