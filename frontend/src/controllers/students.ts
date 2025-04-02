import { BaseController } from "@/controllers/base-controller.ts";
import type {StudentDTO} from "dwengo-1-common/src/interfaces/student";
import type {ClassesResponse} from "@/controllers/classes.ts";
import type {AssignmentsResponse} from "@/controllers/assignments.ts";
import type {GroupsResponse} from "@/controllers/groups.ts";
import type {SubmissionsResponse} from "@/controllers/submissions.ts";
import type {QuestionsResponse} from "@/controllers/questions.ts";
import type {ClassJoinRequestDTO} from "dwengo-1-common/src/interfaces/class-join-request";

export interface StudentsResponse { students: StudentDTO[] | string[] }
export interface StudentResponse { student: StudentDTO }
export interface JoinRequestsResponse { requests: ClassJoinRequestDTO[] }
export interface JoinRequestResponse { request: ClassJoinRequestDTO }


export class StudentController extends BaseController {
    constructor() {
        super("student");
    }

    async getAll(full = true): Promise<StudentsResponse> {
        return this.get<StudentsResponse>("/", { full });
    }

    async getByUsername(username: string): Promise<StudentResponse> {
        return this.get<StudentResponse>(`/${username}`);
    }

    async createStudent(data: StudentDTO): Promise<StudentResponse> {
        return this.post<StudentResponse>("/", data);
    }

    async deleteStudent(username: string): Promise<StudentResponse> {
        return this.delete<StudentResponse>(`/${username}`);
    }

    async getClasses(username: string, full = true): Promise<ClassesResponse> {
        return this.get<ClassesResponse>(`/${username}/classes`, { full });
    }

    async getAssignments(username: string, full = true): Promise<AssignmentsResponse> {
        return this.get<AssignmentsResponse>(`/${username}/assignments`, { full });
    }

    async getGroups(username: string, full = true): Promise<GroupsResponse> {
        return this.get<GroupsResponse>(`/${username}/groups`, { full });
    }

    async getSubmissions(username: string): Promise<SubmissionsResponse> {
        return this.get<SubmissionsResponse>(`/${username}/submissions`);
    }

    async getQuestions(username: string, full = true): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>(`/${username}/questions`, { full });
    }

    async getJoinRequests(username: string): Promise<JoinRequestsResponse> {
        return this.get<JoinRequestsResponse>(`/${username}/joinRequests`);
    }

    async getJoinRequest(username: string, classId: string): Promise<JoinRequestResponse> {
        return this.get<JoinRequestResponse>(`/${username}/joinRequests/${classId}`);
    }

    async createJoinRequest(username: string, classId: string): Promise<JoinRequestResponse> {
        return this.post<JoinRequestResponse>(`/${username}/joinRequests}`, classId);
    }

    async deleteJoinRequest(username: string, classId: string): Promise<JoinRequestResponse> {
        return this.delete<JoinRequestResponse>(`/${username}/joinRequests/${classId}`);
    }
}
