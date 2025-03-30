import { getClassRepository, getGroupRepository, getStudentRepository, getSubmissionRepository } from '../data/repositories.js';
import { Class } from '../entities/classes/class.entity.js';
import { Student } from '../entities/users/student.entity.js';
import { AssignmentDTO } from '../interfaces/assignment.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { GroupDTO, mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { mapToStudent, mapToStudentDTO, StudentDTO } from '../interfaces/student.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId, SubmissionDTO, SubmissionDTOId } from '../interfaces/submission.js';
import { getAllAssignments } from './assignments.js';

export async function getAllStudents(full: boolean): Promise<StudentDTO[] | string[]> {
    const studentRepository = getStudentRepository();
    const students = await studentRepository.findAll();

    if (full) {
        return students.map(mapToStudentDTO);
    }

    return students.map((student) => student.username);
}

export async function getStudent(username: string): Promise<StudentDTO | null> {
    const studentRepository = getStudentRepository();
    const user = await studentRepository.findByUsername(username);
    return user ? mapToStudentDTO(user) : null;
}

export async function createStudent(userData: StudentDTO): Promise<StudentDTO | null> {
    const studentRepository = getStudentRepository();

    try {
        const newStudent = studentRepository.create(mapToStudent(userData));
        await studentRepository.save(newStudent);

        return mapToStudentDTO(newStudent);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function deleteStudent(username: string): Promise<StudentDTO | null> {
    const studentRepository = getStudentRepository();

    const user = await studentRepository.findByUsername(username);

    if (!user) {
        return null;
    }

    try {
        await studentRepository.deleteByUsername(username);

        return mapToStudentDTO(user);
    } catch (e) {
        console.log(e);
        return null;
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

    return classes.map((cls) => cls.classId!);
}

export async function getStudentAssignments(username: string, full: boolean): Promise<AssignmentDTO[]> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) {
        return [];
    }

    const classRepository = getClassRepository();
    const classes = await classRepository.findByStudent(student);

    const assignments = (await Promise.all(classes.map(async (cls) => await getAllAssignments(cls.classId!, full)))).flat();

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

export async function getStudentSubmissions(username: string, full: boolean): Promise<SubmissionDTO[] | SubmissionDTOId[]> {
    const studentRepository = getStudentRepository();
    const student = await studentRepository.findByUsername(username);

    if (!student) {
        return [];
    }

    const submissionRepository = getSubmissionRepository();
    const submissions = await submissionRepository.findAllSubmissionsForStudent(student);

    if (full) {
        return submissions.map(mapToSubmissionDTO);
    }

    return submissions.map(mapToSubmissionDTOId);
}
