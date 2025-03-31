import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity.js';
import { mapToClassDTO } from './class.js';
import { mapToUserDTO } from './user.js';
import { TeacherInvitationDTO } from 'dwengo-1-common/src/interfaces/teacher-invitation';

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
