import { BaseController } from "@/controllers/base-controller.ts";
import type { JoinRequestResponse, JoinRequestsResponse, StudentsResponse } from "@/controllers/students.ts";
import type { QuestionsResponse } from "@/controllers/questions.ts";
import type { ClassesResponse } from "@/controllers/classes.ts";
import type { TeacherDTO } from "@dwengo-1/interfaces/teacher";

export interface TeachersResponse {
    teachers: TeacherDTO[] | string[];
}
export interface TeacherResponse {
    teacher: TeacherDTO;
}

export class TeacherController extends BaseController {
    constructor() {
        super("teacher");
    }

    async getAll(full = false): Promise<TeachersResponse> {
        return this.get<TeachersResponse>("/", { full });
    }

    async getByUsername(username: string): Promise<TeacherResponse> {
        return this.get<TeacherResponse>(`/${username}`);
    }

    async createTeacher(data: TeacherDTO): Promise<TeacherResponse> {
        return this.post<TeacherResponse>("/", data);
    }

    async deleteTeacher(username: string): Promise<TeacherResponse> {
        return this.delete<TeacherResponse>(`/${username}`);
    }

    async getClasses(username: string, full = false): Promise<ClassesResponse> {
        return this.get<ClassesResponse>(`/${username}/classes`, { full });
    }

    async getStudents(username: string, full = false): Promise<StudentsResponse> {
        return this.get<StudentsResponse>(`/${username}/students`, { full });
    }

    async getQuestions(username: string, full = false): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>(`/${username}/questions`, { full });
    }

    async getStudentJoinRequests(username: string, classId: string): Promise<JoinRequestsResponse> {
        return this.get<JoinRequestsResponse>(`/${username}/joinRequests/${classId}`);
    }

    async updateStudentJoinRequest(
        teacherUsername: string,
        classId: string,
        studentUsername: string,
        accepted: boolean,
    ): Promise<JoinRequestResponse> {
        return this.put<JoinRequestResponse>(
            `/${teacherUsername}/joinRequests/${classId}/${studentUsername}`,
            accepted,
        );
    }

    // GetInvitations(id: string) {return this.get<{ invitations: string[] }>(`/${id}/invitations`);}
}
