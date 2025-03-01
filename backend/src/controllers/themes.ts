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

function loadTranslations(language: string): Translations {
    try {
        const filePath = path.join(process.cwd(), '_i18n', `${language}.yml`);
        const yamlFile = fs.readFileSync(filePath, 'utf8');
        return yaml.load(yamlFile) as Translations;
    } catch (error) {
        console.error(
            `Cannot load translation for: ${language}, fallen back to Dutch`
        );
        console.error(error);
        const fallbackPath = path.join(process.cwd(), '_i18n', 'nl.yml');
        return yaml.load(fs.readFileSync(fallbackPath, 'utf8')) as Translations;
    }
}

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
