import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Request, Response } from 'express';
import { themes } from '../data/themes.js';

interface Translations {
    curricula_page: {
        [key: string]: { title: string; description?: string }; // Optioneel veld description
    };
}

/**
 * Laadt de vertalingen uit een YAML-bestand
 */
function loadTranslations(language: string): Translations {
    try {
        const filePath = path.join(process.cwd(), '_i18n', `${language}.yml`);
        const yamlFile = fs.readFileSync(filePath, 'utf8');
        return yaml.load(yamlFile) as Translations;
    } catch (error) {
        console.error(
            `Kan vertaling niet laden voor ${language}, fallback naar Nederlands`
        );
        console.error(error);
        const fallbackPath = path.join(process.cwd(), '_i18n', 'nl.yml');
        return yaml.load(fs.readFileSync(fallbackPath, 'utf8')) as Translations;
    }
}

/**
 * GET /themes → Haalt de lijst met thema's op inclusief vertalingen
 */
export function getThemes(req: Request, res: Response) {
    const language = (req.query.language as string)?.toLowerCase() || 'nl';
    const translations = loadTranslations(language);

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

/**
 * GET /themes/:theme → Geeft de HRUIDs terug voor een specifiek thema
 */
export function getThemeByTitle(req: Request, res: Response) {
    const themeKey = req.params.theme;
    const theme = themes.find((t) => {
        return t.title === themeKey;
    });

    if (theme) {
        res.json(theme.hruids);
    } else {
        res.status(404).json({ error: 'Thema niet gevonden' });
    }
}
