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
import {fetchTeacher} from "./teachers";
import {fetchStudent, getStudent} from "./students";
import {TeacherDTO} from "@dwengo-1/common/interfaces/teacher";
import {mapToTeacherDTO} from "../interfaces/teacher";
import { EntityDTO } from '@mikro-orm/core';

export async function fetchClass(classid: string): Promise<Class> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    if (!cls) {
        throw new NotFoundException("Class not found");
    }

    return cls;
}

export async function getAllClasses(full: boolean): Promise<ClassDTO[] | string[]> {
    const classRepository = getClassRepository();
    const classes = await classRepository.findAll({ populate: ['students', 'teachers'] });

    if (full) {
        return classes.map(mapToClassDTO);
    }
    return classes.map((cls) => cls.classId!);
}

export async function getClass(classId: string): Promise<ClassDTO> {
    const cls = await fetchClass(classId);
    return mapToClassDTO(cls);
}

export async function createClass(classData: ClassDTO): Promise<ClassDTO> {
    const teacherUsernames = classData.teachers || [];
    const teachers = (await Promise.all(teacherUsernames.map(async (id) => fetchTeacher(id) )));

    const studentUsernames = classData.students || [];
    const students = (await Promise.all(studentUsernames.map(async (id) => fetchStudent(id) )));

    const classRepository = getClassRepository();
    const newClass = classRepository.create({
        displayName: classData.displayName,
        teachers: teachers,
        students: students,
    });
    await classRepository.save(newClass, {preventOverwrite: true});

    return mapToClassDTO(newClass);
}

export async function putClass(classId: string, classData: Partial<ClassDTO>): Promise<ClassDTO> {
    const cls = await fetchClass(classId);

    const classRepository = getClassRepository();
    classRepository.assign(cls, classData as Partial<EntityDTO<Class>>);
    await classRepository.getEntityManager().flush();

    return mapToClassDTO(cls);
}

export async function deleteClass(classId: string): Promise<ClassDTO> {
    const cls = await fetchClass(classId);

    const classRepository = getClassRepository();
    await classRepository.deleteById(classId);

    return mapToClassDTO(cls);
}

export async function getClassStudents(classId: string, full: boolean): Promise<StudentDTO[] | string[]> {
    const cls = await fetchClass(classId);

    if (full) {
        return cls.students.map(mapToStudentDTO);
    }
    return cls.students.map((student) => student.username);
}

export async function getClassStudentsDTO(classId: string): Promise<StudentDTO[]> {
    const cls = await fetchClass(classId);
    return cls.students.map(mapToStudentDTO);
}

export async function getClassTeachers(classId: string, full: boolean): Promise<TeacherDTO[] | string[]> {
    const cls = await fetchClass(classId);

    if (full){
        return cls.teachers.map(mapToTeacherDTO);
    }
    return cls.teachers.map((student) => student.username);
}

export async function getClassTeacherInvitations(classId: string, full: boolean): Promise<TeacherInvitationDTO[]> {
    const cls = await fetchClass(classId);

    const teacherInvitationRepository = getTeacherInvitationRepository();
    const invitations = await teacherInvitationRepository.findAllInvitationsForClass(cls);

    if (full) {
        return invitations.map(mapToTeacherInvitationDTO);
    }

    return invitations.map(mapToTeacherInvitationDTOIds);
}

export async function deleteClassStudent(classId: string, username: string): Promise<ClassDTO> {
    const cls = await fetchClass(classId);
    
    const classRepository = getClassRepository();
    classRepository.assign(cls, { students: cls.students.filter((student) => student.username !== username) });
    await classRepository.getEntityManager().flush();

    return mapToClassDTO(cls);
}

export async function deleteClassTeacher(classId: string, username: string): Promise<ClassDTO> {
    const cls = await fetchClass(classId);
    
    const classRepository = getClassRepository();
    classRepository.assign(cls, { teachers: cls.teachers.filter((teacher) => teacher.username !== username) });
    await classRepository.getEntityManager().flush();

    return mapToClassDTO(cls);
}

export async function addClassStudent(classId: string, username: string): Promise<ClassDTO> {
    const cls = await fetchClass(classId);
    const newStudent = await fetchStudent(username);

    const classRepository = getClassRepository();
    classRepository.assign(cls, { students: [...cls.students, newStudent] });
    await classRepository.getEntityManager().flush();

    return mapToClassDTO(cls);
}

export async function addClassTeacher(classId: string, username: string): Promise<ClassDTO> {
    const cls = await fetchClass(classId);
    const newTeacher = await fetchTeacher(username);

    const classRepository = getClassRepository();
    classRepository.assign(cls, { teachers: [...cls.teachers, newTeacher] });
    await classRepository.getEntityManager().flush();

    return mapToClassDTO(cls);
}
