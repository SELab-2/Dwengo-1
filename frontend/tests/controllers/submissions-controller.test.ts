import { describe, expect, it } from "vitest";
import { SubmissionController } from "../../src/controllers/submissions";
import { Language } from "../../src/data-objects/language";
import {getClass01} from "@dwengo-1/backend/tests/test_assets/classes/classes.testdata";

describe("Test controller submissions", () => {
    it("Get submission by number", async () => {
        const hruid = "id03";
        const classId = getClass01().classId;
        const controller = new SubmissionController(hruid);

        const data = await controller.getByNumber(Language.English, 1, classId, 1, 1, 1);

        expect(data.submission).to.have.property("submissionNumber");
    });
});
