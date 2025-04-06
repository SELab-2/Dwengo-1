import { getAssignmentRepository, getClassRepository, getGroupRepository, getSubmissionRepository } from '../data/repositories.js';
import { mapToAssignment, mapToAssignmentDTO, mapToAssignmentDTOId } from '../interfaces/assignment.js';
import { mapToSubmissionDTO, mapToSubmissionDTOId } from '../interfaces/submission.js';
import { AssignmentDTO } from '@dwengo-1/common/interfaces/assignment';
import { SubmissionDTO, SubmissionDTOId } from '@dwengo-1/common/interfaces/submission';
import {fetchClass} from "./classes";
import {Assignment} from "../entities/assignments/assignment.entity";
import {NotFoundException} from "../exceptions/not-found-exception";

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

    const assignment = mapToAssignment(assignmentData, cls);
    const assignmentRepository = getAssignmentRepository();

    const newAssignment = assignmentRepository.create(assignment);
    await assignmentRepository.save(newAssignment, {preventOverwrite: true});

    return mapToAssignmentDTO(newAssignment);

}

export async function fetchAssignment(classid: string, id: number): Promise<Assignment> {
    const cls = await fetchClass(classid);

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, id);

    if (!assignment){
        throw new NotFoundException('Assignment with id not found');
    }

    return assignment;
}

export async function getAssignment(classid: string, id: number): Promise<AssignmentDTO> {
    const assignment = await fetchAssignment(classid, id);
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

    if (groups.length === 0){
        throw new NotFoundException('No groups for assignment found');
    }

    const submissionRepository = getSubmissionRepository();
    const submissions = (await Promise.all(groups.map(async (group) => submissionRepository.findAllSubmissionsForGroup(group)))).flat();

    if (full) {
        return submissions.map(mapToSubmissionDTO);
    }

    return submissions.map(mapToSubmissionDTOId);
}
