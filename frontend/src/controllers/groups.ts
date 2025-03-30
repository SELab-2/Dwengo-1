import { BaseController } from "./base-controller";

export class GroupController extends BaseController {
    constructor(classid: string, assignmentNumber: number) {
        super(`class/${classid}/assignments/${assignmentNumber}/groups`);
    }

    getAll(full = true) {
        return this.get<{ groups: any[] }>(`/`, { full });
    }

    getByNumber(num: number) {
        return this.get<{ group: any }>(`/${num}`);
    }

    createGroup(data: any) {
        return this.post<{ group: any }>(`/`, data);
    }

    deleteClass(num: number) {
        return this.delete<{ group: any }>(`/${num}`);
    }


    getSubmissions(groupNumber: number, full = true) {
        return this.get<{ groups: any[] }>(`/${groupNumber}/submissions`, { full });
    }

    getQuestions(groupNumber: number, full = true) {
        return this.get<{ questions: any[] }>(`/${groupNumber}/questions`, { full });
    }
}