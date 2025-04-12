import { AssignmentDTO } from '@dwengo-1/common/interfaces/assignment';
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
import { assign, EntityDTO } from '@mikro-orm/core';
import { putObject } from './service-helper.js';
import { getLogger } from '../logging/initalize.js';
import { languageMap } from '@dwengo-1/common/util/language';
import { createGroup } from './groups.js';
import { GroupDTO } from 'dwengo-1-common/interfaces/group';

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

export async function getAllAssignments(classid: string, full: boolean): Promise<AssignmentDTO[]> {
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

    /*
    if (assignmentData.groups) {
        const groupRepository = getGroupRepository();
        const studentRepository = getStudentRepository();

        (assignmentData.groups as string[][]).forEach(async (memberUsernames) => {
            const members = (await Promise.all(memberUsernames.map(async (id) => studentRepository.findByUsername(id)))).filter(
                (student) => student !== null
            );

            const newGroup = groupRepository.create({
                assignment: assignment,
                members: members,
            });
            await groupRepository.save(newGroup);
            console.log('NEW GROUP');
            console.log(newGroup);
        });
    }
    */

    return mapToAssignmentDTO(assignment);
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
