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

    async getAll(full = true): Promise<SubmissionsResponse> {
        return this.get<SubmissionsResponse>(`/`, { full });
    }

    async getByNumber(submissionNumber: number): Promise<SubmissionResponse> {
        return this.get<SubmissionResponse>(`/${submissionNumber}`);
    }

    async createSubmission(data: unknown): Promise<SubmissionResponse> {
        return this.post<SubmissionResponse>(`/`, data);
    }

    async deleteSubmission(submissionNumber: number): Promise<SubmissionResponse> {
        return this.delete<SubmissionResponse>(`/${submissionNumber}`);
    }
}
