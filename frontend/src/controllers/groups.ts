import { BaseController } from "./base-controller";
import type { GroupDTO } from "@dwengo-1/common/interfaces/group";
import type { SubmissionsResponse } from "./submissions";
import type { QuestionsResponse } from "./questions";

export interface GroupsResponse {
    groups: GroupDTO[];
}

export interface GroupResponse {
    group: GroupDTO;
}

export class GroupController extends BaseController {
    constructor(classid: string, assignmentNumber: number) {
        super(`class/${classid}/assignments/${assignmentNumber}/groups`);
    }

    async getAll(full = true) {
        return this.get<GroupsResponse>(`/`, { full });
    }

    async getByNumber(num: number) {
        return this.get<GroupResponse>(`/${num}`);
    }

    async createGroup(data: any) {
        return this.post<GroupResponse>(`/`, data);
    }

    async deleteGroup(num: number) {
        return this.delete<GroupResponse>(`/${num}`);
    }

    async getSubmissions(groupNumber: number, full = true) {
        return this.get<SubmissionsResponse>(`/${groupNumber}/submissions`, { full });
    }

    async getQuestions(groupNumber: number, full = true) {
        return this.get<QuestionsResponse>(`/${groupNumber}/questions`, { full });
    }
}
