import { Request, Response } from 'express';
import { getLearningObjectsFromPath } from '../services/learningObjects.js';

export async function getAllLearningObjects(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { hruid } = req.params;
        const language = (req.query.language as string) || 'nl'; // Default to Dutch;

        if (!language) {
            res.status(400).json({
                error: 'Language query parameter is required.',
            });
            return;
        }

        const learningObjects = await getLearningObjectsFromPath(
            hruid,
            language
        );
        res.json(learningObjects);
    } catch (error) {
        console.error('Error fetching learning objects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
