import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { FALLBACK_LANG } from '../config.js';
import learningPathService from "../services/learning-paths/learning-path-service";
import {NotFoundException} from "../exceptions";

/**
 * Fetch learning paths based on query parameters.
 */
export async function getLearningPaths(
    req: Request,
    res: Response
): Promise<void> {
    const hruids = req.query.hruid;
    const themeKey = req.query.theme as string;
    const searchQuery = req.query.search as string;
    const language = (req.query.language as string) || FALLBACK_LANG;

    let hruidList;

    if (hruids) {
        hruidList = Array.isArray(hruids)
            ? hruids.map(String)
            : [String(hruids)];
    } else if (themeKey) {
        const theme = themes.find((t) => {
            return t.title === themeKey;
        });
        if (theme) {
            hruidList = theme.hruids;
        } else {
            throw new NotFoundException(`Theme "${themeKey}" not found.`);
        }
    } else if (searchQuery) {
        const searchResults = await learningPathService.searchLearningPaths(
            searchQuery,
            language
        );
        res.json(searchResults);
        return;
    } else {
        hruidList = themes.flatMap((theme) => {
            return theme.hruids;
        });
    }

    const learningPaths = await learningPathService.fetchLearningPaths(
        hruidList,
        language,
        `HRUIDs: ${hruidList.join(', ')}`
    );
    res.json(learningPaths.data);
}
