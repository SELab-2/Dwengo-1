import { BaseController } from "./base-controller";

export class SubmissionController extends BaseController {
    constructor(classid: string, assignmentNumber: number, groupNumber: number) {
        super(`class/${classid}/assignments/${assignmentNumber}/groups/${groupNumber}`);
    }

    getAll(full = true) {
        return this.get<any>(`/`, { full });
    }

    getByNumber(submissionNumber: number) {
        return this.get<any>(`/${submissionNumber}`);
    }

    createSubmission(data: any) {
        return this.post<any>(`/`, data);
    }

    deleteSubmission(submissionNumber: number) {
        return this.delete<any>(`/${submissionNumber}`);
    }
}
