import { Request, Response } from 'express';
import {
    getLearningObjectById,
    getLearningObjectIdsFromPath,
    getLearningObjectsFromPath,
} from '../services/learning-objects.js';
import { FALLBACK_LANG } from '../config.js';
import { FilteredLearningObject } from '../interfaces/learning-path';

export async function getAllLearningObjects(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const hruid = req.query.hruid as string;
        const full = req.query.full === 'true';
        const language = (req.query.language as string) || FALLBACK_LANG;

        if (!hruid) {
            res.status(400).json({ error: 'HRUID query is required.' });
            return;
        }

        let learningObjects: FilteredLearningObject[] | string[];
        if (full) {
            learningObjects = await getLearningObjectsFromPath(hruid, language);
        } else {
            learningObjects = await getLearningObjectIdsFromPath(
                hruid,
                language
            );
        }

        res.json(learningObjects);
    } catch (error) {
        console.error('Error fetching learning objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getLearningObject(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { hruid } = req.params;
        const language = (req.query.language as string) || FALLBACK_LANG;

        if (!hruid) {
            res.status(400).json({ error: 'HRUID parameter is required.' });
            return;
        }

        const learningObject = await getLearningObjectById(hruid, language);
        res.json(learningObject);
    } catch (error) {
        console.error('Error fetching learning object:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
