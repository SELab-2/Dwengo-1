import { BaseController } from "./base-controller";
import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
import type { StudentsResponse } from "./students";
import type { AssignmentsResponse } from "./assignments";

export interface ClassesResponse {
    classes: ClassDTO[] | string[];
}

export interface ClassResponse {
    class: ClassDTO;
}

export class ClassController extends BaseController {
    constructor() {
        super("class");
    }

    async getAll(full = true) {
        return this.get<ClassesResponse>(`/`, { full });
    }

    async getById(id: string) {
        return this.get<ClassResponse>(`/${id}`);
    }

    async createClass(data: any) {
        return this.post<ClassResponse>(`/`, data);
    }

    async deleteClass(id: string) {
        return this.delete<ClassResponse>(`/${id}`);
    }

    async getStudents(id: string, full = true) {
        return this.get<StudentsResponse>(`/${id}/students`, { full });
    }

    // TODO
    async getTeacherInvitations(id: string, full = true) {
        return this.get<any>(`/${id}/teacher-invitations`, { full });
    }

    async getAssignments(id: string, full = true) {
        return this.get<AssignmentsResponse>(`/${id}/assignments`, { full });
    }
}
