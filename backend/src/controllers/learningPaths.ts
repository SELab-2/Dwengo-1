import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { FALLBACK_LANG } from '../config.js';
import { fetchLearningPaths, searchLearningPaths } from '../services/learningPaths.js';
import { getLogger } from '../logging/initalize.js';
/**
 * Fetch learning paths based on query parameters.
 */
export async function getLearningPaths(req: Request, res: Response): Promise<void> {
    try {
        const hruids = req.query.hruid;
        const themeKey = req.query.theme as string;
        const searchQuery = req.query.search as string;
        const language = (req.query.language as Language) || FALLBACK_LANG;

        let hruidList;

        if (hruids) {
            hruidList = Array.isArray(hruids) ? hruids.map(String) : [String(hruids)];
        } else if (themeKey) {
            const theme = themes.find((t) => t.title === themeKey);
            if (theme) {
                hruidList = theme.hruids;
            } else {
                res.status(404).json({
                    error: `Theme "${themeKey}" not found.`,
                });
                return;
            }
        } else if (searchQuery) {
            const searchResults = await learningPathService.searchLearningPaths(searchQuery, language);
            res.json(searchResults);
            return;
        } else {
            hruidList = themes.flatMap((theme) => theme.hruids);
        }

        const learningPaths = await learningPathService.fetchLearningPaths(hruidList, language, `HRUIDs: ${hruidList.join(', ')}`);
        res.json(learningPaths.data);
    } catch (error) {
        getLogger().error('❌ Unexpected error fetching learning paths:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
