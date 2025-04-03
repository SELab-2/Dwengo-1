import { BaseController } from "./base-controller";
import type { AssignmentDTO } from "@dwengo-1/interfaces/assignment";
import type { SubmissionsResponse } from "./submissions";
import type { QuestionsResponse } from "./questions";
import type { GroupsResponse } from "./groups";

export interface AssignmentsResponse {
    assignments: AssignmentDTO[];
}

export interface AssignmentResponse {
    assignments: AssignmentDTO;
}

export class AssignmentController extends BaseController {
    constructor(classid: string) {
        super(`class/${classid}/assignments`);
    }

    getAll(full = true) {
        return this.get<AssignmentsResponse>(`/`, { full });
    }

    getByNumber(num: number) {
        return this.get<AssignmentResponse>(`/${num}`);
    }

    createAssignment(data: any) {
        return this.post<AssignmentResponse>(`/`, data);
    }

    deleteAssignment(num: number) {
        return this.delete<AssignmentResponse>(`/${num}`);
    }

    getSubmissions(assignmentNumber: number, full = true) {
        return this.get<SubmissionsResponse>(`/${assignmentNumber}/submissions`, { full });
    }

    getQuestions(assignmentNumber: number, full = true) {
        return this.get<QuestionsResponse>(`/${assignmentNumber}/questions`, { full });
    }

    getGroups(assignmentNumber: number, full = true) {
        return this.get<GroupsResponse>(`/${assignmentNumber}/groups`, { full });
    }
}
