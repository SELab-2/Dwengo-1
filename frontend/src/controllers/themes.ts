import {BaseController} from "@/controllers/base-controller.ts";

export class ThemeController extends BaseController {
    constructor() {
        super("theme");
    }

    getAll(language: string | null = null) {
        const query = language ? { language } : undefined;
        return this.get<any[]>("/", query);
    }

    getHruidsByKey(themeKey: string) {
        return this.get<string[]>(`/${encodeURIComponent(themeKey)}`);
    }
}
