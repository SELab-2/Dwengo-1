import { describe, expect, it } from "vitest";
import { GroupController } from "../../src/controllers/groups";

describe("Test controller groups", () => {
    it("Get groups", async () => {
        const classId = "X2J9QT"; // Class01
        const assignmentNumber = 21000;

        const controller = new GroupController(classId, assignmentNumber);
        const data = await controller.getAll(true);
        expect(data.groups).to.have.length.greaterThan(0);
    });
});
