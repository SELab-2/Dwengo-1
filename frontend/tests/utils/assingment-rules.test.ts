import { describe, expect, it } from "vitest";
import {
    assignmentTitleRules,
    classRules,
    deadlineRules,
    descriptionRules,
    learningPathRules,
} from "../../src/utils/assignment-rules";

describe("Validation Rules", () => {
    describe("assignmentTitleRules", () => {
        it("should return true for a valid title", () => {
            const result = assignmentTitleRules[0]("Valid Title");
            expect(result).toBe(true);
        });

        it("should return an error message for an empty title", () => {
            const result = assignmentTitleRules[0]("");
            expect(result).toBe("Title cannot be empty.");
        });
    });

    describe("learningPathRules", () => {
        it("should return true for a valid learning path", () => {
            const result = learningPathRules[0]({ hruid: "123", title: "Path Title" });
            expect(result).toBe(true);
        });

        it("should return an error message for an invalid learning path", () => {
            const result = learningPathRules[0]({ hruid: "", title: "" });
            expect(result).toBe("You must select a learning path.");
        });
    });

    describe("classRules", () => {
        it("should return true for a valid class", () => {
            const result = classRules[0]("Class 1");
            expect(result).toBe(true);
        });

        it("should return an error message for an empty class", () => {
            const result = classRules[0]("");
            expect(result).toBe("You must select at least one class.");
        });
    });

    describe("deadlineRules", () => {
        it("should return true for a valid future deadline", () => {
            const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();
            const result = deadlineRules[0](futureDate);
            expect(result).toBe(true);
        });

        it("should return an error message for a past deadline", () => {
            const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
            const result = deadlineRules[0](pastDate);
            expect(result).toBe("The deadline must be in the future.");
        });

        it("should return an error message for an invalid date", () => {
            const result = deadlineRules[0]("invalid-date");
            expect(result).toBe("Invalid date or time.");
        });

        it("should return an error message for an empty deadline", () => {
            const result = deadlineRules[0]("");
            expect(result).toBe("You must set a deadline.");
        });
    });

    describe("descriptionRules", () => {
        it("should return true for a valid description", () => {
            const result = descriptionRules[0]("This is a valid description.");
            expect(result).toBe(true);
        });

        it("should return an error message for an empty description", () => {
            const result = descriptionRules[0]("");
            expect(result).toBe("Description cannot be empty.");
        });
    });
});
