import { BaseController } from "./base-controller";
import type { ClassDTO } from "@dwengo-1/common/interfaces/class";
import type { StudentsResponse } from "./students";
import type { AssignmentsResponse } from "./assignments";
import type { TeacherInvitationDTO } from "@dwengo-1/common/interfaces/teacher-invitation";
import type { TeachersResponse } from "@/controllers/teachers.ts";

export interface ClassesResponse {
    classes: ClassDTO[] | string[];
}

export interface ClassResponse {
    class: ClassDTO;
}

export interface TeacherInvitationsResponse {
    invites: TeacherInvitationDTO[];
}

export interface TeacherInvitationResponse {
    invite: TeacherInvitationDTO;
}

export class ClassController extends BaseController {
    constructor() {
        super("class");
    }

    async getAll(full = true): Promise<ClassesResponse> {
        return this.get<ClassesResponse>(`/`, { full });
    }

    async getById(id: string): Promise<ClassResponse> {
        return this.get<ClassResponse>(`/${id}`);
    }

    async createClass(data: ClassDTO): Promise<ClassResponse> {
        return this.post<ClassResponse>(`/`, data);
    }

    async deleteClass(id: string): Promise<ClassResponse> {
        return this.delete<ClassResponse>(`/${id}`);
    }

    async updateClass(id: string, data: Partial<ClassDTO>): Promise<ClassResponse> {
        return this.put<ClassResponse>(`/${id}`, data);
    }

    async getStudents(id: string, full = true): Promise<StudentsResponse> {
        return this.get<StudentsResponse>(`/${id}/students`, { full });
    }

    async addStudent(id: string, username: string): Promise<ClassResponse> {
        return this.post<ClassResponse>(`/${id}/students`, { username });
    }

    async deleteStudent(id: string, username: string): Promise<ClassResponse> {
        return this.delete<ClassResponse>(`/${id}/students/${username}`);
    }

    async getTeachers(id: string, full = true): Promise<TeachersResponse> {
        return this.get<TeachersResponse>(`/${id}/teachers`, { full });
    }

    async addTeacher(id: string, username: string): Promise<ClassResponse> {
        return this.post<ClassResponse>(`/${id}/teachers`, { username });
    }

    async deleteTeacher(id: string, username: string): Promise<ClassResponse> {
        return this.delete<ClassResponse>(`/${id}/teachers/${username}`);
    }

    async getTeacherInvitations(id: string, full = true): Promise<TeacherInvitationsResponse> {
        return this.get<TeacherInvitationsResponse>(`/${id}/teacher-invitations`, { full });
    }

    async getAssignments(id: string, full = true): Promise<AssignmentsResponse> {
        return this.get<AssignmentsResponse>(`/${id}/assignments`, { full });
    }
}
