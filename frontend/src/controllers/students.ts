import { BaseController } from "@/controllers/base-controller.ts";

export class StudentController extends BaseController {
    constructor() {
        super("student");
    }

    async getAll(full = true) {
        return this.get<{ students: any[] }>("/", { full });
    }

    async getByUsername(username: string) {
        return this.get<{ student: any }>(`/${username}`);
    }

    async createStudent(data: any) {
        return this.post("/", data);
    }

    async deleteStudent(username: string) {
        return this.delete(`/${username}`);
    }

    async getClasses(username: string, full = true) {
        return this.get<{ classes: any[] }>(`/${username}/classes`, { full });
    }

    async getAssignments(username: string, full = true) {
        return this.get<{ assignments: any[] }>(`/${username}/assignments`, { full });
    }

    async getGroups(username: string, full = true) {
        return this.get<{ groups: any[] }>(`/${username}/groups`, { full });
    }

    async getSubmissions(username: string) {
        return this.get<{ submissions: any[] }>(`/${username}/submissions`);
    }

    async getQuestions(username: string, full = true) {
        return this.get<{ questions: any[] }>(`/${username}/questions`, { full });
    }

    async getJoinRequests(username: string) {
        return this.get<{ requests: any[] }>(`/${username}/joinRequests`);
    }

    async getJoinRequest(username: string, classId: string) {
        return this.get<{ request: any[] }>(`/${username}/joinRequests/${classId}`);
    }

    async createJoinRequest(username: string, classId: string) {
        return this.post(`/${username}/joinRequests}`, classId);
    }

    async deleteJoinRequest(username: string, classId: string) {
        return this.delete(`/${username}/joinRequests/${classId}`);
    }
}
