import { beforeEach, describe, expect, it } from "vitest";
import { LearningPathController } from "../../src/controllers/learning-paths";
import { Language } from "../../src/data-objects/language";

describe("Test controller learning paths", () => {
    let controller: LearningPathController;

    beforeEach(async () => {
        controller = new LearningPathController();
    });

    it("Can search for learning paths", async () => {
        const data = await controller.search("kiks", Language.Dutch);
        expect(data).to.have.length.greaterThan(0);
    });

    it("Can get learning path by id", async () => {
        const data = await controller.getAllByThemeAndLanguage("kiks", Language.Dutch);
        expect(data).to.have.length.greaterThan(0);
    });
});
