import { Request, Response } from 'express';
import { themes } from '../data/themes.js';
import { loadTranslations } from '../util/translation-helper.js';

interface Translations {
    curricula_page: {
        [key: string]: { title: string; description?: string };
    };
}

export function getThemesHandler(req: Request, res: Response) {
    const language = (req.query.language as string)?.toLowerCase() || 'nl';
    const translations = loadTranslations<Translations>(language);
    const themeList = themes.map((theme) => ({
        key: theme.title,
        title: translations.curricula_page[theme.title]?.title || theme.title,
        description: translations.curricula_page[theme.title]?.description,
        image: `https://dwengo.org/images/curricula/logo_${theme.title}.png`,
    }));

    res.json(themeList);
}

export function getHruidsByThemeHandler(req: Request, res: Response) {
    const themeKey = req.params.theme;

    if (!themeKey) {
        res.status(400).json({ error: 'Missing required field: theme' });
        return;
    }

    const theme = themes.find((t) => t.title === themeKey);

    if (theme) {
        res.json(theme.hruids);
    } else {
        res.status(404).json({ error: 'Theme not found' });
    }
}
