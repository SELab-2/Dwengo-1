import { BaseController } from "./base-controller";


export class ClassController extends BaseController {
    constructor() {
        super("class");
    }

    getAll(full = true) {
        return this.get<{ classes: any[] }>(`/`, { full });
    }

    getById(id: string) {
        return this.get<{ class: any }>(`/${id}`);
    }

    createClass(data: any) {
        return this.post<{ class: any }>(`/`, data);
    }

    deleteClass(id: string) {
        return this.delete<{ class: any }>(`/${id}`);
    }

    
    getStudents(id: string, full = true) {
        return this.get<{ students: any[] }>(`/${id}/students`, { full });
    }

    getTeacherInvitations(id: string, full = true) {
        return this.get<{ invitations: any[] }>(`/${id}/teacher-invitations`, { full });
    }

    getAssignments(id: string, full = true) {
        return this.get<{ assignments: any[] }>(`/${id}/assignments`, { full });
    }
}