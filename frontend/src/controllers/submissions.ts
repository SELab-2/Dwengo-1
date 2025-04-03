import { BaseController } from "./base-controller";
import type { SubmissionDTO, SubmissionDTOId } from "@dwengo-1/common/interfaces/submission";

export interface SubmissionsResponse {
    submissions: SubmissionDTO[] | SubmissionDTOId[];
}

export interface SubmissionResponse {
    submission: SubmissionDTO;
}

export class SubmissionController extends BaseController {
    constructor(classid: string, assignmentNumber: number, groupNumber: number) {
        super(`class/${classid}/assignments/${assignmentNumber}/groups/${groupNumber}`);
    }

    async getAll(full = true) {
        return this.get<SubmissionsResponse>(`/`, { full });
    }

    async getByNumber(submissionNumber: number) {
        return this.get<SubmissionResponse>(`/${submissionNumber}`);
    }

    async createSubmission(data: any) {
        return this.post<SubmissionResponse>(`/`, data);
    }

    async deleteSubmission(submissionNumber: number) {
        return this.delete<SubmissionResponse>(`/${submissionNumber}`);
    }
}
