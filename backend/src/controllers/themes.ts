import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { loadTranslations } from '../util/translationHelper.js';

interface Translations {
    curricula_page: {
        [key: string]: { title: string; description?: string };
    };
}

export function getThemes(req: Request, res: Response) {
    const language = (req.query.language as string)?.toLowerCase() || 'nl';
    const translations = loadTranslations<Translations>(language);
    const themeList = themes.map((theme) => {
        return {
            key: theme.title,
            title:
                translations.curricula_page[theme.title]?.title || theme.title,
            description: translations.curricula_page[theme.title]?.description,
            image: `https://dwengo.org/images/curricula/logo_${theme.title}.png`,
        };
    });

    res.json(themeList);
}

export function getThemeByTitle(req: Request, res: Response) {
    const themeKey = req.params.theme;
    const theme = themes.find((t) => {
        return t.title === themeKey;
    });

    if (theme) {
        res.json(theme.hruids);
    } else {
        res.status(404).json({ error: 'Theme not found' });
    }
}
