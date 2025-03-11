import {
    getClassRepository,
    getTeacherInvitationRepository,
} from '../data/repositories.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { mapToStudentDTO, StudentDTO } from '../interfaces/student.js';
import {
    mapToTeacherInvitationDTO,
    mapToTeacherInvitationDTOIds,
    TeacherInvitationDTO,
} from '../interfaces/teacher-invitation.js';

export async function getAllClasses(
    full: boolean
): Promise<ClassDTO[] | string[]> {
    const classRepository = getClassRepository();
    const classes = await classRepository.find(
        {},
        { populate: ['students', 'teachers'] }
    );

    if (!classes) {
        return [];
    }

    if (full) {
        return classes.map(mapToClassDTO);
    }
    return classes.map((cls) => {
        return cls.classId;
    });
}

export async function getClass(classId: string): Promise<ClassDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return null;
    }

    return mapToClassDTO(cls);
}

async function fetchClassStudents(classId: string): Promise<StudentDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    return cls.students.map(mapToStudentDTO);
}

export async function getClassStudents(classId: string): Promise<StudentDTO[]> {
    return await fetchClassStudents(classId);
}

export async function getClassStudentsIds(classId: string): Promise<string[]> {
    const students: StudentDTO[] = await fetchClassStudents(classId);
    return students.map((student) => {
        return student.username;
    });
}

export async function getClassTeacherInvitations(
    classId: string,
    full: boolean
): Promise<TeacherInvitationDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    const teacherInvitationRepository = getTeacherInvitationRepository();
    const invitations =
        await teacherInvitationRepository.findAllInvitationsForClass(cls);

    if (full) {
        return invitations.map(mapToTeacherInvitationDTO);
    }

    return invitations.map(mapToTeacherInvitationDTOIds);
}
