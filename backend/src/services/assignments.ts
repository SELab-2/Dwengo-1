import {
    getAssignmentRepository,
    getClassRepository,
    getGroupRepository,
    getSubmissionRepository,
} from '../data/repositories.js';
import {
    AssignmentDTO,
    mapToAssignmentDTO,
    mapToAssignmentDTOId,
} from '../interfaces/assignment.js';
import { mapToSubmissionDTO, SubmissionDTO } from '../interfaces/submission.js';

export async function getAllAssignments(
    classid: string,
    full: boolean
): Promise<AssignmentDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    if (!cls) {
        return [];
    }

    const assignmentRepository = getAssignmentRepository();
    const assignments =
        await assignmentRepository.findAllAssignmentsInClass(cls);

    if (full) {
        return assignments.map(mapToAssignmentDTO);
    }

    return assignments.map(mapToAssignmentDTOId);
}

export async function getAssignment(
    classid: string,
    id: number
): Promise<AssignmentDTO | null> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    if (!cls) {
        return null;
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, id);

    if (!assignment) {
        return null;
    }

    return mapToAssignmentDTO(assignment);
}

export async function getAssignmentsSubmissions(
    classid: string,
    assignmentNumber: number,
): Promise<SubmissionDTO[]> {
    const classRepository = getClassRepository();
    const cls = await classRepository.findById(classid);

    if (!cls) {
        return [];
    }

    const assignmentRepository = getAssignmentRepository();
    const assignment = await assignmentRepository.findByClassAndId(cls, assignmentNumber);

    if (!assignment) {
        return [];
    }

    const groupRepository = getGroupRepository();
    const groups = await groupRepository.findAllGroupsForAssignment(assignment);

    const submissionRepository = getSubmissionRepository();
    const submissions = 
        (await Promise.all(groups.map(group => submissionRepository.findAllSubmissionsForGroup(group)))).flat();

    return submissions.map(mapToSubmissionDTO);
}