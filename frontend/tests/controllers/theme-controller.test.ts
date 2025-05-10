import { describe, it, expect, beforeEach } from "vitest";
import { ThemeController } from "../../src/controllers/themes";

describe("ThemeController Tests", () => {
    let controller: ThemeController;

    beforeEach(() => {
        controller = new ThemeController();
    });

    it("should fetch all themes", async () => {
        const result = await controller.getAll();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty("key");
        expect(result[0]).toHaveProperty("title");
        expect(result[0]).toHaveProperty("description");
        expect(result[0]).toHaveProperty("image");
    });

    it("should fetch all themes filtered by language", async () => {
        const language = "en";
        const result = await controller.getAll(language);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        result.forEach((theme) => {
            expect(theme).toHaveProperty("key");
            expect(theme).toHaveProperty("title");
            expect(theme).toHaveProperty("description");
            expect(theme).toHaveProperty("image");
        });
    });

    it("should fetch HRUIDs by theme key", async () => {
        const themeKey = "kiks";
        const result = await controller.getHruidsByKey(themeKey);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        result.forEach((hruid) => {
            expect(typeof hruid).toBe("string");
        });
    });

    it("should handle fetching HRUIDs for a non-existent theme key", async () => {
        const themeKey = "nonexistent";
        await expect(controller.getHruidsByKey(themeKey)).rejects.toThrow();
    });
});
