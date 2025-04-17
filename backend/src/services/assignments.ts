import { AssignmentDTO, AssignmentDTOId } from '@dwengo-1/common/interfaces/assignment';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getQuestionRepository,
    getStudentRepository,
    getSubmissionRepository,
} from '../data/repositories.js';
import { Assignment } from '../entities/assignments/assignment.entity.js';
import { NotFoundException } from '../exceptions/not-found-exception.js';
import { mapToAssignment, mapToAssignmentDTO, mapToAssignmentDTOId } from '../interfaces/assignment.js';
import { mapToQuestionDTO } from '../interfaces/question.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId } from '../interfaces/submission.js';
import { fetchClass } from './classes.js';
import { QuestionDTO, QuestionId } from '@dwengo-1/common/interfaces/question';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import { EntityDTO } from '@mikro-orm/core';
import { putObject } from './service-helper.js';
import { fetchStudents } from './students.js';
import { ServerErrorException } from '../exceptions/server-error-exception.js';

export async function fetchAssignment(classid: string, assignmentNumber: number): Promise<Assignment> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    if (!cls) {
        throw new NotFoundException("Could not find assignment's class");
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, assignmentNumber);

    if (!assignment) {
        throw new NotFoundException('Could not find assignment');
    }

    return assignment;
}

export async function getAllAssignments(classid: string, full: boolean): Promise<AssignmentDTO[] | AssignmentDTOId[]> {
    const cls = await fetchClass(classid);

    const assignmentRepository = getAssignmentRepository();
    const assignments = await assignmentRepository.findAllAssignmentsInClass(cls);

    if (full) {
        return assignments.map(mapToAssignmentDTO);
    }

    return assignments.map(mapToAssignmentDTOId);
}

export async function createAssignment(classid: string, assignmentData: AssignmentDTO): Promise<AssignmentDTO> {
    const cls = await fetchClass(classid);

    const assignmentRepository = getAssignmentRepository();
    const assignment = mapToAssignment(assignmentData, cls);
    await assignmentRepository.save(assignment);

    
    if (assignmentData.groups) {
        /*
        For some reason when trying to add groups, it does not work when using the original assignment variable. 
        The assignment needs to be refetched in order for it to work.
        */
        
        const assignmentCopy = await assignmentRepository.findByClassAndId(cls, assignment.id!);
    
        if (assignmentCopy === null) {
            throw new ServerErrorException("Something has gone horribly wrong. Could not find newly added assignment which is needed to add groups.");
        }

        const groupRepository = getGroupRepository();

        (assignmentData.groups as string[][]).forEach(async (memberUsernames) => {
            const members = await fetchStudents(memberUsernames);

            const newGroup = groupRepository.create({
                assignment: assignmentCopy,
                members: members,
            });
            await groupRepository.save(newGroup);
        });
    }

    /* Need to refetch the assignment here again such that the groups are added. */
    const assignmentWithGroups = await fetchAssignment(classid, assignment.id!);

    return mapToAssignmentDTO(assignmentWithGroups);
}

export async function getAssignment(classid: string, id: number): Promise<AssignmentDTO> {
    const assignment = await fetchAssignment(classid, id);
    return mapToAssignmentDTO(assignment);
}

export async function putAssignment(classid: string, id: number, assignmentData: Partial<EntityDTO<Assignment>>): Promise<AssignmentDTO> {
    const assignment = await fetchAssignment(classid, id);

    await putObject<Assignment>(assignment, assignmentData, getAssignmentRepository());

    return mapToAssignmentDTO(assignment);
}

export async function deleteAssignment(classid: string, id: number): Promise<AssignmentDTO> {
    const assignment = await fetchAssignment(classid, id);
    const cls = await fetchClass(classid);

    const assignmentRepository = getAssignmentRepository();
    await assignmentRepository.deleteByClassAndId(cls, id);

    return mapToAssignmentDTO(assignment);
}

export async function getAssignmentsSubmissions(
    classid: string,
    assignmentNumber: number,
    full: boolean
): Promise<SubmissionDTO[] | SubmissionDTOId[]> {
    const assignment = await fetchAssignment(classid, assignmentNumber);

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsForAssignment(assignment);

    const submissionRepository = getSubmissionRepository();
    const submissions = (await Promise.all(groups.map(async (group) => submissionRepository.findAllSubmissionsForGroup(group)))).flat();

    if (full) {
        return submissions.map(mapToSubmissionDTO);
    }

    return submissions.map(mapToSubmissionDTOId);
}

export async function getAssignmentsQuestions(classid: string, assignmentNumber: number, full: boolean): Promise<QuestionDTO[] | QuestionId[]> {
    const assignment = await fetchAssignment(classid, assignmentNumber);

    const questionRepository = getQuestionRepository();
    const questions = await questionRepository.findAllByAssignment(assignment);

    if (full) {
        return questions.map(mapToQuestionDTO);
    }

    return questions.map(mapToQuestionDTO);
}
