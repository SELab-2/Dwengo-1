import { getClassRepository, getStudentRepository, getTeacherInvitationRepository, getTeacherRepository } from '../data/repositories.js';
import { mapToClassDTO } from '../interfaces/class.js';
import { mapToStudentDTO } from '../interfaces/student.js';
import { mapToTeacherInvitationDTO, mapToTeacherInvitationDTOIds } from '../interfaces/teacher-invitation.js';
import { getLogger } from '../logging/initalize.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { Class } from '../entities/classes/class.entity.js';
import { ClassDTO } from '@dwengo-1/common/interfaces/class';
import { TeacherInvitationDTO } from '@dwengo-1/common/interfaces/teacher-invitation';
import { StudentDTO } from '@dwengo-1/common/interfaces/student';

const logger = getLogger();

export async function fetchClass(classId: string): Promise<Class> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classId);

    if (!cls) {
        throw new NotFoundException('Class with id not found');
    }

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
    const teachers = (await Promise.all(teacherUsernames.map(async (id) => teacherRepository.findByUsername(id)))).filter(
        (teacher) => teacher !== null
    );

    const studentRepository = getStudentRepository();
    const studentUsernames = classData.students || [];
    const students = (await Promise.all(studentUsernames.map(async (id) => studentRepository.findByUsername(id)))).filter(
        (student) => student !== null
    );

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
    return students.map((student) => student.username);
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
