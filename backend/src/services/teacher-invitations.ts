import {fetchTeacher} from './teachers';
import {getTeacherInvitationRepository} from '../data/repositories';
import {mapToInvitation, mapToTeacherInvitationDTO} from '../interfaces/teacher-invitation';
import {addClassTeacher, fetchClass} from './classes';
import {TeacherInvitationData, TeacherInvitationDTO} from '@dwengo-1/common/interfaces/teacher-invitation';
import {ConflictException} from '../exceptions/conflict-exception';
import {NotFoundException} from '../exceptions/not-found-exception';
import {TeacherInvitation} from '../entities/classes/teacher-invitation.entity';
import {ClassStatus} from "@dwengo-1/common/util/class-join-request";

export async function getAllInvitations(username: string, sent: boolean): Promise<TeacherInvitationDTO[]> {
    const teacher = await fetchTeacher(username);
    const teacherInvitationRepository = getTeacherInvitationRepository();

    let invitations;
    if (sent) {
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

async function fetchInvitation(usernameSender: string, usernameReceiver: string, classId: string): Promise<TeacherInvitation> {
    const sender = await fetchTeacher(usernameSender);
    const receiver = await fetchTeacher(usernameReceiver);
    const cls = await fetchClass(classId);

    const teacherInvitationRepository = getTeacherInvitationRepository();
    const invite = await teacherInvitationRepository.findBy(cls, sender, receiver);

    if (!invite) {
        throw new NotFoundException('Teacher invite not found');
    }

    return invite;
}

export async function getInvitation(sender: string, receiver: string, classId: string): Promise<TeacherInvitationDTO> {
    const invitation = await fetchInvitation(sender, receiver, classId);
    return mapToTeacherInvitationDTO(invitation);
}

export async function updateInvitation(data: TeacherInvitationData): Promise<TeacherInvitationDTO> {
    const invitation = await fetchInvitation(data.sender, data.receiver, data.class);
    invitation.status = ClassStatus.Declined;

    if (data.accepted) {
        invitation.status = ClassStatus.Accepted;
        await addClassTeacher(data.class, data.receiver);
    }

    const teacherInvitationRepository = getTeacherInvitationRepository();
    await teacherInvitationRepository.save(invitation);

    return mapToTeacherInvitationDTO(invitation);
}

export async function deleteInvitation(data: TeacherInvitationData): Promise<TeacherInvitationDTO> {
    const invitation = await fetchInvitation(data.sender, data.receiver, data.class);

    const sender = await fetchTeacher(data.sender);
    const receiver = await fetchTeacher(data.receiver);
    const cls = await fetchClass(data.class);

    const teacherInvitationRepository = getTeacherInvitationRepository();
    await teacherInvitationRepository.deleteBy(cls, sender, receiver);

    return mapToTeacherInvitationDTO(invitation);
}
