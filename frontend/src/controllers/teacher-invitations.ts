import { BaseController } from "@/controllers/base-controller.ts";
import type { TeacherInvitationData, TeacherInvitationDTO } from "@dwengo-1/common/interfaces/teacher-invitation";

export interface TeacherInvitationsResponse {
    invitations: TeacherInvitationDTO[];
}

export interface TeacherInvitationResponse {
    invitation: TeacherInvitationDTO;
}

export class TeacherInvitationController extends BaseController {
    constructor() {
        super("teachers/invitations");
    }

    async getAll(username: string, sent: boolean): Promise<TeacherInvitationsResponse> {
        return this.get<TeacherInvitationsResponse>(`/${username}`, { sent });
    }

    async getBy(data: TeacherInvitationData): Promise<TeacherInvitationResponse> {
        return this.get<TeacherInvitationResponse>(`/${data.sender}/${data.receiver}/${data.class}`)
    }

    async create(data: TeacherInvitationData): Promise<TeacherInvitationResponse> {
        return this.post<TeacherInvitationResponse>("/", data);
    }

    async remove(data: TeacherInvitationData): Promise<TeacherInvitationResponse> {
        return this.delete<TeacherInvitationResponse>(`/${data.sender}/${data.receiver}/${data.class}`);
    }

    async respond(data: TeacherInvitationData): Promise<TeacherInvitationResponse> {
        return this.put<TeacherInvitationResponse>("/", data);
    }
}
