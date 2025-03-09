import { Class } from "../entities/classes/class.entity.js";

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
        id: cls.classId,
        displayName: cls.displayName,
        teachers: cls.teachers.map(teacher => teacher.username),
        students: cls.students.map(student => student.username),
        joinRequests: [], // TODO
    }
};
