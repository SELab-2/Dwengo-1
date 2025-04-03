import { BaseController } from "./base-controller";

export class SubmissionController extends BaseController {
    constructor(classid: string, assignmentNumber: number, groupNumber: number) {
        super(`class/${classid}/assignments/${assignmentNumber}/groups/${groupNumber}`);
    }

    async getAll(full = true) {
        return this.get<any>(`/`, { full });
    }

    async getByNumber(submissionNumber: number) {
        return this.get<any>(`/${submissionNumber}`);
    }

    async createSubmission(data: any) {
        return this.post<any>(`/`, data);
    }

    async deleteSubmission(submissionNumber: number) {
        return this.delete<any>(`/${submissionNumber}`);
    }
}
