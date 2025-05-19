import { AssignmentDTO, AssignmentDTOId } from '@dwengo-1/common/interfaces/assignment';
import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getQuestionRepository,
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
import {EntityDTO, ForeignKeyConstraintViolationException} from '@mikro-orm/core';
import { putObject } from './service-helper.js';
import { fetchStudents } from './students.js';
import { ServerErrorException } from '../exceptions/server-error-exception.js';
import { BadRequestException } from '../exceptions/bad-request-exception.js';
import {getQuestionsAboutLearningObjectInAssignment} from "./questions";
import {LearningObjectIdentifier} from "../entities/content/learning-object-identifier";
import {ConflictException} from "../exceptions/conflict-exception";

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
            throw new ServerErrorException('Something has gone horribly wrong. Could not find newly added assignment which is needed to add groups.');
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

function hasDuplicates(arr: string[]): boolean {
    return new Set(arr).size !== arr.length;
}

export async function putAssignment(classid: string, id: number, assignmentData: Partial<AssignmentDTO>): Promise<AssignmentDTO> {
    const assignment = await fetchAssignment(classid, id);

    if (assignmentData.groups) {
        if (hasDuplicates(assignmentData.groups.flat() as string[])) {
            throw new BadRequestException('Student can only be in one group');
        }

        const studentLists = await Promise.all((assignmentData.groups as string[][]).map(async (group) => await fetchStudents(group)));

        const groupRepository = getGroupRepository();
        await groupRepository.deleteAllByAssignment(assignment);
        await Promise.all(
            studentLists.map(async (students) => {
                const newGroup = groupRepository.create({
                    assignment: assignment,
                    members: students,
                });
                await groupRepository.save(newGroup);
            })
        );

        delete assignmentData.groups;
    }

    await putObject<Assignment>(assignment, assignmentData as Partial<EntityDTO<Assignment>>, getAssignmentRepository());

    return mapToAssignmentDTO(assignment);
}

export async function deleteAssignment(classid: string, id: number): Promise<AssignmentDTO> {
    const assignment = await fetchAssignment(classid, id);
    const cls = await fetchClass(classid);

    const assignmentRepository = getAssignmentRepository();

    try {
        await assignmentRepository.deleteByClassAndId(cls, id);
    } catch (e: ForeignKeyConstraintViolationException) {
        throw new ConflictException("Cannot delete assigment with questions or submissions")
    }


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
