import { describe, it, expect, beforeEach } from "vitest";
import { AnswerController } from "../../src/controllers/answers";
import { Language } from "@dwengo-1/common/util/language";

describe("AnswerController Tests", () => {
    let controller: AnswerController;

    beforeEach(() => {
        const loiDTO = {
            hruid: "u_test_multiple_choice",
            language: Language.English,
            version: 1,
        };
        const questionId = { learningObjectIdentifier: loiDTO, sequenceNumber: 1 };
        controller = new AnswerController(questionId);
    });

    it("should fetch all answers", async () => {
        const result = await controller.getAll(true);
        expect(result).toHaveProperty("answers");
        expect(Array.isArray(result.answers)).toBe(true);
        expect(result.answers.length).toBeGreaterThan(0);
    });

    it("should fetch an answer by sequencenumber", async () => {
        const answerNumber = 1; // Example sequence number
        const result = await controller.getBy(answerNumber);
        expect(result).toHaveProperty("answer");
        expect(result.answer).toHaveProperty("sequenceNumber", answerNumber);
    });
});


