import { BaseController } from "@/controllers/base-controller.ts";

export class ThemeController extends BaseController {
    constructor() {
        super("theme");
    }

    async getAll(language: string | null = null): Promise<unknown> {
        const query = language ? { language } : undefined;
        return this.get("/", query);
    }

    async getHruidsByKey(themeKey: string): Promise<string[]> {
        return this.get<string[]>(`/${encodeURIComponent(themeKey)}`);
    }
}
