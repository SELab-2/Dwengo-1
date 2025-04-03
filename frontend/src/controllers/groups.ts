import { BaseController } from "./base-controller";
import type { GroupDTO } from "@dwengo-1/interfaces/group";

export interface GroupsResponse {
    groups: GroupDTO[];
} // | TODO id

export class GroupController extends BaseController {
    constructor(classid: string, assignmentNumber: number) {
        super(`class/${classid}/assignments/${assignmentNumber}/groups`);
    }

    async getAll(full = true) {
        return this.get<{ groups: any[] }>(`/`, { full });
    }

    async getByNumber(num: number) {
        return this.get<{ group: any }>(`/${num}`);
    }

    async createGroup(data: any) {
        return this.post<{ group: any }>(`/`, data);
    }

    async deleteClass(num: number) {
        return this.delete<{ group: any }>(`/${num}`);
    }

    async getSubmissions(groupNumber: number, full = true) {
        return this.get<{ groups: any[] }>(`/${groupNumber}/submissions`, { full });
    }

    async getQuestions(groupNumber: number, full = true) {
        return this.get<{ questions: any[] }>(`/${groupNumber}/questions`, { full });
    }
}
