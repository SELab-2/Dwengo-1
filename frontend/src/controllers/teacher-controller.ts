import {BaseController} from "@/controllers/base-controller.ts";

export class TeacherController extends BaseController {
    constructor() {
        super("teachers");
    }

    getAll(full = false) {
        return this.get<{ teachers: any[] }>("/", { full });
    }

    getByUsername(username: string) {
        return this.get<any>(`/${username}`);
    }

    createTeacher(data: any) {
        return this.post<any>("/", data);
    }

    deleteTeacher(username: string) {
        return this.delete<any>(`/${username}`);
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

    // GetInvitations(id: string) {return this.get<{ invitations: string[] }>(`/${id}/invitations`);}
}
