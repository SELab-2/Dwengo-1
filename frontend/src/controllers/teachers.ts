import { BaseController } from "@/controllers/base-controller.ts";

export class TeacherController extends BaseController {
    constructor() {
        super("teacher");
    }

    async getAll(full = false) {
        return this.get<{ teachers: any[] }>("/", { full });
    }

    async getByUsername(username: string) {
        return this.get<any>(`/${username}`);
    }

    async createTeacher(data: any) {
        return this.post("/", data);
    }

    async deleteTeacher(username: string) {
        return this.delete(`/${username}`);
    }

    async getClasses(username: string, full = false) {
        return this.get<any[]>(`/${username}/classes`, { full });
    }

    async getStudents(username: string, full = false) {
        return this.get<{ students: any[] }>(`/${username}/students`, { full });
    }

    async getQuestions(username: string, full = false) {
        return this.get<{ questions: any[] }>(`/${username}/questions`, { full });
    }

    async getStudentJoinRequests(username: string, classId: string) {
        return this.get<{ joinRequests: any[] }>(`/${username}/joinRequests/${classId}`);
    }

    async updateStudentJoinRequest(
        teacherUsername: string,
        classId: string,
        studentUsername: string,
        accepted: boolean,
    ) {
        return this.put(`/${teacherUsername}/joinRequests/${classId}/${studentUsername}`, accepted);
    }

    // GetInvitations(id: string) {return this.get<{ invitations: string[] }>(`/${id}/invitations`);}
}
