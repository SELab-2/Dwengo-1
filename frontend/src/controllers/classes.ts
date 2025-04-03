import { BaseController } from "./base-controller";
import type { ClassDTO } from "@dwengo-1/interfaces/class";

export interface ClassesResponse {
    classes: ClassDTO[] | string[];
}

export class ClassController extends BaseController {
    constructor() {
        super("class");
    }

    async getAll(full = true) {
        return this.get<{ classes: any[] }>(`/`, { full });
    }

    async getById(id: string) {
        return this.get<{ class: any }>(`/${id}`);
    }

    async createClass(data: any) {
        return this.post<{ class: any }>(`/`, data);
    }

    async deleteClass(id: string) {
        return this.delete<{ class: any }>(`/${id}`);
    }

    async getStudents(id: string, full = true) {
        return this.get<{ students: any[] }>(`/${id}/students`, { full });
    }

    async getTeacherInvitations(id: string, full = true) {
        return this.get<{ invitations: any[] }>(`/${id}/teacher-invitations`, { full });
    }

    async getAssignments(id: string, full = true) {
        return this.get<{ assignments: any[] }>(`/${id}/assignments`, { full });
    }
}
