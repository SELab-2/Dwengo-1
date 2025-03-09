import { TeacherInvitation } from "../entities/classes/teacher-invitation.entity.js";
import { ClassDTO, mapToClassDTO } from "./classes.js";
import { mapToTeacherDTO, TeacherDTO } from "./teacher.js";

export interface TeacherInvitationDTO {
    sender: string | TeacherDTO,
    receiver: string | TeacherDTO,
    class: string | ClassDTO,
}

export function mapToTeacherInvitationDTO(invitation: TeacherInvitation): TeacherInvitationDTO {
    return {
        sender: mapToTeacherDTO(invitation.sender),
        receiver: mapToTeacherDTO(invitation.receiver),
        class: mapToClassDTO(invitation.class),
    };
}

export function mapToTeacherInvitationDTOIds(invitation: TeacherInvitation): TeacherInvitationDTO {
    return {
        sender: invitation.sender.username,
        receiver: invitation.receiver.username,
        class: invitation.class.classId,
    };
}
