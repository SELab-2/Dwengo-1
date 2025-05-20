import { BaseController } from "./base-controller";
import type { SubmissionDTO, SubmissionDTOId } from "@dwengo-1/common/interfaces/submission";
import type { Language } from "@dwengo-1/common/util/language";

export interface SubmissionsResponse {
    submissions: SubmissionDTO[] | SubmissionDTOId[];
}

export interface SubmissionResponse {
    submission: SubmissionDTO;
}

export class SubmissionController extends BaseController {
    constructor(hruid: string) {
        super(`learningObject/${hruid}/submissions`);
    }

    async getAll(
        language: Language,
        version: number,
        classId: string,
        assignmentId: number,
        groupId?: number,
        full = true,
    ): Promise<SubmissionsResponse> {
        return this.get<SubmissionsResponse>(`/`, {
            language,
            version,
            classId,
            assignmentId,
            forGroup: groupId,
            full,
        });
    }

    async getByNumber(
        language: Language,
        version: number,
        classId: string,
        assignmentId: number,
        groupId: number,
        submissionNumber: number,
    ): Promise<SubmissionResponse> {
        return this.get<SubmissionResponse>(`/${submissionNumber}`, {
            language,
            version,
            classId,
            assignmentId,
            forGroup: groupId,
        });
    }

    async createSubmission(data: SubmissionDTO): Promise<SubmissionResponse> {
        return this.post<SubmissionResponse>(`/`, data);
    }

    async deleteSubmission(submissionNumber: number): Promise<SubmissionResponse> {
        return this.delete<SubmissionResponse>(`/${submissionNumber}`);
    }
}
