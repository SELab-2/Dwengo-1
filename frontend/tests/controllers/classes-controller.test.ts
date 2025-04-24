import { describe, expect, it } from "vitest";
import { ClassController } from "../../src/controllers/classes";

describe("Test controller classes", () => {
    it("Get classes", async () => {
        const controller = new ClassController();
        const data = await controller.getAll(true);
        expect(data.classes).to.have.length.greaterThan(0);
    });
});
