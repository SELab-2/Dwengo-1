import { describe, it, expect, beforeEach } from "vitest";
import { Language } from "@dwengo-1/common/util/language";
import { QuestionController } from "../../src/controllers/questions";

describe("QuestionController Tests", () => {
    let controller: QuestionController;

    beforeEach(() => {
        const loiDTO = {
            hruid: "u_test_multiple_choice",
            language: Language.English,
            version: 1,
        };
        controller = new QuestionController(loiDTO);
    });

    it("should fetch all questions", async () => {
        const result = await controller.getAll(true);
        expect(result).toHaveProperty("questions");
        expect(Array.isArray(result.questions)).toBe(true);
        expect(result.questions.length).toBeGreaterThan(0);
    });

    it("should fetch an question by sequencenumber", async () => {
        const questionNumber = 1; // Example sequence number
        const result = await controller.getBy(questionNumber);
        expect(result).toHaveProperty("question");
        expect(result.question).toHaveProperty("sequenceNumber", questionNumber);
    });
});
