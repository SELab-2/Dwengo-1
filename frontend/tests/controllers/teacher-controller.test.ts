import { beforeEach, describe, expect, it } from "vitest";
import { TeacherController } from "../../src/controllers/teachers";

describe("Test controller teachers", () => {
    let controller: TeacherController;

    beforeEach(async () => {
        controller = new TeacherController();
    });

    it("Get all teachers", async () => {
        const data = await controller.getAll(true);
        expect(data.teachers).to.have.length.greaterThan(0);
        expect(data.teachers[0]).to.have.property("username");
        expect(data.teachers[0]).to.have.property("firstName");
        expect(data.teachers[0]).to.have.property("lastName");
    });

    it("Get teacher by username", async () => {
        const username = "testleerkracht1";
        const data = await controller.getByUsername(username);
        expect(data.teacher.username).to.equal(username);
        expect(data.teacher).to.have.property("firstName");
        expect(data.teacher).to.have.property("lastName");
    });

    it("Get teacher by non-existent username", async () => {
        const username = "nonexistentuser";
        await expect(controller.getByUsername(username)).rejects.toThrow();
    });

    it("Create a new teacher", async () => {
        const newTeacher = {
            username: "newteacher",
            firstName: "New",
            lastName: "Teacher",
        };
        const data = await controller.createTeacher(newTeacher);
        expect(data.teacher.username).to.equal(newTeacher.username);
        expect(data.teacher.firstName).to.equal(newTeacher.firstName);
        expect(data.teacher.lastName).to.equal(newTeacher.lastName);
    });

    it("Delete a teacher", async () => {
        const username = "newteacher";
        const data = await controller.deleteTeacher(username);
        expect(data).toBeTruthy();
    });

    it("Handle deletion of non-existent teacher", async () => {
        const username = "nonexistentuser";
        await expect(controller.deleteTeacher(username)).rejects.toThrow();
    });

    it("Get classes for a teacher", async () => {
        const username = "testleerkracht1";
        const data = await controller.getClasses(username, true);
        expect(data.classes).to.have.length.greaterThan(0);
        expect(data.classes[0]).to.have.property("id");
        expect(data.classes[0]).to.have.property("displayName");
    });

    it("Get students for a teacher", async () => {
        const username = "testleerkracht1";
        const data = await controller.getStudents(username, true);
        expect(data.students).to.have.length.greaterThan(0);
        expect(data.students[0]).to.have.property("username");
        expect(data.students[0]).to.have.property("firstName");
        expect(data.students[0]).to.have.property("lastName");
    });
});
