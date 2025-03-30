import { BaseController } from "@/controllers/base-controller.ts";

export class TeacherController extends BaseController {
    constructor() {
        super("teacher");
    }

    getAll(full = false) {
        return this.get<{ teachers: any[] }>("/", { full });
    }

    getByUsername(username: string) {
        return this.get<any>(`/${username}`);
    }

    createTeacher(data: any) {
        return this.post("/", data);
    }

    deleteTeacher(username: string) {
        return this.delete(`/${username}`);
    }

    getClasses(username: string, full = false) {
        return this.get<any[]>(`/${username}/classes`, { full });
    }

    getStudents(username: string, full = false) {
        return this.get<{ students: any[] }>(`/${username}/students`, { full });
    }

    getQuestions(username: string, full = false) {
        return this.get<{ questions: any[] }>(`/${username}/questions`, { full });
    }

    getStudentJoinRequests(username: string, classId: string){
        return this.get<{ joinRequests: any[] }>(`/${username}/joinRequests/${classId}`);
    }

    updateStudentJoinRequest(teacherUsername: string, classId: string, studentUsername: string, accepted: boolean){
        return this.put(`/${teacherUsername}/joinRequests/${classId}/${studentUsername}`, accepted)
    }

    // GetInvitations(id: string) {return this.get<{ invitations: string[] }>(`/${id}/invitations`);}
}
