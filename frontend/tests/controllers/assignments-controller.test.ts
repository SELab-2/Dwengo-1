import { describe, it, expect, beforeEach } from "vitest";
import { AssignmentController } from "../../src/controllers/assignments";

describe("AssignmentController Tests", () => {
    let controller: AssignmentController;

    beforeEach(() => {
        controller = new AssignmentController("8764b861-90a6-42e5-9732-c0d9eb2f55f9"); // Example class ID
    });

    it("should fetch all assignments", async () => {
        const result = await controller.getAll(true);
        expect(result).toHaveProperty("assignments");
        expect(Array.isArray(result.assignments)).toBe(true);
        expect(result.assignments.length).toBeGreaterThan(0);
    });

    it("should fetch an assignment by number", async () => {
        const assignmentNumber = 21000; // Example assignment ID
        const result = await controller.getByNumber(assignmentNumber);
        expect(result).toHaveProperty("assignment");
        expect(result.assignment).toHaveProperty("id", assignmentNumber);
    });

    it("should update an existing assignment", async () => {
        const assignmentNumber = 21000;
        const updatedData = { title: "Updated Assignment Title" };
        const result = await controller.updateAssignment(assignmentNumber, updatedData);
        expect(result).toHaveProperty("assignment");
        expect(result.assignment).toHaveProperty("id", assignmentNumber);
        expect(result.assignment).toHaveProperty("title", updatedData.title);
    });

    it("should fetch submissions for an assignment", async () => {
        const assignmentNumber = 21000;
        const result = await controller.getSubmissions(assignmentNumber, true);
        expect(result).toHaveProperty("submissions");
        expect(Array.isArray(result.submissions)).toBe(true);
    });

    it("should fetch questions for an assignment", async () => {
        const assignmentNumber = 21000;
        const result = await controller.getQuestions(assignmentNumber, true);
        expect(result).toHaveProperty("questions");
        expect(Array.isArray(result.questions)).toBe(true);
    });

    it("should fetch groups for an assignment", async () => {
        const assignmentNumber = 21000;
        const result = await controller.getGroups(assignmentNumber, true);
        expect(result).toHaveProperty("groups");
        expect(Array.isArray(result.groups)).toBe(true);
    });

    it("should handle fetching a non-existent assignment", async () => {
        const assignmentNumber = 99999; // Non-existent assignment ID
        await expect(controller.getByNumber(assignmentNumber)).rejects.toThrow();
    });

    it("should handle deleting a non-existent assignment", async () => {
        const assignmentNumber = 99999; // Non-existent assignment ID
        await expect(controller.deleteAssignment(assignmentNumber)).rejects.toThrow();
    });
});
