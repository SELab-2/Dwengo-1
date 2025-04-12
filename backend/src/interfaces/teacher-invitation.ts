import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity.js';
import { mapToClassDTO } from './class.js';
import { mapToUserDTO } from './user.js';
import { TeacherInvitationDTO } from '@dwengo-1/common/interfaces/teacher-invitation';
import {getTeacherInvitationRepository} from "../data/repositories";
import {Teacher} from "../entities/users/teacher.entity";
import {Class} from "../entities/classes/class.entity";

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

export function mapToInvitation(sender: Teacher, receiver: Teacher, cls: Class): TeacherInvitation {
    return getTeacherInvitationRepository().create({
        sender, receiver, class: cls
    });
}
