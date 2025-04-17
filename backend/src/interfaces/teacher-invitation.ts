import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity.js';
import { mapToUserDTO } from './user.js';
import { TeacherInvitationDTO } from '@dwengo-1/common/interfaces/teacher-invitation';
import { getTeacherInvitationRepository } from '../data/repositories.js';
import { Teacher } from '../entities/users/teacher.entity.js';
import { Class } from '../entities/classes/class.entity.js';
import { ClassStatus } from '@dwengo-1/common/util/class-join-request';

export function mapToTeacherInvitationDTO(invitation: TeacherInvitation): TeacherInvitationDTO {
    return {
        sender: mapToUserDTO(invitation.sender),
        receiver: mapToUserDTO(invitation.receiver),
        classId: invitation.class.classId!,
        status: invitation.status,
    };
}

export function mapToTeacherInvitationDTOIds(invitation: TeacherInvitation): TeacherInvitationDTO {
    return {
        sender: invitation.sender.username,
        receiver: invitation.receiver.username,
        classId: invitation.class.classId!,
        status: invitation.status,
    };
}

export function mapToInvitation(sender: Teacher, receiver: Teacher, cls: Class): TeacherInvitation {
    return getTeacherInvitationRepository().create({
        sender,
        receiver,
        class: cls,
        status: ClassStatus.Open,
    });
}
