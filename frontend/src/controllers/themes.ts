import { BaseController } from "@/controllers/base-controller.ts";
import type { Theme } from "@dwengo-1/common/interfaces/theme";

export class ThemeController extends BaseController {
    constructor() {
        super("theme");
    }

    async getAll(language: string | null = null): Promise<Theme[]> {
        const query = language ? { language } : undefined;
        return this.get("/", query);
    }

    async getHruidsByKey(themeKey: string): Promise<string[]> {
        return this.get<string[]>(`/${encodeURIComponent(themeKey)}`);
    }
}
