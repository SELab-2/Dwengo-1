import { BaseController } from "./base-controller";
import type { AssignmentDTO } from "@dwengo-1/interfaces/assignment";

export interface AssignmentsResponse {
    assignments: AssignmentDTO[];
} // TODO ID

export class AssignmentController extends BaseController {
    constructor(classid: string) {
        super(`class/${classid}/assignments`);
    }

    getAll(full = true) {
        return this.get<{ assignments: any[] }>(`/`, { full });
    }

    getByNumber(num: number) {
        return this.get<{ assignment: any }>(`/${num}`);
    }

    createAssignment(data: any) {
        return this.post<{ assignment: any }>(`/`, data);
    }

    deleteAssignment(num: number) {
        return this.delete<{ assignment: any }>(`/${num}`);
    }

    getSubmissions(assignmentNumber: number, full = true) {
        return this.get<{ submissions: any[] }>(`/${assignmentNumber}/submissions`, { full });
    }

    getQuestions(assignmentNumber: number, full = true) {
        return this.get<{ questions: any[] }>(`/${assignmentNumber}/questions`, { full });
    }

    getGroups(assignmentNumber: number, full = true) {
        return this.get<{ groups: any[] }>(`/${assignmentNumber}/groups`, { full });
    }
}