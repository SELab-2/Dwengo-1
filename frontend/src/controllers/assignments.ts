import { BaseController } from "./base-controller";
import type { AssignmentDTO } from "@dwengo-1/common/interfaces/assignment";
import type { SubmissionsResponse } from "./submissions";
import type { QuestionsResponse } from "./questions";
import type { GroupsResponse } from "./groups";

export interface AssignmentsResponse {
    assignments: AssignmentDTO[] | string[];
}

export interface AssignmentResponse {
    assignment: AssignmentDTO;
}

export class AssignmentController extends BaseController {
    constructor(classid: string) {
        super(`class/${classid}/assignments`);
    }

    async getAll(full = true) {
        return this.get<AssignmentsResponse>(`/`, { full });
    }

    async getByNumber(num: number) {
        return this.get<AssignmentResponse>(`/${num}`);
    }

    async createAssignment(data: any) {
        return this.post<AssignmentResponse>(`/`, data);
    }

    async deleteAssignment(num: number) {
        return this.delete<AssignmentResponse>(`/${num}`);
    }

    async getSubmissions(assignmentNumber: number, full = true) {
        return this.get<SubmissionsResponse>(`/${assignmentNumber}/submissions`, { full });
    }

    async getQuestions(assignmentNumber: number, full = true) {
        return this.get<QuestionsResponse>(`/${assignmentNumber}/questions`, { full });
    }

    async getGroups(assignmentNumber: number, full = true) {
        return this.get<GroupsResponse>(`/${assignmentNumber}/groups`, { full });
    }
}
