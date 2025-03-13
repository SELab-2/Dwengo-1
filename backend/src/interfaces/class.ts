import { Collection } from '@mikro-orm/core';
import { Class } from '../entities/classes/class.entity.js';
import { Student } from '../entities/users/student.entity.js';
import { Teacher } from '../entities/users/teacher.entity.js';

export interface ClassDTO {
    id: string;
    displayName: string;
    teachers: string[];
    students: string[];
    joinRequests: string[];
    endpoints?: {
        self: string;
        invitations: string;
        assignments: string;
        students: string;
    };
}

export function mapToClassDTO(cls: Class): ClassDTO {
    return {
        id: cls.classId!,
        displayName: cls.displayName,
        teachers: cls.teachers.map((teacher) => {
            return teacher.username;
        }),
        students: cls.students.map((student) => {
            return student.username;
        }),
        joinRequests: [], // TODO
    };
}

export function mapToClass(
    classData: ClassDTO, 
    students: Collection<Student>, 
    teachers: Collection<Teacher>
): Class {
    const cls = new Class();
    cls.displayName = classData.displayName;
    cls.students = students;
    cls.teachers = teachers;
    
    return cls;
}
