import {
    getClassJoinRequestRepository,
    getClassRepository,
    getGroupRepository,
    getQuestionRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../data/repositories.js';
import { mapToClassDTO } from '../interfaces/class.js';
import { mapToGroupDTO, mapToGroupDTOId } from '../interfaces/group.js';
import { mapToStudent, mapToStudentDTO } from '../interfaces/student.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId } from '../interfaces/submission.js';
import { fetchAssignment } from './assignments.js';
import { mapToQuestionDTO, mapToQuestionDTOId } from '../interfaces/question.js';
import { mapToStudentRequest, mapToStudentRequestDTO } from '../interfaces/student-request.js';
import { Student } from '../entities/users/student.entity.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { fetchClass } from './classes.js';
import { StudentDTO } from '@dwengo-1/common/interfaces/student';
import { ClassDTO } from '@dwengo-1/common/interfaces/class';
import { AssignmentDTO, AssignmentDTOId } from '@dwengo-1/common/interfaces/assignment';
import { GroupDTO, GroupDTOId } from '@dwengo-1/common/interfaces/group';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { ClassJoinRequestDTO } from '@dwengo-1/common/interfaces/class-join-request';
import { ConflictException } from '../exceptions/conflict-exception.js';
import { Submission } from '../entities/assignments/submission.entity.js';
import { mapToUsername } from '../interfaces/user.js';
import { mapToAssignmentDTO, mapToAssignmentDTOId } from '../interfaces/assignment.js';

export async function getAllStudents(full: boolean): Promise<StudentDTO[] | string[]> {
    const studentRepository = getStudentRepository();
    const users = await studentRepository.findAll();

    if (full) {
        return users.map(mapToStudentDTO);
    }

    return users.map(mapToUsername);
}

export async function fetchStudent(username: string): Promise<Student> {
    const studentRepository = getStudentRepository();
    const user = await studentRepository.findByUsername(username);

    if (!user) {
        throw new NotFoundException(`Student with username ${username} not found`);
    }

    return user;
}

export async function fetchStudents(usernames: string[]): Promise<Student[]> {
    return await Promise.all(usernames.map(async (username) => await fetchStudent(username)));
}

export async function getStudent(username: string): Promise<StudentDTO> {
    const user = await fetchStudent(username);
    return mapToStudentDTO(user);
}

export async function createStudent(userData: StudentDTO): Promise<StudentDTO> {
    const studentRepository = getStudentRepository();

    const newStudent = mapToStudent(userData);
    await studentRepository.save(newStudent, { preventOverwrite: true });

    return mapToStudentDTO(newStudent);
}

export async function createOrUpdateStudent(userData: StudentDTO): Promise<StudentDTO> {
    await getStudentRepository().upsert({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
    });
    return userData;
}

export async function deleteStudent(username: string): Promise<StudentDTO> {
    const studentRepository = getStudentRepository();

    const student = await fetchStudent(username); // Throws error if it does not exist

    await studentRepository.deleteByUsername(username);
    return mapToStudentDTO(student);
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

export async function getStudentAssignments(username: string, full: boolean): Promise<AssignmentDTO[] | AssignmentDTOId[]> {
    const student = await fetchStudent(username);

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsWithStudent(student);
    const assignments = await Promise.all(groups.map(async (group) => await fetchAssignment(group.assignment.within.classId!, group.assignment.id!)));

    if (full) {
        return assignments.map(mapToAssignmentDTO);
    }
    return assignments.map(mapToAssignmentDTOId);
}

export async function getStudentGroups(username: string, full: boolean): Promise<GroupDTO[] | GroupDTOId[]> {
    const student = await fetchStudent(username);

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsWithStudent(student);

    if (full) {
        return groups.map((group) => mapToGroupDTO(group, group.assignment.within));
    }

    return groups.map((group) => mapToGroupDTOId(group, group.assignment.within));
}

export async function getStudentSubmissions(username: string, full: boolean): Promise<SubmissionDTO[] | SubmissionDTOId[]> {
    const student = await fetchStudent(username);

    const submissionRepository = getSubmissionRepository();

    const submissions: Submission[] = await submissionRepository.findAllSubmissionsForStudent(student);

    if (full) {
        return submissions.map(mapToSubmissionDTO);
    }

    return submissions.map(mapToSubmissionDTOId);
}

export async function getStudentQuestions(username: string, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const student = await fetchStudent(username);

    const questionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllByAuthor(student);

    if (full) {
        return questions.map(mapToQuestionDTO);
    }

    return questions.map(mapToQuestionDTOId);
}

export async function createClassJoinRequest(username: string, classId: string): Promise<ClassJoinRequestDTO> {
    const requestRepo = getClassJoinRequestRepository();

    const student = await fetchStudent(username); // Throws error if student not found
    const cls = await fetchClass(classId);

    if (cls.students.contains(student)) {
        throw new ConflictException('Student already in this class');
    }

    const request = mapToStudentRequest(student, cls);
    await requestRepo.save(request, { preventOverwrite: true });
    return mapToStudentRequestDTO(request);
}

export async function getJoinRequestsByStudent(username: string): Promise<ClassJoinRequestDTO[]> {
    const requestRepo = getClassJoinRequestRepository();

    const student = await fetchStudent(username);

    const requests = await requestRepo.findAllRequestsBy(student);
    return requests.map(mapToStudentRequestDTO);
}

export async function getJoinRequestByStudentClass(username: string, classId: string): Promise<ClassJoinRequestDTO> {
    const requestRepo = getClassJoinRequestRepository();

    const student = await fetchStudent(username);
    const cls = await fetchClass(classId);

    const request = await requestRepo.findByStudentAndClass(student, cls);
    if (!request) {
        throw new NotFoundException('Join request not found');
    }

    return mapToStudentRequestDTO(request);
}

export async function deleteClassJoinRequest(username: string, classId: string): Promise<ClassJoinRequestDTO> {
    const requestRepo = getClassJoinRequestRepository();

    const student = await fetchStudent(username);
    const cls = await fetchClass(classId);

    const request = await requestRepo.findByStudentAndClass(student, cls);

    if (!request) {
        throw new NotFoundException('Join request not found');
    }

    await requestRepo.deleteBy(student, cls);
    return mapToStudentRequestDTO(request);
}
