import { describe, it, expect, beforeEach } from "vitest";
import { ClassController } from "../../src/controllers/classes";

describe("ClassController Tests", () => {
    let controller: ClassController;
    const testClassId = "X2J9QT";

    beforeEach(() => {
        controller = new ClassController();
    });

    it("should fetch all classes", async () => {
        const result = await controller.getAll(true);
        expect(result).toHaveProperty("classes");
        expect(Array.isArray(result.classes)).toBe(true);
        expect(result.classes.length).toBeGreaterThan(0);
    });

    it("should fetch a class by ID", async () => {
        const result = await controller.getById(testClassId);
        expect(result).toHaveProperty("class");
        expect(result.class).toHaveProperty("id", testClassId);
    });


    it("should fetch students for a class", async () => {
        const result = await controller.getStudents(testClassId, true);
        expect(result).toHaveProperty("students");
        expect(Array.isArray(result.students)).toBe(true);
    });

    it("should fetch teachers for a class", async () => {
        const result = await controller.getTeachers(testClassId, true);
        expect(result).toHaveProperty("teachers");
        expect(Array.isArray(result.teachers)).toBe(true);
    });

    it("should fetch teacher invitations for a class", async () => {
        const result = await controller.getTeacherInvitations(testClassId, true);
        expect(result).toHaveProperty("invitations");
        expect(Array.isArray(result.invitations)).toBe(true);
    });

    it("should fetch assignments for a class", async () => {
        const result = await controller.getAssignments(testClassId, true);
        expect(result).toHaveProperty("assignments");
        expect(Array.isArray(result.assignments)).toBe(true);
    });

    it("should handle fetching a non-existent class", async () => {
        const nonExistentId = "NON_EXISTENT_ID";
        await expect(controller.getById(nonExistentId)).rejects.toThrow();
    });

    it("should handle deleting a non-existent class", async () => {
        const nonExistentId = "NON_EXISTENT_ID";
        await expect(controller.deleteClass(nonExistentId)).rejects.toThrow();
    });
});
