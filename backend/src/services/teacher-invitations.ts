import { fetchTeacher } from './teachers';
import { getTeacherInvitationRepository } from '../data/repositories';
import { mapToInvitation, mapToTeacherInvitationDTO } from '../interfaces/teacher-invitation';
import { addClassTeacher, fetchClass } from './classes';
import { TeacherInvitationData, TeacherInvitationDTO } from '@dwengo-1/common/interfaces/teacher-invitation';
import { ConflictException } from '../exceptions/conflict-exception';
import { Teacher } from '../entities/users/teacher.entity';
import { Class } from '../entities/classes/class.entity';
import { NotFoundException } from '../exceptions/not-found-exception';
import { TeacherInvitation } from '../entities/classes/teacher-invitation.entity';

export async function getAllInvitations(username: string, by: boolean): Promise<TeacherInvitationDTO[]> {
    const teacher = await fetchTeacher(username);
    const teacherInvitationRepository = getTeacherInvitationRepository();

    let invitations;
    if (by) {
        invitations = await teacherInvitationRepository.findAllInvitationsBy(teacher);
    } else {
        invitations = await teacherInvitationRepository.findAllInvitationsFor(teacher);
    }
    return invitations.map(mapToTeacherInvitationDTO);
}

export async function createInvitation(data: TeacherInvitationData): Promise<TeacherInvitationDTO> {
    const teacherInvitationRepository = getTeacherInvitationRepository();
    const sender = await fetchTeacher(data.sender);
    const receiver = await fetchTeacher(data.receiver);

    const cls = await fetchClass(data.class);

    if (!cls.teachers.contains(sender)) {
        throw new ConflictException('The teacher sending the invite is not part of the class');
    }

    const newInvitation = mapToInvitation(sender, receiver, cls);
    await teacherInvitationRepository.save(newInvitation, { preventOverwrite: true });

    return mapToTeacherInvitationDTO(newInvitation);
}

async function fetchInvitation(sender: Teacher, receiver: Teacher, cls: Class): Promise<TeacherInvitation> {
    const teacherInvitationRepository = getTeacherInvitationRepository();
    const invite = await teacherInvitationRepository.findBy(cls, sender, receiver);

    if (!invite) {
        throw new NotFoundException('Teacher invite not found');
    }

    return invite;
}

export async function deleteInvitationFor(
    usernameSender: string,
    usernameReceiver: string,
    classId: string,
    accepted: boolean
): Promise<TeacherInvitationDTO> {
    const teacherInvitationRepository = getTeacherInvitationRepository();
    const sender = await fetchTeacher(usernameSender);
    const receiver = await fetchTeacher(usernameReceiver);

    const cls = await fetchClass(classId);

    const invitation = await fetchInvitation(sender, receiver, cls);
    await teacherInvitationRepository.deleteBy(cls, sender, receiver);

    if (accepted) {
        await addClassTeacher(classId, usernameReceiver);
    }

    return mapToTeacherInvitationDTO(invitation);
}
