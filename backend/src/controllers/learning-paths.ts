import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { FALLBACK_LANG } from '../config.js';
import learningPathService from '../services/learning-paths/learning-path-service.js';
import { Language } from '../entities/content/language.js';
import {
    PersonalizationTarget,
    personalizedForGroup,
    personalizedForStudent,
} from '../services/learning-paths/learning-path-personalization-util.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';

/**
 * Fetch learning paths based on query parameters.
 */
export async function getLearningPaths(req: Request, res: Response): Promise<void> {
    const hruids = req.query.hruid;
    const themeKey = req.query.theme as string;
    const searchQuery = req.query.search as string;
    const language = (req.query.language as string) || FALLBACK_LANG;

    const forStudent = req.query.forStudent as string;
    const forGroupNo = req.query.forGroup as string;
    const assignmentNo = req.query.assignmentNo as string;
    const classId = req.query.classId as string;

    let personalizationTarget: PersonalizationTarget | undefined;

    if (forStudent) {
        personalizationTarget = await personalizedForStudent(forStudent);
    } else if (forGroupNo) {
        if (!assignmentNo || !classId) {
            throw new BadRequestException('If forGroupNo is specified, assignmentNo and classId must also be specified.');
        }
        personalizationTarget = await personalizedForGroup(classId, parseInt(assignmentNo), parseInt(forGroupNo));
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
        const searchResults = await learningPathService.searchLearningPaths(searchQuery, language as Language, personalizationTarget);
        res.json(searchResults);
        return;
    } else {
        hruidList = themes.flatMap((theme) => theme.hruids);
    }

    const learningPaths = await learningPathService.fetchLearningPaths(
        hruidList,
        language as Language,
        `HRUIDs: ${hruidList.join(', ')}`,
        personalizationTarget
    );
    res.json(learningPaths.data);
}
