import { BaseController } from "./base-controller";
import type { AssignmentDTO, AssignmentDTOId } from "@dwengo-1/common/interfaces/assignment";
import type { SubmissionsResponse } from "./submissions";
import type { QuestionsResponse } from "./questions";
import type { GroupsResponse } from "./groups";

export interface AssignmentsResponse {
    assignments: AssignmentDTO[] | AssignmentDTOId[];
}

export interface AssignmentResponse {
    assignment: AssignmentDTO;
}

export class AssignmentController extends BaseController {
    constructor(classid: string) {
        super(`class/${classid}/assignments`);
    }

    async getAll(full = true): Promise<AssignmentsResponse> {
        return this.get<AssignmentsResponse>(`/`, { full });
    }

    async getByNumber(num: number): Promise<AssignmentResponse> {
        return this.get<AssignmentResponse>(`/${num}`);
    }

    async createAssignment(data: Partial<AssignmentDTO>): Promise<AssignmentResponse> {
        return this.post<AssignmentResponse>(`/`, data);
    }

    async deleteAssignment(num: number): Promise<AssignmentResponse> {
        return this.delete<AssignmentResponse>(`/${num}`);
    }

    async updateAssignment(num: number, data: Partial<AssignmentDTO>): Promise<AssignmentResponse> {
        return this.put<AssignmentResponse>(`/${num}`, data);
    }

    async getSubmissions(assignmentNumber: number, full = true): Promise<SubmissionsResponse> {
        return this.get<SubmissionsResponse>(`/${assignmentNumber}/submissions`, { full });
    }

    async getQuestions(assignmentNumber: number, full = true): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>(`/${assignmentNumber}/questions`, { full });
    }

    async getGroups(assignmentNumber: number, full = true): Promise<GroupsResponse> {
        return this.get<GroupsResponse>(`/${assignmentNumber}/groups`, { full });
    }
}
