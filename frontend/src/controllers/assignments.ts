import { BaseController } from "./base-controller";
import type { AssignmentDTO } from "@dwengo-1/interfaces/assignment";

export interface AssignmentsResponse {
    assignments: AssignmentDTO[];
} // TODO ID

export class AssignmentController extends BaseController {
    constructor(classid: string) {
        super(`class/${classid}/assignments`);
    }

    async getAll(full = true) {
        return this.get<{ assignments: any[] }>(`/`, { full });
    }

    async getByNumber(num: number) {
        return this.get<{ assignment: any }>(`/${num}`);
    }

    async createAssignment(data: any) {
        return this.post<{ assignment: any }>(`/`, data);
    }

    async deleteAssignment(num: number) {
        return this.delete<{ assignment: any }>(`/${num}`);
    }

    async getSubmissions(assignmentNumber: number, full = true) {
        return this.get<{ submissions: any[] }>(`/${assignmentNumber}/submissions`, { full });
    }

    async getQuestions(assignmentNumber: number, full = true) {
        return this.get<{ questions: any[] }>(`/${assignmentNumber}/questions`, { full });
    }

    async getGroups(assignmentNumber: number, full = true) {
        return this.get<{ groups: any[] }>(`/${assignmentNumber}/groups`, { full });
    }
}