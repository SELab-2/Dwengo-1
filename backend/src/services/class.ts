import { getClassRepository, getTeacherInvitationRepository } from "../data/repositories";
import { Class } from "../entities/classes/class.entity";
import { ClassDTO, mapToClassDTO } from "../interfaces/classes";
import { mapToStudentDTO, StudentDTO } from "../interfaces/students";
import { mapToTeacherInvitationDTO, mapToTeacherInvitationDTOIds, TeacherInvitationDTO } from "../interfaces/teacher-invitation";

export async function getAllClasses(full: boolean): Promise<ClassDTO[] | string[]> {
    const classRepository = getClassRepository();
    const classes = await classRepository.find({}, { populate: ["students", "teachers"] });

    if (!classes) {
        return [];
    }
    
    if (full) {
        return classes.map(mapToClassDTO);
    } else {
        return classes.map((cls) => cls.classId);
    }
}

export async function getClass(classId: string): Promise<ClassDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) return null;
    else {
        return mapToClassDTO(cls);
    }
}

export async function getClassStudents(classId: string, full: boolean): Promise<StudentDTO[] | string[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    if (full) {
        return cls.students.map(mapToStudentDTO);
    } else {
        return cls.students.map((student) => student.username);
    }
}

export async function getClassTeacherInvitations(classId: string, full: boolean): Promise<TeacherInvitationDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    const teacherInvitationRepository = getTeacherInvitationRepository();
    const invitations = await teacherInvitationRepository.findAllInvitationsForClass(cls);

    console.log(invitations);

    if (!invitations) {
        return [];
    }

    if (full) {
        return invitations.map(mapToTeacherInvitationDTO);
    }

    return invitations.map(mapToTeacherInvitationDTOIds);
}