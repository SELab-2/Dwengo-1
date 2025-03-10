import {
    getClassRepository,
    getGroupRepository,
    getStudentRepository,
} from '../data/repositories.js';
import { Class } from '../entities/classes/class.entity.js';
import { Student } from '../entities/users/student.entity.js';
import { AssignmentDTO } from '../interfaces/assignment.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { GroupDTO, mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { getAllAssignments } from './assignments.js';
import { UserService } from './users.js';

export class StudentService extends UserService<Student> {
    constructor() {
        super(getStudentRepository());
    }
}

export async function getStudentClasses(username: string, full: boolean): Promise<ClassDTO[] | string[]> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) {
        return [];
    }

    const classRepository = getClassRepository();
    const classes = await classRepository.findByStudent(student);

    if (full) {
        return classes.map(mapToClassDTO);
    }

    return classes.map((cls) => cls.classId);
}

export async function getStudentAssignments(username: string, full: boolean): Promise<AssignmentDTO[]> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) {
        return [];
    }

    const classRepository = getClassRepository();
    const classes = await classRepository.findByStudent(student);

    const assignments = (
        await Promise.all(
            classes.map(async (cls) => {
                return await getAllAssignments(cls.classId, full);
            })
        )
    ).flat();

    return assignments;
}

export async function getStudentGroups(username: string, full: boolean): Promise<GroupDTO[]> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) {
        return [];
    }

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsWithStudent(student);

    if (full) {
        return groups.map(mapToGroupDTO);
    }

    return groups.map(mapToGroupDTOId);
}
