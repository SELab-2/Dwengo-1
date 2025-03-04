import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {FALLBACK_LANG} from "../../config";

export function loadTranslations<T>(language: string): T {
    try {
        const filePath = path.join(process.cwd(), '_i18n', `${language}.yml`);
        const yamlFile = fs.readFileSync(filePath, 'utf8');
        return yaml.load(yamlFile) as T;
    } catch (error) {
        console.error(
            `Cannot load translation for ${language}, fallen back to dutch`
        );
        console.error(error);
        const fallbackPath = path.join(process.cwd(), '_i18n', `${FALLBACK_LANG}.yml`);
        return yaml.load(fs.readFileSync(fallbackPath, 'utf8')) as T;
    }
}
