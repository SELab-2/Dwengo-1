import { getClassRepository, getStudentRepository, getTeacherInvitationRepository, getTeacherRepository } from '../data/repositories.js';
import { Class } from '../entities/classes/class.entity.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { mapToStudentDTO, StudentDTO } from '../interfaces/student.js';
import { mapToTeacherInvitationDTO, mapToTeacherInvitationDTOIds, TeacherInvitationDTO } from '../interfaces/teacher-invitation.js';
import { getLogger } from '../logging/initalize.js';

const logger = getLogger();

async function fetchClass(classid: string): Promise<Class | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    return cls;
}

export async function getAllClasses(full: boolean): Promise<ClassDTO[] | string[]> {
    const classRepository = getClassRepository();
    const classes = await classRepository.find({}, { populate: ['students', 'teachers'] });

    if (!classes) {
        return [];
    }

    if (full) {
        return classes.map(mapToClassDTO);
    }
    return classes.map((cls) => cls.classId!);
}

export async function createClass(classData: ClassDTO): Promise<ClassDTO | null> {
    const teacherRepository = getTeacherRepository();
    const teacherUsernames = classData.teachers || [];
    const teachers = (await Promise.all(teacherUsernames.map((id) => teacherRepository.findByUsername(id)))).filter((teacher) => teacher !== null);

    const studentRepository = getStudentRepository();
    const studentUsernames = classData.students || [];
    const students = (await Promise.all(studentUsernames.map((id) => studentRepository.findByUsername(id)))).filter((student) => student !== null);

    const classRepository = getClassRepository();

    try {
        const newClass = classRepository.create({
            displayName: classData.displayName,
            teachers: teachers,
            students: students,
        });
        await classRepository.save(newClass);

        return mapToClassDTO(newClass);
    } catch (e) {
        logger.error(e);
        return null;
    }
}

export async function getClass(classId: string): Promise<ClassDTO | null> {
    const cls = await fetchClass(classId);

    if (!cls) {
        return null;
    }

    return mapToClassDTO(cls);
}

export async function getClassStudents(classId: string, full: boolean): Promise<StudentDTO[] | string[]> {
    const cls = await fetchClass(classId);

    if (!cls) {
        return [];
    }

    if (full) {
        return cls.students.map(mapToStudentDTO);
    }

    return cls.students.map((student) => student.username);
}

export async function getClassTeacherInvitations(classId: string, full: boolean): Promise<TeacherInvitationDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        return [];
    }

    const teacherInvitationRepository = getTeacherInvitationRepository();
    const invitations = await teacherInvitationRepository.findAllInvitationsForClass(cls);

    if (full) {
        return invitations.map(mapToTeacherInvitationDTO);
    }

    return invitations.map(mapToTeacherInvitationDTOIds);
}
