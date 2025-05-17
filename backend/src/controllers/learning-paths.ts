import { Response } from 'express';
import { themes } from '../data/themes.js';
import { FALLBACK_LANG } from '../config.js';
import learningPathService from '../services/learning-paths/learning-path-service.js';
import { Language } from '@dwengo-1/common/util/language';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { Group } from '../entities/assignments/group.entity.js';
import { getAssignmentRepository, getGroupRepository } from '../data/repositories.js';
import { AuthenticatedRequest } from '../middleware/auth/authenticated-request';
import { LearningPath } from '@dwengo-1/common/interfaces/learning-content';

/**
 * Fetch learning paths based on query parameters.
 */
export async function getLearningPaths(req: AuthenticatedRequest, res: Response): Promise<void> {
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

        const apiLearningPathResponse = await learningPathService.fetchLearningPaths(hruidList, language as Language, 'All themes', forGroup);
        const apiLearningPaths: LearningPath[] = apiLearningPathResponse.data || [];
        let allLearningPaths: LearningPath[] = apiLearningPaths;

        if (req.auth) {
            const adminUsername = req.auth.username;
            const userLearningPaths = await learningPathService.searchLearningPathsByAdmin([adminUsername], language as Language, forGroup) || [];
            allLearningPaths = apiLearningPaths.concat(userLearningPaths);
        }

        res.json(allLearningPaths);
        return;
    }

    const learningPaths = await learningPathService.fetchLearningPaths(hruidList, language as Language, `HRUIDs: ${hruidList.join(', ')}`, forGroup);
    res.json(learningPaths.data);
}
