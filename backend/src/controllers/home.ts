import { Request, Response } from 'express';
import { loadTranslations } from '../util/translationHelper.js';

const BASE_IMAGE_URL = "https://www.dwengo.org/images/strengths/";

interface Translation {
    strengths: {
        title: string;
        innovative: string;
        research_based: string;
        inclusive: string;
        socially_relevant: string;
        main: string;
    };
}

export function getHomeScreenData(req: Request, res: Response): void {
    try {
        const language = (req.query.language as string) || 'nl';
        const translations = loadTranslations<Translation>(language);

        const strengths = [
            { key: "innovative", image: "value-innovation.png" },
            { key: "research_based", image: "value-research.png" },
            { key: "inclusive", image: "value-inclusion.png" },
            { key: "socially_relevant", image: "value-society.png" },
        ].map(({ key, image }) => ({
            title: translations.strengths[key as keyof Translation["strengths"]],
            image: `${BASE_IMAGE_URL}${image}`
        }));

        res.json({
            title: translations.strengths.title,
            description: translations.strengths.main,
            strengths
        });
    } catch (error) {
        console.error("❌ Error getting data for homescreen:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
