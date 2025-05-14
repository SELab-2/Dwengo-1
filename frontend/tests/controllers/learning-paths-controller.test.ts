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
        const data = await controller.getAllByTheme("kiks");
        expect(data).to.have.length.greaterThan(0);
    });

    it("Can get all learning paths administrated by a certain user.", async () => {
        const data = await controller.getAllByAdminRaw("user");
        expect(data.length).toBe(0); // This user does not administrate any learning paths in the test data.
    });
});
