import { BaseController } from "./base-controller";
import type { GroupDTO, GroupDTOId } from "@dwengo-1/common/interfaces/group";
import type { SubmissionsResponse } from "./submissions";
import type { QuestionsResponse } from "./questions";

export interface GroupsResponse {
    groups: GroupDTO[] | GroupDTOId[];
}

export interface GroupResponse {
    group: GroupDTO;
}

export class GroupController extends BaseController {
    constructor(classid: string, assignmentNumber: number) {
        super(`class/${classid}/assignments/${assignmentNumber}/groups`);
    }

    async getAll(full = true): Promise<GroupsResponse> {
        return this.get<GroupsResponse>(`/`, { full });
    }

    async getByNumber(num: number): Promise<GroupResponse> {
        return this.get<GroupResponse>(`/${num}`);
    }

    async createGroup(data: GroupDTO): Promise<GroupResponse> {
        return this.post<GroupResponse>(`/`, data);
    }

    async deleteGroup(num: number): Promise<GroupResponse> {
        return this.delete<GroupResponse>(`/${num}`);
    }

    async updateGroup(num: number, data: Partial<GroupDTO>): Promise<GroupResponse> {
        return this.put<GroupResponse>(`/${num}`, data);
    }

    async getSubmissions(groupNumber: number, full = true): Promise<SubmissionsResponse> {
        return this.get<SubmissionsResponse>(`/${groupNumber}/submissions`, { full });
    }

    async getQuestions(groupNumber: number, full = true): Promise<QuestionsResponse> {
        return this.get<QuestionsResponse>(`/${groupNumber}/questions`, { full });
    }
}
