import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { DWENGO_API_BASE } from '../config/config.js';
import { fetchWithLogging } from "../util/apiHelper.js";
import { fetchLearningPaths } from "../services/learningPaths.js";

/**
 * Fetch learning paths based on HRUIDs or return all if no HRUIDs are provided.
 * - If `hruids` are given -> fetch specific learning paths.
 * - If `hruids` is missing -> return all available learning paths.
 */
export async function getLearningPaths(req: Request, res: Response): Promise<void> {
    try {
        const hruids = req.query.hruids; // Can be string or array
        const language = (req.query.language as string) || 'nl';

        let hruidList: string[] = [];

        if (hruids) {
            hruidList = Array.isArray(hruids) ? hruids.map(String) : [String(hruids)];
        } else {
            // If no hruids are provided, fetch ALL learning paths
            hruidList = themes.flatMap((theme) => theme.hruids);
        }

        const learningPaths = await fetchLearningPaths(hruidList, language, `HRUIDs: ${hruidList.join(', ')}`);

        res.json(learningPaths);
    } catch (error) {
        console.error('❌ Unexpected error fetching learning paths:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


/**
 * Fetch all learning paths for a specific theme.
 */
export async function getLearningPathsByTheme(req: Request, res: Response): Promise<void> {
    try {
        const themeKey = req.params.theme;
        const language = (req.query.language as string) || 'nl';

        const theme = themes.find((t) => t.title === themeKey);
        if (!theme) {
            console.error(`⚠️ WARNING: Theme "${themeKey}" not found.`);
            res.status(404).json({ error: 'Theme not found' });
            return;
        }

        const response = await fetchLearningPaths(theme.hruids, language, `theme "${themeKey}"`);
        res.json({
            theme: themeKey,
            hruids: theme.hruids,
            ...response,
        });
    } catch (error) {
        console.error('❌ Unexpected error fetching learning paths by theme:', error);
    }
}

/**
 * Search learning paths by query.
 */
export async function searchLearningPaths(req: Request, res: Response): Promise<void> {
    try {
        const query = req.query.query as string;
        const language = (req.query.language as string) || 'nl';

        if (!query) {
            res.status(400).json({ error: 'Missing search query' });
            return;
        }

        const apiUrl = `${DWENGO_API_BASE}/learningPath/search`;
        const params = { all: query, language };

        const searchResults = await fetchWithLogging<any>(apiUrl, `Search learning paths with query "${query}"`, params);
        res.json(searchResults ?? []);
    } catch (error) {
        console.error('❌ Unexpected error searching learning paths:', error);
    }
}
