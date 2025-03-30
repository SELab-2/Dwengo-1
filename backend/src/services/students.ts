import { getClassRepository, getGroupRepository, getStudentRepository, getSubmissionRepository } from '../data/repositories.js';
import { AssignmentDTO } from '../interfaces/assignment.js';
import { ClassDTO, mapToClassDTO } from '../interfaces/class.js';
import { GroupDTO, mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { mapToStudent, mapToStudentDTO, StudentDTO } from '../interfaces/student.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId, SubmissionDTO, SubmissionDTOId } from '../interfaces/submission.js';
import { getAllAssignments } from './assignments.js';
import { mapToQuestionDTO, mapToQuestionId, QuestionDTO, QuestionId } from '../interfaces/question';
import {ClassJoinRequestStatus} from "../entities/classes/class-join-request.entity";
import {ConflictException, NotFoundException} from "../exceptions";
import {mapToStudentRequestDTO} from "../interfaces/student-request";

export async function getAllStudents(full: boolean): Promise<StudentDTO[] | string[]> {
    const studentRepository = getStudentRepository();
    const users = await studentRepository.findAll();

    if (full)
        return users.map(mapToStudentDTO);

    return users.map((user) => user.username);
}

export async function fetchStudent(username: string): Promise<Student> {
    const studentRepository = getStudentRepository();
    const user = await studentRepository.findByUsername(username);

    if (!user) {
        throw new NotFoundException("Student with username not found");
    }

    return user;
}

export async function getStudent(username: string): Promise<StudentDTO> {
    const user = await fetchStudent(username);
    return mapToStudentDTO(user);
}

export async function createStudent(userData: StudentDTO): Promise<void> {
    const studentRepository = getStudentRepository();

    const newStudent = mapToStudent(userData);
    await studentRepository.save(newStudent, { preventOverwrite: true });
}

export async function deleteStudent(username: string): Promise<void> {
    const studentRepository = getStudentRepository();

    await fetchStudent(username); // throws error if it does not exist

    await studentRepository.deleteByUsername(username);
}

export async function getStudentClasses(username: string, full: boolean): Promise<ClassDTO[] | string[]> {
    const student = await fetchStudent(username);

    const classRepository = getClassRepository();
    const classes = await classRepository.findByStudent(student);

    if (full) {
        return classes.map(mapToClassDTO);
    }

    return classes.map((cls) => cls.classId!);
}

export async function getStudentAssignments(username: string, full: boolean): Promise<AssignmentDTO[]> {
    const student = await fetchStudent(username);

    const classRepository = getClassRepository();
    const classes = await classRepository.findByStudent(student);

    return (await Promise.all(classes.map(async (cls) => await getAllAssignments(cls.classId!, full)))).flat();
}

export async function getStudentGroups(username: string, full: boolean): Promise<GroupDTO[]> {
    const student = await fetchStudent(username);

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsWithStudent(student);

    if (full) {
        return groups.map(mapToGroupDTO);
    }

    return groups.map(mapToGroupDTOId);
}

export async function getStudentSubmissions(username: string, full: boolean): Promise<SubmissionDTO[] | SubmissionDTOId[]> {
    const student = await fetchStudent(username);

    const submissionRepository = getSubmissionRepository();
    const submissions = await submissionRepository.findAllSubmissionsForStudent(student);

    if (full) {
        return submissions.map(mapToSubmissionDTO);
    }

    return submissions.map(mapToSubmissionDTOId);
}
