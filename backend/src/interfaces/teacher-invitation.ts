import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity.js';
import { ClassDTO, mapToClassDTO } from './class.js';
import { mapToUserDTO, UserDTO } from './user.js';

export interface TeacherInvitationDTO {
    sender: string | UserDTO;
    receiver: string | UserDTO;
    class: string | ClassDTO;
}

export function mapToTeacherInvitationDTO(invitation: TeacherInvitation): TeacherInvitationDTO {
    return {
        sender: mapToUserDTO(invitation.sender),
        receiver: mapToUserDTO(invitation.receiver),
        class: mapToClassDTO(invitation.class),
    };
}

export function mapToTeacherInvitationDTOIds(invitation: TeacherInvitation): TeacherInvitationDTO {
    return {
        sender: invitation.sender.username,
        receiver: invitation.receiver.username,
        class: invitation.class.classId!,
    };
}
