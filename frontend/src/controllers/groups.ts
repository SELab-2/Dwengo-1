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
    constructor() {
        super('');
    }

    update(classid: string, assignmentNumber: number) {
        this.basePath = `class/${classid}/assignments/${assignmentNumber}/groups`;
    }

    protected getBasePath(classid: string, assignmentNumber: number) {
        return `class/${classid}/assignments/${assignmentNumber}/groups`;
    }

    async getAll(classid: string, assignmentNumber: number, full = true): Promise<GroupsResponse> {
        return this.get<GroupsResponse>(`${this.getBasePath(classid, assignmentNumber)}/`, { full });
    }

    async getByNumber(classid: string, assignmentNumber: number, num: number | string): Promise<GroupResponse> {
        return this.get<GroupResponse>(`${this.getBasePath(classid, assignmentNumber)}/${num}`);
    }

    async createGroup(classid: string, assignmentNumber: number, data: GroupDTO): Promise<GroupResponse> {
        return this.post<GroupResponse>(`${this.getBasePath(classid, assignmentNumber)}/`, data);
    }

    async deleteGroup(classid: string, assignmentNumber: number, num: number): Promise<GroupResponse> {
        return this.delete<GroupResponse>(`${this.getBasePath(classid, assignmentNumber)}/${num}`);
    }

    async updateGroup(classid: string, assignmentNumber: number, num: number, data: Partial<GroupDTO>): Promise<GroupResponse> {
        return this.put<GroupResponse>(`${this.getBasePath(classid, assignmentNumber)}/${num}`, data);
    }

    async getSubmissions(classid: string, assignmentNumber: number, groupNumber: number, full = true): Promise<SubmissionsResponse> {
        return this.get<SubmissionsResponse>(`${this.getBasePath(classid, assignmentNumber)}/${groupNumber}/submissions`, { full });
    }

    async getQuestions(classid: string, assignmentNumber: number, groupNumber: number, full = true): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>(`${this.getBasePath(classid, assignmentNumber)}/${groupNumber}/questions`, { full });
    }
}
