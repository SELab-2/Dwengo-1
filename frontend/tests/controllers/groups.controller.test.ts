import { describe, expect, it } from "vitest";
import { GroupController } from "../../src/controllers/groups";
import { getClass01 } from "@dwengo-1/backend/tests/test_assets/classes/classes.testdata";

describe("Test controller groups", () => {
    it("Get groups", async () => {
        const classId = getClass01().classId;
        const assignmentNumber = 21000;

        const controller = new GroupController(classId, assignmentNumber);
        const data = await controller.getAll(true);
        expect(data.groups).to.have.length.greaterThan(0);
    });
});
