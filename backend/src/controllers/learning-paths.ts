import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { FALLBACK_LANG } from '../config.js';
import {
    fetchLearningPaths,
    searchLearningPaths,
} from '../services/learning-paths.js';
/**
 * Fetch learning paths based on query parameters.
 */
export async function getLearningPaths(
    req: Request,
    res: Response
): Promise<void> {
    try {
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
                res.status(404).json({
                    error: `Theme "${themeKey}" not found.`,
                });
                return;
            }
        } else if (searchQuery) {
            const searchResults = await searchLearningPaths(
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

        const learningPaths = await fetchLearningPaths(
            hruidList,
            language,
            `HRUIDs: ${hruidList.join(', ')}`
        );
        res.json(learningPaths.data);
    } catch (error) {
        console.error('❌ Unexpected error fetching learning paths:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
