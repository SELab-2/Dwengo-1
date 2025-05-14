import { LearningObjectController } from "../../src/controllers/learning-objects";
import { Language } from "@dwengo-1/common/util/language";
import { beforeEach, describe, expect, it } from "vitest";

describe("Test controller learning object", () => {
    let controller: LearningObjectController;

    beforeEach(async () => {
        controller = new LearningObjectController();
    });

    it("can get the metadata of a learning object", async () => {
        const result = await controller.getMetadata("u_id01", Language.English, 1);
        expect(result).not.toBeNull();
        for (const property of ["key", "version", "language", "title"]) {
            expect(result).toHaveProperty(property);
        }
        expect(result.key).toEqual("u_id01");
        expect(result.version).toEqual(1);
        expect(result.language).toEqual(Language.English);
    });

    it("can get the HTML of a learning object", async () => {
        const result = await controller.getHTML("u_id01", Language.English, 1);
        expect(result).toHaveProperty("body");
        expect(result.body).toHaveProperty("innerHTML");
    });
});
