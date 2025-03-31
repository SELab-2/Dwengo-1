import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity.js';
import { mapToClassDTO } from './class.js';
import { mapToUserDTO } from './user.js';
import { ClassDTO } from 'dwengo-1-common/src/interfaces/class';
import { UserDTO } from 'dwengo-1-common/src/interfaces/user';

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
