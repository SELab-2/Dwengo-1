import { BaseController } from "@/controllers/base-controller.ts";

export class StudentController extends BaseController {
    constructor() {
        super("student");
    }

    getAll(full = true) {
        return this.get<{ students: any[] }>("/", { full });
    }

    getByUsername(username: string) {
        return this.get<{ student: any }>(`/${username}`);
    }

    createStudent(data: any) {
        return this.post("/", data);
    }

    deleteStudent(username: string) {
        return this.delete(`/${username}`);
    }

    getClasses(username: string, full = true) {
        return this.get<{ classes: any[] }>(`/${username}/classes`, { full });
    }

    getAssignments(username: string, full = true) {
        return this.get<{ assignments: any[] }>(`/${username}/assignments`, { full });
    }

    getGroups(username: string, full = true) {
        return this.get<{ groups: any[] }>(`/${username}/groups`, { full });
    }

    getSubmissions(username: string) {
        return this.get<{ submissions: any[] }>(`/${username}/submissions`);
    }

    getQuestions(username: string, full = true) {
        return this.get<{ questions: any[] }>(`/${username}/questions`, { full });
    }

    getJoinRequests(username: string) {
        return this.get<{ requests: any[] }>(`/${username}/joinRequests`);
    }

    createJoinRequest(username: string, classId: string) {
        return this.post(`/${username}/joinRequests}`, classId);
    }

    deleteJoinRequest(username: string, classId: string) {
        return this.delete(`/${username}/joinRequests/${classId}`);
    }
}
