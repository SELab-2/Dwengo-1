import { StudentController } from "../../src/controllers/students";
import { beforeEach, describe, expect, it, test } from "vitest";

describe("Test controller students", () => {
    let controller: StudentController;

    beforeEach(async () => {
        controller = new StudentController();
    });

    it("Get students", async () => {
        const data = await controller.getAll(true);
        expect(data.students).to.have.length.greaterThan(0);
    });

    it("Get student by username", async () => {
        const username = "testleerling1";
        const data = await controller.getByUsername(username);
        expect(data.student.username).to.equal(username);
    });
});

const controller = new StudentController();

test.each([
    { username: "Noordkaap", firstName: "Stijn", lastName: "Meuris" },
    { username: "DireStraits", firstName: "Mark", lastName: "Knopfler" },
    { username: "Tool", firstName: "Maynard", lastName: "Keenan" },
    { username: "SmashingPumpkins", firstName: "Billy", lastName: "Corgan" },
    { username: "testleerling1", firstName: "Gerald", lastName: "Schmittinger" },
])("Get classes of student", async (student) => {
    const data = await controller.getClasses(student.username, true);
    expect(data.classes).to.have.length.greaterThan(0, `Found no classes for ${student.username}`);
});
